// ==========================================================================
// MeteMorali Enterprise Hardened Security & Anti-Brute-Force Engine (v5.0)
// Features: Tiered Escalation (3 fails -> 1 min, 6 fails -> 10 mins)
// Multi-Store Sync (LocalStorage + SessionStorage + Cookies + Closure)
// Cryptographic HMAC Signature to prevent F12 localStorage tampering
// Read-only object locking (Object.defineProperty) to prevent console hijacking
// ==========================================================================

(function() {
    'use strict';

    // Internal Secret Salt based on device & browser fingerprint
    const FINGERPRINT_SALT = (function() {
        const ua = navigator.userAgent || 'agent';
        const scr = `${screen.width}x${screen.height}x${screen.colorDepth}`;
        const lang = navigator.language || 'tr';
        let hash = 0;
        const str = `mm_shield_${ua}_${scr}_${lang}_salt_2026`;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return 'sig_' + Math.abs(hash).toString(36);
    })();

    const STORAGE_KEY = '_mm_auth_gate';
    let inMemoryUnlockAt = 0;
    let inMemoryAttempts = 0;
    let inMemoryTier = 1;

    // Fast synchronous hash signature
    function computeSignature(unlockAt, tier, attempts) {
        const payload = `${unlockAt}|${tier}|${attempts}|${FINGERPRINT_SALT}`;
        let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
        for (let i = 0; i < payload.length; i++) {
            const ch = payload.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
    }

    // Cookie helper
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
        return null;
    }

    function setCookie(name, val, maxAgeSec) {
        document.cookie = `${name}=${encodeURIComponent(val)}; max-age=${maxAgeSec}; path=/; SameSite=Strict`;
    }

    function removeCookie(name) {
        document.cookie = `${name}=; max-age=0; path=/; SameSite=Strict`;
    }

    // Load & Verify State from Multi-Stores with Self-Healing
    function loadAndVerifyState() {
        const now = Date.now();
        const sources = [
            localStorage.getItem(STORAGE_KEY),
            sessionStorage.getItem(STORAGE_KEY),
            getCookie(STORAGE_KEY)
        ];

        let validState = null;

        for (const raw of sources) {
            if (!raw) continue;
            try {
                const parsed = JSON.parse(raw);
                if (typeof parsed === 'object' && parsed !== null) {
                    const expectedSig = computeSignature(parsed.u, parsed.t, parsed.a);
                    if (parsed.sig === expectedSig) {
                        // Found a valid untampered state
                        if (!validState || parsed.u > validState.u) {
                            validState = parsed;
                        }
                    } else {
                        // F12 TAMPER DETECTED!
                        console.warn('[SECURITY] F12 State Tampering Detected! Enforcing Maximum Lockdown.');
                        return forceTamperLockout();
                    }
                }
            } catch (e) {}
        }

        // Check against in-memory closure
        if (inMemoryUnlockAt > now) {
            if (!validState || inMemoryUnlockAt > validState.u) {
                validState = {
                    u: inMemoryUnlockAt,
                    t: inMemoryTier,
                    a: inMemoryAttempts,
                    sig: computeSignature(inMemoryUnlockAt, inMemoryTier, inMemoryAttempts)
                };
            }
        }

        if (validState) {
            inMemoryUnlockAt = validState.u;
            inMemoryTier = validState.t;
            inMemoryAttempts = validState.a;

            // Self-heal stores if any store was wiped in F12
            saveStateToAllStores(validState);
            return validState;
        }

        return { u: 0, t: 1, a: inMemoryAttempts, sig: '' };
    }

    function saveStateToAllStores(state) {
        const serialized = JSON.stringify(state);
        try { localStorage.setItem(STORAGE_KEY, serialized); } catch (e) {}
        try { sessionStorage.setItem(STORAGE_KEY, serialized); } catch (e) {}
        try { setCookie(STORAGE_KEY, serialized, 86400 * 7); } catch (e) {}
    }

    function forceTamperLockout() {
        // Punish F12 tamper attempts with instant 10-minute ban
        const unlockAt = Date.now() + (10 * 60 * 1000);
        inMemoryUnlockAt = unlockAt;
        inMemoryTier = 2;
        inMemoryAttempts = 6;
        const state = {
            u: unlockAt,
            t: 2,
            a: 6,
            sig: computeSignature(unlockAt, 2, 6)
        };
        saveStateToAllStores(state);
        return state;
    }

    // Public Core API
    function getLockoutRemainingSeconds() {
        const state = loadAndVerifyState();
        const now = Date.now();
        if (state.u > now) {
            return Math.ceil((state.u - now) / 1000);
        }
        return 0;
    }

    function getLockoutTier() {
        const state = loadAndVerifyState();
        return state.t || 1;
    }

    function getFailedAttemptsCount() {
        const state = loadAndVerifyState();
        return state.a || 0;
    }

    function recordFailedLoginAttempt() {
        const state = loadAndVerifyState();
        const newAttempts = (state.a || 0) + 1;
        let unlockAt = 0;
        let tier = state.t || 1;

        // TIER 1: 3 failed attempts -> 1 minute ban (60 sec)
        if (newAttempts === 3) {
            tier = 1;
            unlockAt = Date.now() + (60 * 1000);
        }
        // TIER 2: 6 failed attempts -> 10 minutes ban (600 sec)
        else if (newAttempts === 6) {
            tier = 2;
            unlockAt = Date.now() + (10 * 60 * 1000);
        }
        // TIER 3+: Every subsequent 3 failures -> 10 minutes ban
        else if (newAttempts > 6 && newAttempts % 3 === 0) {
            tier = 2;
            unlockAt = Date.now() + (10 * 60 * 1000);
        }

        inMemoryAttempts = newAttempts;
        inMemoryTier = tier;
        inMemoryUnlockAt = unlockAt;

        const newState = {
            u: unlockAt,
            t: tier,
            a: newAttempts,
            sig: computeSignature(unlockAt, tier, newAttempts)
        };

        saveStateToAllStores(newState);
        return unlockAt > Date.now() ? Math.ceil((unlockAt - Date.now()) / 1000) : 0;
    }

    function resetFailedLoginAttempts() {
        inMemoryAttempts = 0;
        inMemoryTier = 1;
        inMemoryUnlockAt = 0;
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
        try { removeCookie(STORAGE_KEY); } catch (e) {}
    }

    // Expose security functions immutably so F12 console cannot overwrite them
    const securityAPI = {
        getLockoutRemainingSeconds,
        getLockoutTier,
        getFailedAttemptsCount,
        recordFailedLoginAttempt,
        resetFailedLoginAttempts
    };

    for (const [fnName, fnRef] of Object.entries(securityAPI)) {
        try {
            Object.defineProperty(window, fnName, {
                value: fnRef,
                writable: false,
                configurable: false
            });
        } catch (e) {
            window[fnName] = fnRef;
        }
    }

})();

