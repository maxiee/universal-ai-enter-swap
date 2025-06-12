# Universal AI Enter Swap

一个油猴脚本，用于交换 AI 聊天网站中 Enter 和 Ctrl+Enter 键的行为，让聊天体验更符合个人习惯。

## 功能特性

- 🔄 **键位交换**：将 Enter 键改为换行
- 🌐 **多站点支持**：目前支持豆包（Doubao）聊天，后续会扩展到更多 AI 聊天平台
- ⚡ **轻量高效**：代码简洁，运行流畅，不影响页面性能
- 🎯 **精准定位**：只在聊天输入框中生效，不影响其他页面元素

## 支持的网站

- [豆包 (Doubao)](https://www.doubao.com/chat/) - 字节跳动的 AI 聊天助手

> **注意**：目前脚本仅支持豆包网站。如需支持其他 AI 聊天平台，请参考下方的扩展方法或提交 Issue。

## 扩展到其他 AI 平台

如果你想让脚本支持其他 AI 聊天网站，可以按以下步骤修改：

1. 在脚本头部添加新的 `@match` 或 `@include` 规则
2. 根据目标网站的输入框选择器，修改 `querySelector` 部分
3. 测试并确认功能正常

常见 AI 聊天平台的输入框选择器参考：
- **ChatGPT**: `textarea[data-id="root"]` 或 `#prompt-textarea`
- **Claude**: `div[contenteditable="true"]`
- **文心一言**: `textarea.input-area`

欢迎提交 PR 来扩展支持更多平台！

## 安装方法

### 前置条件

首先确保你已经安装了油猴脚本管理器：

- **Tampermonkey**（推荐）- [Chrome 扩展商店](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | [Firefox 插件](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Greasemonkey**（Firefox）- [Firefox 插件](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
- **Violentmonkey** - [Chrome](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)

### 方法一：Git Clone 安装（推荐）

1. 克隆本仓库到本地：
   ```bash
   git clone https://github.com/maxiee/universal-ai-enter-swap.git
   ```
2. 打开油猴脚本管理器的管理面板
3. 点击"添加新脚本"或"+"按钮
4. 删除默认内容，复制 `universal-ai-enter-swap.user.js` 文件的全部内容
5. 粘贴到编辑器中，保存即可

### 方法二：直接复制安装

1. 打开 [`universal-ai-enter-swap.user.js`](./universal-ai-enter-swap.user.js) 文件
2. 复制文件的全部内容
3. 打开油猴脚本管理器的管理面板
4. 点击"添加新脚本"或"+"按钮
5. 删除默认内容，粘贴复制的代码
6. 保存脚本

### 方法三：Raw 链接安装

1. 点击以下链接直接安装：
   ```
   https://raw.githubusercontent.com/maxiee/universal-ai-enter-swap/main/universal-ai-enter-swap.user.js
   ```
   > 注意：请将 `[YOUR_USERNAME]` 替换为你的 GitHub 用户名
2. 油猴脚本管理器会自动识别并询问是否安装

## 使用说明

安装完成后，脚本会自动在支持的网站上运行：

- **换行**：按 `Enter` 键在输入框中换行
- **发送消息**：按 `Ctrl + Enter` 发送消息

## 故障排除

### 脚本不生效？

1. **检查脚本是否启用**：在油猴管理器中确认脚本状态为"启用"
2. **检查网站匹配**：确认当前访问的网站 URL 符合脚本的匹配规则
3. **刷新页面**：安装脚本后需要刷新页面才能生效
4. **检查浏览器控制台**：按 F12 打开开发者工具，查看是否有错误信息

### 键位交换不正确？

- 确认焦点在聊天输入框内
- 某些网站可能有自己的快捷键监听，可能存在冲突

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。


如果这个脚本对你有帮助，请考虑给个 ⭐ Star！
