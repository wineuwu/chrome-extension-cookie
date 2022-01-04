"use strict";

window.addEventListener("storage", ({ key, newValue, oldValue }) => {
    console.log("key", key);
    if (key === "domainList") {
        // 比较变化的数据，判断是增添或者删除
        // chrome.cookies.remove(object details)
        const newValue = JSON.parse(newValue);
        const oldValue = JSON.parse(oldValue);
        if (newValue.length > oldValue.length) {
            // 新增
            init(newValue.slice(-1));
        } else {
            const deleteValue = oldValue.find(e => !newValue.some(n => n === e));
            console.log('deleteValue', deleteValue)
            chrome.cookies.remove({
                url: "http://" + deleteValue.to,
                name: deleteValue.name,
            });
        }
    }
});
function setCookie(cookie, obj) {
    console.log("setCookie cookie", cookie);
    const res = cookie;
    chrome.cookies.set(
        {
            url: "http://" + obj.to,
            domain: obj.hostname,
            value: res.value,
            name: res.name,
            httpOnly: res.httpOnly,
        },
        function (cookie) {}
    );
}
const init = domainList => {
    // 遍历domainList,添加规则
    for (const iterator of domainList) {
        chrome.cookies.get(
            {
                url: "http://" + iterator.from,
                name: iterator.name,
            },
            cookie => {
                setCookie(cookie, iterator);
                addEventListener(iterator);
            }
        );
    }
};
const addEventListener = obj => {
    chrome.cookies.onChanged.addListener(function (changeInfo) {
        if (changeInfo.cookie.domain === obj.from) {
            // console.log("changeInfo.removed", changeInfo.removed);
            // 移除
            if (changeInfo.removed) {
                chrome.cookies.remove(
                    {
                        url: "http://" + obj.to,
                        name: changeInfo.cookie["name"],
                    },
                    function (cookie) {
                        // console.log('移除,重新获取cookie');
                    }
                );
            }
            // 设置、更新
            else {
                chrome.cookies.set(
                    {
                        url: "http://" + obj.to,
                        name: changeInfo.cookie["name"],
                        path: "/",
                        value: changeInfo.cookie["value"],
                        expirationDate: changeInfo.cookie["expirationDate"],
                        secure: true,
                        sameSite: "no_restriction", // 不阻止跨域cookie
                    },
                    function (cookie) {
                        // console.log('设置,重新获取cookie');
                    }
                );
            }
        }
    });
};