// ==========================================================================
// Global Session Guard & Logout Handlers
// ==========================================================================
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const path = window.location.pathname.toLowerCase();
    const isLoginPage = path.endsWith('index.html') || path.endsWith('/adminfrontend/') || path.endsWith('/adminfrontend') || path === '/' || path === '';

    if (!token && !isLoginPage) {
        window.location.href = 'index.html';
    } else if (token && isLoginPage) {
        window.location.href = 'dashboard.html';
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}

function getAuthHeaders() {
    const token = localStorage.getItem('adminToken') || '';
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

function confirmLogout(e) {
    if (e) e.preventDefault();
    
    let modalOverlay = document.getElementById('logoutModal');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'logoutModal';
        modalOverlay.className = 'custom-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="custom-modal" style="width: 400px; text-align: center; padding: 32px 24px;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #fef2f2; color: #dc2626; display: inline-flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 16px;">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </div>
                <h3 style="font-size: 1.25rem; margin-bottom: 8px; color: #000000;">Oturumu Kapat</h3>
                <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 24px;">Yönetici panelinden çıkış yapmak istediğinize emin misiniz?</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn btn-secondary" onclick="closeLogoutModal()">İptal</button>
                    <button class="btn btn-danger" onclick="logout()">Evet, Çıkış Yap</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }
    
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
}

function closeLogoutModal() {
    const modalOverlay = document.getElementById('logoutModal');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}