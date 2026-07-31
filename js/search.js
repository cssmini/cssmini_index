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

    function loadSearchData(callback) {
        if (searchData) {
            if (callback) callback(true);
            return;
        }
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
                    if (callback) callback(true);
                    return;
                } catch (e) {}
            }
            if (callback) callback(false);
            if (searchResult) searchResult.innerHTML = '<li class="search-result__empty">数据加载失败</li>';
        };
        xhr.onerror = function() {
            loading = false;
            if (callback) callback(false);
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
        container.innerHTML = '';
        if (!posts.length) {
            container.textContent = '未找到匹配结果';
            return;
        }
        posts.forEach(function(post) {
            var path = String(post.path || '').replace(/^\/+/, '');
            var link = document.createElement('a');
            link.className = 'search-result__link';
            link.href = (typeof SITE_ROOT !== 'undefined' ? SITE_ROOT : '/') + path;
            var title = document.createElement('h4');
            title.className = 'search-result__title';
            title.textContent = post.title || '';
            var meta = document.createElement('div');
            meta.className = 'search-result__meta';
            meta.textContent = (post.tags || []).map(function(t) { return t.name || ''; }).join(' · ');
            var date = document.createElement('time');
            date.className = 'search-result__date';
            date.textContent = post.date ? post.date.substring(0, 10) : '';
            meta.appendChild(date);
            link.appendChild(title);
            link.appendChild(meta);
            var item = document.createElement('li');
            item.className = 'search-result__item';
            item.appendChild(link);
            container.appendChild(item);
        });
    }

    function doSearch(keyword, container) {
        var key = (keyword || '').trim().slice(0, 100);
        if (!key) {
            if (container) container.innerHTML = '';
            return;
        }
        var terms = key.split(/\s+/).filter(Boolean).map(function(term) {
            return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        });
        if (!terms.length) return;
        var reg = new RegExp(terms.join('|'), 'mi');
        function runSearch() {
            if (!searchData) return;
            var result = searchData.filter(function(post) { return matcher(post, reg); });
            renderIn(container, result);
        }
        if (!searchData) {
            loadSearchData(runSearch);
            if (container) container.textContent = '加载中...';
            return;
        }
        runSearch();
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