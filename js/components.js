document.addEventListener('componentsLoaded', () => {

    const t = (key, defaultText = '') => {

        const lang = localStorage.getItem('metemorali_lang') || 'tr';

        if (window.i18n && window.i18n.translations[lang]) {

            return window.i18n.translations[lang][key] || defaultText;

        }

        return defaultText;

    };



    const SUPABASE_URL = 'https://vcmgijcjltleytlwzayx.supabase.co';

    const SUPABASE_ANON_KEY = 'sb_publishable_HF5kZ1rTFx15rJes459xZA_C_rzkoc3'; // Copy from Supabase Settings -> API



    let supabaseClient = null;

    function loadSupabase() {
        return new Promise((resolve) => {
            if (window.supabase) {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                window.supabaseClient = supabaseClient;
                resolve(supabaseClient);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                window.supabaseClient = supabaseClient;
                resolve(supabaseClient);
            };
            document.head.appendChild(script);
        });
    }



    loadSupabase().then(() => {

        console.log("Supabase initialized.");

        

        // Auto open reset password form if redirected from recovery

        if (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token=')) {
            setTimeout(() => {
                openLoginSidebar();
                document.querySelectorAll('.login-sidebar .login-section').forEach(sec => sec.classList.add('hidden'));
                const successSec = document.getElementById('forgot-password-success-section');
                if (successSec) {
                    successSec.classList.remove('hidden');
                    const emailSec = document.getElementById('forgot-password-section');
                    if (emailSec) emailSec.classList.add('hidden');
                    
                    // Hide reset code input box
                    const resetCodeBox = document.getElementById('reset-code-input')?.closest('.input-group');
                    if (resetCodeBox) resetCodeBox.style.display = "none";
                    
                    // Update instruction subtitle
                    const subtitle = document.getElementById('forgot-success-subtitle');
                    if (subtitle) {
                        subtitle.textContent = "Lütfen yeni şifrenizi girin.";
                    }
                }
            }, 800);
        }



        // Listen for auth changes
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session) {
                const addresses = (session.user.user_metadata && session.user.user_metadata.addresses) || JSON.parse(localStorage.getItem('metemorali_addresses') || '[]');
                const user = {
                    type: 'email',
                    value: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email,
                    phone: session.user.user_metadata?.phone || '',
                    addresses: addresses
                };
                localStorage.setItem('metemorali_user', JSON.stringify(user));
                localStorage.setItem('metemorali_token', session.access_token);
                if (addresses && addresses.length > 0) {
                    localStorage.setItem('metemorali_addresses', JSON.stringify(addresses));
                }
                updateNavbarAuthState();

                if (window.location.pathname.includes('hesabim')) {
                    updateProfileUI();
                    if (window.loadUserAddresses) window.loadUserAddresses();
                    const wrapper = document.querySelector('.dashboard-wrapper');
                    if (wrapper) wrapper.style.display = 'block';
                }
            } else {
                const existingUser = JSON.parse(localStorage.getItem('metemorali_user') || 'null');
                if (existingUser && existingUser.type === 'email') {
                    localStorage.removeItem('metemorali_user');
                    localStorage.removeItem('metemorali_token');
                    updateNavbarAuthState();
                }
            }

        });

    });



    // Highlight the active page link in the navigation menus

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

    highlightActiveNavLink();



    // Modern and Premium Custom Toast Notification System

    function showToastNotification(message, type = 'error') {

        // Check if container exists, if not create one

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

        

        // Define colors based on type

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



    // Expose toast notification function globally

    window.showToast = showToastNotification;



    function showLoadingOverlay(show) {

        const overlay = document.getElementById('auth-loading-overlay');

        if (overlay) {

            if (show) overlay.classList.add('active');

            else overlay.classList.remove('active');

        }

    }



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

        } else {

            if (callback) callback();

        }

    }



    // --- NAVBAR SCROLL LOGIC ---

    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // Sadece anasayfa (showcase) varsa tetikle
        const showcase = document.querySelector('.showcase-container');
        if (!showcase) return;

        if (window.scrollY > window.innerHeight - 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });





    // --- LOGIN SIDEBAR LOGIC ---

    const loginBtn = document.getElementById('user-login-btn');

    const loginSidebar = document.getElementById('login-sidebar');

    const loginOverlay = document.getElementById('login-overlay');

    const closeLoginBtn = document.getElementById('close-login-sidebar');

    const switchToEmailBtn = document.getElementById('switch-to-email');

    const switchToPhoneBtn = document.getElementById('switch-to-phone');

    const phoneSection = document.getElementById('phone-login-section');

    const emailSection = document.getElementById('email-login-section');

    

    // Forgot Password elements

    const forgotPasswordLink = document.getElementById('forgot-password-link');

    const forgotPasswordSection = document.getElementById('forgot-password-section');

    const switchFromForgotToEmailBtn = document.getElementById('switch-to-email-from-forgot');

    const sendResetLinkBtn = document.getElementById('send-reset-link-btn');

    const forgotPasswordSuccessSection = document.getElementById('forgot-password-success-section');

    const backToLoginFromSuccessBtn = document.getElementById('back-to-login-from-success');



    // Dynamic password toggle bindings

    document.querySelectorAll('.password-toggle-btn').forEach(btn => {

        btn.addEventListener('click', function() {

            const input = this.previousElementSibling;

            if (input && (input.type === 'password' || input.type === 'text')) {

                const icon = this.querySelector('i');

                if (input.type === 'password') {

                    input.type = 'text';

                    if (icon) {

                        icon.className = 'fa-regular fa-eye-slash';

                    }

                } else {

                    input.type = 'password';

                    if (icon) {

                        icon.className = 'fa-regular fa-eye';

                    }

                }

            }

        });

    });



    function openLoginSidebar() {

        if (loginSidebar && loginOverlay) {

            // Reset to email login section by default, hiding all other panels

            document.querySelectorAll('.login-sidebar .login-section').forEach(sec => {

                if (sec.id === 'email-login-section') {

                    sec.classList.remove('hidden');

                } else {

                    sec.classList.add('hidden');

                }

            });



            loginSidebar.classList.add('active');

            loginOverlay.classList.add('active');

            document.body.style.overflow = 'hidden'; // Prevent scrolling

            

            // FPS Optimizasyonu: Partikülleri durdur
            try {
                if (typeof tsParticles !== 'undefined') {
                    const containers = tsParticles.dom();
                    if (containers && containers.length > 0) {
                        containers[0].pause();
                    }
                }
            } catch(e) { /* particles not loaded or error */ }

        }

    }



    function closeLoginSidebar() {

        if (loginSidebar && loginOverlay) {

            loginSidebar.classList.remove('active');

            loginOverlay.classList.remove('active');

            document.body.style.overflow = ''; // Restore scrolling

            

            // FPS Optimizasyonu: Partikülleri yeniden başlat
            try {
                if (typeof tsParticles !== 'undefined') {
                    const containers = tsParticles.dom();
                    if (containers && containers.length > 0) {
                        containers[0].play();
                    }
                }
            } catch(e) { /* particles not loaded or error */ }

        }

    }



    window.openLoginSidebar = openLoginSidebar;

    window.closeLoginSidebar = closeLoginSidebar;



    if (loginBtn) {

        loginBtn.addEventListener('click', (e) => {

            const user = localStorage.getItem('metemorali_user');

            if (!user) {

                e.preventDefault();

                openLoginSidebar();

            }

        });

    }



    if (closeLoginBtn) {

        closeLoginBtn.addEventListener('click', closeLoginSidebar);

    }



    if (loginOverlay) {

        loginOverlay.addEventListener('click', closeLoginSidebar);

    }



    // Toggle between sections

    if (switchToEmailBtn && switchToPhoneBtn && phoneSection && emailSection) {

        switchToEmailBtn.addEventListener('click', () => {

            phoneSection.classList.add('hidden');

            forgotPasswordSection.classList.add('hidden');

            emailSection.classList.remove('hidden');

        });



        switchToPhoneBtn.addEventListener('click', () => {

            emailSection.classList.add('hidden');

            forgotPasswordSection.classList.add('hidden');

            phoneSection.classList.remove('hidden');

        });

    }



    if (forgotPasswordLink && forgotPasswordSection && emailSection) {

        forgotPasswordLink.addEventListener('click', (e) => {

            e.preventDefault();

            emailSection.classList.add('hidden');

            phoneSection.classList.add('hidden');

            forgotPasswordSection.classList.remove('hidden');

        });

    }



    if (switchFromForgotToEmailBtn && forgotPasswordSection && emailSection) {

        switchFromForgotToEmailBtn.addEventListener('click', () => {

            forgotPasswordSection.classList.add('hidden');

            emailSection.classList.remove('hidden');

        });

    }



    // Handle send reset link button click (with Validation)

    const forgotEmailInput = document.getElementById('forgot-email-input');

    const forgotEmailError = document.getElementById('forgot-email-error');



    if (forgotEmailInput && forgotEmailError) {

        // Kullanıcı yazmaya başlayınca hata mesajını gizle

        forgotEmailInput.addEventListener('input', () => {

            forgotEmailError.style.display = 'none';

        });

    }



    if (sendResetLinkBtn && forgotPasswordSection && forgotPasswordSuccessSection) {

        sendResetLinkBtn.addEventListener('click', () => {

            // Algoritma: E-posta kontrolü

            if (forgotEmailInput && forgotEmailError) {

                const emailValue = forgotEmailInput.value.trim();

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



                if (emailValue === "") {

                    forgotEmailError.textContent = "Lütfen e-posta adresinizi girin.";

                    forgotEmailError.style.display = "block";

                    return; // İşlemi durdur

                } else if (!emailRegex.test(emailValue)) {

                    forgotEmailError.textContent = "Lütfen geçerli bir e-posta formatı girin (ör: isim@mail.com).";

                    forgotEmailError.style.display = "block";

                    return; // İşlemi durdur

                }

                

                // Her şey doğruysa hata mesajını gizle ve inputu temizle

                forgotEmailError.style.display = "none";

                forgotEmailInput.value = "";

            }



            // Başarılı ekranına geç

            forgotPasswordSection.classList.add('hidden');

            forgotPasswordSuccessSection.classList.remove('hidden');

        });

    }



    // Handle back to login from success screen

    if (backToLoginFromSuccessBtn && forgotPasswordSuccessSection && emailSection) {

        backToLoginFromSuccessBtn.addEventListener('click', () => {

            forgotPasswordSuccessSection.classList.add('hidden');

            emailSection.classList.remove('hidden');

        });

    }



    // --- PHONE INPUT FORMATTING & COUNTRY CODE HANDLING (intl-tel-input Integration) ---

    window.loginItiInstance = null;
    window.profileItiInstance = null;

    function loadIntlTelInput() {
        return new Promise((resolve) => {
            if (window.intlTelInput) {
                resolve();
                return;
            }

            // Load CSS
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.4/build/css/intlTelInput.css';
            document.head.appendChild(css);

            // Load JS
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.4/build/js/intlTelInput.min.js';
            script.onload = () => resolve();
            script.onerror = () => {
                console.error('Failed to load intl-tel-input');
                resolve();
            };
            document.body.appendChild(script);
        });
    }

    async function initPhoneFields() {
        await loadIntlTelInput();
        if (!window.intlTelInput) return;

        // 1. Sidebar Login Input
        const loginInput = document.getElementById('phone-login-input');
        if (loginInput && !window.loginItiInstance) {
            window.loginItiInstance = window.intlTelInput(loginInput, {
                initialCountry: "tr",
                preferredCountries: ["tr", "de", "gb", "ru", "nl", "fr", "it", "az"],
                autoPlaceholder: "aggressive",
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.4/build/js/utils.js"
            });

            // Strip leading zero for Turkey
            loginInput.addEventListener('input', () => {
                const country = window.loginItiInstance.getSelectedCountryData();
                if (country.dialCode === '90') {
                    let val = loginInput.value.replace(/\D/g, '');
                    if (val.startsWith('0')) {
                        loginInput.value = val.substring(1);
                        loginInput.dispatchEvent(new Event('input'));
                    }
                }
            });
        }

        // 2. Profile Page Input
        const profileInput = document.getElementById('profile-tel');
        if (profileInput && !window.profileItiInstance) {
            window.profileItiInstance = window.intlTelInput(profileInput, {
                initialCountry: "tr",
                preferredCountries: ["tr", "de", "gb", "ru", "nl", "fr", "it", "az"],
                autoPlaceholder: "aggressive",
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.4/build/js/utils.js"
            });

            // Strip leading zero for Turkey
            profileInput.addEventListener('input', () => {
                const country = window.profileItiInstance.getSelectedCountryData();
                if (country.dialCode === '90') {
                    let val = profileInput.value.replace(/\D/g, '');
                    if (val.startsWith('0')) {
                        profileInput.value = val.substring(1);
                        profileInput.dispatchEvent(new Event('input'));
                    }
                }
            });

            // If user phone is already loaded, populate it
            const userJson = localStorage.getItem('metemorali_user');
            if (userJson) {
                const user = JSON.parse(userJson);
                const rawPhone = user.type === 'phone' ? user.value : (user.phone || '');
                if (rawPhone) {
                    window.profileItiInstance.setNumber(rawPhone);
                }
            }
        }
    }

    // Run initialization
    initPhoneFields();



    // --- MOBİL MENÜ LOGIC (GSAP Animasyonlu) ---

    const topMenuBtn = document.querySelector('.menu-btn'); // Navbar'daki sol üst menü butonu

    const mobileMenuOverlay = document.getElementById('mobile-menu');

    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');

    const mobileNavItems = document.querySelectorAll('.mobile-nav-links li');

    

    // Login açmak için mobil menüdeki hesap butonu

    const mobileMenuLoginBtn = document.getElementById('mobile-menu-login-btn');



    if (topMenuBtn && mobileMenuOverlay) {

        // GSAP Timeline

        const menuTl = gsap.timeline({ paused: true });

        

        menuTl.to(mobileMenuOverlay, {

            opacity: 1,

            autoAlpha: 1, // visibility: visible yapar

            duration: 0.4,

            ease: "power2.inOut"

        })

        .fromTo(mobileNavItems, 

            { y: 30, opacity: 0 }, 

            { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.5)" },

            "-=0.2"

        );



        topMenuBtn.addEventListener('click', () => {

            mobileMenuOverlay.classList.add('active'); // pointer-events: auto yapar

            menuTl.play();

            document.body.style.overflow = 'hidden'; // Arka plan kaymasını engelle

        });



        if (mobileMenuCloseBtn) {

            mobileMenuCloseBtn.addEventListener('click', () => {

                menuTl.reverse();

                mobileMenuOverlay.classList.remove('active');

                document.body.style.overflow = '';

            });

        }

        

        // Eğer mobil menüdeki Login butonuna tıklanırsa, önce menüyü kapatıp sonra Login sidebar'ı aç

        if(mobileMenuLoginBtn) {

            mobileMenuLoginBtn.addEventListener('click', (e) => {

                const user = localStorage.getItem('metemorali_user');

                if (!user) {

                    e.preventDefault();

                    menuTl.reverse();

                    mobileMenuOverlay.classList.remove('active');

                    document.body.style.overflow = '';

                    openLoginSidebar(); // Zaten yukarıda tanımlanmıştı

                } else {

                    menuTl.reverse();

                    mobileMenuOverlay.classList.remove('active');

                    document.body.style.overflow = '';

                }

            });

        }

    }



    // --- NAVBAR AUTH STATE VISUAL INDICATOR ---

    function updateNavbarAuthState() {

        const loginBtn = document.getElementById('user-login-btn');

        if (loginBtn) {

            const user = localStorage.getItem('metemorali_user');

            const icon = loginBtn.querySelector('i');

            if (user && icon) {

                icon.className = 'fa-solid fa-user';

                loginBtn.classList.add('user-logged-in');

            } else if (icon) {

                icon.className = 'fa-regular fa-user';

                loginBtn.classList.remove('user-logged-in');

            }

        }

    }

    updateNavbarAuthState();

    const API_BASE_URL = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.apiBase : 'http://localhost:5055';



    // --- USER DATABASE SIMULATION & INITIALIZATION ---



    // --- PANEL SWITCHING EVENTS ---

    const goRegisterLink = document.getElementById('go-to-register-link');

    const switchLoginFromRegisterBtn = document.getElementById('switch-to-login-from-register');

    const switchBackToPhoneInputBtn = document.getElementById('switch-back-to-phone-input');

    

    const registerSection = document.getElementById('register-section');

    const phoneVerifySection = document.getElementById('phone-verify-section');

    

    if (goRegisterLink && emailSection && registerSection) {

        goRegisterLink.addEventListener('click', (e) => {

            e.preventDefault();

            emailSection.classList.add('hidden');

            registerSection.classList.remove('hidden');

        });

    }



    if (switchLoginFromRegisterBtn && emailSection && registerSection) {

        switchLoginFromRegisterBtn.addEventListener('click', () => {

            registerSection.classList.add('hidden');

            emailSection.classList.remove('hidden');

        });

    }



    if (switchBackToPhoneInputBtn && phoneSection && phoneVerifySection) {

        switchBackToPhoneInputBtn.addEventListener('click', () => {

            phoneVerifySection.classList.add('hidden');

            phoneSection.classList.remove('hidden');

        });

    }



    // --- PHONE LOGIN & SMS VERIFICATION FLOW ---

    const phoneSubmitBtn = document.querySelector('#phone-login-section .login-submit-btn');

    const phoneInputEl = document.getElementById('phone-login-input');

    const termsCheckEl = document.getElementById('terms-check');

    let activePhoneLogin = ""; // Store phone number between panels

    let offlinePhoneCode = ""; // Simulated code when server is offline



    if (phoneSubmitBtn && phoneSection && phoneVerifySection) {

        phoneSubmitBtn.addEventListener('click', async () => {

            if (!phoneInputEl || !phoneInputEl.value.trim()) {

                showToast(t('alert_enter_phone', 'Lütfen telefon numaranızı girin.'), 'error');

                return;

            }

            if (termsCheckEl && !termsCheckEl.checked) {

                showToast(t('alert_accept_terms', 'Giriş yapabilmek için sözleşmeleri ve politikaları kabul etmelisiniz.'), 'error');

                return;

            }

            

            let rawPhone = phoneInputEl.value.trim();
            if (window.loginItiInstance) {
                rawPhone = window.loginItiInstance.getNumber();
            }

            activePhoneLogin = rawPhone;

            

            showLoadingOverlay(true);

            

            try {

                const response = await fetch(`${API_BASE_URL}/CustomerAuth/send-phone-code`, {

                    method: 'POST',

                    headers: { 'Content-Type': 'application/json' },

                    body: JSON.stringify({ phone: rawPhone })

                });



                if (response.ok) {

                    const data = await response.json();

                    console.log("\n==========================================");

                    console.log("[PHONE LOGIN CODE]");

                    console.log("Phone: " + rawPhone);

                    console.log("Code: " + data.debugCode);

                    console.log("==========================================\n");

                    

                    showLoadingOverlay(false);

                    phoneSection.classList.add('hidden');

                    phoneVerifySection.classList.remove('hidden');

                    

                    const verifyInput = document.getElementById('phone-verify-code-input');

                    const verifyError = document.getElementById('phone-verify-error');

                    if (verifyInput) verifyInput.value = "";

                    if (verifyError) verifyError.style.display = "none";

                    return;

                } else {

                    const errData = await response.json();

                    showLoadingOverlay(false);

                    showToast(errData.message || "Telefon kodu gönderme işlemi başarısız.", 'error');

                    return;

                }

            } catch (err) {

                console.warn("Backend API not reachable for phone verification. Falling back to local/offline mode.", err);

            }



            // Fallback (Offline Mode)

            offlinePhoneCode = "123456";

            console.log("\n==========================================");

            console.log("[PHONE LOGIN CODE] (Çevrimdışı)");

            console.log("Phone: " + rawPhone);

            console.log("Code: " + offlinePhoneCode);

            console.log("==========================================\n");

            

            showLoadingOverlay(false);

            phoneSection.classList.add('hidden');

            phoneVerifySection.classList.remove('hidden');

            

            const verifyInput = document.getElementById('phone-verify-code-input');

            const verifyError = document.getElementById('phone-verify-error');

            if (verifyInput) verifyInput.value = "";

            if (verifyError) verifyError.style.display = "none";

        });

    }



    const phoneVerifySubmitBtn = document.getElementById('phone-verify-submit-btn');

    const phoneVerifyCodeInput = document.getElementById('phone-verify-code-input');

    const phoneVerifyError = document.getElementById('phone-verify-error');



    if (phoneVerifySubmitBtn && phoneVerifyCodeInput && phoneVerifyError) {

        phoneVerifySubmitBtn.addEventListener('click', async () => {

            const enteredCode = phoneVerifyCodeInput.value.trim();

            if (!enteredCode) {

                phoneVerifyError.textContent = "Lütfen doğrulama kodunu girin.";

                phoneVerifyError.style.display = "block";

                return;

            }



            showLoadingOverlay(true);



            try {

                const response = await fetch(`${API_BASE_URL}/CustomerAuth/verify-phone`, {

                    method: 'POST',

                    headers: { 'Content-Type': 'application/json' },

                    body: JSON.stringify({ phone: activePhoneLogin, code: enteredCode })

                });



                if (response.ok) {

                    const data = await response.json();

                    const sessionUser = {

                        type: 'phone',

                        value: activePhoneLogin,

                        name: data.fullName

                    };



                    localStorage.setItem('metemorali_user', JSON.stringify(sessionUser));

                    localStorage.setItem('metemorali_token', data.token);



                    showLoadingOverlay(false);

                    closeLoginSidebar();

                    updateNavbarAuthState();



                    if (window.location.pathname.includes('hesabim')) {

                        updateProfileUI();

                    } else {

                        window.location.href = 'hesabim';

                    }

                    return;

                } else {

                    const errData = await response.json();

                    showLoadingOverlay(false);

                    phoneVerifyError.textContent = errData.message || "Doğrulama kodu hatalı.";

                    phoneVerifyError.style.display = "block";

                    return;

                }

            } catch (err) {

                console.warn("Backend API not reachable for phone login verify. Falling back to LocalStorage.", err);

            }



            // Fallback (Offline Mode)

            showLoadingOverlay(false);

            if (enteredCode !== offlinePhoneCode && enteredCode !== "123456") {

                phoneVerifyError.textContent = "Hatalı doğrulama kodu. Lütfen test kodu olan '123456' girin.";

                phoneVerifyError.style.display = "block";

                return;

            }



            phoneVerifyError.style.display = "none";



            let simulatedUsers = JSON.parse(localStorage.getItem('metemorali_users')) || [];

            let existingUser = simulatedUsers.find(u => u.phone === activePhoneLogin);

            

            if (!existingUser) {

                existingUser = {

                    name: "Değerli Müşterimiz",

                    email: "",

                    password: "",

                    phone: activePhoneLogin

                };

                simulatedUsers.push(existingUser);

                localStorage.setItem('metemorali_users', JSON.stringify(simulatedUsers));

            }



            const sessionUser = {

                type: 'phone',

                value: activePhoneLogin,

                name: existingUser.name

            };



            localStorage.setItem('metemorali_user', JSON.stringify(sessionUser));

            localStorage.removeItem('metemorali_token'); // Clear token in offline mode

            closeLoginSidebar();

            updateNavbarAuthState();



            if (window.location.pathname.includes('hesabim')) {

                updateProfileUI();

            } else {

                window.location.href = 'hesabim';

            }

        });



        phoneVerifyCodeInput.addEventListener('input', () => {

            phoneVerifyError.style.display = "none";

        });

    }

    

    // --- EMAIL LOGIN FLOW ---

    // --- EMAIL LOGIN AND REGISTRATION WITH SUPABASE ---

    const emailSubmitBtn = document.querySelector('#email-login-section .login-submit-btn');

    const emailInputEl = document.getElementById('email-login-input');

    const passwordInputEl = document.getElementById('email-login-password-input');

    const emailLoginError = document.getElementById('email-login-general-error');



    const registerSubmitBtn = document.getElementById('register-submit-btn');

    const regNameInput = document.getElementById('register-name-input');

    const regEmailInput = document.getElementById('register-email-input');

    const regPasswordInput = document.getElementById('register-password-input');

    const regConfirmInput = document.getElementById('register-confirm-input');

    const regTermsCheck = document.getElementById('register-terms-check');

    const emailVerifySection = document.getElementById('email-verify-section');

    const regNameError = document.getElementById('register-name-error');

    const regEmailError = document.getElementById('register-email-error');

    const regPasswordError = document.getElementById('register-password-error');

    const regConfirmError = document.getElementById('register-confirm-error');

    const regTermsError = document.getElementById('register-terms-error');



    const emailVerifySubmitBtn = document.getElementById('email-verify-submit-btn');

    const emailVerifyCodeInput = document.getElementById('email-verify-code-input');

    const emailVerifyError = document.getElementById('email-verify-error');

    function getAuthErrorMessage(err) {
        if (!err) return '';
        const msg = (err.message || String(err)).toLowerCase();
        const lang = localStorage.getItem('metemorali_lang') || 'tr';

        const translations = {
            invalid_credentials: {
                tr: "Hatalı e-posta veya şifre girdiniz.",
                en: "Invalid email or password.",
                de: "Ungültige E-Mail-Adresse oder Passwort.",
                ru: "Неверный адрес электронной почты или пароль.",
                nl: "Ongeldig e-mailadres of wachtwoord.",
                fr: "E-mail ou mot de passe incorrect.",
                it: "Email o password non validi."
            },
            email_not_confirmed: {
                tr: "Lütfen önce e-posta adresinize gelen onay linkine tıklayın.",
                en: "Please verify your email address first.",
                de: "Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.",
                ru: "Пожалуйста, подтвердите ваш адрес электронной почты.",
                nl: "Bevestig eerst uw e-mailadres.",
                fr: "Veuillez d'abord confirmer votre adresse e-mail.",
                it: "Conferma prima il tuo indirizzo email."
            },
            user_already_registered: {
                tr: "Bu e-posta adresiyle zaten kayıtlı bir hesap var.",
                en: "An account with this email already exists.",
                de: "Ein Konto mit dieser E-Mail existiert bereits.",
                ru: "Учетная запись с этой почтой уже существует.",
                nl: "Er bestaat al een account met dit e-mailadres.",
                fr: "Un compte avec cet e-mail existe déjà.",
                it: "Esiste già un account con questa email."
            },
            password_length: {
                tr: "Şifre en az 6 karakter olmalıdır.",
                en: "Password should be at least 6 characters.",
                de: "Das Passwort muss mindestens 6 Zeichen lang sein.",
                ru: "Пароль должен содержать не менее 6 символов.",
                nl: "Wachtwoord moet minimaal 6 tekens lang zijn.",
                fr: "Le mot de passe doit comporter au moins 6 caractères.",
                it: "La password deve contenere almeno 6 caratteri."
            },
            rate_limit: {
                tr: "Güvenlik nedeniyle lütfen kısa bir süre bekleyip tekrar deneyin.",
                en: "Please wait a moment before trying again.",
                de: "Bitte warten Sie einen Moment, bevor Sie es erneut versuchen.",
                ru: "Пожалуйста, подождите немного перед повторной попыткой.",
                nl: "Wacht even voordat u het opnieuw probeert.",
                fr: "Veuillez patienter un instant avant de réessayer.",
                it: "Attendi un momento prima di riprovare."
            },
            user_not_found: {
                tr: "Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.",
                en: "No user found with this email address.",
                de: "Kein Benutzer mit dieser E-Mail-Adresse gefunden.",
                ru: "Пользователь с такой почтой не найден.",
                nl: "Geen gebruiker gevonden met dit e-mailadres.",
                fr: "Aucun utilisateur trouvé avec cet e-mail.",
                it: "Nessun utente trovato con questa email."
            },
            invalid_otp: {
                tr: "Geçersiz veya süresi dolmuş doğrulama kodu.",
                en: "Invalid or expired verification code.",
                de: "Ungültiger oder abgelaufener Bestätigungscode.",
                ru: "Неверный или просроченный код подтверждения.",
                nl: "Ongeldige of verlopen verificatiecode.",
                fr: "Code de vérification invalide ou expiré.",
                it: "Codice di verifica non valido o scaduto."
            },
            generic: {
                tr: "Hatalı bilgi veya işlem hatası. Lütfen tekrar deneyin.",
                en: "An error occurred. Please try again.",
                de: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
                ru: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
                nl: "Er is een fout opgetreden. Probeer het opnieuw.",
                fr: "Une erreur est survenue. Veuillez réessayer.",
                it: "Si è verificato un errore. Riprova."
            }
        };

        let key = 'generic';
        if (msg.includes('invalid login credentials') || msg.includes('invalid_grant') || msg.includes('invalid credentials')) {
            key = 'invalid_credentials';
        } else if (msg.includes('email not confirmed')) {
            key = 'email_not_confirmed';
        } else if (msg.includes('already registered') || msg.includes('user already exists')) {
            key = 'user_already_registered';
        } else if (msg.includes('at least 6 characters') || msg.includes('password should be')) {
            key = 'password_length';
        } else if (msg.includes('token') && (msg.includes('expired') || msg.includes('invalid') || msg.includes('otp'))) {
            key = 'invalid_otp';
        } else if (msg.includes('security purposes') || msg.includes('rate limit') || msg.includes('too many requests')) {
            key = 'rate_limit';
        } else if (msg.includes('user not found')) {
            key = 'user_not_found';
        }

        return (translations[key] && translations[key][lang]) || translations[key]['tr'] || err.message;
    }

    // Hide error states on input
    if (emailInputEl && emailLoginError) emailInputEl.addEventListener('input', () => { emailLoginError.style.display = 'none'; });
    if (passwordInputEl && emailLoginError) passwordInputEl.addEventListener('input', () => { emailLoginError.style.display = 'none'; });



    // 1. Email Login

    if (emailSubmitBtn && emailInputEl && passwordInputEl) {

        emailSubmitBtn.addEventListener('click', async () => {

            const email = emailInputEl.value.trim();

            const password = passwordInputEl.value.trim();

            let hasErr = false;



            if (emailLoginError) emailLoginError.style.display = 'none';



            if (!email) {

                if (emailLoginError) {

                    emailLoginError.textContent = "E-posta adresi gereklidir.";

                    emailLoginError.style.display = 'block';

                }

                hasErr = true;

            }

            if (!password) {

                if (emailLoginError) {

                    emailLoginError.textContent = "Şifre gereklidir.";

                    emailLoginError.style.display = 'block';

                }

                hasErr = true;

            }



            if (hasErr) return;



            showLoadingOverlay(true);



            try {

                const { data, error } = await supabaseClient.auth.signInWithPassword({

                    email,

                    password

                });



                showLoadingOverlay(false);



                if (error) {
                    if (emailLoginError) {
                        emailLoginError.textContent = getAuthErrorMessage(error);
                        emailLoginError.style.display = 'block';
                    }
                } else {

                    showSuccessOverlay("Giriş Başarılı!", "Hesabınıza yönlendiriliyorsunuz...", () => {

                        closeLoginSidebar();

                        updateNavbarAuthState();

                        if (window.location.pathname.includes('hesabim')) {

                            updateProfileUI();

                            const wrapper = document.querySelector('.dashboard-wrapper');

                            if (wrapper) wrapper.style.display = 'block';

                        } else {

                            window.location.href = 'hesabim';

                        }

                    });

                }

            } catch (err) {

                showLoadingOverlay(false);

                if (emailLoginError) {

                    emailLoginError.textContent = "Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.";

                    emailLoginError.style.display = 'block';

                }

            }

        });

    }



    // 2. Email Register (Sign Up)

    if (registerSubmitBtn && regNameInput && regEmailInput && regPasswordInput && regConfirmInput) {

        registerSubmitBtn.addEventListener('click', async () => {

            if (regNameError) regNameError.style.display = 'none';

            if (regEmailError) regEmailError.style.display = 'none';

            if (regPasswordError) regPasswordError.style.display = 'none';

            if (regConfirmError) regConfirmError.style.display = 'none';

            if (regTermsError) regTermsError.style.display = 'none';



            const name = regNameInput.value.trim();

            const email = regEmailInput.value.trim();

            const password = regPasswordInput.value.trim();

            const confirm = regConfirmInput.value.trim();

            const termsChecked = regTermsCheck ? regTermsCheck.checked : false;



            let hasErr = false;



            if (!name) {

                if (regNameError) { regNameError.textContent = "Ad soyad gereklidir."; regNameError.style.display = 'block'; }

                hasErr = true;

            }

            if (!email) {

                if (regEmailError) { regEmailError.textContent = "E-posta gereklidir."; regEmailError.style.display = 'block'; }

                hasErr = true;

            }

            if (!password) {

                if (regPasswordError) { regPasswordError.textContent = "Şifre gereklidir."; regPasswordError.style.display = 'block'; }

                hasErr = true;

            }

            if (password !== confirm) {

                if (regConfirmError) { regConfirmError.textContent = "Şifreler uyuşmuyor."; regConfirmError.style.display = 'block'; }

                hasErr = true;

            }

            if (!termsChecked) {

                if (regTermsError) { regTermsError.textContent = "Gizlilik sözleşmesini onaylamalısınız."; regTermsError.style.display = 'block'; }

                hasErr = true;

            }



            if (hasErr) return;



            showLoadingOverlay(true);



            try {

                const { data, error } = await supabaseClient.auth.signUp({

                    email,

                    password,

                    options: {

                        data: {

                            full_name: name

                        }

                    }

                });



                showLoadingOverlay(false);



                if (error) {
                    if (regEmailError) {
                        regEmailError.textContent = getAuthErrorMessage(error);
                        regEmailError.style.display = 'block';
                    }
                } else {

                    activeRegInfo = { name, email, password };



                    // Switch to verification code entry panel

                    const registerSection = document.getElementById('register-section');

                    if (registerSection) registerSection.classList.add('hidden');

                    if (emailVerifySection) {

                        emailVerifySection.classList.remove('hidden');

                        if (emailVerifyCodeInput) emailVerifyCodeInput.value = "";

                        if (emailVerifyError) emailVerifyError.style.display = "none";

                    }

                }

            } catch (err) {

                showLoadingOverlay(false);

                if (regEmailError) {

                    regEmailError.textContent = "Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.";

                    regEmailError.style.display = 'block';

                }

            }

        });



        // Event listeners to hide errors

        regNameInput.addEventListener('input', () => { if (regNameError) regNameError.style.display = 'none'; });

        regEmailInput.addEventListener('input', () => { if (regEmailError) regEmailError.style.display = 'none'; });

        regPasswordInput.addEventListener('input', () => { if (regPasswordError) regPasswordError.style.display = 'none'; });

        regConfirmInput.addEventListener('input', () => { if (regConfirmError) regConfirmError.style.display = 'none'; });

        if (regTermsCheck) regTermsCheck.addEventListener('change', () => { if (regTermsError) regTermsError.style.display = 'none'; });

    }



    // 3. Register Verification OTP code confirmation

    if (emailVerifySubmitBtn && emailVerifyCodeInput && emailVerifyError) {

        emailVerifySubmitBtn.addEventListener('click', async () => {

            const enteredCode = emailVerifyCodeInput.value.trim();

            if (!enteredCode) {

                emailVerifyError.textContent = "Lütfen onay kodunu girin.";

                emailVerifyError.style.display = 'block';

                return;

            }



            showLoadingOverlay(true);



            try {

                const { data, error } = await supabaseClient.auth.verifyOtp({

                    email: activeRegInfo.email,

                    token: enteredCode,

                    type: 'signup'

                });



                showLoadingOverlay(false);



                if (error) {
                    if (emailVerifyError) {
                        emailVerifyError.textContent = getAuthErrorMessage(error);
                        emailVerifyError.style.display = 'block';
                    }
                } else {

                    showSuccessOverlay("Kayıt Başarılı!", "Hesabınız başarıyla oluşturuldu...", () => {

                        closeLoginSidebar();

                        updateNavbarAuthState();



                        regNameInput.value = "";

                        regEmailInput.value = "";

                        regPasswordInput.value = "";

                        regConfirmInput.value = "";

                        if (regTermsCheck) regTermsCheck.checked = false;

                        emailVerifyCodeInput.value = "";

                        activeRegInfo = null;



                        if (window.location.pathname.includes('hesabim')) {

                            updateProfileUI();

                            const wrapper = document.querySelector('.dashboard-wrapper');

                            if (wrapper) wrapper.style.display = 'block';

                        } else {

                            window.location.href = 'hesabim';

                        }

                    });

                }

            } catch (err) {

                showLoadingOverlay(false);

                if (emailVerifyError) {

                    emailVerifyError.textContent = "Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.";

                    emailVerifyError.style.display = 'block';

                }

            }

        });



        emailVerifyCodeInput.addEventListener('input', () => {

            if (emailVerifyError) emailVerifyError.style.display = 'none';

        });

    }



    // Switch back button

    const switchBackToRegisterInputBtn = document.getElementById('switch-back-to-register-input');

    if (switchBackToRegisterInputBtn && emailVerifySection) {

        switchBackToRegisterInputBtn.addEventListener('click', () => {

            emailVerifySection.classList.add('hidden');

            const registerSection = document.getElementById('register-section');

            if (registerSection) registerSection.classList.remove('hidden');

        });

    }



    // --- PROFILE AND LOGOUT LOGIC ---

    async function updateProfileUI() {

        const userJson = localStorage.getItem('metemorali_user');

        if (!userJson) return;

        

        let user = JSON.parse(userJson);

        const token = localStorage.getItem('metemorali_token');



        if (token && user && user.type !== 'email' && API_BASE_URL && !API_BASE_URL.includes('api-sunucu-adresiniz')) {
            try {

                const response = await fetch(`${API_BASE_URL}/CustomerAuth/profile`, {

                    headers: { 'Authorization': `Bearer ${token}` }

                });

                if (response.ok) {

                    const data = await response.json();

                    user.name = data.fullName;

                    user.value = data.email;

                    localStorage.setItem('metemorali_user', JSON.stringify(user));

                } else if (response.status === 401) {

                    localStorage.removeItem('metemorali_user');

                    localStorage.removeItem('metemorali_token');

                    window.location.href = 'anasayfa';

                    return;

                }

            } catch (err) {

                console.warn("Backend API not reachable for profile sync. Using offline local state.", err);

            }

        }

        

        const greeting = document.querySelector('.dashboard-greeting');

        if (greeting) {

            greeting.textContent = `${t('hello_user', 'Merhaba')}, ${user.name}`;

        }

        

        const nameInput = document.querySelector('#tab-profil input[type="text"]');

        const emailInput = document.querySelector('#tab-profil input[type="email"]');

        const telInput = document.querySelector('#tab-profil input[type="tel"]');

        

        if (nameInput) nameInput.value = user.name;

        if (emailInput) emailInput.value = user.type === 'email' ? user.value : '';

        

        if (telInput) {
            const rawPhone = user.type === 'phone' ? user.value : (user.phone || '');
            if (window.profileItiInstance) {
                window.profileItiInstance.setNumber(rawPhone);
            } else {
                telInput.value = rawPhone;
            }
        }



        // Render user orders if on hesabim

        if (window.location.pathname.includes('hesabim')) {

            renderUserOrders();

            checkCheckoutSuccess();

        }

    }

    

    window.updateProfileUI = updateProfileUI;

    updateProfileUI();



    // --- ORDER HISTORY AND REAL-TIME TRACKING SYSTEM ---
    async function renderUserOrders() {
        const container = document.querySelector('.luxury-order-list');
        if (!container) return;

        const lang = localStorage.getItem('metemorali_lang') || 'tr';
        const user = JSON.parse(localStorage.getItem('metemorali_user') || 'null');
        const ordersJson = localStorage.getItem('metemorali_orders');
        let orders = ordersJson ? JSON.parse(ordersJson) : [];

        // Function to render order cards to HTML
        const renderOrderCards = (orderList) => {
            if (!orderList || orderList.length === 0) {
                container.innerHTML = `<p class="empty-state" data-i18n="empty_state_orders">${t('empty_state_orders', 'Şu an için oluşturulmuş bir siparişiniz bulunmamaktadır.')}</p>`;
                return;
            }

            orderList.sort((a, b) => new Date(b.date) - new Date(a.date));
            container.innerHTML = '';

            orderList.forEach(order => {
                const statusStep = getStatusStep(order.status);
                const formattedDate = new Date(order.date).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                });

                const orderId = order.id;
                const cardId = `order-card-${orderId}`;

                let itemsHtml = (order.items || []).map(item => `
                    <div class="order-detail-item">
                        <img src="${item.image || 'img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png'}" alt="${item.title || 'Ürün'}" class="order-item-thumb">
                        <div class="order-item-info">
                            <h4>${item.title || 'Ürün'}</h4>
                            <p>${t('cart_item_size', 'Beden')}: <b>${item.size || 'Standart'}</b> | ${t('whatsapp_qty', 'Adet')}: <b>${item.quantity || 1}</b></p>
                        </div>
                        <div class="order-item-price">€${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</div>
                    </div>
                `).join('');

                const whatsappNumber = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.whatsapp : '905322144553';
                const whatsappMessage = `${t('whatsapp_quote_title', 'MeteMorali Teklif Talebi')}\n\nSipariş No: #${orderId}\nSipariş Tarihi: ${formattedDate}\nDurum: ${order.status}\n\nSiparişim hakkında bilgi almak istiyorum.`;
                const encodedText = encodeURIComponent(whatsappMessage);

                const orderCardHtml = `
                    <div class="luxury-order-card" id="${cardId}">
                        <div class="order-card-header" onclick="toggleOrderDetails('${cardId}')">
                            <div class="order-header-main">
                                <span class="order-id">#${orderId}</span>
                                <span class="order-date">${formattedDate}</span>
                            </div>
                            <div class="order-header-status-price">
                                <span class="order-status-badge status-${statusStep}">${t('status_' + (order.status || '').replace(/\s+/g, '_').toLowerCase(), order.status || 'Talep Alındı')}</span>
                                <span class="order-price">€${(order.totalAmount || 0).toFixed(2)}</span>
                                <i class="fa-solid fa-chevron-down toggle-icon"></i>
                            </div>
                        </div>
                        
                        <div class="order-card-body">
                            <!-- Tracker -->
                            <div class="order-tracker">
                                <div class="tracker-line">
                                    <div class="tracker-progress" style="width: ${((statusStep - 1) / 3) * 100}%"></div>
                                </div>
                                <div class="tracker-steps">
                                    <div class="tracker-step ${statusStep >= 1 ? 'active' : ''}">
                                        <div class="step-dot"><i class="fa-solid fa-file-invoice"></i></div>
                                        <span class="step-label">${t('status_talep_alindi', 'Talep Alındı')}</span>
                                    </div>
                                    <div class="tracker-step ${statusStep >= 2 ? 'active' : ''}">
                                        <div class="step-dot"><i class="fa-solid fa-gears"></i></div>
                                        <span class="step-label">${t('status_hazirlaniyor', 'Hazırlanıyor')}</span>
                                    </div>
                                    <div class="tracker-step ${statusStep >= 3 ? 'active' : ''}">
                                        <div class="step-dot"><i class="fa-solid fa-truck-fast"></i></div>
                                        <span class="step-label">${t('status_kargoda', 'Kargoda')}</span>
                                    </div>
                                    <div class="tracker-step ${statusStep >= 4 ? 'active' : ''}">
                                        <div class="step-dot"><i class="fa-solid fa-house-chimney-user"></i></div>
                                        <span class="step-label">${t('status_teslim_edildi', 'Teslim Edildi')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="order-items-list-wrapper">
                                <h4 class="items-title">${t('whatsapp_products', 'Ürünler')}</h4>
                                <div class="order-items-list">${itemsHtml}</div>
                            </div>
                            
                            <div class="order-card-actions">
                                <a href="https://wa.me/${whatsappNumber}?text=${encodedText}" target="_blank" class="order-support-btn">
                                    <i class="fa-brands fa-whatsapp"></i> ${t('live_support', 'WhatsApp ile İletişime Geç')}
                                </a>
                            </div>
                        </div>
                    </div>
                `;

                container.innerHTML += orderCardHtml;
            });
        };

        // Render local orders initially
        renderOrderCards(orders);

        // Async sync from Supabase if user is logged in
        if (supabaseClient && user) {
            try {
                const phone = user.phone || (user.type === 'phone' ? user.value : '');
                const name = user.name || '';
                const email = user.email || (user.type === 'email' ? user.value : '');

                let filterArr = [];
                if (phone) filterArr.push(`CustomerPhone.eq.${phone}`);
                if (name && name !== email) filterArr.push(`CustomerName.eq.${name}`);

                let query = supabaseClient.from('Orders').select('*');
                if (filterArr.length > 0) {
                    query = query.or(filterArr.join(','));
                }

                const { data: dbOrders, error: orderErr } = await query.order('Id', { ascending: false });
                if (!orderErr && dbOrders && dbOrders.length > 0) {
                    const orderIds = dbOrders.map(o => o.Id || o.id);
                    const { data: dbItems } = await supabaseClient.from('OrderItems').select('*').in('OrderId', orderIds);

                    const mergedOrders = [...orders];
                    dbOrders.forEach(dbOrder => {
                        const dbOrderId = (dbOrder.Id || dbOrder.id).toString();
                        const existingIdx = mergedOrders.findIndex(o => (o.apiId && o.apiId.toString() === dbOrderId) || o.id === dbOrderId || o.id === `MM-${dbOrderId}`);

                        const matchingItems = (dbItems || []).filter(item => (item.OrderId || item.orderId) == dbOrderId);
                        const formattedItems = matchingItems.map(item => {
                            const prodId = item.ProductId || item.productId;
                            const mock = (typeof MOCK_PRODUCTS !== 'undefined' ? MOCK_PRODUCTS.find(p => p.id == prodId) : null);
                            const pTitle = mock ? (typeof mock.name === 'object' ? (mock.name[lang] || mock.name['tr']) : mock.name) : `Ürün #${prodId}`;
                            const pImg = mock ? mock.imageUrl : 'img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png';
                            return {
                                productId: prodId,
                                title: pTitle,
                                size: item.Size || item.size || 'Standart',
                                quantity: item.Quantity || item.quantity || 1,
                                price: Number(item.UnitPrice || item.unitPrice || 0),
                                image: pImg
                            };
                        });

                        const mappedOrder = {
                            id: (existingIdx > -1 && mergedOrders[existingIdx].id.startsWith('MM-')) ? mergedOrders[existingIdx].id : `MM-${dbOrderId}`,
                            apiId: parseInt(dbOrderId),
                            date: dbOrder.OrderDate || dbOrder.orderDate || new Date().toISOString(),
                            customerName: dbOrder.CustomerName || dbOrder.customerName || user.name,
                            customerPhone: dbOrder.CustomerPhone || dbOrder.customerPhone || phone,
                            totalAmount: Number(dbOrder.TotalAmount || dbOrder.totalAmount || 0),
                            status: dbOrder.Status || dbOrder.status || 'Talep Alındı',
                            items: (existingIdx > -1 && mergedOrders[existingIdx].items && mergedOrders[existingIdx].items.length > 0) 
                                ? mergedOrders[existingIdx].items 
                                : (formattedItems.length > 0 ? formattedItems : [{
                                    productId: 1,
                                    title: 'MeteMorali Koruyucu Kıyafet',
                                    size: 'Standart',
                                    quantity: 1,
                                    price: Number(dbOrder.TotalAmount || dbOrder.totalAmount || 0),
                                    image: 'img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png'
                                }])
                        };

                        if (existingIdx > -1) {
                            mergedOrders[existingIdx].status = mappedOrder.status;
                            mergedOrders[existingIdx].apiId = mappedOrder.apiId;
                        } else {
                            mergedOrders.push(mappedOrder);
                        }
                    });

                    localStorage.setItem('metemorali_orders', JSON.stringify(mergedOrders));
                    renderOrderCards(mergedOrders);
                }
            } catch (err) {
                console.warn("Supabase sipariş geçmişi senkronize edilemedi:", err);
            }
        }
    }



     function getStatusStep(status) {

         const s = (status || '').toLowerCase();

         if (s.includes('teslim') || s.includes('tamam') || s.includes('deliv')) return 4;

         if (s.includes('kargo') || s.includes('yolda') || s.includes('ship')) return 3;

         if (s.includes('hazır') || s.includes('hazir') || s.includes('onay') || s.includes('prep')) return 2;

         return 1; // Default "Talep Alındı" / "Bekliyor"

     }



     async function fetchLatestOrderStatus(apiId, orderId, allOrders) {

         try {

             const token = localStorage.getItem('metemorali_token');
             const headers = {};
             if (token) {
                 headers['Authorization'] = `Bearer ${token}`;
             }
             const res = await fetch(`${API_BASE_URL}/api/Orders/${apiId}`, { headers });

             if (res.ok) {

                 const apiOrder = await res.json();

                 if (apiOrder && apiOrder.status) {

                     const currentOrder = allOrders.find(o => o.id === orderId);

                     if (currentOrder && currentOrder.status !== apiOrder.status) {

                         currentOrder.status = apiOrder.status;

                         localStorage.setItem('metemorali_orders', JSON.stringify(allOrders));

                         

                         // Update UI dynamically

                         const card = document.getElementById(`order-card-${orderId}`);

                         if (card) {

                             const statusStep = getStatusStep(apiOrder.status);

                             

                             // Update Badge

                             const badge = card.querySelector('.order-status-badge');

                             if (badge) {

                                 badge.textContent = apiOrder.status;

                                 badge.className = `order-status-badge status-${statusStep}`;

                             }

                             

                             // Update Progress Line

                             const progress = card.querySelector('.tracker-progress');

                             if (progress) {

                                 progress.style.width = `${((statusStep - 1) / 3) * 100}%`;

                             }

                             

                             // Update Steps

                             const steps = card.querySelectorAll('.tracker-step');

                             steps.forEach((step, idx) => {

                                 if (idx < statusStep) {

                                     step.classList.add('active');

                                 } else {

                                     step.classList.remove('active');

                                 }

                             });

                         }

                     }

                 }

             }

         } catch (e) {

             console.warn("Backend API not reachable for order tracking:", e);

         }

     }



     window.toggleOrderDetails = function(cardId) {

         const card = document.getElementById(cardId);

         if (card) {

             card.classList.toggle('expanded');

         }

     };



     function checkCheckoutSuccess() {

         const urlParams = new URLSearchParams(window.location.search);

         if (urlParams.has('success')) {

             const dashboardContent = document.querySelector('.dashboard-content');

             if (dashboardContent) {

                 // Check if banner already exists

                 if (document.querySelector('.order-success-banner')) return;

                 // Get last order info for bank details display
                 const localOrders = JSON.parse(localStorage.getItem('metemorali_orders')) || [];
                 let orderIdVal = "";
                 let orderAmountVal = "";
                 if (localOrders.length > 0) {
                     const lastOrder = localOrders[localOrders.length - 1];
                     orderIdVal = lastOrder.id;
                     orderAmountVal = `€${lastOrder.totalAmount.toFixed(2)}`;
                 }

                 const lang = localStorage.getItem('metemorali_lang') || 'tr';
                 const bankTrans = {
                     tr: {
                         title: "Siparişiniz Alındı! (Banka Havalesi/EFT)",
                         desc: "Siparişinizi onaylamak için lütfen aşağıdaki banka hesabına havale/EFT yapınız. Ödeme yaparken açıklama kısmına sipariş kodunuzu yazmayı unutmayınız.",
                         bankName: "Banka Adı",
                         receiver: "Alıcı Adı",
                         iban: "IBAN",
                         orderNo: "Sipariş No",
                         amount: "Toplam Tutar",
                         copy: "Kopyala",
                         copied: "Kopyalandı"
                     },
                     en: {
                         title: "Order Received! (Bank Transfer)",
                         desc: "To confirm your order, please make a bank transfer to the account below. Do not forget to write your order number in the payment description.",
                         bankName: "Bank Name",
                         receiver: "Account Holder",
                         iban: "IBAN",
                         orderNo: "Order No",
                         amount: "Total Amount",
                         copy: "Copy",
                         copied: "Copied"
                     },
                     de: {
                         title: "Bestellung eingegangen! (Banküberweisung)",
                         desc: "Um Ihre Bestellung zu bestätigen, überweisen Sie bitte den Betrag auf das unten angegebene Bankkonto. Bitte vergessen Sie nicht, Ihre Bestellnummer im Verwendungszweck anzugeben.",
                         bankName: "Bankname",
                         receiver: "Empfänger",
                         iban: "IBAN",
                         orderNo: "Bestellnummer",
                         amount: "Gesamtbetrag",
                         copy: "Kopieren",
                         copied: "Kopiert"
                     },
                     ru: {
                         title: "Заказ принят! (Банковский перевод)",
                         desc: "Для подтверждения заказа, пожалуйста, переведите сумму на банковский счет ниже. Не забудьте указать номер заказа в описании платежа.",
                         bankName: "Название банка",
                         receiver: "Получатель",
                         iban: "IBAN",
                         orderNo: "Номер заказа",
                         amount: "Итоговая сумма",
                         copy: "Копировать",
                         copied: "Скопировано"
                     }
                 };

                 const tB = bankTrans[lang] || bankTrans['en'];

                 const banner = document.createElement('div');

                 banner.className = 'order-success-banner';
                 banner.style.flexDirection = 'column';
                 banner.style.alignItems = 'flex-start';
                 banner.style.gap = '10px';

                 banner.innerHTML = `
                     <div style="display: flex; align-items: center; gap: 1.5rem; width: 100%;">
                         <div class="success-banner-icon"><i class="fa-regular fa-circle-check"></i></div>
                         <div class="success-banner-text">
                             <h3>${tB.title}</h3>
                             <p>${tB.desc}</p>
                         </div>
                         <button class="close-banner-btn" onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; font-size: 1.2rem; cursor: pointer; color: #1b5e20;"><i class="fa-solid fa-xmark"></i></button>
                     </div>
                     
                     <div class="bank-details-box" style="width: 100%; background: rgba(255, 255, 255, 0.65); border: 1px solid #cce8cc; padding: 18px; border-radius: 8px; margin-top: 15px; font-family: 'Outfit', sans-serif;">
                         <p style="margin: 6px 0; color: #1b5e20; font-size: 0.95rem;"><strong>${tB.bankName}:</strong> QNB Finansbank</p>
                         <p style="margin: 6px 0; color: #1b5e20; font-size: 0.95rem;"><strong>${tB.receiver}:</strong> Mete Moralı Tekstil San. Tic. Ltd. Şti.</p>
                         <p style="margin: 6px 0; color: #1b5e20; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                             <strong>${tB.iban}:</strong> <span style="font-family: monospace; font-weight: 600; font-size: 1rem;">TR34 0004 6000 8088 0000 1234 56</span>
                             <button onclick="navigator.clipboard.writeText('TR340004600080880000123456'); if (window.showToast) { window.showToast('${tB.copied}', 'success'); }" style="background: #1b5e20; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-family: 'Outfit', sans-serif;"><i class="fa-regular fa-copy"></i> ${tB.copy}</button>
                         </p>
                         ${orderIdVal ? `
                         <p style="margin: 6px 0; color: #1b5e20; font-size: 0.95rem;"><strong>${tB.orderNo}:</strong> <span style="font-weight: 700; background: #e8f5e9; padding: 2px 6px; border-radius: 4px; border: 1px dashed #2e7d32;">#${orderIdVal}</span></p>
                         <p style="margin: 6px 0; color: #1b5e20; font-size: 0.95rem;"><strong>${tB.amount}:</strong> <span style="font-weight: 700;">${orderAmountVal}</span></p>
                         ` : ''}
                     </div>
                 `;

                 dashboardContent.prepend(banner);

                 // Clean up query string

                 const newUrl = window.location.pathname;

                 window.history.replaceState({}, document.title, newUrl);

             }

         }

     }

    

    // --- PROFILE INFO UPDATE AND PASSWORD UPDATES SYSTEM ---

    const profileForm = document.querySelector('#tab-profil form');

    if (profileForm) {

        profileForm.addEventListener('submit', async (e) => {

            e.preventDefault();

            const nameInput = document.querySelector('#tab-profil input[type="text"]');
            const telInput = document.querySelector('#tab-profil input[type="tel"]');
            const newPasswordInput = document.querySelector('#tab-profil input[type="password"]');

            const name = nameInput ? nameInput.value.trim() : '';
            let phone = telInput ? telInput.value.trim() : '';
            if (window.profileItiInstance) {
                phone = window.profileItiInstance.getNumber();
            }

            const newPassword = newPasswordInput ? newPasswordInput.value.trim() : '';



            showLoadingOverlay(true);



            try {

                // Update full name in metadata

                const { data, error } = await supabaseClient.auth.updateUser({

                    data: {

                        full_name: name,

                        phone: phone

                    }

                });



                if (error) {
                    showLoadingOverlay(false);
                    const friendlyMsg = getAuthErrorMessage(error);
                    if (window.showToast) {
                        window.showToast(friendlyMsg, 'error');
                    } else {
                        alert(friendlyMsg);
                    }
                    return;
                }



                // If user wants to update password

                if (newPassword) {

                    const { error: pwdErr } = await supabaseClient.auth.updateUser({

                        password: newPassword

                    });

                    if (pwdErr) {

                        showLoadingOverlay(false);

                        if (window.showToast) {
                            window.showToast(pwdErr.message, 'error');
                        } else {
                            alert(pwdErr.message);
                        }

                        return;

                    }

                }



                showLoadingOverlay(false);

                const userJson = localStorage.getItem('metemorali_user');

                let user = userJson ? JSON.parse(userJson) : {};

                user.name = name;

                user.phone = phone;

                localStorage.setItem('metemorali_user', JSON.stringify(user));



                await updateProfileUI();
                if (newPasswordInput) newPasswordInput.value = '';
                
                if (window.showToast) {
                    window.showToast(t('profile_updated_success', 'Profil bilgileriniz başarıyla güncellendi!'), 'success');
                } else {
                    alert(t('profile_updated_success', 'Profil bilgileriniz başarıyla güncellendi!'));
                }

            } catch (err) {

                showLoadingOverlay(false);

                const connErr = t('connection_error', 'İşlem sırasında sunucu bağlantı hatası oluştu.');
                if (window.showToast) {
                    window.showToast(connErr, 'error');
                } else {
                    alert(connErr);
                }

            }

        });

    }



    window.logoutUser = async () => {
        showLoadingOverlay(true);
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
                await supabaseClient.auth.signOut();
            }
        } catch (err) {
            console.error("SignOut error:", err);
        }
        localStorage.removeItem('metemorali_user');
        localStorage.removeItem('metemorali_token');
        showLoadingOverlay(false);
        window.location.href = 'index.html';
    };

    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await window.logoutUser();
        });
    });



    // --- PASSWORD RESET BACKEND SYSTEM ---

    const resetPasswordSubmitBtn = document.getElementById('reset-password-submit-btn');

    const resetNewPasswordInput = document.getElementById('reset-new-password-input');

    const resetNewPasswordError = document.getElementById('reset-new-password-error');

    let activeResetEmail = "";



    // Toggle eye button for reset new password input

    const resetPasswordToggleBtn = document.querySelector('#forgot-password-success-section .password-toggle-btn');

    if (resetPasswordToggleBtn && resetNewPasswordInput) {

        resetPasswordToggleBtn.addEventListener('click', () => {

            const isPassword = resetNewPasswordInput.type === 'password';

            resetNewPasswordInput.type = isPassword ? 'text' : 'password';

            const icon = resetPasswordToggleBtn.querySelector('i');

            if (icon) {

                icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';

            }

        });

    }



    // Send password reset email

    if (sendResetLinkBtn && forgotPasswordSection && forgotPasswordSuccessSection) {

        const newSendResetLinkBtn = sendResetLinkBtn.cloneNode(true);

        sendResetLinkBtn.parentNode.replaceChild(newSendResetLinkBtn, sendResetLinkBtn);



        newSendResetLinkBtn.addEventListener('click', async () => {

            if (forgotEmailInput && forgotEmailError) {

                const emailValue = forgotEmailInput.value.trim();

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



                if (emailValue === "") {

                    forgotEmailError.textContent = "Lütfen e-posta adresinizi girin.";

                    forgotEmailError.style.display = "block";

                    return;

                } else if (!emailRegex.test(emailValue)) {

                    forgotEmailError.textContent = "Lütfen geçerli bir e-posta formatı girin (ör: isim@mail.com).";

                    forgotEmailError.style.display = "block";

                    return;

                }



                forgotEmailError.style.display = "none";

                activeResetEmail = emailValue.toLowerCase();



                showLoadingOverlay(true);



                try {

                    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(activeResetEmail, {

                        redirectTo: window.location.origin + '/hesabim'

                    });



                    showLoadingOverlay(false);



                    if (error) {
                        if (forgotEmailError) {
                            forgotEmailError.textContent = getAuthErrorMessage(error);
                            forgotEmailError.style.display = "block";
                        }
                    } else {

                        forgotPasswordSection.classList.add('hidden');

                        forgotPasswordSuccessSection.classList.remove('hidden');



                        if (resetNewPasswordInput) resetNewPasswordInput.value = "";

                        if (resetNewPasswordError) resetNewPasswordError.style.display = "none";

                        

                        // Hide code field box since it's not needed (user clicks recovery link)
                        const resetCodeBox = document.getElementById('reset-code-input')?.closest('.input-group');
                        if (resetCodeBox) resetCodeBox.style.display = "none";

                    }

                } catch (err) {

                    showLoadingOverlay(false);

                    if (forgotEmailError) {

                        forgotEmailError.textContent = "Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.";

                        forgotEmailError.style.display = "block";

                    }

                }

            }

        });

    }



    // Submit new password

    if (resetPasswordSubmitBtn && resetNewPasswordInput) {

        resetPasswordSubmitBtn.addEventListener('click', async () => {

            if (resetNewPasswordError) resetNewPasswordError.style.display = "none";



            const newPassword = resetNewPasswordInput.value.trim();



            if (!newPassword || newPassword.length < 6) {

                if (resetNewPasswordError) {

                    resetNewPasswordError.textContent = "Şifre en az 6 karakter olmalıdır.";

                    resetNewPasswordError.style.display = "block";

                }

                return;

            }



            showLoadingOverlay(true);



            try {

                const { data, error } = await supabaseClient.auth.updateUser({

                    password: newPassword

                });



                showLoadingOverlay(false);



                if (error) {
                    if (resetNewPasswordError) {
                        resetNewPasswordError.textContent = getAuthErrorMessage(error);
                        resetNewPasswordError.style.display = "block";
                    }
                } else {

                    showSuccessOverlay("Şifre Değiştirildi!", "Yeni şifreniz başarıyla güncellendi.", () => {

                        forgotPasswordSuccessSection.classList.add('hidden');

                        emailSection.classList.remove('hidden');

                        window.location.hash = ""; // Clear hash

                    });

                }

            } catch (err) {

                showLoadingOverlay(false);

                if (resetNewPasswordError) {

                    resetNewPasswordError.textContent = "Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.";

                    resetNewPasswordError.style.display = "block";

                }

            }

        });

    }



    if (window.location.pathname.includes('hesabim')) {

        const user = localStorage.getItem('metemorali_user');

        if (!user) {

            setTimeout(() => {

                openLoginSidebar();

            }, 300);

        }

    }

});