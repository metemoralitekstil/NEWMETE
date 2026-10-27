// MeteMorali Unified Admin Engine & Supabase API (v4.5)

// ==========================================================================
// 1. TOAST NOTIFICATION ENGINE
// ==========================================================================
window.showAdminToast = function(message, type = 'success') {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'adminToastContainer';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="${iconClass}" style="font-size: 1.15rem; color: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};"></i>
        <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, 4000);
};

// ==========================================================================
// 2. LIVE HEALTH CHECK (SYSTEM STATUS BADGE)
// ==========================================================================
window.checkSystemHealth = async function() {
    const badge = document.getElementById('connectionBadge');
    if (!badge) return;

    const start = performance.now();
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data, error } = await supabaseClient.from('Products').select('Id').limit(1);
            const latency = Math.round(performance.now() - start);
            
            if (!error) {
                badge.className = 'health-badge';
                badge.innerHTML = `<span class="pulse-dot"></span> Supabase Bağlı (${latency}ms)`;
                badge.title = 'Supabase PostgreSQL veritabanı aktif ve canlı.';
                return;
            }
        }
        throw new Error('Supabase client unready');
    } catch (e) {
        badge.className = 'health-badge offline';
        badge.innerHTML = `<span class="pulse-dot"></span> Çevrimdışı / Bağlantı Yok`;
        badge.title = 'Veritabanına bağlanılamadı. İnternet bağlantınızı kontrol edin.';
    }
};

// ==========================================================================
// 3. LOGIN & BRUTE-FORCE / BOT DEFENSE ENGINE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const lockoutBanner = document.getElementById('lockoutBanner');
        const lockoutTimer = document.getElementById('lockoutTimer');
        const errorBanner = document.getElementById('errorBanner');
        const errorMsg = document.getElementById('errorMsg');
        const submitBtn = document.getElementById('loginSubmitBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');

        function formatDuration(sec) {
            if (sec >= 60) {
                const mins = Math.floor(sec / 60);
                const s = sec % 60;
                return s > 0 ? `${mins} dk ${s} sn` : `${mins} dakika`;
            }
            return `${sec} saniye`;
        }

        // Active MutationObserver: Prevents attackers from removing 'disabled' via F12 Inspect Element
        let isLockedOut = false;
        const observer = new MutationObserver(() => {
            if (isLockedOut && submitBtn) {
                if (!submitBtn.disabled || submitBtn.style.pointerEvents !== 'none') {
                    submitBtn.disabled = true;
                    submitBtn.style.pointerEvents = 'none';
                    submitBtn.style.opacity = '0.4';
                    submitBtn.style.cursor = 'not-allowed';
                }
            }
        });

        if (submitBtn) {
            observer.observe(submitBtn, { attributes: true, attributeFilter: ['disabled', 'style', 'class'] });
        }

        let timerInterval = null;

        // Check if currently locked out
        function checkLockout() {
            const remaining = typeof getLockoutRemainingSeconds === 'function' ? getLockoutRemainingSeconds() : 0;
            if (remaining > 0) {
                isLockedOut = true;
                submitBtn.disabled = true;
                submitBtn.style.pointerEvents = 'none';
                submitBtn.style.opacity = '0.4';
                submitBtn.style.cursor = 'not-allowed';
                lockoutBanner.style.display = 'block';
                errorBanner.style.display = 'none';

                const tier = typeof getLockoutTier === 'function' ? getLockoutTier() : 1;
                const tierNotice = tier === 1 ? '3 hatalı deneme yapıldı (1 dk kilit).' : 'Tekrarlanan hatalı deneme (10 dk kilit)!';

                lockoutBanner.innerHTML = `
                    <i class="fa-solid fa-lock" style="margin-right: 6px;"></i>
                    <strong>${tierNotice}</strong> Lütfen <strong id="lockoutTimer">${formatDuration(remaining)}</strong> bekleyin.
                `;

                if (timerInterval) clearInterval(timerInterval);

                timerInterval = setInterval(() => {
                    const sec = typeof getLockoutRemainingSeconds === 'function' ? getLockoutRemainingSeconds() : 0;
                    if (sec <= 0) {
                        clearInterval(timerInterval);
                        isLockedOut = false;
                        submitBtn.disabled = false;
                        submitBtn.style.pointerEvents = 'auto';
                        submitBtn.style.opacity = '1';
                        submitBtn.style.cursor = 'pointer';
                        lockoutBanner.style.display = 'none';
                        if (typeof resetFailedLoginAttempts === 'function') resetFailedLoginAttempts();
                    } else {
                        const timerEl = document.getElementById('lockoutTimer');
                        if (timerEl) timerEl.textContent = formatDuration(sec);
                    }
                }, 1000);
            } else {
                isLockedOut = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.pointerEvents = 'auto';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                }
                if (lockoutBanner) lockoutBanner.style.display = 'none';
            }
        }

        checkLockout();

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            // 1. Hard Lockout Enforcement (Cannot bypass from F12)
            if (typeof getLockoutRemainingSeconds === 'function' && getLockoutRemainingSeconds() > 0) {
                checkLockout();
                return;
            }

            // 2. Honeypot Bot Trap Check
            const trapField = document.getElementById('b_trap_field');
            if (trapField && trapField.value.trim() !== '') {
                console.warn('Bot submission blocked via Honeypot!');
                await new Promise(r => setTimeout(r, 2000));
                errorBanner.style.display = 'block';
                errorMsg.textContent = 'Güvenlik doğrulaması başarısız.';
                return;
            }

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // UI Loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Doğrulanıyor...';
            btnIcon.className = 'fa-solid fa-spinner fa-spin';
            errorBanner.style.display = 'none';

            // Anti-automation throttle delay
            await new Promise(r => setTimeout(r, 500));

            try {
                if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
                    const { data, error } = await supabaseClient
                        .from('AdminUsers')
                        .select('*')
                        .eq('Username', username)
                        .maybeSingle();

                    if (!error && data) {
                        const inputHash = await sha256(password);
                        const dbHash = data.PasswordHash || data.passwordHash;

                        if (inputHash && dbHash && inputHash.toLowerCase() === dbHash.toLowerCase()) {
                            if (typeof resetFailedLoginAttempts === 'function') resetFailedLoginAttempts();
                            localStorage.setItem('adminToken', 'supabase-token-' + username + '-' + Date.now());
                            localStorage.setItem('adminUser', JSON.stringify({
                                username: data.Username,
                                role: data.Role || 'Yönetici'
                            }));

                            window.showAdminToast('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                            setTimeout(() => {
                                window.location.href = 'dashboard.html';
                            }, 400);
                            return;
                        }
                    }
                }

                // If credentials invalid:
                const lockSec = typeof recordFailedLoginAttempt === 'function' ? recordFailedLoginAttempt() : 0;
                const attempts = typeof getFailedAttemptsCount === 'function' ? getFailedAttemptsCount() : 1;
                const remainingTries = 3 - (attempts % 3);

                errorBanner.style.display = 'block';
                if (lockSec > 0) {
                    checkLockout();
                } else {
                    errorMsg.textContent = `Hatalı kullanıcı adı veya şifre! (${remainingTries} deneme hakkı kaldı)`;
                }

            } catch (err) {
                console.error('Login error:', err);
                errorBanner.style.display = 'block';
                errorMsg.textContent = 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.';
            } finally {
                if (typeof getLockoutRemainingSeconds === 'function' && getLockoutRemainingSeconds() <= 0) {
                    submitBtn.disabled = false;
                    btnText.textContent = 'Giriş Yap';
                    btnIcon.className = 'fa-solid fa-arrow-right';
                }
            }
        });
    }

    // Run health check on protected pages
    checkSystemHealth();
});

