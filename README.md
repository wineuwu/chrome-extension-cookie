# chrome-extension-cookie
开发环境下用来自动获取cookie的chrome插件。输入源站点和目标站点以及cookieName,便可以自动获取和监听cookie的变化并实时更新。

> A chrome plug-in used to automatically obtain cookies in the development environment. By entering the source site, target site and cookie name, you can automatically obtain and monitor the changes of cookies and update them in real time.

## 使用方法
1. clone 本仓库
```js
git clone https://github.com/aMiing/chrome-extension-cookie.git

cd chrome-extension-cookie
npm install
npm run build

```
2. 打包
3. 打开chrome扩展程序设置
4. 右上角打开开发模式
5. 加载已解压扩展程序（如果是压缩包，直接将文件拖入该设置界面）
6. 浏览器右上角点击扩展程序图标，在弹出窗口中填入您需要设置的信息
> cookieName: cookie名称； from: 源站点； to: 目标站点；
