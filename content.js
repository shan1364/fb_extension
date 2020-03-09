//https://www.facebook.com/pcyeh.NTU, https://www.facebook.com/profile.php?id=100000543132185, https://www.facebook.com/shu.w.zhengwei,https://www.facebook.com/profile.php?id=100005030224189
function getData() {
    let ID = document.querySelector('.profilePicThumb') == null ?
        'not found' : document.querySelector('.profilePicThumb').href.split('=').slice(-1).join('');
    let name = document.querySelector('.profilePicThumb>img') == null ?
        'not found' : document.querySelector('.profilePicThumb>img').alt.split("'s Profile Photo")[0];
    let img = document.querySelector('.profilePicThumb>img') == null ?
        'not found' : document.querySelector('.profilePicThumb>img').src;
    let return_item = { ID, name, img };
    console.log(return_item);
    return return_item;
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    chrome.storage.sync.get(null, function (data) {
        let origin_item = data;
        var keys = Object.keys(origin_item);
        for (const key of keys) { //data=='' 代表要去新的連結
            if (!origin_item[key].hasOwnProperty('len') && origin_item[key].state == 'fetch') {
                let page_data = getData();
                var current_url = location.href;
                origin_item[key].data = page_data;
                origin_item[key].state = 'finish';
                console.log('now url:', current_url, ', insert data:', origin_item[key]);
                chrome.storage.sync.set(origin_item, function () { });
                break;
            } 
        }

    })
})