// ==========================================================================
// 4. DASHBOARD ANALYTICS & METRICS
// ==========================================================================
window.loadDashboard = async function() {
    try {
        let products = [];
        let orders = [];

        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data: pData } = await supabaseClient.from('Products').select('StockQuantity, Price');
            const { data: oData } = await supabaseClient.from('Orders').select('*').order('Id', { ascending: false });
            if (pData) products = pData;
            if (oData) orders = oData;
        }

        // Calculate KPI values
        const totalProducts = products.length;
        const totalStock = products.reduce((acc, p) => acc + (Number(p.StockQuantity) || 0), 0);
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(o => (o.Status || '').toLowerCase().includes('tamam') || (o.Status || '').toLowerCase().includes('teslim'))
            .reduce((acc, o) => acc + (Number(o.TotalAmount) || 0), 0);

        const elProd = document.getElementById('totalProducts');
        const elStock = document.getElementById('totalStock');
        const elOrders = document.getElementById('totalOrders');
        const elRev = document.getElementById('totalRevenue');

        if (elProd) elProd.textContent = totalProducts;
        if (elStock) elStock.textContent = totalStock.toLocaleString('tr-TR');
        if (elOrders) elOrders.textContent = totalOrders;
        if (elRev) elRev.textContent = `€${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Populate Recent Orders Table
        const tbody = document.querySelector('#recentOrdersTable tbody');
        if (tbody) {
            tbody.innerHTML = '';
            if (orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">Henüz sipariş kaydı bulunmuyor.</td></tr>';
                return;
            }

            orders.slice(0, 8).forEach(o => {
                const dateStr = o.OrderDate ? new Date(o.OrderDate).toLocaleDateString('tr-TR') : '-';
                const status = o.Status || 'Beklemede';
                let badgeClass = 'badge-warning';
                if (status.includes('Tamam') || status.includes('Teslim')) badgeClass = 'badge-success';
                else if (status.includes('İptal')) badgeClass = 'badge-danger';
                else if (status.includes('Kargo')) badgeClass = 'badge-info';

                tbody.innerHTML += `
                    <tr>
                        <td style="font-weight: 700; color: var(--brand-gold);">#${o.Id || o.id}</td>
                        <td>${o.CustomerName || 'Müşteri'}</td>
                        <td style="color: var(--text-secondary);">${dateStr}</td>
                        <td style="font-weight: 600;">€${Number(o.TotalAmount || 0).toFixed(2)}</td>
                        <td><span class="badge ${badgeClass}">${status}</span></td>
                    </tr>
                `;
            });
        }
    } catch (e) {
        console.error('loadDashboard error:', e);
        window.showAdminToast('Dashboard verileri yüklenirken hata oluştu.', 'error');
    }
};

// ==========================================================================
// 5. PRODUCTS HUB (FULL WORKING CRUD)
// ==========================================================================
const CURATED_IMAGES = [
    "img/neon-sari-reflektif-guvenlik-parkasi.png",
    "img/neon-sari-reflektif-is-parkasi.png",
    "img/neon-sari-kapusonlu-guvenlik-montu.png",
    "img/profilde-neon-sari-reflektorlu-is-parkasi.png",
    "img/beyaz-zeminde-yuksek-gorunurluklu-is-parkasi.png",
    "img/reflektorlu-mavi-lime-is-elbisesi.png",
    "img/arka-gorunum-reflektif-is-elbisesi.png",
    "img/mavi-ve-neon-sari-reflektif-is-tulumu.png",
    "img/kobalt-mavi-ve-neon-sari-is-montu.png",
    "img/mavi-sari-reflektorlu-is-montu.png",
    "img/yandan-gorunum-hi-vis-is-montu.png",
    "img/yuksek-gorunurluklu-is-pantolonu.png",
    "img/gri-mavi-reflektif-is-elbisesi.png",
    "img/gri-mavi-reflektif-is-tulumu.png",
    "img/gri-reflektorlu-is-uniformasi-arkadan-gorunum.png",
    "img/reflektorlu-gri-mavi-is-montu.png",
    "img/celik-grisi-reflektorlu-is-ceketi.png",
    "img/reflektor-seritli-is-pantolonu.png",
    "img/mavi-reflektif-is-uniformasi.png",
    "img/mavi-reflektif-is-uniformasi-seti.png",
    "img/mavi-reflektorlu-is-uniformasi-2.png",
    "img/mavi-reflektorlu-is-guvenligi-montu.png",
    "img/donanimli-lacivert-is-pantolonu.png",
    "img/lacivert-1.png",
    "img/lacivert-2.png",
    "img/lacivert-3.png",
    "img/lacivert-4.png",
    "img/lacivert-5.png",
    "img/lacivert-6.png",
    "img/lacivert-7.png",
    "img/lacivert-8.png",
    "img/lacivert-9.png"
];

// Cache of currently loaded products for instant modal responses
window._productsCache = [];

function getCleanString(val) {
    if (!val) return '';
    if (typeof val === 'object') {
        return val.tr || val.en || Object.values(val)[0] || '';
    }
    if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try {
            const parsed = JSON.parse(val);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed.tr || parsed.en || Object.values(parsed)[0] || val;
            }
        } catch (e) {}
    }
    return String(val);
}

function getSupabase() {
    return window.supabaseClient || (typeof supabaseClient !== 'undefined' ? supabaseClient : null);
}

window.loadProducts = async function() {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">Ürünler yükleniyor...</td></tr>';

        const client = getSupabase();
        let products = [];
        if (client) {
            const { data, error } = await client.from('Products').select('*').order('Id');
            if (!error && data && data.length > 0) {
                products = data;
            }
        }

        window._productsCache = products;
        tbody.innerHTML = '';
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">Kayıtlı ürün bulunamadı.</td></tr>';
            return;
        }

        products.forEach(p => {
            const id = p.Id || p.id || 0;
            const name = getCleanString(p.Name || p.name);
            const subtitle = getCleanString(p.Subtitle || p.subtitle);
            const price = Number(p.Price || p.price || 0).toFixed(2);
            const stock = Number(p.StockQuantity || p.stockQuantity || 0);
            const imgPath = p.ImageUrl || p.image_url || 'img/default.webp';
            const articleCode = p.ArticleCode || p.article_code || '-';

            let standards = [];
            try {
                standards = typeof p.Standards === 'string' ? JSON.parse(p.Standards) : (p.Standards || []);
            } catch(e) {}

            const standardsHtml = standards.map(s => `<span class="standard-chip">${s}</span>`).join('');
            const stockBadge = stock > 10 
                ? `<span class="badge badge-success">${stock} Adet</span>` 
                : `<span class="badge badge-warning">${stock} Adet (Kritik)</span>`;

            tbody.innerHTML += `
                <tr>
                    <td>
                        <div class="product-cell">
                            <img src="../${imgPath}" alt="${name}" class="product-thumb" onerror="this.src='../img/logo_gri.webp'">
                            <div class="product-info-text">
                                <div class="product-info-title">${name}</div>
                                <div class="product-info-subtitle">Kod: ${articleCode} | ${subtitle}</div>
                            </div>
                        </div>
                    </td>
                    <td>${standardsHtml}</td>
                    <td style="font-weight: 700; font-size: 1.05rem; color: #000000;">€${price}</td>
                    <td>${stockBadge}</td>
                    <td>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <button class="btn btn-secondary btn-sm" onclick="openEditProductModal(${id})">Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${id})">Sil</button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error('loadProducts error:', e);
        window.showAdminToast('Ürünler yüklenirken hata oluştu.', 'error');
    }
};

// ==========================================================================
// FEATURE CHIPS & IMAGE UPLOAD ENGINE
// ==========================================================================
window._modalFeatures = { new: [], edit: [] };
window._modalColors = { new: [], edit: [] };

function normalizeColorText(str) {
    return (str || '')
        .toLowerCase()
        .trim()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
}

const COLOR_DICTIONARY = {
    'turkuaz': '#00ced1',
    'turquoise': '#00ced1',
    'cyan': '#00ced1',
    'mavi': '#1e3799',
    'blue': '#1e3799',
    'lacivert': '#0c2461',
    'navy': '#0c2461',
    'sari': '#f1c40f',
    'yellow': '#f1c40f',
    'neon sari': '#e2f10f',
    'turuncu': '#e67e22',
    'orange': '#e67e22',
    'gri': '#7f8c8d',
    'gray': '#7f8c8d',
    'grey': '#7f8c8d',
    'celik grisi': '#7f8c8d',
    'antrasit': '#2c3e50',
    'anthracite': '#2c3e50',
    'siyah': '#111111',
    'siyaah': '#111111',
    'kara': '#111111',
    'black': '#111111',
    'kirmizi': '#cf1b1b',
    'kirmiz': '#cf1b1b',
    'al': '#cf1b1b',
    'red': '#cf1b1b',
    'yesil': '#27ae60',
    'green': '#27ae60',
    'haki': '#556b2f',
    'khaki': '#556b2f',
    'bordo': '#800020',
    'burgundy': '#800020',
    'beyaz': '#ffffff',
    'ak': '#ffffff',
    'white': '#ffffff',
    'bej': '#d7c4a7',
    'beige': '#d7c4a7',
    'kahverengi': '#795548',
    'kahve': '#795548',
    'brown': '#795548',
    'petrol': '#005f73',
    'petrol mavisi': '#005f73',
    'saks': '#2980b9',
    'saks mavisi': '#2980b9',
    'mor': '#8e44ad',
    'purple': '#8e44ad',
    'pembe': '#e84393',
    'pink': '#e84393',
    'altin': '#d4af37',
    'gold': '#d4af37',
    'gumus': '#bdc3c7',
    'silver': '#bdc3c7'
};

