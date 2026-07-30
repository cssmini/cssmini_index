(function() {
    'use strict';

    var keyInput = document.getElementById('search-key');
    var menuKey = document.getElementById('menu-search-key');
    var searchPanel = document.getElementById('search-panel');
    var searchResult = document.getElementById('search-result');
    var menuResult = document.getElementById('menu-search-result');
    var searchTpl = document.getElementById('search-tpl');
    var searchClose = document.getElementById('search-close');
    var searchData = null;
    var loading = false;

    var JSON_URL = (typeof SITE_ROOT !== 'undefined' ? SITE_ROOT : '/') + 'content.json';

    function loadSearchData() {
        if (searchData) return;
        if (loading) return;
        loading = true;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', JSON_URL, true);
        xhr.onload = function() {
            loading = false;
            if (this.status >= 200 && this.status < 300) {
                try {
                    var res = JSON.parse(this.response || this.responseText);
                    searchData = res instanceof Array ? res : (res.posts || []);
                } catch (e) {
                    if (searchResult) searchResult.innerHTML = '<li class="search-result__empty">数据加载失败</li>';
                }
            }
        };
        xhr.onerror = function() {
            loading = false;
            if (searchResult) searchResult.innerHTML = '<li class="search-result__empty">数据加载失败</li>';
        };
        xhr.send();
    }

    function escapeHtml(str) {
        return str ? str.replace(/[<>&"']/g, function(m) {
            return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[m];
        }) : '';
    }

    function matcher(post, reg) {
        if (!post) return false;
        return reg.test(post.title || '') ||
            (post.tags && post.tags.some(function(t) { return reg.test(t.name); })) ||
            reg.test(post.text || '');
    }

    function tpl(html, data) {
        return html.replace(/\{(\w+)\}/g, function(m, key) {
            return data[key] !== undefined ? escapeHtml(String(data[key])) : '';
        });
    }

    function renderIn(container, posts) {
        if (!container) return;
        if (!posts.length) {
            container.innerHTML = '<li class="search-result__empty">未找到匹配结果</li>';
            return;
        }
        var html = '';
        posts.forEach(function(post) {
            var item = {
                title: post.title,
                path: (typeof SITE_ROOT !== 'undefined' ? SITE_ROOT : '/') + post.path.replace(/^\//, ''),
                date: post.date ? post.date.substring(0, 10) : '',
                tags: (post.tags || []).map(function(t) { return t.name; }).join(' · ')
            };
            html += tpl(searchTpl.innerHTML, item);
        });
        container.innerHTML = html;
    }

    function doSearch(keyword, container) {
        var key = (keyword || '').trim();
        if (!key) {
            if (container) container.innerHTML = '';
            return;
        }
        if (!searchData) {
            loadSearchData();
            if (container) container.innerHTML = '<li class="search-result__empty">加载中...</li>';
            setTimeout(function() {
                if (searchData) {
                    var reg = new RegExp(key.replace(/\s+/g, '|'), 'mi');
                    var result = searchData.filter(function(post) { return matcher(post, reg); });
                    renderIn(container, result);
                }
            }, 500);
            return;
        }
        var reg = new RegExp(key.replace(/\s+/g, '|'), 'mi');
        var result = searchData.filter(function(post) { return matcher(post, reg); });
        renderIn(container, result);
    }

    // desktop search
    if (keyInput && searchResult) {
        keyInput.addEventListener('input', function() {
            doSearch(keyInput.value, searchResult);
        });
        keyInput.addEventListener('focus', loadSearchData);
    }

    if (searchClose && searchPanel) {
        searchClose.addEventListener('click', function() {
            searchPanel.classList.remove('open');
            if (keyInput) keyInput.value = '';
            if (searchResult) searchResult.innerHTML = '';
        });
    }

    // mobile menu search
    if (menuKey && menuResult) {
        menuKey.addEventListener('input', function() {
            doSearch(menuKey.value, menuResult);
        });
        menuKey.addEventListener('focus', loadSearchData);
    }

    // expose for main.js
    window.loadSearchData = loadSearchData;

})();