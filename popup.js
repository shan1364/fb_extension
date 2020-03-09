//確定DOM結構已被完整讀取與解析 
document.addEventListener('DOMContentLoaded', function (event) {
    var btn = document.getElementById('button');
    var input_area = document.getElementById('inputArea');
    //var output_area = document.getElementById('textArea');

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //點擊: 將輸入的連結儲存起來
        btn.addEventListener('click', function (event) {
            chrome.storage.sync.clear(function () {});

            let links = input_area.value.split(',');
            var arr = [];
            var j = 0;
            for (let i = 0; i < links.length; i++) {
                let item_obj = {};
                let url_pattern = 'www.facebook.com';
                if (links[i].search(url_pattern) >= 0) {
                    let id = j;
                    item_obj.id = id;
                    item_obj.link = links[i];
                    item_obj.data = '';
                    item_obj.state = '';
                    arr.push(item_obj);
                    j++;
                }
            }
            let len = arr.length;
            arr.push({ len: len });
            let obj = { ...arr };
            console.log(obj);
            chrome.storage.sync.set(obj, function () {
                console.log('save origin links finish');
            })
            //點開第一個
            //chrome.tabs.update({ url: links[0] });
        })

        //更新storage的資料 並(1)到還沒去過的新頁面 或 (2)完成 印出
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            chrome.storage.sync.get(null, function (data) {
                let origin_item = data;
                var keys = Object.keys(origin_item);
                for (var key in changes) {
                    var storageChange = changes[key];
                    console.log('Storage key "%s" in namespace "%s" changed. Old value was "%s", new value is "%s".',
                        key, namespace, storageChange.oldValue, storageChange.newValue);
                }
                for (const key of keys) { //data=='' 代表要去新的連結
                    if (!origin_item[key].hasOwnProperty('len') && origin_item[key].data == '') {
                        let goto_url = origin_item[key].link;
                        console.log('ready to:', goto_url);
                        chrome.tabs.update({ url: goto_url });
                        break;
                    } else if (origin_item[key].hasOwnProperty('len')) { //全部完成 開始output
                        let output_items = data;
                        let keys = Object.keys(output_items);
                        for (const key of keys) {
                            if ( !(output_items[key].hasOwnProperty('len') )) {
                                let item_data = output_items[key].data;
                                let ID = item_data.ID;
                                let name = item_data.name;
                                let img = item_data.img;
                                let items = { ID, name, img };
                                console.log('output item:', items);
                                //output_area.value += JSON.stringify(items) + ', ';
                                
                            }
                        }
                        console.log('output all finish');
                        break;
                    }

                }
            });

        })


        //確認已經到 新的連結
        chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
            if (changeInfo.status == 'complete') {
                chrome.storage.sync.get(null, function (data) {
                    let origin_item = data;
                    var keys = Object.keys(origin_item);
                    for (const key of keys) {
                        if (!origin_item[key].hasOwnProperty('len') && origin_item[key].state == '') {
                            origin_item[key].state = 'fetch';
                            console.log('origin item:', origin_item[key], 'start to fetch data');
                            chrome.storage.sync.set(origin_item, function () { });
                            break;
                        }
                    }
                });
            }

        })


    })
})