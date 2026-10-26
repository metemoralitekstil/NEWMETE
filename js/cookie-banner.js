/**
 * MeteMorali — KVKK Uyumlu Cookie Consent Banner
 * v1.0 — Tüm dil desteğiyle (i18n entegre)
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'metemorali_cookie_consent';
    const CONSENT_VERSION = '1.0';

    const translations = {
        tr: {
            title: '🍪 Çerez Politikası',
            desc: 'Size daha iyi bir deneyim sunmak için zorunlu çerezler kullanıyoruz. Gizlilik politikamız hakkında bilgi almak için ',
            link: 'Çerez Politikası',
            linkEnd: "'nı inceleyebilirsiniz.",
            accept: 'Tümünü Kabul Et',
            necessary: 'Yalnızca Zorunlular',
            close: '×'
        },
        en: {
            title: '🍪 Cookie Policy',
            desc: 'We use essential cookies to provide you a better experience. For more information, please review our ',
            link: 'Cookie Policy',
            linkEnd: '.',
            accept: 'Accept All',
            necessary: 'Necessary Only',
            close: '×'
        },
        de: {
            title: '🍪 Cookie-Richtlinie',
            desc: 'Wir verwenden notwendige Cookies, um Ihnen ein besseres Erlebnis zu bieten. Weitere Informationen finden Sie in unserer ',
            link: 'Cookie-Richtlinie',
            linkEnd: '.',
            accept: 'Alle akzeptieren',
            necessary: 'Nur Notwendige',
            close: '×'
        },
        ru: {
            title: '🍪 Политика файлов Cookie',
            desc: 'Мы используем необходимые файлы cookie для улучшения вашего опыта. Подробнее в нашей ',
            link: 'Политике Cookie',
            linkEnd: '.',
            accept: 'Принять все',
            necessary: 'Только необходимые',
            close: '×'
        },
        fr: {
            title: '🍪 Politique de Cookies',
            desc: 'Nous utilisons des cookies essentiels pour améliorer votre expérience. Pour en savoir plus, consultez notre ',
            link: 'Politique de Cookies',
            linkEnd: '.',
            accept: 'Tout accepter',
            necessary: 'Nécessaires uniquement',
            close: '×'
        },
        nl: {
            title: '🍪 Cookiebeleid',
            desc: 'We gebruiken essentiële cookies voor een betere ervaring. Lees ons ',
            link: 'Cookiebeleid',
            linkEnd: ' voor meer informatie.',
            accept: 'Alles accepteren',
            necessary: 'Alleen noodzakelijke',
            close: '×'
        },
        it: {
            title: '🍪 Politica sui Cookie',
            desc: 'Utilizziamo cookie essenziali per migliorare la tua esperienza. Per saperne di più, consulta la nostra ',
            link: 'Politica sui Cookie',
            linkEnd: '.',
            accept: 'Accetta tutti',
            necessary: 'Solo necessari',
            close: '×'
        }
    };

    function getConsent() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }

    function saveConsent(type) {
        const consent = {
            version: CONSENT_VERSION,
            type: type, 
            date: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    }

    function removeBanner() {
        const banner = document.getElementById('mm-cookie-banner');
        if (banner) {
            banner.style.transform = 'translateY(120%)';
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 400);
        }
    }

    function createBanner() {
        const lang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
        const t = translations[lang] || translations['tr'];

        const policyUrl = 'sozlesmeler#cerez-politikasi';

        const banner = document.createElement('div');
        banner.id = 'mm-cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', t.title);
        banner.innerHTML = `
            <div class="mm-cookie-inner">
                <button class="mm-cookie-close" id="mm-cookie-close" aria-label="Kapat">${t.close}</button>
                <div class="mm-cookie-content">
                    <h3 class="mm-cookie-title">${t.title}</h3>
                    <p class="mm-cookie-desc">
                        ${t.desc}<a href="${policyUrl}" class="mm-cookie-link">${t.link}</a>${t.linkEnd}
                    </p>
                </div>
                <div class="mm-cookie-actions">
                    <button class="mm-cookie-btn mm-cookie-necessary" id="mm-cookie-necessary">${t.necessary}</button>
                    <button class="mm-cookie-btn mm-cookie-accept" id="mm-cookie-accept">${t.accept}</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        requestAnimationFrame(() => {
            banner.style.transform = 'translateY(0)';
            banner.style.opacity = '1';
        });

        document.getElementById('mm-cookie-accept').addEventListener('click', () => {
            saveConsent('all');
            removeBanner();
        });

        document.getElementById('mm-cookie-necessary').addEventListener('click', () => {
            saveConsent('necessary');
            removeBanner();
        });

        document.getElementById('mm-cookie-close').addEventListener('click', () => {
            saveConsent('necessary');
            removeBanner();
        });
    }

    function init() {
        const consent = getConsent();
        if (consent && consent.version === CONSENT_VERSION) {
            
            return;
        }
        
        setTimeout(createBanner, 800);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Global API — dil değişiminde banner'ı yeniden render et
    window.MMeteCookieBanner = { init, getConsent, saveConsent };
})();
