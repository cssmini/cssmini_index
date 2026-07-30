(function() {
    'use strict';
    // 不蒜子热门文章排行（月度）
    var container = document.getElementById('hot-list');
    if (!container) return;

    function md5(str) {
        function r(n, c) { return (n << c) | (n >>> (32 - c)); }
        function q(n, c) { return n & c; }
        function p(n, c) { return n ^ c; }
        function a(n, c) { return n + c; }
        function ff(a, b, c, d, x, s, t) { return a(r(a + p(b, p(c, d)) + x + t, s), b); }
        function gg(a, b, c, d, x, s, t) { return a(r(a + p(b, q(c, d)) + x + t, s) + b, b); }
        function hh(a, b, c, d, x, s, t) { return a(r(a + p(b, p(c, d)) + x + t, s), b); }
        function ii(a, b, c, d, x, s, t) { return a(r(a + p(b, q(c, d)) + x + t, s), b); }
        var s = [], i, j, k, l;
        var b = 0x67452301, c = 0xefcdab89, d = 0x98badcfe, e = 0x10325476;
        for (i = 0; i < str.length; i += 64) {
            var chunk = [];
            for (j = 0; j < 64; j++) chunk[j] = j < str.length - i ? str.charCodeAt(i + j) : j < 56 ? 0 : str.length * 8 >>> (j - 56) * 8 & 0xff;
            for (k = 0; k < 16; k++) s[k] = chunk[k * 4] | chunk[k * 4 + 1] << 8 | chunk[k * 4 + 2] << 16 | chunk[k * 4 + 3] << 24;
            var aa = b, bb = c, cc = d, dd = e;
            b = ff(b, c, d, e, s[0], 7, 0xd76aa478); e = ff(e, b, c, d, s[1], 12, 0xe8c7b756); d = ff(d, e, b, c, s[2], 17, 0x242070db);
            c = ff(c, d, e, b, s[3], 22, 0xc1bdceee); b = ff(b, c, d, e, s[4], 7, 0xf57c0faf); e = ff(e, b, c, d, s[5], 12, 0x4787c62a);
            d = ff(d, e, b, c, s[6], 17, 0xa8304613); c = ff(c, d, e, b, s[7], 22, 0xfd469501); b = ff(b, c, d, e, s[8], 7, 0x698098d8);
            e = ff(e, b, c, d, s[9], 12, 0x8b44f7af); d = ff(d, e, b, c, s[10], 17, 0xffff5bb1); c = ff(c, d, e, b, s[11], 22, 0x895cd7be);
            b = ff(b, c, d, e, s[12], 7, 0x6b901122); e = ff(e, b, c, d, s[13], 12, 0xfd987193); d = ff(d, e, b, c, s[14], 17, 0xa679438e);
            c = ff(c, d, e, b, s[15], 22, 0x49b40821); b = gg(b, c, d, e, s[1], 5, 0xf61e2562); e = gg(e, b, c, d, s[6], 9, 0xc040b340);
            d = gg(d, e, b, c, s[11], 14, 0x265e5a51); c = gg(c, d, e, b, s[0], 20, 0xe9b6c7aa); b = gg(b, c, d, e, s[5], 5, 0xd62f105d);
            e = gg(e, b, c, d, s[10], 9, 0x02441453); d = gg(d, e, b, c, s[15], 14, 0xd8a1e681); c = gg(c, d, e, b, s[4], 20, 0xe7d3fbc8);
            b = gg(b, c, d, e, s[9], 5, 0x21e1cde6); e = gg(e, b, c, d, s[14], 9, 0xc33707d6); d = gg(d, e, b, c, s[3], 14, 0xf4d50d87);
            c = gg(c, d, e, b, s[8], 20, 0x455a14ed); b = gg(b, c, d, e, s[13], 5, 0xa9e3e905); e = gg(e, b, c, d, s[2], 9, 0xfcefa3f8);
            d = gg(d, e, b, c, s[7], 14, 0x676f02d9); c = gg(c, d, e, b, s[12], 20, 0x8d2a4c8a); b = hh(b, c, d, e, s[5], 4, 0xfffa3942);
            e = hh(e, b, c, d, s[8], 11, 0x8771f681); d = hh(d, e, b, c, s[11], 16, 0x6d9d6122); c = hh(c, d, e, b, s[14], 23, 0xfde5380c);
            b = hh(b, c, d, e, s[1], 4, 0xa4beea44); e = hh(e, b, c, d, s[4], 11, 0x4bdecfa9); d = hh(d, e, b, c, s[7], 16, 0xf6bb4b60);
            c = hh(c, d, e, b, s[10], 23, 0xbebfbc70); b = hh(b, c, d, e, s[13], 4, 0x289b7ec6); e = hh(e, b, c, d, s[0], 11, 0xeaa127fa);
            d = hh(d, e, b, c, s[3], 16, 0xd4ef3085); c = hh(c, d, e, b, s[6], 23, 0x04881d05); b = hh(b, c, d, e, s[9], 4, 0xd9d4d039);
            e = hh(e, b, c, d, s[12], 11, 0xe6db99e5); d = hh(d, e, b, c, s[15], 16, 0x1fa27cf8); c = hh(c, d, e, b, s[2], 23, 0xc4ac5665);
            b = ii(b, c, d, e, s[0], 6, 0xf4292244); e = ii(e, b, c, d, s[7], 10, 0x432aff97); d = ii(d, e, b, c, s[14], 15, 0xab9423a7);
            c = ii(c, d, e, b, s[5], 21, 0xfc93a039); b = ii(b, c, d, e, s[12], 6, 0x655b59c3); e = ii(e, b, c, d, s[3], 10, 0x8f0ccc92);
            d = ii(d, e, b, c, s[10], 15, 0xffeff47d); c = ii(c, d, e, b, s[1], 21, 0x85845dd1); b = ii(b, c, d, e, s[8], 6, 0x6fa87e4f);
            e = ii(e, b, c, d, s[15], 10, 0xfe2ce6e0); d = ii(d, e, b, c, s[6], 15, 0xa3014314); c = ii(c, d, e, b, s[13], 21, 0x4e0811a1);
            b = ii(b, c, d, e, s[4], 6, 0xf7537e82); e = ii(e, b, c, d, s[11], 10, 0xbd3af235); d = ii(d, e, b, c, s[2], 15, 0x2ad7d2bb);
            c = ii(c, d, e, b, s[9], 21, 0xeb86d391); b = a(b, aa); c = a(c, bb); d = a(d, cc); e = a(e, dd);
        }
        function hex(n) { return ((n >>> 24) & 0xff).toString(16).padStart(2, '0') + ((n >>> 16) & 0xff).toString(16).padStart(2, '0') + ((n >>> 8) & 0xff).toString(16).padStart(2, '0') + (n & 0xff).toString(16).padStart(2, '0'); }
        return hex(b) + hex(c) + hex(d) + hex(e);
    }

    var domain = window.location.hostname;
    if (domain === 'localhost' || domain === '127.0.0.1') {
        container.innerHTML = '<span style="font-size:12px;color:var(--color-text-muted)">上线后可见</span>';
        return;
    }

    var siteId = md5(domain);
    var apiUrl = 'https://api.busuanzi.ibruce.info/api/rank?site_id=' + siteId + '&type=month';

    fetch(apiUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (!data || !data.length) {
                container.innerHTML = '<span style="font-size:12px;color:var(--color-text-muted)">暂无数据</span>';
                return;
            }
            var html = '';
            var top5 = data.slice(0, 5);
            top5.forEach(function(item, idx) {
                var path = item.path || '';
                var title = item.title || path.replace(/.*\//, '').replace(/\.html$/, '');
                var pv = item.pv || 0;
                var emoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📄';
                html += '<div class="hot-item">' +
                    '<span class="hot-rank">' + emoji + '</span>' +
                    '<a href="' + path + '" class="hot-title">' + title + '</a>' +
                    '<span class="hot-pv">' + pv + '</span>' +
                    '</div>';
            });
            container.innerHTML = html;
        })
        .catch(function() {
            container.innerHTML = '<span style="font-size:12px;color:var(--color-text-muted)">加载失败</span>';
        });

})();