document.addEventListener('DOMContentLoaded', async () => {
    async function loadComponent(url, placeholderId) {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;
        
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const html = await res.text();

            const temp = document.createElement('div');
            temp.innerHTML = html;

            if (placeholder.dataset.classes && temp.firstElementChild) {
                const classesToAdd = placeholder.dataset.classes.split(' ');
                temp.firstElementChild.classList.add(...classesToAdd);
            }

            const fragment = document.createDocumentFragment();
            while (temp.firstChild) {
                fragment.appendChild(temp.firstChild);
            }
            placeholder.parentNode.replaceChild(fragment, placeholder);
        } catch (error) {
            console.error(`Error loading component ${url}:`, error);
        }
    }

    await Promise.all([
        loadComponent('components/navbar.html', 'navbar-placeholder'),
        loadComponent('components/mobile-menu.html', 'mobile-menu-placeholder'),
        loadComponent('components/login-sidebar.html', 'login-sidebar-placeholder'),
        loadComponent('components/footer.html', 'footer-placeholder')
    ]);

    await new Promise((resolve) => {
        const i18nScript = document.createElement('script');
        i18nScript.src = 'js/i18n.js';
        i18nScript.onload = resolve;
        i18nScript.onerror = () => {
            console.error('Failed to load i18n script');
            resolve();
        };
        document.body.appendChild(i18nScript);
    });

    // Load Cookie Banner CSS + JS (KVKK uyumlu)
    if (!document.getElementById('mm-cookie-banner-css')) {
        const cookieCSS = document.createElement('link');
        cookieCSS.id = 'mm-cookie-banner-css';
        cookieCSS.rel = 'stylesheet';
        cookieCSS.href = 'css/cookie-banner.css';
        document.head.appendChild(cookieCSS);
    }
    await new Promise((resolve) => {
        const cookieScript = document.createElement('script');
        cookieScript.src = 'js/cookie-banner.js';
        cookieScript.onload = resolve;
        cookieScript.onerror = () => resolve();
        document.body.appendChild(cookieScript);
    });

    // Dispatch a custom event to signal that components are ready
    document.dispatchEvent(new Event('componentsLoaded'));
});