function resolveColorHex(colorName) {
    const norm = normalizeColorText(colorName);
    if (COLOR_DICTIONARY[norm]) return COLOR_DICTIONARY[norm];

    for (const [key, hex] of Object.entries(COLOR_DICTIONARY)) {
        if (norm.includes(key) || key.includes(norm)) return hex;
    }

    return '#64748b'; // Neutral slate dot for unknown colors
}

window.handleColorInputKeydown = function(e, prefix) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const input = document.getElementById(`${prefix}ColorInput`);
        if (!input) return;
        const val = input.value.trim();
        if (val) {
            const parts = val.split(/[,;\n]+/).map(p => p.trim()).filter(Boolean);
            parts.forEach(p => addColorTag(prefix, p));
            input.value = '';
        }
    } else if (e.key === 'Backspace') {
        const input = document.getElementById(`${prefix}ColorInput`);
        if (input && input.value === '') {
            if (window._modalColors[prefix] && window._modalColors[prefix].length > 0) {
                window._modalColors[prefix].pop();
                renderColorTags(prefix);
            }
        }
    }
};

window.addColorTag = function(prefix, colorName) {
    const raw = (colorName || '').trim();
    if (!raw) return;

    if (!window._modalColors[prefix]) window._modalColors[prefix] = [];
    const exists = window._modalColors[prefix].some(c => (typeof c === 'string' ? c : c.name).toLowerCase() === raw.toLowerCase());
    if (!exists) {
        window._modalColors[prefix].push({ name: raw, hex: resolveColorHex(raw) });
        renderColorTags(prefix);
    }
};

window.removeColorTag = function(prefix, idx) {
    if (window._modalColors[prefix]) {
        window._modalColors[prefix].splice(idx, 1);
        renderColorTags(prefix);
    }
};

function renderColorTags(prefix) {
    const container = document.getElementById(`${prefix}ColorPillsList`);
    if (!container) return;
    const list = window._modalColors[prefix] || [];
    container.innerHTML = list.map((item, idx) => {
        const rawName = typeof item === 'string' ? item : item.name;
        const hex = typeof item === 'string' ? resolveColorHex(item) : (item.hex || resolveColorHex(item.name));
        const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        return `
            <span class="color-tag-pill">
                <span class="color-tag-dot" style="background: ${hex};"></span>
                <span>${displayName}</span>
                <span class="color-tag-remove" onclick="removeColorTag('${prefix}', ${idx})">&times;</span>
            </span>
        `;
    }).join('');
}

window.addFeatureChip = function(prefix) {
    const input = document.getElementById(`${prefix}FeatureInput`);
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    if (!window._modalFeatures[prefix]) window._modalFeatures[prefix] = [];
    if (!window._modalFeatures[prefix].includes(val)) {
        window._modalFeatures[prefix].push(val);
        renderFeatureChips(prefix);
    }
    input.value = '';
};

window.removeFeatureChip = function(prefix, idx) {
    if (window._modalFeatures[prefix]) {
        window._modalFeatures[prefix].splice(idx, 1);
        renderFeatureChips(prefix);
    }
};

function renderFeatureChips(prefix) {
    const container = document.getElementById(`${prefix}FeaturesChips`);
    if (!container) return;
    const list = window._modalFeatures[prefix] || [];
    container.innerHTML = list.map((item, idx) => `
        <span class="feature-tag-chip">
            <span>${item}</span>
            <span class="remove-chip" onclick="removeFeatureChip('${prefix}', ${idx})">&times;</span>
        </span>
    `).join('');
}

window.handleImageSelectChange = function(prefix) {
    const select = document.getElementById(`${prefix}ProductImagePicker`);
    const preview = document.getElementById(`${prefix}ProductPreviewImg`);
    const finalInput = document.getElementById(`${prefix}ProductFinalImage`);
    if (!select) return;

    const val = select.value;
    if (val) {
        if (preview) preview.src = val.startsWith('http') || val.startsWith('/') ? val : ('../' + val);
        if (finalInput) finalInput.value = val;
    } else {
        if (preview) preview.src = '../img/default.webp';
        if (finalInput) finalInput.value = '';
    }
};

window.handleFileUpload = function(event, prefix) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        window.showAdminToast('Dosya boyutu çok büyük! Lütfen 5MB altında bir resim seçin.', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        const preview = document.getElementById(`${prefix}ProductPreviewImg`);
        const finalInput = document.getElementById(`${prefix}ProductFinalImage`);
        const select = document.getElementById(`${prefix}ProductImagePicker`);

        if (preview) preview.src = dataUrl;
        if (finalInput) finalInput.value = dataUrl;
        if (select) select.value = ''; // Deselect gallery dropdown since custom file is uploaded

        window.showAdminToast('Fotoğraf başarıyla yüklendi ve önizlendi!', 'success');
    };
    reader.readAsDataURL(file);
};

// Open Add Product Modal
window.openAddProductModal = function() {
    const modal = document.getElementById('addProductModal');
    if (!modal) return;

    const form = document.getElementById('addProductForm');
    if (form) form.reset();

    // Start with empty clean features and colors
    window._modalFeatures.new = [];
    renderFeatureChips('new');
    window._modalColors.new = [];
    renderColorTags('new');

    // Do NOT preselect any image! Keep empty
    populateImagePicker('newProductImagePicker', '');
    const finalInput = document.getElementById('newProductFinalImage');
    if (finalInput) finalInput.value = '';

    const preview = document.getElementById('newProductPreviewImg');
    if (preview) preview.src = '../img/default.webp';

    modal.classList.add('active');
};

window.closeAddProductModal = function() {
    const modal = document.getElementById('addProductModal');
    if (modal) modal.classList.remove('active');
};

function populateImagePicker(selectId, selectedVal) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '';

    // Clean empty default option
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '-- Bir Görsel Seçin (veya aşağıdan dosya yükleyin) --';
    if (!selectedVal) defaultOpt.selected = true;
    select.appendChild(defaultOpt);

    let images = [...CURATED_IMAGES];
    if (selectedVal && !images.includes(selectedVal) && !selectedVal.startsWith('data:')) {
        images.unshift(selectedVal);
    }

    images.forEach(img => {
        const opt = document.createElement('option');
        opt.value = img;
        opt.textContent = img.replace('img/', '');
        if (img === selectedVal) opt.selected = true;
        select.appendChild(opt);
    });

    const prefix = selectId.includes('edit') ? 'edit' : 'new';
    const previewImg = document.getElementById(`${prefix}ProductPreviewImg`);
    const finalInput = document.getElementById(`${prefix}ProductFinalImage`);

    if (selectedVal) {
        if (previewImg) previewImg.src = selectedVal.startsWith('http') || selectedVal.startsWith('/') || selectedVal.startsWith('data:') ? selectedVal : ('../' + selectedVal);
        if (finalInput) finalInput.value = selectedVal;
    } else {
        if (previewImg) previewImg.src = '../img/default.webp';
        if (finalInput) finalInput.value = '';
    }
}

