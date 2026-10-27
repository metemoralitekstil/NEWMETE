/**
 * MeteMorali - User Dashboard & Orders Module
 * Handles profile management, order history, live tracking, and bank transfer notifications.
 * Loaded on hesabim.html
 */

(function () {
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

    function translateOrderStatus(status) {
        if (!status) return t('status_talep_alindi', 'Talep Alındı');
        const s = status.toLowerCase();
        if (s.includes('whatsapp')) {
            return t('status_whatsapp_order', 'Talep Alındı (WhatsApp)');
        }
        if (s.includes('iptal') || s.includes('cancel')) {
            return t('status_cancelled', 'İptal Edildi');
        }
        if (s.includes('teslim') || s.includes('tamam') || s.includes('deliv')) {
            return t('status_teslim_edildi', 'Teslim Edildi');
        }
        if (s.includes('kargo') || s.includes('ship')) {
            return t('status_kargoda', 'Kargoya Verildi');
        }
        if (s.includes('hazır') || s.includes('hazir') || s.includes('prep') || s.includes('onay')) {
            return t('status_hazirlaniyor', 'Hazırlanıyor');
        }
        return t('status_talep_alindi', 'Talep Alındı');
    }

    function getStatusStep(status) {
        const s = (status || '').toLowerCase();
        if (s.includes('teslim') || s.includes('tamam') || s.includes('deliv')) return 4;
        if (s.includes('kargo') || s.includes('yolda') || s.includes('ship')) return 3;
        if (s.includes('hazır') || s.includes('hazir') || s.includes('onay') || s.includes('prep')) return 2;
        return 1;
    }

    // Toggle Order Details Card
    window.toggleOrderDetails = function (cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.classList.toggle('expanded');
        }
    };

    // Render User Orders List
    async function renderUserOrders() {
        const container = document.querySelector('.luxury-order-list');
        if (!container) return;

        const lang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
        const user = JSON.parse(localStorage.getItem('metemorali_user') || 'null');
        const ordersJson = localStorage.getItem('metemorali_orders');
        let orders = ordersJson ? JSON.parse(ordersJson) : [];

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
                        <img src="${item.image || 'img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png'}" alt="${item.title || 'Ürün'}" class="order-item-thumb">
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
                                <span class="order-status-badge status-${statusStep}">${translateOrderStatus(order.status)}</span>
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
                                    <i class="fa-brands fa-whatsapp"></i> ${t('order_support_whatsapp', 'WhatsApp ile İletişime Geç')}
                                </a>
                            </div>
                        </div>
                    </div>
                `;

                container.innerHTML += orderCardHtml;
            });
        };

        renderOrderCards(orders);

        // Async sync from Supabase if client is ready
        const client = window.supabaseClient;
        if (client && user) {
            try {
                const phone = user.phone || (user.type === 'phone' ? user.value : '');
                const name = user.name || '';
                const email = user.email || (user.type === 'email' ? user.value : '');

                let filterArr = [];
                if (phone) filterArr.push(`CustomerPhone.eq.${phone}`);
                if (name && name !== email) filterArr.push(`CustomerName.eq.${name}`);

                let query = client.from('Orders').select('*');
                if (filterArr.length > 0) {
                    query = query.or(filterArr.join(','));
                }

                const { data: dbOrders, error: orderErr } = await query.order('Id', { ascending: false });
                if (!orderErr && dbOrders && dbOrders.length > 0) {
                    const orderIds = dbOrders.map(o => o.Id || o.id);
                    const { data: dbItems } = await client.from('OrderItems').select('*').in('OrderId', orderIds);

                    const mergedOrders = [...orders];
                    dbOrders.forEach(dbOrder => {
                        const dbOrderId = (dbOrder.Id || dbOrder.id).toString();
                        const existingIdx = mergedOrders.findIndex(o => (o.apiId && o.apiId.toString() === dbOrderId) || o.id === dbOrderId || o.id === `MM-${dbOrderId}`);

                        const matchingItems = (dbItems || []).filter(item => (item.OrderId || item.orderId) == dbOrderId);
                        const formattedItems = matchingItems.map(item => {
                            const prodId = item.ProductId || item.productId;
                            const mock = (typeof MOCK_PRODUCTS !== 'undefined' ? MOCK_PRODUCTS.find(p => p.id == prodId) : null);
                            const pTitle = mock ? (typeof mock.name === 'object' ? (mock.name[lang] || mock.name['tr']) : mock.name) : `Ürün #${prodId}`;
                            const pImg = mock ? mock.imageUrl : 'img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png';
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
                                    image: 'img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png'
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
    window.renderUserOrders = renderUserOrders;

    // Bank Details / Checkout Success Banner
    function checkCheckoutSuccess() {
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('success')) return;

        const dashboardContent = document.querySelector('.dashboard-content');
        if (!dashboardContent || document.querySelector('.order-success-banner')) return;

        const localOrders = JSON.parse(localStorage.getItem('metemorali_orders')) || [];
        let orderIdVal = "";
        let orderAmountVal = "";
        if (localOrders.length > 0) {
            const lastOrder = localOrders[localOrders.length - 1];
            orderIdVal = lastOrder.id;
            orderAmountVal = `€${Number(lastOrder.totalAmount || 0).toFixed(2)}`;
        }

        const lang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
        const bankTrans = {
            tr: {
                title: "Siparişiniz Alındı! (Banka Havalesi/EFT)",
                desc: "Siparişinizi onaylamak için lütfen aşağıdaki banka hesabına havale/EFT yapınız. Açıklama kısmına sipariş kodunuzu yazmayı unutmayınız.",
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
                desc: "To confirm your order, please make a bank transfer to the account below with your order number in the description.",
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
                desc: "Um Ihre Bestellung zu bestätigen, überweisen Sie bitte den Betrag auf das unten angegebene Bankkonto mit Ihrer Bestellnummer im Verwendungszweck.",
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
                desc: "Для подтверждения заказа переведите сумму на банковский счет с указанием номера заказа в описании.",
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
        banner.style.cssText = 'flex-direction: column; align-items: flex-start; gap: 10px; position: relative;';

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
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    window.checkCheckoutSuccess = checkCheckoutSuccess;

    // Update Profile Information UI
    async function updateProfileUI() {
        const userJson = localStorage.getItem('metemorali_user');
        if (!userJson) return;

        let user = JSON.parse(userJson);
        const greeting = document.querySelector('.dashboard-greeting');
        if (greeting) greeting.textContent = `${t('hello_user', 'Merhaba')}, ${user.name || 'Değerli Müşterimiz'}`;

        const emailBadge = document.getElementById('dashboard-email-badge');
        if (emailBadge) {
            emailBadge.textContent = user.type === 'email' ? user.value : (user.phone || user.value || '');
        }

        const avatar = document.getElementById('profile-avatar-circle');
        if (avatar && user.name) {
            avatar.textContent = user.name.charAt(0).toUpperCase();
        }

        const nameInput = document.querySelector('#tab-profil input[type="text"]');
        const emailInput = document.querySelector('#tab-profil input[type="email"]');
        const telInput = document.querySelector('#tab-profil input[type="tel"]');

        if (nameInput) nameInput.value = user.name || '';
        if (emailInput) emailInput.value = user.type === 'email' ? user.value : '';

        if (telInput) {
            const rawPhone = user.type === 'phone' ? user.value : (user.phone || '');
            if (window.profileItiInstance) {
                window.profileItiInstance.setNumber(rawPhone);
            } else {
                telInput.value = rawPhone;
            }
        }

        renderUserOrders();
        checkCheckoutSuccess();
    }
    window.updateProfileUI = updateProfileUI;

    // Initialize Dashboard logic
    function initDashboard() {
        if (!window.location.pathname.includes('hesabim') && !document.querySelector('.dashboard-wrapper')) return;

        const user = localStorage.getItem('metemorali_user');
        if (!user) {
            setTimeout(() => {
                if (window.openLoginSidebar) window.openLoginSidebar();
            }, 300);
            return;
        }

        const wrapper = document.querySelector('.dashboard-wrapper');
        if (wrapper) wrapper.style.display = 'block';

        updateProfileUI();

        // Profile Form Submit
        const profileForm = document.querySelector('#tab-profil form');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const nameInput = document.querySelector('#tab-profil input[type="text"]');
                const telInput = document.querySelector('#tab-profil input[type="tel"]');
                const newPasswordInput = document.querySelector('#tab-profil input[type="password"]');

                const name = nameInput ? nameInput.value.trim() : '';
                let phone = telInput ? telInput.value.trim() : '';
                if (window.profileItiInstance) phone = window.profileItiInstance.getNumber();
                const newPassword = newPasswordInput ? newPasswordInput.value.trim() : '';

                if (window.showLoadingOverlay) window.showLoadingOverlay(true);

                try {
                    const client = window.supabaseClient;
                    if (client && client.auth) {
                        const { error } = await client.auth.updateUser({
                            data: { full_name: name, phone: phone }
                        });

                        if (error) {
                            if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                            if (window.showToast) window.showToast(error.message, 'error');
                            return;
                        }

                        if (newPassword) {
                            const { error: pwdErr } = await client.auth.updateUser({ password: newPassword });
                            if (pwdErr) {
                                if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                                if (window.showToast) window.showToast(pwdErr.message, 'error');
                                return;
                            }
                        }
                    }

                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);

                    const userJson = localStorage.getItem('metemorali_user');
                    let storedUser = userJson ? JSON.parse(userJson) : {};
                    storedUser.name = name;
                    storedUser.phone = phone;
                    localStorage.setItem('metemorali_user', JSON.stringify(storedUser));

                    updateProfileUI();
                    if (newPasswordInput) newPasswordInput.value = '';

                    if (window.showToast) {
                        window.showToast(t('profile_updated_success', 'Profil bilgileriniz başarıyla güncellendi!'), 'success');
                    }
                } catch (err) {
                    if (window.showLoadingOverlay) window.showLoadingOverlay(false);
                    if (window.showToast) {
                        window.showToast(t('connection_error', 'İşlem sırasında hata oluştu.'), 'error');
                    }
                }
            });
        }
    }

    document.addEventListener('componentsLoaded', initDashboard);
    document.addEventListener('DOMContentLoaded', initDashboard);
})();
