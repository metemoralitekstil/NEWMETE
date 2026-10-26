// MeteMorali Admin Auth & Security Guard (v4.5)
const LOCKOUT_THRESHOLD = 4; // 4 failed attempts triggers lockout
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function getLockoutRemainingSeconds() {
    try {
        const lockoutUntil = Number(localStorage.getItem('admin_lockout_until') || 0);
        const now = Date.now();
        if (lockoutUntil > now) {
            return Math.ceil((lockoutUntil - now) / 1000);
        }
    } catch (e) {}
    return 0;
}

function recordFailedLoginAttempt() {
    try {
        const attempts = Number(localStorage.getItem('admin_failed_attempts') || 0) + 1;
        localStorage.setItem('admin_failed_attempts', String(attempts));
        
        if (attempts >= LOCKOUT_THRESHOLD) {
            const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
            localStorage.setItem('admin_lockout_until', String(lockoutUntil));
            return Math.ceil(LOCKOUT_DURATION_MS / 1000);
        }
        return 0;
    } catch (e) {
        return 0;
    }
}

function resetFailedLoginAttempts() {
    try {
        localStorage.removeItem('admin_failed_attempts');
        localStorage.removeItem('admin_lockout_until');
    } catch (e) {}
}

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
            <div class="custom-modal" style="width: 420px; text-align: center; padding: 32px 24px;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.12); color: #ef4444; display: inline-flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 16px;">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </div>
                <h3 style="font-size: 1.25rem; margin-bottom: 8px;">Oturumu Kapat</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px;">Yönetici panelinden çıkış yapmak istediğinize emin misiniz?</p>
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

// Auto check auth on load
checkAuth();