// Save New Product
window.saveProduct = async function(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Ürünü Kaydet';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Kaydediliyor...';
    }

    const name = document.getElementById('newProductName').value.trim();
    const subtitle = document.getElementById('newProductSubtitle').value.trim();
    const description = (document.getElementById('newProductDescription')?.value.trim()) || subtitle;
    const price = Number(document.getElementById('newProductPrice').value);
    const stock = parseInt(document.getElementById('newProductStock').value) || 0;
    const articleCode = document.getElementById('newProductArticleCode').value.trim();
    const certificateCode = document.getElementById('newProductCertificateCode').value.trim();
    
    const finalImageInput = document.getElementById('newProductFinalImage');
    const pickerSelect = document.getElementById('newProductImagePicker');
    const imageUrl = (finalImageInput && finalImageInput.value) ? finalImageInput.value : (pickerSelect ? pickerSelect.value : 'img/default.webp');

    const finalColors = window._modalColors.new && window._modalColors.new.length > 0 
        ? window._modalColors.new.map(c => typeof c === 'string' ? c : c.name) 
        : ["Standart"];
    const finalFeatures = window._modalFeatures.new && window._modalFeatures.new.length > 0 ? window._modalFeatures.new : ["Alev Geciktirici & Antistatik Koruma"];
    const checkedStandards = Array.from(document.querySelectorAll('input[name="newStandards"]:checked')).map(cb => cb.value);

    try {
        const client = getSupabase();
        if (client) {
            const { data, error } = await client.from('Products').insert([{
                Name: name,
                Subtitle: subtitle,
                Description: description,
                Price: price,
                StockQuantity: stock,
                ArticleCode: articleCode,
                CertificateCode: certificateCode,
                Standards: JSON.stringify(checkedStandards),
                ImageUrl: imageUrl,
                SubImages: JSON.stringify([imageUrl]),
                Colors: JSON.stringify(finalColors),
                Features: JSON.stringify(finalFeatures)
            }]).select();

            if (error) throw error;

            window.showAdminToast('Yeni ürün Supabase veritabanına ve canlı kataloğa başarıyla eklendi!', 'success');
            closeAddProductModal();
            document.getElementById('addProductForm').reset();
            loadProducts();
            return;
        } else {
            throw new Error('Supabase bağlantısı hazır değil');
        }
    } catch (err) {
        console.error('saveProduct error:', err);
        window.showAdminToast('Ürün eklenirken hata: ' + (err.message || err), 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
};

// Open Edit Product Modal (Instant from cache + network sync)
window.openEditProductModal = async function(id) {
    const numId = parseInt(id);
    if (!numId) {
        window.showAdminToast('Geçersiz ürün ID!', 'error');
        return;
    }

    function populateModalFields(product) {
        document.getElementById('editProductId').value = product.Id || product.id || numId;
        document.getElementById('editProductName').value = getCleanString(product.Name || product.name);
        document.getElementById('editProductSubtitle').value = getCleanString(product.Subtitle || product.subtitle);
        
        const descVal = getCleanString(product.Description || product.description);
        const descEl = document.getElementById('editProductDescription');
        if (descEl) descEl.value = descVal || getCleanString(product.Subtitle || product.subtitle);

        document.getElementById('editProductPrice').value = product.Price || product.price || 0;
        document.getElementById('editProductStock').value = product.StockQuantity || product.stockQuantity || 0;
        document.getElementById('editProductArticleCode').value = product.ArticleCode || product.article_code || '';
        document.getElementById('editProductCertificateCode').value = product.CertificateCode || product.certificate_code || '';

        const imgVal = product.ImageUrl || product.image_url || 'img/Neon Sarı Reflektif Güvenlik Parkası.png';
        populateImagePicker('editProductImagePicker', imgVal);

        const finalImgInput = document.getElementById('editProductFinalImage');
        if (finalImgInput) finalImgInput.value = imgVal;

        const previewImg = document.getElementById('editProductPreviewImg');
        if (previewImg) previewImg.src = imgVal.startsWith('http') || imgVal.startsWith('/') || imgVal.startsWith('data:') ? imgVal : ('../' + imgVal);

        // Populate Colors
        let colors = [];
        try {
            colors = typeof product.Colors === 'string' ? JSON.parse(product.Colors) : (product.Colors || []);
        } catch(e) {}
        window._modalColors.edit = (Array.isArray(colors) ? colors : []).map(c => {
            const name = typeof c === 'string' ? c : (c.name || 'Standart');
            return { name: name, hex: resolveColorHex(name) };
        });
        renderColorTags('edit');

        // Populate Features Chips
        let feats = [];
        try {
            feats = typeof product.Features === 'string' ? JSON.parse(product.Features) : (product.Features || []);
        } catch(e) {}
        window._modalFeatures.edit = Array.isArray(feats) ? feats : [];
        renderFeatureChips('edit');

        // Check Standards
        let standards = [];
        try {
            standards = typeof product.Standards === 'string' ? JSON.parse(product.Standards) : (product.Standards || []);
        } catch(e) {}

        document.querySelectorAll('input[name="editStandards"]').forEach(cb => {
            cb.checked = standards.includes(cb.value);
        });

        const modal = document.getElementById('editProductModal');
        if (modal) modal.classList.add('active');
    }

    try {
        // Step 1: Check cache first for INSTANT 0ms modal opening
        if (Array.isArray(window._productsCache) && window._productsCache.length > 0) {
            const cached = window._productsCache.find(p => (p.Id || p.id) == numId);
            if (cached) {
                populateModalFields(cached);
                return;
            }
        }

        // Step 2: Fetch fresh from Supabase if not in cache
        const client = getSupabase();
        if (client) {
            const { data: product, error } = await client.from('Products').select('*').eq('Id', numId).single();
            if (error || !product) throw new Error('Ürün veritabanında bulunamadı.');
            populateModalFields(product);
        } else {
            throw new Error('Supabase veritabanı bağlantısı kurulamadı.');
        }
    } catch (e) {
        console.error('openEditProductModal error:', e);
        window.showAdminToast('Ürün detayları alınamadı: ' + (e.message || e), 'error');
    }
};

window.closeEditProductModal = function() {
    const modal = document.getElementById('editProductModal');
    if (modal) modal.classList.remove('active');
};

// Submit Edit Product
window.submitEditProduct = async function(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Değişiklikleri Kaydet';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Kaydediliyor...';
    }

    const id = parseInt(document.getElementById('editProductId').value);
    const name = document.getElementById('editProductName').value.trim();
    const subtitle = document.getElementById('editProductSubtitle').value.trim();
    const description = (document.getElementById('editProductDescription')?.value.trim()) || subtitle;
    const price = Number(document.getElementById('editProductPrice').value);
    const stock = parseInt(document.getElementById('editProductStock').value) || 0;
    const articleCode = document.getElementById('editProductArticleCode').value.trim();
    const certificateCode = document.getElementById('editProductCertificateCode').value.trim();

    const finalImageInput = document.getElementById('editProductFinalImage');
    const pickerSelect = document.getElementById('editProductImagePicker');
    const imageUrl = (finalImageInput && finalImageInput.value) ? finalImageInput.value : (pickerSelect ? pickerSelect.value : 'img/default.webp');

    const finalColors = window._modalColors.edit && window._modalColors.edit.length > 0 
        ? window._modalColors.edit.map(c => typeof c === 'string' ? c : c.name) 
        : ["Standart"];
    const finalFeatures = window._modalFeatures.edit && window._modalFeatures.edit.length > 0 ? window._modalFeatures.edit : ["Alev Geciktirici & Antistatik Koruma"];
    const checkedStandards = Array.from(document.querySelectorAll('input[name="editStandards"]:checked')).map(cb => cb.value);

    try {
        const client = getSupabase();
        if (client) {
            const { error } = await client.from('Products').update({
                Name: name,
                Subtitle: subtitle,
                Description: description,
                Price: price,
                StockQuantity: stock,
                ArticleCode: articleCode,
                CertificateCode: certificateCode,
                Standards: JSON.stringify(checkedStandards),
                ImageUrl: imageUrl,
                SubImages: JSON.stringify([imageUrl]),
                Colors: JSON.stringify(finalColors),
                Features: JSON.stringify(finalFeatures)
            }).eq('Id', id);

            if (error) throw error;

            window.showAdminToast('Ürün başarıyla güncellendi!', 'success');
            closeEditProductModal();
            loadProducts();
            return;
        } else {
            throw new Error('Supabase bağlantısı hazır değil');
        }
    } catch (err) {
        console.error('submitEditProduct error:', err);
        window.showAdminToast('Güncellenirken hata oluştu: ' + (err.message || err), 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
};

// Delete Product
window.deleteProduct = function(id) {
    document.getElementById('deleteTargetId').value = id;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.add('active');
};

window.closeDeleteConfirmModal = function() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.remove('active');
};

window.executeDeleteProduct = async function() {
    const id = parseInt(document.getElementById('deleteTargetId').value);
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { error } = await supabaseClient.from('Products').delete().eq('Id', id);
            if (error) throw error;

            closeDeleteConfirmModal();
            window.showAdminToast(`Ürün #${id} Supabase veritabanından silindi.`, 'success');
            loadProducts();
            return;
        }
    } catch (e) {
        console.error('executeDeleteProduct error:', e);
        window.showAdminToast('Silinirken hata oluştu.', 'error');
    }
};

// ==========================================================================
// 6. ORDERS & LOGISTICS / SHIPPING MANAGEMENT ENGINE (v5.1 Clean Executive Edition)
// ==========================================================================

let allOrdersCache = [];
let allProductsCache = [];
let currentFilterStatus = 'all';
let currentSearchQuery = '';
let activeModalOrder = null;

