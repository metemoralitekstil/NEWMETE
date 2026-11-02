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
            transition: opacity 0.25s ease, transform 0.25s ease;
            pointer-events: auto;
        `;

        toast.innerHTML = `
            <span style="font-size: 1.15rem; display: flex; align-items: center;">${icon}</span>
            <span style="flex: 1; line-height: 1.4;">${message}</span>
            <button class="toast-close-btn" style="background: transparent; border: none; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 1rem; padding: 0 0 0 5px; transition: color 0.2s;"><i class="fa-solid fa-xmark"></i></button>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        const autoCloseTimeout = setTimeout(() => {
            closeToast(toast);
        }, 4000);

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
        }, 260);
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

    function setParticlesPaused(paused) {
        if (!window.tsParticles) return;
        const containers = tsParticles.dom();
        if (!containers || containers.length === 0) return;
        containers.forEach(c => {
            if (paused) c.pause();
            else c.play();
        });
    }

    // --- 4. INITIALIZE UI ON componentsLoaded ---
    document.addEventListener('componentsLoaded', () => {
        highlightActiveNavLink();

        // Navbar Scroll Effect (passive & state-cached so no DOM query/reflow on every scroll tick)
        const navbar = document.querySelector('.navbar');
        const showcase = document.querySelector('.showcase-container');
        if (navbar && showcase) {
            let isScrolled = false;
            window.addEventListener('scroll', () => {
                const shouldScroll = window.scrollY > window.innerHeight - 100;
                if (shouldScroll !== isScrolled) {
                    isScrolled = shouldScroll;
                    navbar.classList.toggle('scrolled', shouldScroll);
                }
            }, { passive: true });
        }

        // Mobile Menu with GSAP Animation
        const topMenuBtn = document.querySelector('.menu-btn');
        const mobileMenuOverlay = document.getElementById('mobile-menu');
        const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
        const mobileNavItems = document.querySelectorAll('.mobile-nav-links li');
        const mobileMenuLoginBtn = document.getElementById('mobile-menu-login-btn');

        if (topMenuBtn && mobileMenuOverlay && typeof gsap !== 'undefined') {
            const menuTl = gsap.timeline({
                paused: true,
                onReverseComplete: () => {
                    mobileMenuOverlay.classList.remove('active');
                    setParticlesPaused(false);
                }
            });

            menuTl.to(mobileMenuOverlay, {
                opacity: 1,
                autoAlpha: 1,
                duration: 0.25,
                ease: "power2.out"
            })
            .fromTo(mobileNavItems,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.25, stagger: 0.05, ease: "power2.out" },
                "-=0.15"
            );

            topMenuBtn.addEventListener('click', () => {
                setParticlesPaused(true);
                mobileMenuOverlay.classList.add('active');
                menuTl.play();
                document.body.style.overflow = 'hidden';
            });

            if (mobileMenuCloseBtn) {
                mobileMenuCloseBtn.addEventListener('click', () => {
                    menuTl.reverse();
                    document.body.style.overflow = '';
                });
            }

            if (mobileMenuLoginBtn) {
                mobileMenuLoginBtn.addEventListener('click', (e) => {
                    const user = localStorage.getItem('metemorali_user');
                    menuTl.reverse();
                    document.body.style.overflow = '';

                    if (!user) {
                        e.preventDefault();
                        if (window.openLoginSidebar) window.openLoginSidebar();
                    }
                });
            }
        }

        // Dynamically load auth.js if not already present
        if (!window.openLoginSidebar && !document.querySelector('script[src*="js/auth.js"]')) {
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
