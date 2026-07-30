(function() {
    'use strict';

    // loading bar
    var loadingBar = document.getElementById('loading-bar');
    function startLoading() { if (loadingBar) { loadingBar.className = 'loading-bar start'; } }
    function doneLoading() { if (loadingBar) { loadingBar.className = 'loading-bar done'; } }

    window.addEventListener('pageshow', function() { doneLoading(); });
    window.addEventListener('beforeunload', function() { startLoading(); });

    // intercept link clicks for loading bar
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link && link.href && link.host === window.location.host && link.getAttribute('target') !== '_blank') {
            startLoading();
        }
    });

    // language switch
    var langCurrent = document.getElementById('lang-current');
    var langDropdown = document.getElementById('lang-dropdown');
    if (langCurrent && langDropdown) {
        langCurrent.addEventListener('click', function(e) {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });
        document.addEventListener('click', function() {
            langDropdown.classList.remove('show');
        });
        langDropdown.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.setItem('site-lang', a.dataset.lang);
                document.cookie = 'lang=' + a.dataset.lang + ';path=/;max-age=31536000';
                location.reload();
            });
        });
    }

    var navBar = document.getElementById('nav-bar');
    var banner = document.querySelector('.header__img');
    var bannerHeight = banner ? banner.offsetHeight : 400;

    function onScroll() {
        if (!navBar) return;
        var scrolled = window.scrollY > bannerHeight - 5;
        var html = document.documentElement;

        if (scrolled) {
            navBar.classList.add('scrolled');
            html.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
            html.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // hamburger toggle (drawer + mask)
    var navToggle = document.getElementById('nav-toggle');
    var navMask = document.getElementById('nav-mask');
    var drawerClose = document.getElementById('nav-drawer-close');
    var body = document.body;

    function openMenu() { body.classList.add('menu-open'); }
    function closeMenu() { body.classList.remove('menu-open'); }

    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            body.classList.contains('menu-open') ? closeMenu() : openMenu();
        });
    }
    if (drawerClose) { drawerClose.addEventListener('click', closeMenu); }

    // close on mask click
    if (navMask) {
        navMask.addEventListener('click', closeMenu);
    }

    // close on drawer nav link click
    var drawerLinks = document.querySelectorAll('.nav-drawer__item');
    drawerLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    // close on ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('menu-open')) {
            closeMenu();
        }
    });

    // search toggle
    var searchToggle = document.getElementById('search-toggle');
    var searchPanel = document.getElementById('search-panel');
    var searchKey = document.getElementById('search-key');

    if (searchToggle && searchPanel) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            var isOpen = searchPanel.classList.toggle('open');
            if (isOpen) {
                if (searchKey) {
                    searchKey.value = '';
                    setTimeout(function() { searchKey.focus(); }, 100);
                }
                if (typeof window.loadSearchData === 'function') window.loadSearchData();
            }
        });

        document.addEventListener('click', function(e) {
            if (searchPanel.classList.contains('open') &&
                !searchPanel.contains(e.target) &&
                e.target !== searchToggle) {
                searchPanel.classList.remove('open');
            }
        });
    }

    // 一言（Hitohoto）
    var hitokotoLoaded = false;
    var hitokotoUrl = (typeof SITE_ROOT !== 'undefined' ? SITE_ROOT : '/') + 'hitohoto.json';

    function loadHitokoto() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', hitokotoUrl, true);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                try {
                    var res = JSON.parse(this.response || this.responseText);
                    var hitokotoData = res instanceof Array ? res : (res.posts || []);
                    showHitokoto(hitokotoData);
                } catch (e) { showFallback(); }
            } else { showFallback(); }
        };
        xhr.onerror = function() { showFallback(); };
        xhr.send();
    }

    function showHitokoto(data) {
        if (!data || !data.length) { showFallback(); return; }
        var index = Math.floor(Math.random() * data.length);
        var textEl = document.querySelector('.hitokoto_text');
        var fromEl = document.querySelector('.hitokoto_from');
        if (textEl) {
            textEl.textContent = data[index].hitokoto;
        }
        if (fromEl) fromEl.textContent = '—— ' + data[index].from;
        hitokotoLoaded = true;
    }

    function showFallback() {
        var textEl = document.querySelector('.hitokoto_text');
        if (textEl) textEl.textContent = '人类的悲欢并不相通，我只是觉得他们吵闹。';
        var fromEl = document.querySelector('.hitokoto_from');
        if (fromEl) fromEl.textContent = '—— 鲁迅';
    }

    var hitokotoWrap = document.querySelector('.hitokoto_wrap');
    if (hitokotoWrap) {
        hitokotoWrap.addEventListener('click', loadHitokoto);
        loadHitokoto();
    }

    // back to top
    var backTop = document.getElementById('back-top');
    if (backTop) {
        window.addEventListener('scroll', function() {
            backTop.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });
        backTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // TOC scroll highlight
    var toc = document.getElementById('post-toc');
    if (toc) {
        var tocLinks = toc.querySelectorAll('.post-toc-content a');
        var headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4');
        if (tocLinks.length && headings.length) {
            var headerH = document.getElementById('nav-bar') ? document.getElementById('nav-bar').offsetHeight : 50;
            function onTocScroll() {
                var scrollPos = window.scrollY + headerH + 20;
                var current = null;
                headings.forEach(function(h) {
                    if (h.offsetTop <= scrollPos) current = h;
                });
                if (current) {
                    tocLinks.forEach(function(a) { a.parentElement.classList.remove('active'); });
                    var link = toc.querySelector('a[href="#' + current.id + '"]');
                    if (link) link.parentElement.classList.add('active');
                }
            }
            window.addEventListener('scroll', onTocScroll, { passive: true });
            onTocScroll();
        }
    }

})();