// Parse customer name, phone, and delivery address reliably
function parseCustomerContact(orderObj) {
    if (!orderObj) return { customerName: 'Ziyaretçi', phone: '', address: 'Adres henüz girilmemiş', addressObj: { title: 'Teslimat', receiver: 'Ziyaretçi', phone: '', street: '', district: '', city: '', zip: '', country: 'Türkiye' } };
    
    let rawName = (orderObj.CustomerName || orderObj.customerName || 'Ziyaretçi').trim();
    let rawPhone = (orderObj.CustomerPhone || orderObj.customerPhone || '').trim();
    let customerName = rawName;
    let phone = rawPhone;
    let address = '';
    let addressObj = null;

    // Check if address is encoded in CustomerName
    if (rawName.includes(' | Adres: ')) {
        const parts = rawName.split(' | Adres: ');
        customerName = parts[0].trim();
        address = parts[1].trim();
    } else if (rawName.includes('[Adres: ')) {
        const parts = rawName.split('[Adres: ');
        customerName = parts[0].trim();
        address = parts[1].replace(']', '').trim();
    }

    // Check if address is encoded in CustomerPhone
    if (!address && rawPhone.includes(' | Adres: ')) {
        const parts = rawPhone.split(' | Adres: ');
        phone = parts[0].trim();
        address = parts[1].trim();
    } else if (!address && rawPhone.includes('[Adres: ')) {
        const parts = rawPhone.split('[Adres: ');
        phone = parts[0].trim();
        address = parts[1].replace(']', '').trim();
    }

    // Try finding matching structured address from localStorage
    try {
        const userJson = localStorage.getItem('metemorali_user');
        const user = userJson ? JSON.parse(userJson) : null;
        const userAddrs = (user && user.addresses && user.addresses.length > 0) ? user.addresses : JSON.parse(localStorage.getItem('metemorali_addresses') || '[]');
        if (userAddrs.length > 0) {
            const a = userAddrs[0];
            const street = a.detail || a.address || '';
            const cityDistrict = [a.district, a.city].filter(Boolean).join(' / ');
            
            if (!address) {
                const parts = [];
                if (a.title) parts.push(`[${a.title}]`);
                if (a.receiver) parts.push(`Alıcı: ${a.receiver}`);
                if (street) parts.push(street);
                if (cityDistrict) parts.push(cityDistrict);
                if (a.zip) parts.push(`PK: ${a.zip}`);
                if (a.country && a.country.toLowerCase() !== 'türkiye') parts.push(a.country);
                address = parts.join(', ');
            }

            addressObj = {
                title: a.title || 'Teslimat Adresi',
                receiver: a.receiver || customerName,
                phone: a.phone || phone,
                street: street,
                district: a.district || '',
                city: a.city || '',
                zip: a.zip || '',
                country: a.country || 'Türkiye'
            };
        }
    } catch (e) {}

    // Fallback: If no addressObj constructed from userAddrs, parse from string address
    if (!addressObj) {
        addressObj = parseAddressString(address, customerName, phone);
    }

    if (!address) {
        address = 'Kayıtlı teslimat adresi bulunamadı (Müşteriden talep edilebilir)';
    }

    return { customerName, phone, address, addressObj };
}

function parseAddressString(addrStr, fallbackReceiver, fallbackPhone) {
    if (!addrStr || addrStr.includes('Kayıtlı teslimat adresi bulunamadı')) {
        return {
            title: 'Teslimat',
            receiver: fallbackReceiver || 'Ziyaretçi',
            phone: fallbackPhone || '',
            street: 'Adres henüz girilmemiş',
            district: '',
            city: '',
            zip: '',
            country: 'Türkiye'
        };
    }

    let title = 'Teslimat';
    let text = addrStr;
    const titleMatch = text.match(/^\[([^\]]+)\]\s*/);
    if (titleMatch) {
        title = titleMatch[1];
        text = text.replace(titleMatch[0], '');
    }

    let zip = '';
    const zipMatch = text.match(/\(PK:\s*([^)]+)\)/i) || text.match(/PK:\s*([0-9]+)/i);
    if (zipMatch) {
        zip = zipMatch[1].trim();
        text = text.replace(zipMatch[0], '');
    }

    let receiver = fallbackReceiver || '';
    const recMatch = text.match(/Alıcı:\s*([^,-]+)/i);
    if (recMatch) {
        receiver = recMatch[1].trim();
        text = text.replace(recMatch[0], '');
    }

    let district = '';
    let city = '';
    const locMatch = text.match(/(?:-\s*|\s+)([A-Za-zÇĞİÖŞÜçğıöşü\s]+)\s*\/\s*([A-Za-zÇĞİÖŞÜçğıöşü\s]+)$/);
    if (locMatch) {
        district = locMatch[1].trim();
        city = locMatch[2].trim();
        text = text.slice(0, locMatch.index).trim();
    }

    let street = text.replace(/^,\s*|,\s*$/g, '').trim();
    if (!street && (district || city)) {
        street = [district, city].filter(Boolean).join(' / ');
    }

    return {
        title: title || 'Teslimat',
        receiver: receiver || fallbackReceiver || 'Müşteri',
        phone: fallbackPhone || '',
        street: street || addrStr,
        district: district,
        city: city,
        zip: zip,
        country: 'Türkiye'
    };
}

function sanitizePhone(phone) {
    if (!phone) return '';
    let p = phone.replace(/\D/g, '');
    if (p.startsWith('0')) p = '9' + p;
    if (p.length === 10) p = '90' + p;
    return p;
}

window.loadOrders = async function() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;

    try {
        let orders = [];
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data: oData, error: oErr } = await supabaseClient
                .from('Orders')
                .select('*')
                .order('Id', { ascending: false });
            if (!oErr && oData) orders = oData;

            const { data: pData } = await supabaseClient
                .from('Products')
                .select('Id, Name, Price, ImageUrl, ArticleCode, Standards');
            if (pData) allProductsCache = pData;
        }

        allOrdersCache = orders;

        // KPI Statistics
        const statTotal = orders.length;
        const statPending = orders.filter(o => (o.Status || '').toLowerCase().includes('talep')).length;
        const statShipping = orders.filter(o => ['hazırlanıyor', 'kargoya verildi'].includes((o.Status || '').toLowerCase())).length;
        const statRevenue = orders.reduce((acc, o) => acc + Number(o.TotalAmount || 0), 0);

        const elTotal = document.getElementById('statTotalOrders');
        const elPending = document.getElementById('statPendingOrders');
        const elShipping = document.getElementById('statShippingOrders');
        const elRevenue = document.getElementById('statTotalRevenue');

        if (elTotal) elTotal.textContent = statTotal;
        if (elPending) elPending.textContent = statPending;
        if (elShipping) elShipping.textContent = statShipping;
        if (elRevenue) elRevenue.textContent = '€' + statRevenue.toFixed(2);

        renderOrdersTable();

    } catch (e) {
        console.error('loadOrders error:', e);
        window.showAdminToast('Siparişler yüklenirken bir hata oluştu.', 'error');
    }
};

window.setOrderStatusFilter = function(status, btn) {
    currentFilterStatus = status;
    document.querySelectorAll('.status-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderOrdersTable();
};

window.filterOrdersList = function() {
    const input = document.getElementById('orderSearchInput');
    currentSearchQuery = (input ? input.value : '').toLowerCase().trim();
    renderOrdersTable();
};

function renderOrdersTable() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;

    let filtered = allOrdersCache.filter(o => {
        if (currentFilterStatus !== 'all') {
            const statusMatch = (o.Status || '').toLowerCase() === currentFilterStatus.toLowerCase();
            if (!statusMatch) return false;
        }

        if (currentSearchQuery) {
            const contact = parseCustomerContact(o);
            const haystack = `#${o.Id} ${contact.customerName} ${contact.phone} ${contact.address} ${o.Status || ''}`.toLowerCase();
            if (!haystack.includes(currentSearchQuery)) return false;
        }

        return true;
    });

    tbody.innerHTML = '';
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 48px; color: var(--text-muted); font-size: 0.9rem;">Kriterlere uygun sipariş kaydı bulunmuyor.</td></tr>';
        return;
    }

    filtered.forEach(o => {
        const id = o.Id || o.id;
        const contact = parseCustomerContact(o);
        const cleanPhone = sanitizePhone(contact.phone);
        const dateStr = o.OrderDate ? new Date(o.OrderDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
        const total = Number(o.TotalAmount || 0).toFixed(2);
        const status = o.Status || 'Talep Alındı';

        const savedMeta = JSON.parse(localStorage.getItem(`mm_order_meta_${id}`) || '{}');
        const displayAddress = savedMeta.address || contact.address;

        let badgeClass = 'talep';
        const sLower = status.toLowerCase();
        if (sLower.includes('hazır')) badgeClass = 'hazirlaniyor';
        else if (sLower.includes('kargo')) badgeClass = 'kargo';
        else if (sLower.includes('tamam')) badgeClass = 'tamamlandi';
        else if (sLower.includes('iptal')) badgeClass = 'iptal';

        const statusOptions = ['Talep Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Tamamlandı', 'İptal Edildi'];
        const selectOptionsHtml = statusOptions.map(opt => `<option value="${opt}" ${opt.toLowerCase() === sLower ? 'selected' : ''}>${opt}</option>`).join('');

        tbody.innerHTML += `
            <tr style="transition: background 0.15s;">
                <td style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">#${id}</td>
                <td>
                    <div style="font-weight: 600; color: #0f172a;">${contact.customerName}</div>
                    <div style="font-size: 0.8rem; color: #64748b; margin-top: 1px;">${contact.phone || 'Telefon Yok'}</div>
                    <div class="customer-contact-links">
                        ${cleanPhone ? `
                            <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent('Merhaba ' + contact.customerName + ', Mete Morali #' + id + ' numaralı siparişiniz hakkında bilgilendirme:')}" target="_blank" class="contact-chip wa" title="WhatsApp Mesajı Gönder">
                                <i class="fa-brands fa-whatsapp"></i>
                            </a>
                            <a href="tel:${cleanPhone}" class="contact-chip tel" title="Müşteriyi Ara">
                                <i class="fa-solid fa-phone"></i>
                            </a>
                        ` : ''}
                    </div>
                </td>
                <td>
                    <div style="font-size: 0.84rem; color: #334155; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${displayAddress}">
                        ${displayAddress}
                    </div>
                    ${savedMeta.cargoCompany ? `
                        <div style="font-size: 0.75rem; color: #16a34a; margin-top: 3px; font-weight: 500;">
                            ${savedMeta.cargoCompany}: ${savedMeta.trackingCode || 'Kod Yok'}
                        </div>
                    ` : ''}
                </td>
                <td style="color: #64748b; font-size: 0.85rem;">${dateStr}</td>
                <td style="font-weight: 700; font-size: 1rem; color: #0f172a;">€${total}</td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <span class="status-badge ${badgeClass}">${status}</span>
                        <select class="form-select" style="padding: 4px 8px; font-size: 0.78rem; border-radius: 6px;" onchange="updateOrderStatus(${id}, this.value)">
                            ${selectOptionsHtml}
                        </select>
                    </div>
                </td>
                <td style="text-align: center;">
                    <button class="order-action-btn btn-detail" onclick="viewOrderDetails(${id})">
                        Detay & Sevkiyat
                    </button>
                </td>
            </tr>
        `;
    });
}

