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
    "img/Neon Sarı Reflektif Güvenlik Parkası.png",
    "img/Neon Sarı Reflektif İş Parkası.png",
    "img/Neon Sarı Kapüşonlu Güvenlik Montu.png",
    "img/Profilde Neon Sarı Reflektörlü İş Parkası.png",
    "img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png",
    "img/Reflektörlü Mavi-Lime İş Elbisesi.png",
    "img/Arka Görünüm Reflektif İş Elbisesi.png",
    "img/Mavi ve Neon Sarı Reflektif İş Tulumu.png",
    "img/Kobalt Mavi ve Neon Sarı İş Montu.png",
    "img/Mavi Sarı Reflektörlü İş Montu.png",
    "img/Yandan Görünüm Hi-Vis İş Montu.png",
    "img/Yüksek Görünürlüklü İş Pantolonu.png",
    "img/Gri-Mavi Reflektif İş Elbisesi.png",
    "img/Gri Mavi Reflektif İş Tulumu.png",
    "img/Gri Reflektörlü İş Üniforması Arkadan Görünüm.png",
    "img/Reflektörlü Gri-Mavi İş Montu.png",
    "img/Çelik Grisi Reflektörlü İş Ceketi.png",
    "img/Reflektör Şeritli İş Pantolonu.png",
    "img/Mavi Reflektif İş Üniforması.png",
    "img/Mavi Reflektif İş Üniforması Seti.png",
    "img/Mavi Reflektörlü İş Üniforması-2.png",
    "img/Mavi Reflektörlü İş Güvenliği Montu.png",
    "img/Donanımlı Lacivert İş Pantolonu.png",
    "img/Lacivert 1.png",
    "img/Lacivert 2.png",
    "img/Lacivert 3.png",
    "img/Lacivert 4.png",
    "img/Lacivert 5.png",
    "img/Lacivert 6.png",
    "img/Lacivert 7.png",
    "img/Lacivert 8.png",
    "img/Lacivert 9.png"
];

window.loadProducts = async function() {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;

    try {
        let products = [];
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data, error } = await supabaseClient.from('Products').select('*').order('Id');
            if (!error && data && data.length > 0) {
                products = data;
            }
        }

        tbody.innerHTML = '';
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Kayıtlı ürün bulunamadı.</td></tr>';
            return;
        }

        products.forEach(p => {
            const id = p.Id || p.id;
            const name = (typeof p.Name === 'object' && p.Name !== null) ? (p.Name.tr || p.Name.en) : (p.Name || p.name);
            const subtitle = (typeof p.Subtitle === 'object' && p.Subtitle !== null) ? (p.Subtitle.tr || '') : (p.Subtitle || '');
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
                    <td style="font-weight: 700; color: var(--brand-gold);">#${id}</td>
                    <td>
                        <div class="product-cell">
                            <img src="../${imgPath}" alt="${name}" class="product-thumb" onerror="this.src='../img/logo_gri.webp'">
                            <div>
                                <div class="product-info-title">${name}</div>
                                <div class="product-info-subtitle">Kod: ${articleCode} | ${subtitle}</div>
                            </div>
                        </div>
                    </td>
                    <td>${standardsHtml}</td>
                    <td style="font-weight: 700; font-size: 1rem;">€${price}</td>
                    <td>${stockBadge}</td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary btn-sm" onclick="openEditProductModal(${id})"><i class="fa-solid fa-pen-to-square"></i> Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${id})"><i class="fa-solid fa-trash"></i></button>
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

// Open Add Product Modal
window.openAddProductModal = function() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.add('active');
        populateImagePicker('newProductImagePicker', 'img/Neon Sarı Reflektif Güvenlik Parkası.png');
    }
};

window.closeAddProductModal = function() {
    const modal = document.getElementById('addProductModal');
    if (modal) modal.classList.remove('active');
};

function populateImagePicker(selectId, selectedVal) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '';
    CURATED_IMAGES.forEach(img => {
        const opt = document.createElement('option');
        opt.value = img;
        opt.textContent = img.replace('img/', '');
        if (img === selectedVal) opt.selected = true;
        select.appendChild(opt);
    });
}

