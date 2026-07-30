(function() {
    'use strict';
    var LANG = {
        'zh-CN': {
            'nav.home': '首页', 'nav.archives': '归档', 'nav.categories': '分类', 'nav.tags': '标签', 'nav.guestbook': '留言', 'nav.about': '关于',
            'sidebar.say': '说给你听', 'sidebar.loading': '加载中...', 'sidebar.recommend': '随机推荐',
            'sidebar.fallback': '人类的悲欢并不相通，我只是觉得他们吵闹。', 'sidebar.fallback_from': '鲁迅',
            'article.toc': '目录', 'article.prev': '上一篇', 'article.next': '下一篇',
            'article.copyright_author': '本文作者', 'article.copyright_link': '本文链接',
            'article.copyright_notice': '本博客所有文章除特别声明外，均采用 CC BY-NC-SA 4.0 许可协议。转载请注明出处！',
            'search.placeholder': '输入关键词搜索...',
            'paginator.prev': '上一页', 'paginator.next': '下一页',
            'counter.site_pv': '总访问', 'counter.site_uv': '总访客',
            'page.home': '首页', 'page.archives': '归档', 'page.categories': '分类', 'page.tags': '标签', 'page.guestbook': '留言', 'page.about': '关于'
        },
        'en': {
            'nav.home': 'Home', 'nav.archives': 'Archives', 'nav.categories': 'Categories', 'nav.tags': 'Tags', 'nav.guestbook': 'Guestbook', 'nav.about': 'About',
            'sidebar.say': 'Words for You', 'sidebar.loading': 'Loading...', 'sidebar.recommend': 'Recommended',
            'sidebar.fallback': 'The loneliness of human beings is not interlinked.', 'sidebar.fallback_from': 'Lu Xun',
            'article.toc': 'TOC', 'article.prev': 'Previous', 'article.next': 'Next',
            'article.copyright_author': 'Author', 'article.copyright_link': 'Link',
            'article.copyright_notice': 'All articles in this blog are licensed under CC BY-NC-SA 4.0 unless otherwise noted.',
            'search.placeholder': 'Search...',
            'paginator.prev': 'Prev', 'paginator.next': 'Next',
            'counter.site_pv': 'Page Views', 'counter.site_uv': 'Visitors',
            'page.home': 'Home', 'page.archives': 'Archives', 'page.categories': 'Categories', 'page.tags': 'Tags', 'page.guestbook': 'Guestbook', 'page.about': 'About'
        },
        'ja': {
            'nav.home': 'ホーム', 'nav.archives': 'アーカイブ', 'nav.categories': 'カテゴリー', 'nav.tags': 'タグ', 'nav.guestbook': '掲示板', 'nav.about': 'について',
            'sidebar.say': '君に届け', 'sidebar.loading': '読み込み中...', 'sidebar.recommend': 'おすすめ',
            'sidebar.fallback': '人間の悲喜は相通じない。私はただ彼らが騒がしいと感じるだけだ。', 'sidebar.fallback_from': '魯迅',
            'article.toc': '目次', 'article.prev': '前へ', 'article.next': '次へ',
            'article.copyright_author': '著者', 'article.copyright_link': 'リンク',
            'article.copyright_notice': '本ブログの記事は、特に明記されていない限り CC BY-NC-SA 4.0 ライセンスの下で提供されています。',
            'search.placeholder': '検索...',
            'paginator.prev': '前へ', 'paginator.next': '次へ',
            'counter.site_pv': '閲覧数', 'counter.site_uv': '訪問者',
            'page.home': 'ホーム', 'page.archives': 'アーカイブ', 'page.categories': 'カテゴリー', 'page.tags': 'タグ', 'page.guestbook': '掲示板', 'page.about': 'について'
        }
    };

    // stored preference or browser detection
    function getLang() {
        // 1: localStorage
        var ls = localStorage.getItem('site-lang');
        if (ls) return ls;
        // 2: browser
        var bl = (navigator.language || '').split('-')[0];
        var map = { zh: 'zh-CN', en: 'en', ja: 'ja' };
        return map[bl] || 'zh-CN';
    }
    function setLang(l) {
        localStorage.setItem('site-lang', l);
        document.cookie = 'lang=' + l + ';path=/;max-age=31536000';
    }
    var lang = getLang();
    setLang(lang); // ensure cookie exists
    document.documentElement.lang = lang;

    var t = LANG[lang] || LANG['zh-CN'];

    // apply translations
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.setAttribute('placeholder', t[key]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-title');
        if (t[key]) el.setAttribute('title', t[key]);
    });

    // update lang switcher display
    var cur = document.getElementById('lang-current');
    if (cur) {
        var labels = { 'zh-CN': '中文', en: 'English', ja: '日本語' };
        cur.textContent = labels[lang] || '中文';
    }
    var dd = document.getElementById('lang-dropdown');
    if (dd) {
        dd.querySelectorAll('a').forEach(function(a) {
            a.classList.toggle('active', a.dataset.lang === lang);
        });
    }

    // expose for switcher
    window.__lang = lang;
})();