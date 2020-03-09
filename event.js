//指定比對的url：不允許片段表達式 
//例如： *://*.google.com.tw/* 作為查詢字串不被接受因為host是一個片段表達式
// <schema> :// <host> <path>
var urlPattern = '*://www.facebook.com/*';


//利用 tabs.query API 查找畫面上的所有tab
function queryTabsAndShowPageActions(queryObject) {
    chrome.tabs.query(queryObject,
        function(tabs) {
            if (tabs && tabs.length > 0) {
                for (var i = 0; i < tabs.length; i++) {
                    //在加載完畢的tab上，使用chrome.pageAction.show 啟用按鈕
                    if (tabs[i].status === "complete") chrome.pageAction.show(tabs[i].id);
                }
            }
        }
    );
}

//事件腳本的生命週期:
//當extension第一次安裝、更新到新版本或chrome瀏覽器更新到新版本時(onInstalled, onUpdateAvailable)

//第一次的初始化
//active：tab是否是窗口中的活動頁籤
chrome.runtime.onInstalled.addListener(function() {
    queryTabsAndShowPageActions({
        "active": false,
        "currentWindow": true,
        "url": urlPattern
    });
});
//每次tab有變動，檢查現在這個current tab是否在指定的 url pattern底下
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    queryTabsAndShowPageActions({
        "active": true,
        "currentWindow": true,
        "url": urlPattern
    });
});