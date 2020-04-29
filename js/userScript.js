(function() {
    // 请求 hitohoto.json 数据
    loadData();

    // 请求 hitohoto.json 数据
    function loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/hitohoto.json', true);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                var res = JSON.parse(this.response || this.responseText);
                var hitokotoData = res instanceof Array ? res : res.posts;
                success(hitokotoData);
            } else {
                console.error(this.statusText);
            }
        };
        xhr.onerror = function() {
            console.error(this.statusText);
        };
        xhr.send();
    }

    function success(hitokotoData) {
        var index = Math.floor(Math.random() * hitokotoData.length);
        if (document.getElementsByClassName('hitokoto_text').length > 0) {
            var hitokoto_text = document.getElementsByClassName('hitokoto_text')[0];
            hitokoto_text.innerHTML = hitokotoData[index].hitokoto;
        }
        if (document.getElementsByClassName('hitokoto_from').length > 0) {
            var hitokoto_from = document.getElementsByClassName('hitokoto_from')[0];
            hitokoto_from.innerHTML = '--&ensp;' + hitokotoData[index].from;
        }
    }
})();