// Save New Product
window.saveProduct = async function(e) {
    e.preventDefault();
    const name = document.getElementById('newProductName').value.trim();
    const subtitle = document.getElementById('newProductSubtitle').value.trim();
    const price = Number(document.getElementById('newProductPrice').value);
    const stock = parseInt(document.getElementById('newProductStock').value) || 0;
    const articleCode = document.getElementById('newProductArticleCode').value.trim();
    const certificateCode = document.getElementById('newProductCertificateCode').value.trim();
    const imageUrl = document.getElementById('newProductImagePicker').value;

    const checkedStandards = Array.from(document.querySelectorAll('input[name="newStandards"]:checked')).map(cb => cb.value);

    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data, error } = await supabaseClient.from('Products').insert([{
                Name: name,
                Subtitle: subtitle,
                Description: subtitle,
                Price: price,
                StockQuantity: stock,
                ArticleCode: articleCode,
                CertificateCode: certificateCode,
                Standards: JSON.stringify(checkedStandards),
                ImageUrl: imageUrl,
                SubImages: JSON.stringify([imageUrl]),
                Colors: JSON.stringify(["Standart"]),
                Features: JSON.stringify(["Alev Geciktirici & Antistatik Kumaş", "Ergonomik Tasarım", "Yüksek Güvenlik Standardı"])
            }]).select();

            if (error) throw error;

            window.showAdminToast('Yeni ürün Supabase veritabanına eklendi!', 'success');
            closeAddProductModal();
            document.getElementById('addProductForm').reset();
            loadProducts();
            return;
        }
    } catch (err) {
        console.error('saveProduct error:', err);
        window.showAdminToast('Ürün eklenirken hata: ' + (err.message || err), 'error');
    }
};

// Open Edit Product Modal
window.openEditProductModal = async function(id) {
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data: product, error } = await supabaseClient.from('Products').select('*').eq('Id', parseInt(id)).single();
            if (error || !product) throw new Error('Ürün bulunamadı');

            document.getElementById('editProductId').value = product.Id || product.id;
            document.getElementById('editProductName').value = product.Name || product.name || '';
            document.getElementById('editProductSubtitle').value = product.Subtitle || product.subtitle || '';
            document.getElementById('editProductPrice').value = product.Price || product.price || 0;
            document.getElementById('editProductStock').value = product.StockQuantity || product.stockQuantity || 0;
            document.getElementById('editProductArticleCode').value = product.ArticleCode || product.article_code || '';
            document.getElementById('editProductCertificateCode').value = product.CertificateCode || product.certificate_code || '';

            populateImagePicker('editProductImagePicker', product.ImageUrl || 'img/Neon Sarı Reflektif Güvenlik Parkası.png');
            
            // Check standards
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
    } catch (e) {
        console.error('openEditProductModal error:', e);
        window.showAdminToast('Ürün detayları alınamadı.', 'error');
    }
};

window.closeEditProductModal = function() {
    const modal = document.getElementById('editProductModal');
    if (modal) modal.classList.remove('active');
};

