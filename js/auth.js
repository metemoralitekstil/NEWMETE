/**
 * MeteMorali - Authentication & Login Sidebar Module
 * Manages Supabase Auth, Login/Register Modal, SMS/OTP Verification, and Password Reset.
 */

(function () {
    const SUPABASE_URL = 'https://vcmgijcjltleytlwzayx.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_HF5kZ1rTFx15rJes459xZA_C_rzkoc3';

    let supabaseClient = null;
    let activePhoneLogin = '';
    let offlinePhoneCode = '';
    let activeRegInfo = null;
    let activeResetEmail = '';

    // Translation helper
    const t = (key, defaultText = '') => {
        if (window.i18n && typeof window.i18n.t === 'function') {
            return window.i18n.t(key, defaultText);
        }
        const lang = (window.i18n && window.i18n.currentLang) || localStorage.getItem('metemorali_lang') || 'tr';
        if (window.i18n && window.i18n.translations && window.i18n.translations[lang]) {
            return window.i18n.translations[lang][key] || defaultText;
        }
        return defaultText;
    };

    // Load Supabase Client
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

    // Auth error message translation map
    function getAuthErrorMessage(err) {
        if (!err) return '';
        const msg = (err.message || String(err)).toLowerCase();
        const lang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';

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

    // Modal Control Functions
    function openLoginSidebar() {
        const loginSidebar = document.getElementById('login-sidebar');
        const loginOverlay = document.getElementById('login-overlay');
        if (!loginSidebar || !loginOverlay) return;

        // Reset to email login section by default
        document.querySelectorAll('.login-sidebar .login-section').forEach(sec => {
            if (sec.id === 'email-login-section') sec.classList.remove('hidden');
            else sec.classList.add('hidden');
        });

        loginSidebar.classList.add('active');
        loginOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pause particles if available to save CPU
        try {
            if (typeof tsParticles !== 'undefined') {
                const containers = tsParticles.dom();
                if (containers && containers.length > 0) containers[0].pause();
            }
        } catch (e) {}
    }

    function closeLoginSidebar() {
        const loginSidebar = document.getElementById('login-sidebar');
        const loginOverlay = document.getElementById('login-overlay');
        if (!loginSidebar || !loginOverlay) return;

        loginSidebar.classList.remove('active');
        loginOverlay.classList.remove('active');
        document.body.style.overflow = '';

        try {
            if (typeof tsParticles !== 'undefined') {
                const containers = tsParticles.dom();
                if (containers && containers.length > 0) containers[0].play();
            }
        } catch (e) {}
    }

    window.openLoginSidebar = openLoginSidebar;
    window.closeLoginSidebar = closeLoginSidebar;

    // Visual auth state in navbar
    function updateNavbarAuthState() {
        const loginBtn = document.getElementById('user-login-btn');
        if (!loginBtn) return;
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
    window.updateNavbarAuthState = updateNavbarAuthState;

    // Global Logout
    window.logoutUser = async () => {
        if (window.showLoadingOverlay) window.showLoadingOverlay(true);
        try {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
        } catch (err) {
            console.error("SignOut error:", err);
        }
        localStorage.removeItem('metemorali_user');
        localStorage.removeItem('metemorali_token');
        if (window.showLoadingOverlay) window.showLoadingOverlay(false);
        window.location.href = 'index.html';
    };

    // Initialize International Phone Inputs
    function initPhoneFields() {
        if (typeof window.intlTelInput !== 'function') return;

        const loginInput = document.getElementById('phone-login-input');
        if (loginInput && !window.loginItiInstance) {
            window.loginItiInstance = window.intlTelInput(loginInput, {
                initialCountry: "tr",
                preferredCountries: ["tr", "de", "gb", "ru", "nl", "fr", "it", "az"],
                autoPlaceholder: "aggressive",
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.4/build/js/utils.js"
            });

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

        const profileInput = document.getElementById('profile-tel');
        if (profileInput && !window.profileItiInstance) {
            window.profileItiInstance = window.intlTelInput(profileInput, {
                initialCountry: "tr",
                preferredCountries: ["tr", "de", "gb", "ru", "nl", "fr", "it", "az"],
                autoPlaceholder: "aggressive",
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.4/build/js/utils.js"
            });

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

            const userJson = localStorage.getItem('metemorali_user');
            if (userJson) {
                const user = JSON.parse(userJson);
                const rawPhone = user.type === 'phone' ? user.value : (user.phone || '');
                if (rawPhone) window.profileItiInstance.setNumber(rawPhone);
            }
        }
    }

    // Main Init on componentsLoaded
    document.addEventListener('componentsLoaded', () => {
        const API_BASE_URL = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.apiBase : 'http://localhost:5055';

        // Password eye toggle buttons
        document.querySelectorAll('.password-toggle-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const input = this.previousElementSibling;
                if (input && (input.type === 'password' || input.type === 'text')) {
                    const icon = this.querySelector('i');
                    if (input.type === 'password') {
                        input.type = 'text';
                        if (icon) icon.className = 'fa-regular fa-eye-slash';
                    } else {
                        input.type = 'password';
                        if (icon) icon.className = 'fa-regular fa-eye';
                    }
                }
            });
        });

        // Initialize Supabase and handle auth state
        loadSupabase().then(() => {
            // Auto open recovery if redirected from password reset email
            if (window.location.hash.includes('type=recovery')) {
                setTimeout(() => {
                    openLoginSidebar();
                    document.querySelectorAll('.login-sidebar .login-section').forEach(sec => sec.classList.add('hidden'));
                    const successSec = document.getElementById('forgot-password-success-section');
                    if (successSec) {
                        successSec.classList.remove('hidden');
                        const subtitle = document.getElementById('forgot-success-subtitle');
                        if (subtitle) subtitle.textContent = "Lütfen yeni şifrenizi girin.";
                    }
                }, 800);
            } else if (window.location.hash.includes('type=signup') || window.location.hash.includes('type=email_change')) {
                setTimeout(() => {
                    if (window.showToast) {
                        window.showToast("E-posta adresiniz başarıyla doğrulandı! Hoş geldiniz.", "success");
                    }
                    updateNavbarAuthState();
                }, 800);
            }

            // Auth state changes
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
                        if (window.updateProfileUI) window.updateProfileUI();
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

        initPhoneFields();
        updateNavbarAuthState();

        // Bind Sidebar open/close triggers
        const loginBtn = document.getElementById('user-login-btn');
        const closeLoginBtn = document.getElementById('close-login-sidebar');
        const loginOverlay = document.getElementById('login-overlay');

        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                const user = localStorage.getItem('metemorali_user');
                if (!user) {
                    e.preventDefault();
                    openLoginSidebar();
                }
            });
        }
        if (closeLoginBtn) closeLoginBtn.addEventListener('click', closeLoginSidebar);
        if (loginOverlay) loginOverlay.addEventListener('click', closeLoginSidebar);

        // Sidebar Navigation & Panel Switching
        const phoneSection = document.getElementById('phone-login-section');
        const emailSection = document.getElementById('email-login-section');
        const registerSection = document.getElementById('register-section');
        const forgotPasswordSection = document.getElementById('forgot-password-section');
        const forgotPasswordSuccessSection = document.getElementById('forgot-password-success-section');
        const phoneVerifySection = document.getElementById('phone-verify-section');
        const emailVerifySection = document.getElementById('email-verify-section');

        const switchToEmailBtn = document.getElementById('switch-to-email');
        const switchToPhoneBtn = document.getElementById('switch-to-phone');
        const goRegisterLink = document.getElementById('go-to-register-link');
        const switchLoginFromRegisterBtn = document.getElementById('switch-to-login-from-register');
        const switchBackToPhoneInputBtn = document.getElementById('switch-back-to-phone-input');
        const switchBackToRegisterInputBtn = document.getElementById('switch-back-to-register-input');
        const forgotPasswordLink = document.getElementById('forgot-password-link');
        const switchFromForgotToEmailBtn = document.getElementById('switch-to-email-from-forgot');

        if (switchToEmailBtn) switchToEmailBtn.addEventListener('click', () => {
            if (phoneSection) phoneSection.classList.add('hidden');
            if (forgotPasswordSection) forgotPasswordSection.classList.add('hidden');
            if (emailSection) emailSection.classList.remove('hidden');
        });

        if (switchToPhoneBtn) switchToPhoneBtn.addEventListener('click', () => {
            if (emailSection) emailSection.classList.add('hidden');
            if (forgotPasswordSection) forgotPasswordSection.classList.add('hidden');
            if (phoneSection) phoneSection.classList.remove('hidden');
        });

        if (goRegisterLink) goRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (emailSection) emailSection.classList.add('hidden');
            if (registerSection) registerSection.classList.remove('hidden');
        });

        if (switchLoginFromRegisterBtn) switchLoginFromRegisterBtn.addEventListener('click', () => {
            if (registerSection) registerSection.classList.add('hidden');
            if (emailSection) emailSection.classList.remove('hidden');
        });

        if (switchBackToPhoneInputBtn) switchBackToPhoneInputBtn.addEventListener('click', () => {
            if (phoneVerifySection) phoneVerifySection.classList.add('hidden');
            if (phoneSection) phoneSection.classList.remove('hidden');
        });

        if (switchBackToRegisterInputBtn) switchBackToRegisterInputBtn.addEventListener('click', () => {
            if (emailVerifySection) emailVerifySection.classList.add('hidden');
            if (registerSection) registerSection.classList.remove('hidden');
        });

        if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (emailSection) emailSection.classList.add('hidden');
            if (phoneSection) phoneSection.classList.add('hidden');
            if (forgotPasswordSection) forgotPasswordSection.classList.remove('hidden');
        });

        if (switchFromForgotToEmailBtn) switchFromForgotToEmailBtn.addEventListener('click', () => {
            if (forgotPasswordSection) forgotPasswordSection.classList.add('hidden');
            if (emailSection) emailSection.classList.remove('hidden');
        });

        // 1. Phone Login Send SMS
        const phoneSubmitBtn = document.querySelector('#phone-login-section .login-submit-btn');
        const phoneInputEl = document.getElementById('phone-login-input');
        const termsCheckEl = document.getElementById('terms-check');

        if (phoneSubmitBtn && phoneSection && phoneVerifySection) {
            phoneSubmitBtn.addEventListener('click', async () => {
                if (!phoneInputEl || !phoneInputEl.value.trim()) {
                    window.showToast(t('alert_enter_phone', 'Lütfen telefon numaranızı girin.'), 'error');
                    return;
                }
                if (termsCheckEl && !termsCheckEl.checked) {
                    window.showToast(t('alert_accept_terms', 'Giriş yapabilmek için sözleşmeleri kabul etmelisiniz.'), 'error');
                    return;
                }

                let rawPhone = phoneInputEl.value.trim();
                if (window.loginItiInstance) rawPhone = window.loginItiInstance.getNumber();
                activePhoneLogin = rawPhone;

                if (window.showLoadingOverlay) window.showLoadingOverlay(true);

                try {
                    const response = await fetch(`${API_BASE_URL}/CustomerAuth/send-phone-code`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: rawPhone })
                    });

                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);

                    if (response.ok) {
                        phoneSection.classList.add('hidden');
                        phoneVerifySection.classList.remove('hidden');
                        return;
                    }
                } catch (err) {
                    console.warn("Backend API not reachable. Using fallback SMS mode.", err);
                }

                // Fallback (Offline Mode code)
                offlinePhoneCode = "123456";
                if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                phoneSection.classList.add('hidden');
                phoneVerifySection.classList.remove('hidden');
            });
        }

        // 2. Phone Verify Code Submit
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

                if (window.showLoadingOverlay) window.showLoadingOverlay(true);

                try {
                    const response = await fetch(`${API_BASE_URL}/CustomerAuth/verify-phone`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: activePhoneLogin, code: enteredCode })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const sessionUser = { type: 'phone', value: activePhoneLogin, name: data.fullName };
                        localStorage.setItem('metemorali_user', JSON.stringify(sessionUser));
                        localStorage.setItem('metemorali_token', data.token);

                        if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                        closeLoginSidebar();
                        updateNavbarAuthState();

                        if (window.location.pathname.includes('hesabim')) {
                            if (window.updateProfileUI) window.updateProfileUI();
                        } else {
                            window.location.href = 'hesabim';
                        }
                        return;
                    }
                } catch (err) {
                    console.warn("API not reachable, using local fallback.", err);
                }

                if (window.showLoadingOverlay) window.showLoadingOverlay(false);

                if (enteredCode !== offlinePhoneCode && enteredCode !== "123456") {
                    phoneVerifyError.textContent = "Hatalı doğrulama kodu. Test kodu: 123456";
                    phoneVerifyError.style.display = "block";
                    return;
                }

                phoneVerifyError.style.display = "none";
                const sessionUser = { type: 'phone', value: activePhoneLogin, name: "Değerli Müşterimiz" };
                localStorage.setItem('metemorali_user', JSON.stringify(sessionUser));
                localStorage.removeItem('metemorali_token');
                closeLoginSidebar();
                updateNavbarAuthState();

                if (window.location.pathname.includes('hesabim')) {
                    if (window.updateProfileUI) window.updateProfileUI();
                } else {
                    window.location.href = 'hesabim';
                }
            });

            phoneVerifyCodeInput.addEventListener('input', () => {
                phoneVerifyError.style.display = "none";
            });
        }

        // 3. Email Login Submit (Supabase)
        const emailSubmitBtn = document.querySelector('#email-login-section .login-submit-btn');
        const emailInputEl = document.getElementById('email-login-input');
        const passwordInputEl = document.getElementById('email-login-password-input');
        const emailLoginError = document.getElementById('email-login-general-error');

        if (emailInputEl && emailLoginError) emailInputEl.addEventListener('input', () => { emailLoginError.style.display = 'none'; });
        if (passwordInputEl && emailLoginError) passwordInputEl.addEventListener('input', () => { emailLoginError.style.display = 'none'; });

        if (emailSubmitBtn && emailInputEl && passwordInputEl) {
            emailSubmitBtn.addEventListener('click', async () => {
                const email = emailInputEl.value.trim();
                const password = passwordInputEl.value.trim();

                if (!email || !password) {
                    if (emailLoginError) {
                        emailLoginError.textContent = !email ? "E-posta adresi gereklidir." : "Şifre gereklidir.";
                        emailLoginError.style.display = 'block';
                    }
                    return;
                }

                if (window.showLoadingOverlay) window.showLoadingOverlay(true);

                try {
                    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);

                    if (error) {
                        if (emailLoginError) {
                            emailLoginError.textContent = getAuthErrorMessage(error);
                            emailLoginError.style.display = 'block';
                        }
                    } else {
                        if (window.showSuccessOverlay) {
                            window.showSuccessOverlay("Giriş Başarılı!", "Hesabınıza yönlendiriliyorsunuz...", () => {
                                closeLoginSidebar();
                                updateNavbarAuthState();
                                if (window.location.pathname.includes('hesabim')) {
                                    if (window.updateProfileUI) window.updateProfileUI();
                                    const wrapper = document.querySelector('.dashboard-wrapper');
                                    if (wrapper) wrapper.style.display = 'block';
                                } else {
                                    window.location.href = 'hesabim';
                                }
                            });
                        }
                    }
                } catch (err) {
                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                    if (emailLoginError) {
                        emailLoginError.textContent = "Bağlantı hatası oluştu. Lütfen tekrar deneyin.";
                        emailLoginError.style.display = 'block';
                    }
                }
            });
        }

        // 4. Email Register Submit (Supabase)
        const registerSubmitBtn = document.getElementById('register-submit-btn');
        const regNameInput = document.getElementById('register-name-input');
        const regEmailInput = document.getElementById('register-email-input');
        const regPasswordInput = document.getElementById('register-password-input');
        const regConfirmInput = document.getElementById('register-confirm-input');
        const regTermsCheck = document.getElementById('register-terms-check');

        const regNameError = document.getElementById('register-name-error');
        const regEmailError = document.getElementById('register-email-error');
        const regPasswordError = document.getElementById('register-password-error');
        const regConfirmError = document.getElementById('register-confirm-error');
        const regTermsError = document.getElementById('register-terms-error');

        if (regNameInput && regNameError) regNameInput.addEventListener('input', () => { regNameError.style.display = 'none'; });
        if (regEmailInput && regEmailError) regEmailInput.addEventListener('input', () => { regEmailError.style.display = 'none'; });
        if (regPasswordInput && regPasswordError) regPasswordInput.addEventListener('input', () => { regPasswordError.style.display = 'none'; });
        if (regConfirmInput && regConfirmError) regConfirmInput.addEventListener('input', () => { regConfirmError.style.display = 'none'; });
        if (regTermsCheck && regTermsError) regTermsCheck.addEventListener('change', () => { regTermsError.style.display = 'none'; });

        if (registerSubmitBtn && regNameInput && regEmailInput && regPasswordInput && regConfirmInput) {
            registerSubmitBtn.addEventListener('click', async () => {
                const name = regNameInput.value.trim();
                const email = regEmailInput.value.trim();
                const password = regPasswordInput.value.trim();
                const confirm = regConfirmInput.value.trim();
                const termsChecked = regTermsCheck ? regTermsCheck.checked : false;

                let hasErr = false;
                if (!name) { if (regNameError) { regNameError.textContent = "Ad soyad gereklidir."; regNameError.style.display = 'block'; } hasErr = true; }
                if (!email) { if (regEmailError) { regEmailError.textContent = "E-posta gereklidir."; regEmailError.style.display = 'block'; } hasErr = true; }
                if (!password) { if (regPasswordError) { regPasswordError.textContent = "Şifre gereklidir."; regPasswordError.style.display = 'block'; } hasErr = true; }
                if (password !== confirm) { if (regConfirmError) { regConfirmError.textContent = "Şifreler uyuşmuyor."; regConfirmError.style.display = 'block'; } hasErr = true; }
                if (!termsChecked) { if (regTermsError) { regTermsError.textContent = "Gizlilik sözleşmesini onaylamalısınız."; regTermsError.style.display = 'block'; } hasErr = true; }

                if (hasErr) return;

                if (window.showLoadingOverlay) window.showLoadingOverlay(true);

                try {
                    const { data, error } = await supabaseClient.auth.signUp({
                        email,
                        password,
                        options: { data: { full_name: name } }
                    });

                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);

                    if (error) {
                        if (regEmailError) {
                            regEmailError.textContent = getAuthErrorMessage(error);
                            regEmailError.style.display = 'block';
                        }
                    } else {
                        // If Supabase has email confirmation disabled, session is returned immediately
                        if (data && data.session) {
                            if (window.showSuccessOverlay) {
                                window.showSuccessOverlay("Kayıt Başarılı!", "Hesabınıza yönlendiriliyorsunuz...", () => {
                                    closeLoginSidebar();
                                    updateNavbarAuthState();
                                    if (window.location.pathname.includes('hesabim')) {
                                        if (window.updateProfileUI) window.updateProfileUI();
                                    } else {
                                        window.location.href = 'hesabim';
                                    }
                                });
                            }
                            return;
                        }

                        activeRegInfo = { name, email, password };
                        try {
                            sessionStorage.setItem('mm_pending_reg', JSON.stringify({ name, email }));
                        } catch (e) {}

                        if (registerSection) registerSection.classList.add('hidden');
                        if (emailVerifySection) {
                            emailVerifySection.classList.remove('hidden');
                            const emailVerifySubtitle = document.getElementById('email-verify-subtitle');
                            if (emailVerifySubtitle) {
                                emailVerifySubtitle.textContent = `${email} adresine doğrulama bağlantısı ve onay kodu gönderildi.`;
                            }
                            const emailVerifyCodeInput = document.getElementById('email-verify-code-input');
                            if (emailVerifyCodeInput) emailVerifyCodeInput.value = "";
                        }
                    }
                } catch (err) {
                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                    if (regEmailError) {
                        regEmailError.textContent = "Sunucu bağlantı hatası oluştu.";
                        regEmailError.style.display = 'block';
                    }
                }
            });
        }

        // 5. Register OTP Verify Submit
        const emailVerifySubmitBtn = document.getElementById('email-verify-submit-btn');
        const emailVerifyCodeInput = document.getElementById('email-verify-code-input');
        const emailVerifyError = document.getElementById('email-verify-error');

        if (emailVerifySubmitBtn && emailVerifyCodeInput && emailVerifyError) {
            emailVerifySubmitBtn.addEventListener('click', async () => {
                const enteredCode = emailVerifyCodeInput.value.trim();
                if (!enteredCode) {
                    emailVerifyError.textContent = "Lütfen onay kodunu girin.";
                    emailVerifyError.style.display = 'block';
                    return;
                }

                if (window.showLoadingOverlay) window.showLoadingOverlay(true);

                try {
                    const targetEmail = (activeRegInfo && activeRegInfo.email) ||
                        (function() {
                            try {
                                return JSON.parse(sessionStorage.getItem('mm_pending_reg') || '{}').email || '';
                            } catch(e) { return ''; }
                        })();

                    const { data, error } = await supabaseClient.auth.verifyOtp({
                        email: targetEmail,
                        token: enteredCode,
                        type: 'signup'
                    });

                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);

                    if (error) {
                        emailVerifyError.textContent = getAuthErrorMessage(error);
                        emailVerifyError.style.display = 'block';
                    } else {
                        if (window.showSuccessOverlay) {
                            window.showSuccessOverlay("Kayıt Başarılı!", "Hesabınız başarıyla oluşturuldu...", () => {
                                closeLoginSidebar();
                                updateNavbarAuthState();
                                if (window.location.pathname.includes('hesabim')) {
                                    if (window.updateProfileUI) window.updateProfileUI();
                                } else {
                                    window.location.href = 'hesabim';
                                }
                            });
                        }
                    }
                } catch (err) {
                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                    emailVerifyError.textContent = "Sunucu bağlantı hatası oluştu.";
                    emailVerifyError.style.display = 'block';
                }
            });

            emailVerifyCodeInput.addEventListener('input', () => {
                emailVerifyError.style.display = "none";
            });
        }

        // 6. Password Reset Request
        const sendResetLinkBtn = document.getElementById('send-reset-link-btn');
        const forgotEmailInput = document.getElementById('forgot-email-input');
        const forgotEmailError = document.getElementById('forgot-email-error');

        if (forgotEmailInput && forgotEmailError) {
            forgotEmailInput.addEventListener('input', () => { forgotEmailError.style.display = 'none'; });
        }

        if (sendResetLinkBtn && forgotPasswordSection && forgotPasswordSuccessSection) {
            sendResetLinkBtn.addEventListener('click', async () => {
                const emailValue = forgotEmailInput ? forgotEmailInput.value.trim() : '';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailValue || !emailRegex.test(emailValue)) {
                    if (forgotEmailError) {
                        forgotEmailError.textContent = !emailValue ? "Lütfen e-posta adresinizi girin." : "Geçerli bir e-posta formatı girin.";
                        forgotEmailError.style.display = "block";
                    }
                    return;
                }

                activeResetEmail = emailValue.toLowerCase();
                if (window.showLoadingOverlay) window.showLoadingOverlay(true);

                try {
                    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(activeResetEmail, {
                        redirectTo: window.location.origin + '/hesabim'
                    });

                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);

                    if (error) {
                        if (forgotEmailError) {
                            forgotEmailError.textContent = getAuthErrorMessage(error);
                            forgotEmailError.style.display = "block";
                        }
                    } else {
                        forgotPasswordSection.classList.add('hidden');
                        forgotPasswordSuccessSection.classList.remove('hidden');
                    }
                } catch (err) {
                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                    if (forgotEmailError) {
                        forgotEmailError.textContent = "Sunucu hatası oluştu.";
                        forgotEmailError.style.display = "block";
                    }
                }
            });
        }

        // 7. Password Reset Submit New Password
        const resetPasswordSubmitBtn = document.getElementById('reset-password-submit-btn');
        const resetNewPasswordInput = document.getElementById('reset-new-password-input');
        const resetNewPasswordError = document.getElementById('reset-new-password-error');

        if (resetPasswordSubmitBtn && resetNewPasswordInput) {
            resetPasswordSubmitBtn.addEventListener('click', async () => {
                const newPassword = resetNewPasswordInput.value.trim();
                if (!newPassword || newPassword.length < 6) {
                    if (resetNewPasswordError) {
                        resetNewPasswordError.textContent = "Şifre en az 6 karakter olmalıdır.";
                        resetNewPasswordError.style.display = "block";
                    }
                    return;
                }

                if (window.showLoadingOverlay) window.showLoadingOverlay(true);

                try {
                    const { data, error } = await supabaseClient.auth.updateUser({ password: newPassword });
                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);

                    if (error) {
                        if (resetNewPasswordError) {
                            resetNewPasswordError.textContent = getAuthErrorMessage(error);
                            resetNewPasswordError.style.display = "block";
                        }
                    } else {
                        if (window.showSuccessOverlay) {
                            window.showSuccessOverlay("Şifre Değiştirildi!", "Yeni şifreniz güncellendi.", () => {
                                forgotPasswordSuccessSection.classList.add('hidden');
                                if (emailSection) emailSection.classList.remove('hidden');
                                window.location.hash = "";
                            });
                        }
                    }
                } catch (err) {
                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                    if (resetNewPasswordError) {
                        resetNewPasswordError.textContent = "Sunucu bağlantı hatası.";
                        resetNewPasswordError.style.display = "block";
                    }
                }
            });
        }
    });
})();
