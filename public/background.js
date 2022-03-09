"use strict";
let storageList = [];

function updateConfigList(list) {
    storageList = list;
}

function changeConfigItem(configItem, type = "add") {
    // 从source源获取cookie
    return new Promise(resolve => {
        chrome.cookies.get(
            {
                url: addProtocol(configItem.from),
                name: configItem.name,
            },
            cookie => {
                if (cookie) {
                    type === "add" ? setCookie(cookie, configItem) : removeCookie(cookie, configItem);
                } else {
                    resolve(false);
                }
                resolve(true);
            }
        );
    });
}

chrome.cookies.onChanged.addListener(function ({ cookie, removed }) {
    const target = storageList.find(e => e.from === cookie.domain);
    if (target) {
        // 移除
        if (removed) removeCookie(cookie, target);
        // 设置、更新
        else setCookie(cookie, target);
    }
});

function setCookie(cookie, config) {
    // console.log("setCookie----cookie, config", cookie, config);
    chrome.cookies.set({
        url: addProtocol(config.to),
        domain: removeProtocol(config.to),
        name: cookie["name"],
        path: cookie["path"],
        value: cookie["value"],
        // expirationDate: cookie["expirationDate"],
        // secure: true,
        // sameSite: "no_restriction", // 不阻止跨域cookie
    });
}

function removeCookie(cookie, config) {
    chrome.cookies.remove({
        url: addProtocol(config.to),
        name: cookie["name"],
    });
}
// 增加协议头
function addProtocol(uri) {
    return uri.startsWith("http") ? uri : "http://" + uri;
}
// 去除协议头
function removeProtocol(uri) {
    return uri.startsWith("http") ? uri.replace("https://", "").replace("http://", "") : uri;
}
