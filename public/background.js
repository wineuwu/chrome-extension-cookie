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
                url: "https://" + configItem.from,
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
    })
}

chrome.cookies.onChanged.addListener(function ({ cookie, removed }) {
    const target = storageList.find(e => e.from === cookie.domain);
    if (target) {
        console.log("cookie---", cookie);
        console.log("storageList: target", target);
        // 移除
        if (removed) removeCookie(cookie, target);
        // 设置、更新
        else setCookie(cookie, target);
    }
});

const setCookie = (cookie, config) => {
    console.log("setCookie----cookie, config", cookie, config);
    chrome.cookies.set({
        url: "https://" + config.to,
        domain: config.to,
        name: cookie["name"],
        path: cookie["path"],
        value: cookie["value"],
        expirationDate: cookie["expirationDate"],
        secure: true,
        sameSite: "no_restriction", // 不阻止跨域cookie
    });
};

const removeCookie = (cookie, config) => {
    chrome.cookies.remove({
        url: "https://" + config.to,
        name: cookie["name"],
    });
};
