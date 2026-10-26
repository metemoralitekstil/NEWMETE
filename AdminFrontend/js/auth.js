// API Base URL - Canlı yayına alırken 'https://metemorali-backend-api.onrender.com' gibi kendi Render API URL'nizi yazın.
var API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5055'
    : 'https://metemorali-backend-api.onrender.com') + '/api';

function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/AdminFrontend/') || window.location.pathname.endsWith('/AdminFrontend') || window.location.pathname === '/' || window.location.pathname === '';
    
    if (!token && !isLoginPage) {
        window.location.href = 'index.html';
    } else if (token && isLoginPage) {
        window.location.href = 'dashboard.html';
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
}

function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

checkAuth();

function confirmLogout(e) {
    if (e) e.preventDefault();
    
    let modalOverlay = document.getElementById('logoutModal');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'logoutModal';
        modalOverlay.className = 'custom-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="custom-modal">
                <h3>Çıkış Yap</h3>
                <p>Çıkış yapmak istediğinize emin misiniz?</p>
                <div class="custom-modal-actions">
                    <button class="btn-cancel" onclick="closeLogoutModal()">İptal</button>
                    <button class="btn-confirm" onclick="logout()">Evet, Çıkış Yap</button>
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