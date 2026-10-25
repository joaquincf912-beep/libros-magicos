/**
 * Libros Mágicos - i18n language switcher
 * Idiomas: es (origen), en, pt, fr, zh
 * Los diccionarios viven en i18n-en.js / i18n-pt.js / i18n-fr.js / i18n-zh.js
 * (window.I18N_DICTS = { en: {...}, pt: {...}, fr: {...}, zh: {...} })
 *
 * Cada diccionario mapea el texto EN ESPAÑOL del DOM -> traducción.
 * Opcionales: d._rules = [{ re, to }] para textos dinámicos con capturas.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'lm_lang';
    var SUPPORTED = ['es', 'en', 'pt', 'fr', 'zh'];
    var current = 'es';
    var observer = null;
    var passTimer = null;

    var LANGS = [
        { code: 'es', flag: '🇪🇸', name: 'Español' },
        { code: 'en', flag: '🇺🇸', name: 'English' },
        { code: 'pt', flag: '🇧🇷', name: 'Português' },
        { code: 'fr', flag: '🇫🇷', name: 'Français' },
        { code: 'zh', flag: '🇨🇳', name: '中文' }
    ];

    function dictFor(lang) {
        var all = window.I18N_DICTS || {};
        return all[lang] || null;
    }

    function interpolate(str, vars) {
        if (!vars) return str;
        return str.replace(/\{(\w+)\}/g, function (m, k) {
            return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
        });
    }

    function translateBase(base, lang) {
        var d = dictFor(lang);
        if (!d || !base) return base;
        if (Object.prototype.hasOwnProperty.call(d, base)) return d[base];
        var rules = d._rules || [];
        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            if (r.re.test(base)) return base.replace(r.re, r.to);
        }
        return base;
    }

    /** Traduce un texto en español (con vars opcionales). Fuera de soporte devuelve el original. */
    window.LM_T = function (str, vars) {
        var out = current === 'es' ? str : translateBase(str, current);
        return interpolate(out, vars);
    };

    function isSkippable(node) {
        var p = node.parentElement;
        if (!p) return true;
        var tag = p.tagName;
        return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA';
    }

    function passTextNodes(root) {
        var doc = root.ownerDocument || document;
        var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        var node;
        while ((node = walker.nextNode())) {
            if (isSkippable(node)) continue;
            var cur = node.nodeValue;
            if (node.__i18nLast === undefined || cur !== node.__i18nLast) {
                // Escrito por el código o visto por primera vez -> fuente en español
                node.__i18nBase = cur;
            }
            var base = node.__i18nBase;
            if (base === undefined) continue;
            var lead = (cur.match(/^\s*/) || [''])[0];
            var trail = (cur.match(/\s*$/) || [''])[0];
            var trimmed = cur.trim();
            var outTrimmed = current === 'es' ? base.trim() : translateBase(base.trim(), current);
            var out = lead + outTrimmed + trail;
            if (out !== cur) node.nodeValue = out;
            node.__i18nLast = out;
        }
    }

    function passAttributes(root) {
        var els = root.querySelectorAll ? root.querySelectorAll('[placeholder]') : [];
        Array.prototype.forEach.call(els, function (el) {
            var cur = el.getAttribute('placeholder') || '';
            if (!cur) return;
            if (el.__i18nPhLast === undefined || cur !== el.__i18nPhLast) {
                el.__i18nPhBase = cur;
            }
            var base = el.__i18nPhBase;
            if (base === undefined) return;
            var out = current === 'es' ? base : translateBase(base, current);
            if (out !== cur) el.setAttribute('placeholder', out);
            el.__i18nPhLast = out;
        });
    }

    var titleBase = null;

    function passTitle() {
        var cur = document.title;
        if (titleBase === null || (document.__i18nTitleLast !== undefined && cur !== document.__i18nTitleLast)) {
            titleBase = cur;
        }
        var out = current === 'es' ? titleBase : translateBase(titleBase, current);
        if (out !== document.title) document.title = out;
        document.__i18nTitleLast = document.title;
    }

    function runPass() {
        if (document.body) passTextNodes(document.body);
        if (document.body) passAttributes(document.body);
        passTitle();
    }

    function schedulePass() {
        clearTimeout(passTimer);
        passTimer = setTimeout(runPass, 40);
    }

    function startObserver() {
        if (!window.MutationObserver || observer) return;
        observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.type === 'characterData' || m.type === 'childList') {
                    schedulePass();
                    return;
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }

    /* ================= SWITCHER UI ================= */

    function buildSwitcher() {
        var container = document.querySelector('.nav-container');
        if (!container || document.querySelector('.lang-switcher')) return;

        var wrap = document.createElement('div');
        wrap.className = 'lang-switcher';

        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'lang-toggle';
        toggle.setAttribute('aria-label', 'Cambiar idioma / Change language');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>' +
            '<span class="lang-current">ES</span>';

        var menu = document.createElement('div');
        menu.className = 'lang-menu';
        menu.setAttribute('role', 'menu');

        LANGS.forEach(function (l) {
            var opt = document.createElement('button');
            opt.type = 'button';
            opt.className = 'lang-option';
            opt.dataset.lang = l.code;
            opt.setAttribute('role', 'menuitem');
            opt.innerHTML =
                '<span class="lang-flag">' + l.flag + '</span>' +
                '<span class="lang-name">' + l.name + '</span>' +
                '<span class="lang-check">✓</span>';
            opt.addEventListener('click', function (e) {
                e.stopPropagation();
                applyLang(l.code);
                closeMenu();
            });
            menu.appendChild(opt);
        });

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });

        document.addEventListener('click', closeMenu);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        function closeMenu() {
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }

        wrap.appendChild(toggle);
        wrap.appendChild(menu);

        var anchor = container.querySelector('.mobile-menu-btn');
        if (anchor) container.insertBefore(wrap, anchor);
        else container.appendChild(wrap);

        updateSwitcherUI();
    }

    function updateSwitcherUI() {
        var label = document.querySelector('.lang-switcher .lang-current');
        if (label) label.textContent = current.toUpperCase();
        document.querySelectorAll('.lang-option').forEach(function (opt) {
            opt.classList.toggle('active', opt.dataset.lang === current);
        });
    }

    /* ================= APPLY ================= */

    function applyLang(lang) {
        if (SUPPORTED.indexOf(lang) === -1) lang = 'es';
        current = lang;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* modo privado */ }
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        runPass();
        updateSwitcherUI();
        try {
            document.dispatchEvent(new CustomEvent('lm:langchange', { detail: { lang: lang } }));
        } catch (e) { /* CustomEvent no soportado */ }
    }

    window.LM_setLang = applyLang;
    window.LM_getLang = function () { return current; };

    // Cambio en otra pestaña -> se aplica en vivo en ambas páginas
    window.addEventListener('storage', function (e) {
        if (e.key === STORAGE_KEY && e.newValue) applyLang(e.newValue);
    });

    document.addEventListener('DOMContentLoaded', function () {
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
        buildSwitcher();
        applyLang(saved || 'es');
        startObserver();
    });
})();
