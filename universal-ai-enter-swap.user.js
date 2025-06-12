// ==UserScript==
// @name        Swap Enter and Ctrl+Enter Keys
// @namespace   http://www.doubao.com/keyswap
// @description Swaps RETURN and CTRL+RETURN key behavior on specified website
// @author      uglee
// @include     https://www.doubao.com/chat/*
// @match       https://www.doubao.com/chat/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

(function () {
    'use strict';

    function swapEnterKeys(event) {
        if ((event.key === 'Enter' || event.keyCode === 13) && !event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            const textarea = document.querySelector('textarea[data-testid="chat_input_input"]');
            if (textarea) {
                const cursorPos = textarea.selectionStart;
                const textBefore = textarea.value.substring(0, cursorPos);
                const textAfter = textarea.value.substring(textarea.selectionEnd);
                textarea.value = textBefore + '\n' + textAfter;
                textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
            return false;
        }
    }

    document.addEventListener('keydown', swapEnterKeys, true);
})();