window.updateOrderStatus = async function(orderId, newStatus) {
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { error } = await supabaseClient.from('Orders').update({ Status: newStatus }).eq('Id', orderId);
            if (error) throw error;

            const target = allOrdersCache.find(o => (o.Id || o.id) === orderId);
            if (target) target.Status = newStatus;

            renderOrdersTable();
            window.showAdminToast(`Sipariş #${orderId} durumu "${newStatus}" olarak güncellendi.`, 'success');
        }
    } catch (e) {
        console.error('updateOrderStatus error:', e);
        window.showAdminToast('Durum güncellenirken hata oluştu.', 'error');
    }
};

window.viewOrderDetails = async function(orderId) {
    try {
        let order = allOrdersCache.find(o => (o.Id || o.id) === orderId);
        if (!order && typeof supabaseClient !== 'undefined') {
            const { data } = await supabaseClient.from('Orders').select('*').eq('Id', orderId).single();
            if (data) order = data;
        }

        if (!order) {
            window.showAdminToast('Sipariş bulunamadı.', 'error');
            return;
        }

        activeModalOrder = order;

        let items = [];
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data: iData } = await supabaseClient.from('OrderItems').select('*').eq('OrderId', orderId);
            if (iData) items = iData;
        }

        const contact = parseCustomerContact(order);
        const savedMeta = JSON.parse(localStorage.getItem(`mm_order_meta_${orderId}`) || '{}');
        const currentAddress = savedMeta.address || contact.address;
        const addrObj = (savedMeta.address && savedMeta.address !== contact.address) ? parseAddressString(savedMeta.address, contact.customerName, contact.phone) : (contact.addressObj || parseAddressString(currentAddress, contact.customerName, contact.phone));
        
        // Prepare carrier shipping label
        window._activeShippingLabel = [
            `Alıcı: ${addrObj.receiver || contact.customerName}`,
            `Telefon: ${addrObj.phone || contact.phone || ''}`,
            `Adres: ${addrObj.street || currentAddress}`,
            `İlçe / İl: ${[addrObj.district, addrObj.city].filter(Boolean).join(' / ')}`,
            addrObj.zip ? `Posta Kodu: ${addrObj.zip}` : '',
            `Ülke: ${addrObj.country || 'Türkiye'}`
        ].filter(Boolean).join('\n');

        const currentCargoCompany = savedMeta.cargoCompany || 'Yurtiçi Kargo';
        const currentTrackingCode = savedMeta.trackingCode || '';
        const currentNotes = savedMeta.notes || '';
        const cleanPhone = sanitizePhone(contact.phone);

        document.getElementById('modalOrderId').textContent = `#MM-${orderId}`;
        const dateStr = order.OrderDate ? new Date(order.OrderDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
        document.getElementById('modalOrderDate').textContent = `Kayıt Tarihi: ${dateStr}`;

        let productsHtml = '';
        if (items.length === 0) {
            productsHtml = '<p style="color: #94a3b8; text-align: center; padding: 24px 0;">Bu siparişte kayıtlı ürün kalemi bulunamadı.</p>';
        } else {
            productsHtml = items.map(item => {
                const prod = allProductsCache.find(p => p.Id === item.ProductId) || {};
                const name = prod.Name || ('Endüstriyel Ürün #' + item.ProductId);
                const img = prod.ImageUrl || 'img/logo_gri.webp';
                const artCode = prod.ArticleCode ? `Art: ${prod.ArticleCode}` : '';
                const unitPrice = Number(item.UnitPrice || prod.Price || 0);
                const qty = Number(item.Quantity || 1);
                const lineTotal = (unitPrice * qty).toFixed(2);

                return `
                    <div class="order-product-row">
                        <img src="${img}" class="order-product-thumb" alt="${name}" onerror="this.src='../img/logo_gri.png'">
                        <div class="order-product-info">
                            <div class="order-product-title">${name}</div>
                            <div class="order-product-meta">${artCode ? `<span>${artCode}</span> • ` : ''}Birim: €${unitPrice.toFixed(2)}</div>
                        </div>
                        <div style="text-align: right;">
                            <span style="background: #f1f5f9; padding: 3px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 700; color: #0f172a;">x${qty} Adet</span>
                            <div style="font-weight: 700; color: #0f172a; margin-top: 4px; font-size: 0.95rem;">€${lineTotal}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        const totalAmount = Number(order.TotalAmount || 0).toFixed(2);
        const currentStatus = order.Status || 'Talep Alındı';

        const modalBody = document.getElementById('modalOrderBody');
        modalBody.innerHTML = `
            <div class="order-console-grid">
                <!-- Sol Kolon: Müşteri, Teslimat & Kargo Takip -->
                <div>
                    <!-- Müşteri Bilgileri -->
                    <div class="console-card">
                        <h4>Müşteri Bilgileri</h4>
                        <div class="console-field-row">
                            <span class="label">Adı Soyadı:</span>
                            <span class="val">${contact.customerName}</span>
                        </div>
                        <div class="console-field-row">
                            <span class="label">Telefon:</span>
                            <span class="val">${contact.phone || 'Belirtilmedi'}</span>
                        </div>
                        <div style="display: flex; gap: 8px; margin-top: 14px;">
                            ${cleanPhone ? `
                                <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent('Merhaba ' + contact.customerName + ', Mete Morali #' + orderId + ' numaralı siparişiniz hakkında bilgilendirme:')}" target="_blank" class="btn btn-sm btn-success" style="flex: 1; justify-content: center; background: #25d366; color: #fff; text-decoration: none; border: none; font-size: 0.82rem; font-weight: 600;">
                                    WhatsApp'tan Yaz
                                </a>
                                <a href="tel:${cleanPhone}" class="btn btn-sm btn-secondary" style="background: #f1f5f9; text-decoration: none; font-size: 0.82rem; font-weight: 600;">
                                    Ara
                                </a>
                            ` : '<span style="color: #94a3b8; font-size: 0.8rem;">Telefon numarası kayıtlı değil.</span>'}
                        </div>
                    </div>

                    <!-- Teslimat & Sevkiyat Adresi (Büyük E-Ticaret / Kurumsal Sevkiyat Kartı) -->
                    <div class="console-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px;">
                            <h4 style="margin: 0; border: none; padding: 0;">TESLİMAT VE SEVKİYAT ADRESİ</h4>
                            <span class="shipping-badge">${addrObj.title || 'Teslimat'}</span>
                        </div>

                        <!-- Yapılandırılmış Teslimat Kartı -->
                        <div class="shipping-address-card">
                            <div class="shipping-field">
                                <span class="k">Alıcı:</span>
                                <span class="v bold">${addrObj.receiver || contact.customerName}</span>
                            </div>
                            <div class="shipping-field">
                                <span class="k">Telefon:</span>
                                <span class="v">${addrObj.phone || contact.phone || '-'}</span>
                            </div>
                            <div class="shipping-field">
                                <span class="k">Açık Adres:</span>
                                <span class="v">${addrObj.street || '-'}</span>
                            </div>
                            <div class="shipping-field">
                                <span class="k">İlçe / İl:</span>
                                <span class="v bold">${[addrObj.district, addrObj.city].filter(Boolean).join(' / ') || '-'}</span>
                            </div>
                            <div class="shipping-field">
                                <span class="k">Posta / Ülke:</span>
                                <span class="v">${addrObj.zip ? addrObj.zip + ' • ' : ''}${addrObj.country || 'Türkiye'}</span>
                            </div>
                        </div>

                        <!-- Aksiyon Butonları (Kargo Paneline Kopyalama, Harita, Düzenleme) -->
                        <div class="shipping-actions-bar">
                            <button type="button" class="btn-copy-kargo" onclick="copyShippingLabelToClipboard(${orderId})">
                                <i class="fa-solid fa-copy"></i> Kargo Formatında Kopyala
                            </button>
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([addrObj.street, addrObj.district, addrObj.city, addrObj.country].filter(Boolean).join(' '))}" target="_blank" class="btn-map-link">
                                <i class="fa-solid fa-location-dot"></i> Haritada Göster
                            </a>
                            <button type="button" class="btn-edit-toggle" onclick="toggleOrderAddressEdit()">
                                <i class="fa-solid fa-pen"></i> Düzenle
                            </button>
                        </div>

                        <!-- Manuel Düzenleme Formu (İsteğe Bağlı Açılır) -->
                        <div id="orderAddressEditForm" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
                            <label style="font-size: 0.74rem; font-weight: 600; color: #64748b; display: block; margin-bottom: 4px;">Adresi Düzenle / Güncelle:</label>
                            <textarea id="modalOrderAddressInput" rows="3" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 0.85rem; line-height: 1.45; outline: none; margin-bottom: 8px;">${currentAddress}</textarea>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn btn-secondary btn-sm" onclick="saveOrderAddressMeta(${orderId})">
                                    Kaydet ve Güncelle
                                </button>
                                <button type="button" class="btn btn-sm" style="background: #e2e8f0; color: #475569;" onclick="toggleOrderAddressEdit()">
                                    Vazgeç
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Kargo & Lojistik Takip -->
                    <div class="console-card">
                        <h4>Kargo ve Sevkiyat Takibi</h4>
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 0.78rem; font-weight: 600; color: #64748b; display: block; margin-bottom: 4px;">Kargo Firması</label>
                            <select id="modalOrderCargoCompany" class="form-select" style="width: 100%; padding: 8px 12px; font-size: 0.85rem;">
                                ${['Yurtiçi Kargo', 'Aras Kargo', 'MNG Kargo', 'Sürat Kargo', 'UPS Kargo', 'PTT Kargo', 'Özel Kurye / Ambar'].map(c => `<option value="${c}" ${c === currentCargoCompany ? 'selected' : ''}>${c}</option>`).join('')}
                            </select>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 0.78rem; font-weight: 600; color: #64748b; display: block; margin-bottom: 4px;">Kargo Takip No</label>
                            <input type="text" id="modalOrderTrackingInput" value="${currentTrackingCode}" placeholder="Örn: 1234567890" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; outline: none;">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <button class="btn btn-secondary btn-sm" onclick="saveOrderTrackingMeta(${orderId})">
                                Kargo Bilgisini Kaydet
                            </button>
                            ${cleanPhone ? `
                                <button class="btn btn-sm btn-success" onclick="sendOrderTrackingWhatsApp(${orderId})" style="background: #25d366; color: #fff; border: none; font-size: 0.82rem; font-weight: 600; padding: 9px 12px;">
                                    Müşteriye WhatsApp Kargo Bildirimi Gönder
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Yönetici Notu -->
                    <div class="console-card" style="margin-bottom: 0;">
                        <h4>Yönetici Özel Notu</h4>
                        <textarea id="modalOrderNotesInput" rows="2" placeholder="Özel nakış baskısı, koli bilgisi veya not ekleyin..." style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 0.82rem; outline: none; margin-bottom: 8px;">${currentNotes}</textarea>
                        <button class="btn btn-secondary btn-sm" onclick="saveOrderNotesMeta(${orderId})">
                            Notu Kaydet
                        </button>
                    </div>
                </div>

                <!-- Sağ Kolon: Kalemler, Finans & Süreç Stepper -->
                <div>
                    <!-- Sipariş Kalemleri -->
                    <div class="console-card">
                        <h4>Siparişteki Kalemler</h4>
                        <div style="max-height: 280px; overflow-y: auto; padding-right: 4px;">
                            ${productsHtml}
                        </div>
                    </div>

                    <!-- Maliyet & Fiyatlandırma Tablosu -->
                    <div class="console-card">
                        <h4>Mali Özet</h4>
                        <div class="console-field-row">
                            <span class="label">Ara Toplam:</span>
                            <span class="val">€${totalAmount}</span>
                        </div>
                        <div class="console-field-row">
                            <span class="label">Kargo & Sigorta:</span>
                            <span class="val" style="color: #16a34a;">Ücretsiz / Anlaşmalı</span>
                        </div>
                        <div class="console-field-row">
                            <span class="label">KDV Durumu:</span>
                            <span class="val">Fiyata Dahil</span>
                        </div>
                        <div class="console-field-row" style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px; font-size: 1.1rem;">
                            <span class="label" style="font-weight: 700; color: #0f172a;">Genel Toplam:</span>
                            <span class="val" style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">€${totalAmount}</span>
                        </div>
                    </div>

                    <!-- Sipariş Durumu İş Akışı (Stepper - Clean Minimalist) -->
                    <div class="console-card" style="margin-bottom: 0;">
                        <h4>Sipariş Durumu</h4>
                        <div class="stepper-pipeline">
                            <button class="stepper-btn ${currentStatus === 'Talep Alındı' ? 'active' : ''}" onclick="applyModalStatusChange(${orderId}, 'Talep Alındı')">
                                Talep Alındı
                            </button>
                            <button class="stepper-btn ${currentStatus === 'Hazırlanıyor' ? 'active' : ''}" onclick="applyModalStatusChange(${orderId}, 'Hazırlanıyor')">
                                Hazırlanıyor
                            </button>
                            <button class="stepper-btn ${currentStatus === 'Kargoya Verildi' ? 'active' : ''}" onclick="applyModalStatusChange(${orderId}, 'Kargoya Verildi')">
                                Kargoda
                            </button>
                            <button class="stepper-btn ${currentStatus === 'Tamamlandı' ? 'active' : ''}" onclick="applyModalStatusChange(${orderId}, 'Tamamlandı')">
                                Tamamlandı
                            </button>
                            <button class="stepper-btn danger ${currentStatus === 'İptal Edildi' ? 'active' : ''}" onclick="applyModalStatusChange(${orderId}, 'İptal Edildi')">
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = document.getElementById('orderDetailsModal');
        if (modal) modal.classList.add('active');

    } catch (e) {
        console.error('viewOrderDetails error:', e);
        window.showAdminToast('Sipariş detayları alınamadı.', 'error');
    }
};

window.toggleOrderAddressEdit = function() {
    const editForm = document.getElementById('orderAddressEditForm');
    if (!editForm) return;
    editForm.style.display = (editForm.style.display === 'none' || !editForm.style.display) ? 'block' : 'none';
};

window.copyShippingLabelToClipboard = function(orderId) {
    if (!window._activeShippingLabel) {
        window.showAdminToast('Kargo etiketi verisi bulunamadı.', 'error');
        return;
    }
    navigator.clipboard.writeText(window._activeShippingLabel).then(() => {
        window.showAdminToast('Kargo etiketi panoya kopyalandı! (Kargo sistemine yapıştırabilirsiniz)', 'success');
    }).catch(err => {
        console.error('Clipboard error:', err);
        window.showAdminToast('Panoya kopyalanamadı.', 'error');
    });
};

window.saveOrderAddressMeta = async function(orderId) {
    const val = (document.getElementById('modalOrderAddressInput')?.value || '').trim();
    const meta = JSON.parse(localStorage.getItem(`mm_order_meta_${orderId}`) || '{}');
    meta.address = val;
    localStorage.setItem(`mm_order_meta_${orderId}`, JSON.stringify(meta));

    // Also update Supabase row CustomerName field so the address is permanently synced in database
    if (typeof supabaseClient !== 'undefined' && supabaseClient !== null && activeModalOrder) {
        try {
            const contact = parseCustomerContact(activeModalOrder);
            const newCustomerNamePayload = `${contact.customerName} | Adres: ${val}`;
            await supabaseClient.from('Orders').update({ CustomerName: newCustomerNamePayload }).eq('Id', orderId);
            activeModalOrder.CustomerName = newCustomerNamePayload;
            
            const cached = allOrdersCache.find(o => (o.Id || o.id) === orderId);
            if (cached) cached.CustomerName = newCustomerNamePayload;
        } catch (e) {
            console.warn('Supabase address update error:', e);
        }
    }

    window.showAdminToast('Teslimat adresi güncellendi ve kaydedildi.', 'success');
    renderOrdersTable();
    window.viewOrderDetails(orderId);
};

window.saveOrderTrackingMeta = function(orderId) {
    const cargoCompany = document.getElementById('modalOrderCargoCompany')?.value || 'Yurtiçi Kargo';
    const trackingCode = (document.getElementById('modalOrderTrackingInput')?.value || '').trim();
    const meta = JSON.parse(localStorage.getItem(`mm_order_meta_${orderId}`) || '{}');
    meta.cargoCompany = cargoCompany;
    meta.trackingCode = trackingCode;
    localStorage.setItem(`mm_order_meta_${orderId}`, JSON.stringify(meta));
    window.showAdminToast('Kargo takip bilgileri kaydedildi.', 'success');
    renderOrdersTable();
};

window.saveOrderNotesMeta = function(orderId) {
    const val = (document.getElementById('modalOrderNotesInput')?.value || '').trim();
    const meta = JSON.parse(localStorage.getItem(`mm_order_meta_${orderId}`) || '{}');
    meta.notes = val;
    localStorage.setItem(`mm_order_meta_${orderId}`, JSON.stringify(meta));
    window.showAdminToast('Yönetici notu kaydedildi.', 'success');
};

window.applyModalStatusChange = async function(orderId, newStatus) {
    await window.updateOrderStatus(orderId, newStatus);
    window.viewOrderDetails(orderId);
};

window.sendOrderTrackingWhatsApp = function(orderId) {
    if (!activeModalOrder) return;
    const contact = parseCustomerContact(activeModalOrder);
    const cleanPhone = sanitizePhone(contact.phone);
    if (!cleanPhone) {
        window.showAdminToast('Müşterinin telefon numarası bulunmuyor.', 'warning');
        return;
    }

    const savedMeta = JSON.parse(localStorage.getItem(`mm_order_meta_${orderId}`) || '{}');
    const cargo = savedMeta.cargoCompany || 'Kargo';
    const tracking = savedMeta.trackingCode || '(Belirtilmedi)';
    const customer = contact.customerName || 'Değerli Müşterimiz';

    const text = 
`*METE MORALİ - KARGO SEVKİYAT BİLDİRİMİ*
──────────────────────────
Sayın *${customer}*,

Mete Morali'den oluşturduğunuz *#MM-${orderId}* numaralı siparişiniz hazırlanmış ve kargoya teslim edilmiştir.

• *Kargo Firması:* ${cargo}
• *Kargo Takip Kodu:* ${tracking}

Ürünlerinizi iyi günlerde ve güvenle kullanmanızı dileriz.
──────────────────────────
Mete Morali Tekstil A.Ş.`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
};

window.printActiveOrderInvoice = function() {
    if (!activeModalOrder) return;
    const order = activeModalOrder;
    const orderId = order.Id || order.id;
    const contact = parseCustomerContact(order);
    const savedMeta = JSON.parse(localStorage.getItem(`mm_order_meta_${orderId}`) || '{}');
    const address = savedMeta.address || contact.address;
    const cargo = savedMeta.cargoCompany || 'Standart Sevkiyat';
    const tracking = savedMeta.trackingCode || '-';
    const dateStr = order.OrderDate ? new Date(order.OrderDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

    const printArea = document.getElementById('printInvoiceArea');
    if (!printArea) return;

    printArea.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; font-family: 'Outfit', sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
                <div>
                    <h1 style="margin: 0; font-size: 1.8rem; font-weight: 800; color: #0f172a;">METE MORALI</h1>
                    <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b;">Endüstriyel & Teknik İş Kıyafetleri San. Tic. A.Ş.</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin: 0; font-size: 1.3rem; color: #2563eb;">SEVKİYAT & İRSALİYE FİŞİ</h2>
                    <p style="margin: 4px 0 0 0; font-size: 0.9rem; font-weight: 600;">Sipariş No: #MM-${orderId}</p>
                    <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b;">Tarih: ${dateStr}</p>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 28px; background: #f8fafc; padding: 16px; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; text-transform: uppercase; color: #64748b;">GÖNDERİCİ:</h4>
                    <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">Mete Morali Tekstil A.Ş.</p>
                    <p style="margin: 2px 0; font-size: 0.8rem; color: #475569;">Bursa Organize Sanayi Bölgesi, Türkiye</p>
                    <p style="margin: 2px 0; font-size: 0.8rem; color: #475569;">Tel: +90 532 214 45 53</p>
                </div>
                <div style="flex: 1; padding-left: 20px;">
                    <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; text-transform: uppercase; color: #64748b;">ALICI & TESLİMAT:</h4>
                    <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">${contact.customerName}</p>
                    <p style="margin: 2px 0; font-size: 0.8rem; color: #475569;">Tel: ${contact.phone || '-'}</p>
                    <p style="margin: 2px 0; font-size: 0.8rem; color: #475569;">Adres: ${address}</p>
                </div>
            </div>

            <div style="margin-bottom: 28px;">
                <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 6px;">Sipariş Kalemleri</div>
                ${document.querySelector('#modalOrderBody .console-card div[style*="max-height"]')?.innerHTML || '<p>Kalemler görüntülendi.</p>'}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-top: 1px solid #ddd; padding-top: 16px;">
                <div>
                    <p style="margin: 0 0 4px 0; font-size: 0.85rem;"><b>Kargo Şirketi:</b> ${cargo}</p>
                    <p style="margin: 0; font-size: 0.85rem;"><b>Takip No:</b> ${tracking}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 1.1rem; font-weight: 700;">Toplam Tutar: €${Number(order.TotalAmount || 0).toFixed(2)}</p>
                    <p style="margin: 2px 0 0 0; font-size: 0.78rem; color: #16a34a;">KDV Dahil / Sevk Edildi</p>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; border-top: 1px dashed #bbb; font-size: 0.8rem; color: #64748b;">
                <div>Teslim Eden: MeteMorali Depo / Kaşe - İmza</div>
                <div>Teslim Alan: Kargo Yetkilisi / İsim - İmza</div>
            </div>
        </div>
    `;

    window.print();
};

// 7. CUSTOMERS MANAGEMENT
// ==========================================================================
window.loadCustomers = async function() {
    const tbody = document.querySelector('#customersTable tbody');
    if (!tbody) return;

    try {
        let customers = [];
        let orders = [];
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data: cData, error } = await supabaseClient.from('Customers').select('*').order('CreatedAt', { ascending: false });
            const { data: oData } = await supabaseClient.from('Orders').select('*');
            if (!error && cData) customers = cData;
            if (oData) orders = oData;
        }

        tbody.innerHTML = '';
        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">Kayıtlı müşteri bulunamadı.</td></tr>';
            return;
        }

        customers.forEach(c => {
            const name = c.FullName || c.fullName || 'İsimsiz Müşteri';
            const email = c.Email || c.email || '-';
            const phone = c.Phone || c.phone || '-';
            const dateStr = c.CreatedAt ? new Date(c.CreatedAt).toLocaleDateString('tr-TR') : '-';
            const userOrders = orders.filter(o => 
                (phone && o.CustomerPhone && o.CustomerPhone === phone) || 
                (name && o.CustomerName && o.CustomerName.toLowerCase() === name.toLowerCase())
            );

            tbody.innerHTML += `
                <tr>
                    <td>
                        <div style="font-weight: 600; color: var(--text-primary);">${name}</div>
                    </td>
                    <td style="color: var(--text-secondary);">${email}</td>
                    <td style="color: var(--text-secondary);">${phone}</td>
                    <td>
                        <span class="badge ${userOrders.length > 0 ? 'badge-info' : 'badge-warning'}">${userOrders.length} Sipariş</span>
                    </td>
                    <td style="color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
                </tr>
            `;
        });
    } catch (e) {
        console.error('loadCustomers error:', e);
        window.showAdminToast('Müşteriler yüklenemedi.', 'error');
    }
};