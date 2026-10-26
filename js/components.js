/**
 * MeteMorali - Global UI Components Module
 * Toast notifications, Loading & Success overlays, Navbar interactions, and Mobile menu.
 */

(function () {
    // --- 1. TOAST NOTIFICATION SYSTEM ---
    function showToastNotification(message, type = 'error') {
        let container = document.getElementById('custom-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'custom-toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: 90%;
                max-width: 400px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;

        let bgColor = '#e74c3c'; // error
        let icon = '<i class="fa-solid fa-circle-exclamation"></i>';

        if (type === 'success') {
            bgColor = '#2ecc71';
            icon = '<i class="fa-solid fa-circle-check"></i>';
        } else if (type === 'info') {
            bgColor = '#3498db';
            icon = '<i class="fa-solid fa-circle-info"></i>';
        }

        toast.style.cssText = `
            background: ${bgColor};
            color: #ffffff;
            padding: 14px 20px;
            border-radius: 12px;
            font-family: 'Outfit', sans-serif;
            font-size: 0.95rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: auto;
        `;

        toast.innerHTML = `
            <span style="font-size: 1.15rem; display: flex; align-items: center;">${icon}</span>
            <span style="flex: 1; line-height: 1.4;">${message}</span>
            <button class="toast-close-btn" style="background: transparent; border: none; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 1rem; padding: 0 0 0 5px; transition: color 0.2s;"><i class="fa-solid fa-xmark"></i></button>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Auto close after 4 seconds
        const autoCloseTimeout = setTimeout(() => {
            closeToast(toast);
        }, 4000);

        // Close on button click
        toast.querySelector('.toast-close-btn').addEventListener('click', () => {
            clearTimeout(autoCloseTimeout);
            closeToast(toast);
        });
    }

    function closeToast(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    window.showToast = showToastNotification;

    // --- 2. LOADING & SUCCESS OVERLAYS ---
    function showLoadingOverlay(show) {
        const overlay = document.getElementById('auth-loading-overlay');
        if (overlay) {
            if (show) overlay.classList.add('active');
            else overlay.classList.remove('active');
        }
    }
    window.showLoadingOverlay = showLoadingOverlay;

    function showSuccessOverlay(title, desc, callback) {
        const overlay = document.getElementById('auth-success-overlay');
        const titleEl = document.getElementById('auth-success-title');
        const descEl = document.getElementById('auth-success-desc');

        if (overlay) {
            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.textContent = desc;
            overlay.classList.add('active');

            setTimeout(() => {
                overlay.classList.remove('active');
                if (callback) callback();
            }, 1800);
        } else if (callback) {
            callback();
        }
    }
    window.showSuccessOverlay = showSuccessOverlay;

    // --- 3. ACTIVE NAV LINK HIGHLIGHT ---
    function highlightActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index';
        const cleanCurrentPage = currentPage.replace('.html', '');

        document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const cleanHref = href.replace('.html', '').replace('./', '').replace('/', '');
                const isHome = cleanCurrentPage === '' || cleanCurrentPage === 'index' || cleanCurrentPage === 'anasayfa';
                const isLinkHome = cleanHref === '' || cleanHref === '.' || cleanHref === 'index' || cleanHref === 'anasayfa';

                if ((isHome && isLinkHome) || (cleanHref === cleanCurrentPage && !isHome)) {
                    link.classList.add('active-page');
                }
            }
        });
    }

    // --- 4. INITIALIZE UI ON componentsLoaded ---
    document.addEventListener('componentsLoaded', () => {
        highlightActiveNavLink();

        // Navbar Scroll Effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                const showcase = document.querySelector('.showcase-container');
                if (!showcase) return;

                if (window.scrollY > window.innerHeight - 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Mobile Menu with GSAP Animation
        const topMenuBtn = document.querySelector('.menu-btn');
        const mobileMenuOverlay = document.getElementById('mobile-menu');
        const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
        const mobileNavItems = document.querySelectorAll('.mobile-nav-links li');
        const mobileMenuLoginBtn = document.getElementById('mobile-menu-login-btn');

        if (topMenuBtn && mobileMenuOverlay && typeof gsap !== 'undefined') {
            const menuTl = gsap.timeline({ paused: true });

            menuTl.to(mobileMenuOverlay, {
                opacity: 1,
                autoAlpha: 1,
                duration: 0.4,
                ease: "power2.inOut"
            })
            .fromTo(mobileNavItems,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.5)" },
                "-=0.2"
            );

            topMenuBtn.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('active');
                menuTl.play();
                document.body.style.overflow = 'hidden';
            });

            if (mobileMenuCloseBtn) {
                mobileMenuCloseBtn.addEventListener('click', () => {
                    menuTl.reverse();
                    mobileMenuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            if (mobileMenuLoginBtn) {
                mobileMenuLoginBtn.addEventListener('click', (e) => {
                    const user = localStorage.getItem('metemorali_user');
                    menuTl.reverse();
                    mobileMenuOverlay.classList.remove('active');
                    document.body.style.overflow = '';

                    if (!user) {
                        e.preventDefault();
                        if (window.openLoginSidebar) window.openLoginSidebar();
                    }
                });
            }
        }

        // Dynamically load auth.js if not already present
        if (!window.openLoginSidebar) {
            const authScript = document.createElement('script');
            authScript.src = 'js/auth.js';
            document.body.appendChild(authScript);
        }

        // Dynamically load dashboard.js if on hesabim.html
        if (window.location.pathname.includes('hesabim') && !window.renderUserOrders) {
            const dashScript = document.createElement('script');
            dashScript.src = 'js/dashboard.js';
            document.body.appendChild(dashScript);
        }
    });
})();