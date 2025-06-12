// ==UserScript==
// @name        Swap Enter and Ctrl+Enter Keys
// @namespace   http://www.doubao.com/keyswap
// @description Swaps RETURN and CTRL+RETURN key behavior on specified website
// @author      uglee
// @include     https://www.doubao.com/chat/*
// @match       https://www.doubao.com/chat/*
// @match       https://www.doubao.com/*
// @version     1.2
// @run-at      document-start
// ==/UserScript==

(function () {
    'use strict';

    // 调试开关 - 设置为 true 开启调试日志，false 关闭
    const DEBUG_MODE = false;

    // 输入法状态跟踪
    let isComposing = false;
    let lastInputTime = 0;

    // 调试日志函数
    function debugLog(message, data = null) {
        // 支持通过全局变量动态控制调试模式
        const isDebugEnabled = DEBUG_MODE || window.enterSwapDebugMode;
        if (isDebugEnabled) {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = `[EnterSwap ${timestamp}]`;
            if (data) {
                console.log(prefix, message, data);
            } else {
                console.log(prefix, message);
            }
        }
    }

    // 初始化日志
    debugLog('脚本开始初始化');
    debugLog('当前页面URL:', window.location.href);
    debugLog('调试模式已开启');

    // 处理textarea类型的输入框
    function handleTextareaEnter(element) {
        debugLog('处理textarea类型的回车事件');

        // 获取当前光标位置
        const cursorPos = element.selectionStart;
        const selectionEnd = element.selectionEnd;
        const textBefore = element.value.substring(0, cursorPos);
        const textAfter = element.value.substring(selectionEnd);

        debugLog('光标位置和文本信息', {
            cursorPos: cursorPos,
            selectionEnd: selectionEnd,
            textLength: element.value.length
        });

        // 尝试多种方法插入换行符
        try {
            // 方法1: 使用 document.execCommand
            if (document.execCommand) {
                debugLog('尝试使用 execCommand 插入换行符');
                element.focus();
                element.setSelectionRange(cursorPos, selectionEnd);
                const success = document.execCommand('insertText', false, '\n');
                if (success) {
                    debugLog('execCommand 成功插入换行符');
                    setTimeout(() => {
                        element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    }, 0);
                    return;
                }
            }

            // 方法2: 使用 setRangeText
            if (element.setRangeText) {
                debugLog('尝试使用 setRangeText 插入换行符');
                element.setRangeText('\n', cursorPos, selectionEnd, 'end');
                setTimeout(() => {
                    element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                }, 0);
                return;
            }

            // 方法3: 直接修改 value 属性
            debugLog('尝试直接修改 value 属性');
            element.value = textBefore + '\n' + textAfter;
            element.selectionStart = element.selectionEnd = cursorPos + 1;
            setTimeout(() => {
                element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            }, 0);

        } catch (error) {
            debugLog('插入换行符时出错:', error);
        }
    }

    // 处理contenteditable div类型的输入框
    function handleContentEditableEnter(element) {
        debugLog('处理contenteditable类型的回车事件');

        // 确保元素获得焦点
        element.focus();

        try {
            // 使用 execCommand 插入换行符
            if (document.execCommand) {
                debugLog('尝试使用 execCommand 插入换行符');
                const success = document.execCommand('insertLineBreak', false, null) ||
                    document.execCommand('insertHTML', false, '<br>');

                if (success) {
                    debugLog('execCommand 成功插入换行符');
                    setTimeout(() => {
                        element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertLineBreak' }));
                    }, 0);
                    return;
                }
            }

            // 手动操作 DOM
            debugLog('execCommand 失败，尝试手动操作DOM');
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();

                const br = document.createElement('br');
                range.insertNode(br);
                range.setStartAfter(br);
                range.collapse(true);

                selection.removeAllRanges();
                selection.addRange(range);

                setTimeout(() => {
                    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertLineBreak' }));
                }, 0);
            }
        } catch (error) {
            debugLog('处理contenteditable换行时出错:', error);
        }
    }

    // 全局键盘事件处理函数
    function swapEnterKeys(event) {
        // 只处理回车键
        if (event.key !== 'Enter' && event.keyCode !== 13) {
            return;
        }

        // 检查是否处于输入法组合状态
        // 当输入法正在工作时（如输入拼音、显示候选词等），不应该拦截回车键
        const currentTime = Date.now();
        const recentInput = currentTime - lastInputTime < 100; // 100ms内有输入活动

        if (event.isComposing || event.keyCode === 229 || isComposing || recentInput) {
            debugLog('检测到输入法组合状态，跳过拦截', {
                eventIsComposing: event.isComposing,
                keyCode: event.keyCode,
                globalIsComposing: isComposing,
                recentInput: recentInput,
                timeSinceLastInput: currentTime - lastInputTime
            });
            return;
        }

        // 动态查找当前聚焦的输入框
        const activeElement = document.activeElement;
        if (!activeElement) {
            return;
        }

        // 检查是否是我们支持的输入框类型
        const isTargetTextarea = activeElement.tagName.toLowerCase() === 'textarea' &&
            activeElement.matches('textarea[data-testid="chat_input_input"]');

        const isTargetContentEditable = activeElement.contentEditable === 'true' &&
            activeElement.matches('div[data-testid="chat_input_input"]');

        if (!isTargetTextarea && !isTargetContentEditable) {
            return;
        }

        debugLog('键盘事件触发', {
            key: event.key,
            keyCode: event.keyCode,
            ctrlKey: event.ctrlKey,
            elementType: activeElement.tagName,
            contentEditable: activeElement.contentEditable
        });

        // 处理普通的回车键（不包含 Ctrl）- 换行
        if (!event.ctrlKey) {
            debugLog('检测到普通回车键，开始处理换行逻辑');
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (isTargetTextarea) {
                handleTextareaEnter(activeElement);
            } else if (isTargetContentEditable) {
                handleContentEditableEnter(activeElement);
            }
            return false;
        }

        // 处理 Ctrl+Enter 组合键 - 提交
        if (event.ctrlKey) {
            debugLog('检测到Ctrl+Enter组合键，开始处理提交逻辑');
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            // 寻找提交按钮并点击
            const submitButton = document.querySelector('button[data-testid="chat_input_send_button"]') ||
                document.querySelector('svg[data-testid="chat_input_send_icon"]')?.closest('button') ||
                document.querySelector('[data-testid*="send"]') ||
                document.querySelector('button[type="submit"]') ||
                document.querySelector('button[aria-label*="发送"]') ||
                document.querySelector('button[title*="发送"]');

            debugLog('查找提交按钮结果', {
                found: !!submitButton,
                disabled: submitButton?.disabled
            });

            if (submitButton && !submitButton.disabled) {
                debugLog('点击提交按钮');
                submitButton.click();
            } else {
                debugLog('提交按钮不可用或未找到');
            }

            return false;
        }
    }

    // 输入法事件处理函数
    function handleCompositionStart(event) {
        isComposing = true;
        debugLog('输入法组合开始', {
            target: event.target.tagName,
            data: event.data
        });
    }

    function handleCompositionUpdate(event) {
        isComposing = true;
        debugLog('输入法组合更新', {
            target: event.target.tagName,
            data: event.data
        });
    }

    function handleCompositionEnd(event) {
        isComposing = false;
        debugLog('输入法组合结束', {
            target: event.target.tagName,
            data: event.data
        });
    }

    // 输入事件处理函数
    function handleInput(event) {
        lastInputTime = Date.now();
        // 只在调试模式下记录输入事件，避免日志过多
        if (DEBUG_MODE || window.enterSwapDebugMode) {
            debugLog('输入事件触发', {
                target: event.target.tagName,
                inputType: event.inputType,
                data: event.data
            });
        }
    }

    // 初始化全局键盘事件监听
    function initGlobalKeyListener() {
        debugLog('初始化全局键盘事件监听');
        document.addEventListener('keydown', swapEnterKeys, true);

        // 添加输入法事件监听
        document.addEventListener('compositionstart', handleCompositionStart, true);
        document.addEventListener('compositionupdate', handleCompositionUpdate, true);
        document.addEventListener('compositionend', handleCompositionEnd, true);

        // 添加输入事件监听来跟踪输入活动
        document.addEventListener('input', handleInput, true);

        debugLog('全局键盘事件监听器已添加');
        debugLog('输入法事件监听器已添加');
        debugLog('输入事件监听器已添加');
    }

    // 立即初始化全局键盘监听
    debugLog('立即初始化全局键盘监听');
    initGlobalKeyListener();

    debugLog('脚本初始化完成');

    // 添加全局调试控制函数，方便在控制台中切换调试模式
    window.enterSwapDebug = {
        enable: function () {
            window.enterSwapDebugMode = true;
            debugLog('调试模式已通过控制台启用');
        },
        disable: function () {
            window.enterSwapDebugMode = false;
            console.log('[EnterSwap] 调试模式已禁用');
        },
        status: function () {
            console.log('[EnterSwap] 调试模式状态:', DEBUG_MODE || window.enterSwapDebugMode);
        }
    };

    debugLog('全局调试控制函数已创建，可通过 enterSwapDebug.enable() 或 enterSwapDebug.disable() 控制');
})();