// Submit Edit Product
window.submitEditProduct = async function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editProductId').value);
    const name = document.getElementById('editProductName').value.trim();
    const subtitle = document.getElementById('editProductSubtitle').value.trim();
    const price = Number(document.getElementById('editProductPrice').value);
    const stock = parseInt(document.getElementById('editProductStock').value) || 0;
    const articleCode = document.getElementById('editProductArticleCode').value.trim();
    const certificateCode = document.getElementById('editProductCertificateCode').value.trim();
    const imageUrl = document.getElementById('editProductImagePicker').value;

    const checkedStandards = Array.from(document.querySelectorAll('input[name="editStandards"]:checked')).map(cb => cb.value);

    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { error } = await supabaseClient.from('Products').update({
                Name: name,
                Subtitle: subtitle,
                Price: price,
                StockQuantity: stock,
                ArticleCode: articleCode,
                CertificateCode: certificateCode,
                Standards: JSON.stringify(checkedStandards),
                ImageUrl: imageUrl
            }).eq('Id', id);

            if (error) throw error;

            window.showAdminToast('Ürün başarıyla güncellendi!', 'success');
            closeEditProductModal();
            loadProducts();
            return;
        }
    } catch (err) {
        console.error('submitEditProduct error:', err);
        window.showAdminToast('Güncellenirken hata oluştu: ' + (err.message || err), 'error');
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
// 6. ORDERS MANAGEMENT
// ==========================================================================
window.loadOrders = async function() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;

    try {
        let orders = [];
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data, error } = await supabaseClient.from('Orders').select('*').order('Id', { ascending: false });
            if (!error && data) orders = data;
        }

        tbody.innerHTML = '';
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Sipariş kaydı bulunmuyor.</td></tr>';
            return;
        }

        orders.forEach(o => {
            const id = o.Id || o.id;
            const customer = o.CustomerName || o.customerName || 'Bilinmiyor';
            const phone = o.CustomerPhone || o.customerPhone || '-';
            const dateStr = o.OrderDate ? new Date(o.OrderDate).toLocaleDateString('tr-TR') : '-';
            const total = Number(o.TotalAmount || 0).toFixed(2);
            const status = o.Status || 'Talep Alındı';

            const statusOptions = ['Talep Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Tamamlandı', 'İptal Edildi'];
            const selectOptionsHtml = statusOptions.map(opt => `<option value="${opt}" ${opt === status ? 'selected' : ''}>${opt}</option>`).join('');

            tbody.innerHTML += `
                <tr>
                    <td style="font-weight: 700; color: var(--brand-gold);">#${id}</td>
                    <td>
                        <div style="font-weight: 600;">${customer}</div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);"><i class="fa-solid fa-phone" style="font-size: 0.7rem;"></i> ${phone}</div>
                    </td>
                    <td style="color: var(--text-secondary);">${dateStr}</td>
                    <td style="font-weight: 700; font-size: 1rem;">€${total}</td>
                    <td>
                        <select class="form-select" style="padding: 6px 10px; font-size: 0.8rem; width: 140px;" onchange="updateOrderStatus(${id}, this.value)">
                            ${selectOptionsHtml}
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails(${id})"><i class="fa-regular fa-eye"></i> Detay</button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error('loadOrders error:', e);
        window.showAdminToast('Siparişler yüklenemedi.', 'error');
    }
};

window.updateOrderStatus = async function(orderId, newStatus) {
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { error } = await supabaseClient.from('Orders').update({ Status: newStatus }).eq('Id', orderId);
            if (error) throw error;
            window.showAdminToast(`Sipariş #${orderId} durumu "${newStatus}" olarak güncellendi.`, 'success');
        }
    } catch (e) {
        console.error('updateOrderStatus error:', e);
        window.showAdminToast('Durum güncellenirken hata oluştu.', 'error');
    }
};

window.viewOrderDetails = async function(orderId) {
    try {
        let items = [];
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data } = await supabaseClient.from('OrderItems').select('*').eq('OrderId', orderId);
            if (data) items = data;
        }

        let modal = document.getElementById('orderDetailsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'orderDetailsModal';
            modal.className = 'custom-modal-overlay';
            modal.innerHTML = `
                <div class="custom-modal" style="width: 500px;">
                    <div class="modal-header">
                        <h3>Sipariş Kalemleri <span id="modalOrderId" style="color: var(--brand-gold);"></span></h3>
                        <button class="modal-close-btn" onclick="document.getElementById('orderDetailsModal').classList.remove('active')"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body" id="modalOrderItemsBody" style="padding: 20px;"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById('modalOrderId').textContent = `#${orderId}`;
        const itemsBody = document.getElementById('modalOrderItemsBody');
        
        if (items.length === 0) {
            itemsBody.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Bu siparişte kayıtlı kalem bulunmuyor.</p>';
        } else {
            itemsBody.innerHTML = items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-subtle);">
                    <div>
                        <div style="font-weight: 600;">Ürün ID: #${item.ProductId}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Birim Fiyat: €${Number(item.UnitPrice || 0).toFixed(2)}</div>
                    </div>
                    <div style="text-align: right;">
                        <span class="badge badge-info">${item.Quantity} Adet</span>
                        <div style="font-weight: 700; margin-top: 4px;">€${(Number(item.UnitPrice || 0) * Number(item.Quantity || 1)).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
        }

        modal.classList.add('active');
    } catch (e) {
        console.error('viewOrderDetails error:', e);
        window.showAdminToast('Sipariş detayları alınamadı.', 'error');
    }
};

// ==========================================================================
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
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="admin-avatar" style="width: 36px; height: 36px; font-size: 0.9rem;">${name.charAt(0).toUpperCase()}</div>
                            <div>
                                <div style="font-weight: 600; color: var(--text-primary);">${name}</div>
                                <div style="font-size: 0.75rem; color: var(--brand-gold);">B2B Kurumsal Müşteri</div>
                            </div>
                        </div>
                    </td>
                    <td style="color: var(--text-secondary);"><i class="fa-regular fa-envelope" style="margin-right: 6px; font-size: 0.8rem; color: var(--text-muted);"></i>${email}</td>
                    <td style="color: var(--text-secondary);"><i class="fa-solid fa-phone" style="margin-right: 6px; font-size: 0.8rem; color: var(--text-muted);"></i>${phone}</td>
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