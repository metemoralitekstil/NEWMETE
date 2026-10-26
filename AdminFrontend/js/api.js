// API Base URL - Canlı yayına alırken 'https://metemorali-backend-api.onrender.com' gibi kendi Render API URL'nizi yazın.
var API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5055'
    : 'https://metemorali-backend-api.onrender.com') + '/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
                    try {
                        const { data, error } = await supabaseClient
                            .from('AdminUsers')
                            .select('*')
                            .eq('Username', username)
                            .maybeSingle();

                        if (!error && data) {
                            const inputHash = await sha256(password);
                            const dbHash = data.PasswordHash || data.passwordHash;
                            if (inputHash && dbHash && inputHash.toLowerCase() === dbHash.toLowerCase()) {
                                localStorage.setItem('adminToken', 'supabase-session-token-' + username);
                                window.location.href = 'dashboard.html';
                                return;
                            } else {
                                document.getElementById('errorMsg').style.display = 'block';
                                return;
                            }
                        }
                    } catch (sErr) {
                        console.warn("Supabase bağlantısı kurulamadı, alternatif giriş deneniyor...", sErr);
                    }
                }

                // Fallback to local API
                try {
                    const res = await fetch(API_BASE_URL + '/Auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        localStorage.setItem('adminToken', data.token);
                        window.location.href = 'dashboard.html';
                        return;
                    }
                } catch (apiErr) {
                    console.warn("API bağlantısı kurulamadı, yerel doğrulama deneniyor...", apiErr);
                }

                // Doğrulama başarısız olduğunda hata göster
                document.getElementById('errorMsg').style.display = 'block';
            } catch (err) {
                console.error(err);
                document.getElementById('errorMsg').style.display = 'block';
            }
        });
    }
});

async function loadDashboard() {
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data: products } = await supabaseClient.from('Products').select('StockQuantity, Price');
            const { data: orders } = await supabaseClient.from('Orders').select('*').order('OrderDate', { ascending: false });

            if (products && orders) {
                const totalProducts = products.length;
                const totalStock = products.reduce((acc, p) => acc + (p.StockQuantity || 0), 0);
                const totalOrders = orders.length;
                const totalRevenue = orders
                    .filter(o => o.Status === 'Tamamlandı')
                    .reduce((acc, o) => acc + Number(o.TotalAmount || 0), 0);

                document.getElementById('totalProducts').textContent = totalProducts;
                document.getElementById('totalStock').textContent = totalStock;
                document.getElementById('totalOrders').textContent = totalOrders;
                
                const revEl = document.getElementById('totalRevenue');
                if (revEl) {
                    revEl.textContent = totalRevenue.toFixed(2) + ' €';
                }

                const tbody = document.querySelector('#recentOrdersTable tbody');
                tbody.innerHTML = '';
                orders.slice(0, 5).forEach(o => {
                    tbody.innerHTML += `<tr>
                        <td>#${o.Id || o.id}</td>
                        <td>${o.CustomerName || o.customerName}</td>
                        <td>${new Date(o.OrderDate || o.orderDate).toLocaleDateString()}</td>
                        <td>${o.TotalAmount || o.totalAmount} €</td>
                        <td>${o.Status || o.status}</td>
                    </tr>`;
                });
                return;
            }
        }

        // Fallback to local API
        const res = await fetch(API_BASE_URL + '/Dashboard/summary', { headers: getAuthHeaders() });
        if (res.status === 401) return logout();
        const data = await res.json();
        
        document.getElementById('totalProducts').textContent = data.totalProducts;
        document.getElementById('totalStock').textContent = data.totalStock;
        document.getElementById('totalOrders').textContent = data.totalOrders;
        
        const revEl = document.getElementById('totalRevenue');
        if (revEl) {
            revEl.textContent = (data.totalRevenue || 0).toFixed(2) + ' €';
        }
        
        const tbody = document.querySelector('#recentOrdersTable tbody');
        tbody.innerHTML = '';
        data.recentOrders.forEach(o => {
            tbody.innerHTML += `<tr>
                <td>#${o.id}</td>
                <td>${o.customerName}</td>
                <td>${new Date(o.orderDate).toLocaleDateString()}</td>
                <td>${o.totalAmount} €</td>
                <td>${o.status}</td>
            </tr>`;
        });
    } catch (e) { console.error(e); }
}

async function loadProducts() {
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data: products } = await supabaseClient.from('Products').select('*').order('Id');
            if (products) {
                const tbody = document.querySelector('#productsTable tbody');
                tbody.innerHTML = '';
                products.forEach(p => {
                    tbody.innerHTML += `<tr>
                        <td>${p.Id || p.id}</td>
                        <td>${p.Name || p.name}</td>
                        <td>${Number(p.Price || p.price).toFixed(2)} €</td>
                        <td>${p.StockQuantity || p.stockQuantity}</td>
                        <td>
                            <button class="btn btn-sm" onclick="openEditProductModal(${p.Id || p.id})">Düzenle</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.Id || p.id})">Sil</button>
                        </td>
                    </tr>`;
                });
                return;
            }
        }

        // Fallback to local API
        const res = await fetch(API_BASE_URL + '/Products', { 
            headers: getAuthHeaders(),
            cache: 'no-store'
        });
        if (res.status === 401) return logout();
        const products = await res.json();
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';
        products.forEach(p => {
            tbody.innerHTML += `<tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.price} €</td>
                <td>${p.stockQuantity}</td>
                <td>
                    <button class="btn btn-sm" onclick="openEditProductModal(${p.id})">Düzenle</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Sil</button>
                </td>
            </tr>`;
        });
    } catch (e) { console.error(e); }
}

function deleteProduct(id) {
    document.getElementById('deleteTargetId').value = id;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.add('active');
}

function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.remove('active');
}

async function executeDeleteProduct() {
    const id = document.getElementById('deleteTargetId').value;
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { error } = await supabaseClient.from('Products').delete().eq('Id', parseInt(id));
            if (!error) {
                closeDeleteConfirmModal();
                loadProducts();
                return;
            }
        }

        // Fallback to local API
        const res = await fetch(API_BASE_URL + '/Products/' + id, { method: 'DELETE', headers: getAuthHeaders() });
        if(res.ok) {
            closeDeleteConfirmModal();
            loadProducts();
        }
    } catch (e) { console.error(e); }
}

async function openEditProductModal(id) {
    try {
        let product = null;

        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data } = await supabaseClient.from('Products').select('*').eq('Id', parseInt(id)).maybeSingle();
            if (data) {
                product = {
                    id: data.Id || data.id,
                    name: data.Name || data.name,
                    subtitle: data.Subtitle || data.subtitle,
                    price: Number(data.Price || data.price),
                    stockQuantity: data.StockQuantity || data.stockQuantity,
                    articleCode: data.ArticleCode || data.article_code || data.articleCode,
                    certificateCode: data.CertificateCode || data.certificate_code || data.certificateCode,
                    standards: data.Standards || data.standards,
                    features: data.Features || data.features,
                    colors: data.Colors || data.colors
                };
            }
        }

        if (!product) {
            const res = await fetch(API_BASE_URL + '/Products/' + id);
            if (!res.ok) throw new Error('Ürün yüklenemedi');
            product = await res.json();
        }
        
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductSubtitle').value = product.subtitle || '';
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductStock').value = product.stockQuantity;
        document.getElementById('editProductArticleCode').value = product.articleCode || '';
        document.getElementById('editProductCertificateCode').value = product.certificateCode || '';
        
        const editCheckboxes = document.querySelectorAll('input[name="editStandards"]');
        let standards = [];
        try {
            if (product.standards) {
                standards = typeof product.standards === 'string' ? JSON.parse(product.standards) : product.standards;
            }
        } catch(e) {}
        editCheckboxes.forEach(cb => {
            cb.checked = Array.isArray(standards) && standards.includes(cb.value);
        });
        
        document.getElementById('editProductImage').value = "";
    
        // reset edit sub images
        const editSubContainer = document.getElementById('editSubImagesContainer');
        editSubContainer.innerHTML = `
            <div style="display: flex; align-items: center;">
                <input type="file" class="edit-sub-image-input" accept="image/*" style="flex: 1; padding: 5px;">
                <i class="fa-solid fa-trash" style="color: red; margin-left: 10px; cursor: pointer;" onclick="this.parentElement.remove()"></i>
            </div>
        `;
        
        const featuresContainer = document.getElementById('editFeaturesContainer');
        featuresContainer.innerHTML = '';
        
        let features = [];
        try { features = typeof product.features === 'string' ? JSON.parse(product.features) : product.features; } catch(e) {}
        if(features && features.length > 0) {
            features.forEach(f => addEditFeatureInput(f));
        }
        
        const colorsContainer = document.getElementById('editColorsContainer');
        colorsContainer.innerHTML = '';
        
        let colors = [];
        try { colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors; } catch(e) {}
        if(colors && colors.length > 0) {
            colors.forEach(c => addEditColorInput(c));
        }
        
        const modal = document.getElementById('editProductModal');
        if (modal) modal.classList.add('active');
    } catch (e) {
        console.error(e);
        alert('Ürün detayları alınamadı.');
    }
}

function addEditColorInput(value = '') {
    const container = document.getElementById('editColorsContainer');
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.innerHTML = `
        <span style="font-weight: bold; margin-right: 10px; width: 100px; color: #fff;">Renk:</span>
        <input type="text" class="edit-color-input" value="${value.replace(/"/g, '&quot;')}" required style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.15); background: #1e293b; color: #fff;">
        <i class="fa-solid fa-trash" style="color: red; margin-left: 10px; cursor: pointer;" onclick="this.parentElement.remove()"></i>
    `;
    container.appendChild(div);
}

function addEditFeatureInput(value = '') {
    const container = document.getElementById('editFeaturesContainer');
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.innerHTML = `
        <span style="font-weight: bold; margin-right: 10px; width: 100px; color: #fff;">Açıklama:</span>
        <input type="text" class="edit-feature-input" value="${value.replace(/"/g, '&quot;')}" required style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.15); background: #1e293b; color: #fff;">
        <i class="fa-solid fa-trash" style="color: red; margin-left: 10px; cursor: pointer;" onclick="this.parentElement.remove()"></i>
    `;
    container.appendChild(div);
}

function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    if (modal) modal.classList.remove('active');
}

async function submitEditProduct(e) {
    e.preventDefault();
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const subtitle = document.getElementById('editProductSubtitle').value;
    const price = Number(document.getElementById('editProductPrice').value);
    const stock = parseInt(document.getElementById('editProductStock').value);
    const articleCode = document.getElementById('editProductArticleCode').value;
    const certificateCode = document.getElementById('editProductCertificateCode').value;
    const checkedEditStandards = Array.from(document.querySelectorAll('input[name="editStandards"]:checked')).map(cb => cb.value);
    
    const fileInput = document.getElementById('editProductImage');
    const subImageInputs = document.querySelectorAll('.edit-sub-image-input');
    
    const featureInputs = document.querySelectorAll('.edit-feature-input');
    const features = [];
    featureInputs.forEach(input => {
        if(input.value.trim() !== '') features.push(input.value.trim());
    });

    const colorInputs = document.querySelectorAll('.edit-color-input');
    const colors = [];
    colorInputs.forEach(input => {
        if(input.value.trim() !== '') colors.push(input.value.trim());
    });

    if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
        try {
            const idVal = parseInt(id);
            const { data: curProd } = await supabaseClient.from('Products').select('ImageUrl, SubImages').eq('Id', idVal).single();
            
            let imageUrl = curProd ? curProd.ImageUrl : 'img/default.webp';
            if (fileInput.files.length > 0) {
                imageUrl = 'img/' + fileInput.files[0].name;
            }

            let subImagesArr = curProd && curProd.SubImages ? (typeof curProd.SubImages === 'string' ? JSON.parse(curProd.SubImages) : curProd.SubImages) : [];
            subImageInputs.forEach(input => {
                if(input.files.length > 0) {
                    subImagesArr.push('img/' + input.files[0].name);
                }
            });

            const updateData = {
                Name: name,
                Subtitle: subtitle,
                Price: price,
                StockQuantity: stock,
                Features: JSON.stringify(features),
                ArticleCode: articleCode,
                CertificateCode: certificateCode,
                Standards: JSON.stringify(checkedEditStandards),
                Colors: JSON.stringify(colors),
                ImageUrl: imageUrl,
                SubImages: JSON.stringify(subImagesArr)
            };

            const { error } = await supabaseClient.from('Products').update(updateData).eq('Id', idVal);
            if (!error) {
                closeEditProductModal();
                loadProducts();
                return;
            } else {
                throw error;
            }
        } catch (err) {
            console.error("Supabase update error: ", err);
            alert("Güncellenirken hata oluştu.");
            return;
        }
    }

    // Fallback to local API
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Subtitle', subtitle);
    formData.append('Description', '');
    formData.append('Price', price);
    formData.append('StockQuantity', stock);
    formData.append('Features', JSON.stringify(features));
    formData.append('ArticleCode', articleCode);
    formData.append('CertificateCode', certificateCode);
    formData.append('Standards', JSON.stringify(checkedEditStandards));
    formData.append('Colors', JSON.stringify(colors));

    if (fileInput.files.length > 0) {
        formData.append('ImageFile', fileInput.files[0]);
    }
    
    subImageInputs.forEach(input => {
        if(input.files.length > 0) {
            formData.append('SubImageFiles', input.files[0]);
        }
    });

    try {
        const res = await fetch(API_BASE_URL + '/Products/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            },
            body: formData
        });
        
        if (res.ok) {
            closeEditProductModal();
            loadProducts();
        } else {
            alert('Güncellenirken hata oluştu.');
        }
    } catch (err) {
        console.error(err);
        alert('Bağlantı hatası.');
    }
}

async function loadOrders() {
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { data: orders } = await supabaseClient.from('Orders').select('*').order('Id', { ascending: false });
            if (orders) {
                const tbody = document.querySelector('#ordersTable tbody');
                tbody.innerHTML = '';
                orders.forEach(o => {
                    const statusOptions = [
                        "Talep Alındı",
                        "Hazırlanıyor",
                        "Kargoya Verildi",
                        "Tamamlandı",
                        "İptal Edildi"
                    ];
                    
                    const oId = o.Id || o.id;
                    const oCustName = o.CustomerName || o.customerName;
                    const oCustPhone = o.CustomerPhone || o.customerPhone;
                    const oDate = o.OrderDate || o.orderDate;
                    const oTotal = o.TotalAmount || o.totalAmount;
                    const oStatus = o.Status || o.status;

                    let selectHtml = `<select class="status-select select-status-${getStatusClass(oStatus)}" onchange="changeOrderStatus(${oId}, this.value)">`;
                    statusOptions.forEach(opt => {
                        const selected = oStatus === opt ? 'selected' : '';
                        selectHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
                    });
                    selectHtml += `</select>`;

                    tbody.innerHTML += `<tr>
                        <td>#${oId}</td>
                        <td>
                            <strong>${oCustName}</strong><br>
                            <small style="color: #666;"><i class="fa-solid fa-phone"></i> ${oCustPhone || '-'}</small>
                        </td>
                        <td>${new Date(oDate).toLocaleString('tr-TR')}</td>
                        <td>${Number(oTotal).toFixed(2)} €</td>
                        <td>${selectHtml}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="viewOrderDetails(${oId})"><i class="fa-solid fa-eye"></i> Detay</button>
                        </td>
                    </tr>`;
                });
                return;
            }
        }

        // Fallback to local API
        const res = await fetch(API_BASE_URL + '/Orders', { headers: getAuthHeaders() });
        if (res.status === 401) return logout();
        const orders = await res.json();
        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = '';
        orders.forEach(o => {
            const statusOptions = [
                "Talep Alındı",
                "Hazırlanıyor",
                "Kargoya Verildi",
                "Tamamlandı",
                "İptal Edildi"
            ];
            
            let selectHtml = `<select class="status-select select-status-${getStatusClass(o.status)}" onchange="changeOrderStatus(${o.id}, this.value)">`;
            statusOptions.forEach(opt => {
                const selected = o.status === opt ? 'selected' : '';
                selectHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
            });
            selectHtml += `</select>`;

            tbody.innerHTML += `<tr>
                <td>#${o.id}</td>
                <td>
                    <strong>${o.customerName}</strong><br>
                    <small style="color: #666;"><i class="fa-solid fa-phone"></i> ${o.customerPhone || '-'}</small>
                </td>
                <td>${new Date(o.orderDate).toLocaleString('tr-TR')}</td>
                <td>${o.totalAmount} €</td>
                <td>${selectHtml}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewOrderDetails(${o.id})"><i class="fa-solid fa-eye"></i> Detay</button>
                </td>
            </tr>`;
        });
    } catch (e) { console.error(e); }
}

function getStatusClass(status) {
    switch (status) {
        case 'Talep Alındı': return 'pending';
        case 'Hazırlanıyor': return 'processing';
        case 'Kargoya Verildi': return 'shipped';
        case 'Tamamlandı': return 'completed';
        case 'İptal Edildi': return 'cancelled';
        default: return 'unknown';
    }
}

async function changeOrderStatus(id, newStatus) {
    try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const { error } = await supabaseClient.from('Orders').update({ Status: newStatus }).eq('Id', parseInt(id));
            if (!error) {
                loadOrders();
                return;
            }
        }

        // Fallback to local API
        const res = await fetch(API_BASE_URL + '/Orders/' + id + '/status', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: newStatus })
        });
        if (res.status === 401) return logout();
        if (res.ok) {
            loadOrders();
        } else {
            alert('Sipariş durumu güncellenirken hata oluştu.');
        }
    } catch (e) {
        console.error(e);
        alert('Bağlantı hatası.');
    }
}

async function viewOrderDetails(id) {
    try {
        let order = null;

        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            const idVal = parseInt(id);
            const { data: oData } = await supabaseClient.from('Orders').select('*').eq('Id', idVal).single();
            if (oData) {
                const { data: itemsData } = await supabaseClient.from('OrderItems').select('*').eq('OrderId', idVal);
                const { data: productsData } = await supabaseClient.from('Products').select('Id, Name');
                
                order = {
                    id: oData.Id || oData.id,
                    customerName: oData.CustomerName || oData.customerName,
                    customerPhone: oData.CustomerPhone || oData.customerPhone,
                    orderDate: oData.OrderDate || oData.orderDate,
                    totalAmount: oData.TotalAmount || oData.totalAmount,
                    status: oData.Status || oData.status,
                    orderItems: (itemsData || []).map(item => {
                        const prodId = item.ProductId || item.productId;
                        const prod = (productsData || []).find(p => (p.Id || p.id) === prodId);
                        return {
                            quantity: item.Quantity || item.quantity,
                            unitPrice: item.UnitPrice || item.unitPrice,
                            product: prod ? { name: prod.Name || prod.name } : null
                        };
                    })
                };
            }
        }

        if (!order) {
            const res = await fetch(API_BASE_URL + '/Orders/' + id, { headers: getAuthHeaders() });
            if (res.status === 401) return logout();
            order = await res.json();
        }
        
        let itemsHtml = '';
        if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach(item => {
                const prodName = item.product ? item.product.name : 'Silinmiş Ürün';
                itemsHtml += `
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.1); padding: 8px 0; color: #fff;">
                        <span>${prodName} x ${item.quantity}</span>
                        <span>${item.unitPrice} €</span>
                    </div>
                `;
            });
        } else {
            itemsHtml = '<p style="color: rgba(255, 255, 255, 0.6);">Ürün bilgisi yok.</p>';
        }

        let detailsModal = document.getElementById('orderDetailsModal');
        if (!detailsModal) {
            detailsModal = document.createElement('div');
            detailsModal.id = 'orderDetailsModal';
            detailsModal.className = 'custom-modal-overlay';
            document.body.appendChild(detailsModal);
        }
        
        detailsModal.innerHTML = `
            <div class="custom-modal" style="width: 450px; max-height: 90vh; overflow-y: auto;">
                <h3>Sipariş Detayı (#${order.id})</h3>
                <div style="text-align: left; margin: 15px 0; background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15); color: #fff;">
                    <p style="color: #fff; margin-bottom: 8px;"><strong>Müşteri:</strong> ${order.customerName}</p>
                    <p style="color: #fff; margin-bottom: 8px;"><strong>Telefon:</strong> ${order.customerPhone || '-'}</p>
                    <p style="color: #fff; margin-bottom: 8px;"><strong>Tarih:</strong> ${new Date(order.orderDate).toLocaleString('tr-TR')}</p>
                    <p style="color: #fff; margin-bottom: 15px;"><strong>Durum:</strong> ${order.status}</p>
                    <h4 style="margin-top: 15px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 5px; color: #fff;">Ürünler</h4>
                    ${itemsHtml}
                    <div style="text-align: right; margin-top: 15px; font-weight: bold; font-size: 1.1rem; color: var(--accent);">
                        Toplam: ${order.totalAmount} €
                    </div>
                </div>
                <div class="custom-modal-actions">
                    <button class="btn-cancel" onclick="document.getElementById('orderDetailsModal').classList.remove('active')">Kapat</button>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            detailsModal.classList.add('active');
        }, 10);
    } catch (e) {
        console.error(e);
        alert('Sipariş detayları alınamadı.');
    }
}


function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) modal.classList.add('active');
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('addProductForm').reset();
        
        document.getElementById('colorsContainer').innerHTML = '';
        document.getElementById('featuresContainer').innerHTML = '';
        
        const newSubContainer = document.getElementById('newSubImagesContainer');
        newSubContainer.innerHTML = `
            <div style="display: flex; align-items: center;">
                <input type="file" class="new-sub-image-input" accept="image/*" style="flex: 1; padding: 10px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; background: #1e293b; color: #fff;">
                <i class="fa-solid fa-trash" style="color: red; margin-left: 10px; cursor: pointer;" onclick="this.parentElement.remove()"></i>
            </div>
        `;
    }
}

function addSubImageInput(type) {
    const container = document.getElementById(type === 'new' ? 'newSubImagesContainer' : 'editSubImagesContainer');
    const inputClass = type === 'new' ? 'new-sub-image-input' : 'edit-sub-image-input';
    const padding = type === 'new' ? '10px' : '5px';
    const border = type === 'new' ? '1px solid rgba(255,255,255,0.15)' : 'none';
    const radius = type === 'new' ? '8px' : '0';
    const boxSizing = type === 'new' ? 'box-sizing: border-box;' : '';
    const bg = type === 'new' ? 'background: #1e293b; color: #fff;' : '';
    
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.innerHTML = `
        <input type="file" class="${inputClass}" accept="image/*" style="flex: 1; padding: ${padding}; border: ${border}; border-radius: ${radius}; ${boxSizing} ${bg}">
        <i class="fa-solid fa-trash" style="color: red; margin-left: 10px; cursor: pointer;" onclick="this.parentElement.remove()"></i>
    `;
    container.appendChild(div);
}

function addFeatureInput() {
    const container = document.getElementById('featuresContainer');
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.innerHTML = `
        <span style="font-weight: bold; margin-right: 10px; width: 100px; color: #fff;">Açıklama:</span>
        <input type="text" class="feature-input" required style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.15); background: #1e293b; color: #fff;">
        <i class="fa-solid fa-trash" style="color: red; margin-left: 10px; cursor: pointer;" onclick="this.parentElement.remove()"></i>
    `;
    container.appendChild(div);
}

function addColorInput(value = '') {
    const container = document.getElementById('colorsContainer');
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.innerHTML = `
        <span style="font-weight: bold; margin-right: 10px; width: 100px; color: #fff;">Renk:</span>
        <input type="text" class="color-input" value="${value.replace(/"/g, '&quot;')}" required style="flex: 1; padding: 8px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.15); background: #1e293b; color: #fff;">
        <i class="fa-solid fa-trash" style="color: red; margin-left: 10px; cursor: pointer;" onclick="this.parentElement.remove()"></i>
    `;
    container.appendChild(div);
}

function previewMainImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('mainImagePreview');
            img.src = e.target.result;
            
            document.getElementById('mainImagePlaceholder').style.display = 'none';
            document.getElementById('mainImagePreviewContainer').style.display = 'inline-block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function clearMainImage() {
    const input = document.getElementById('newProductImage');
    input.value = "";
    document.getElementById('mainImagePreview').src = "";
    
    document.getElementById('mainImagePreviewContainer').style.display = 'none';
    document.getElementById('mainImagePlaceholder').style.display = 'block';
}

async function saveProduct(e) {
    e.preventDefault();
    const name = document.getElementById('newProductName').value;
    const subtitle = document.getElementById('newProductSubtitle').value;
    const price = Number(document.getElementById('newProductPrice').value);
    const articleCode = document.getElementById('newProductArticleCode').value;
    const certificateCode = document.getElementById('newProductCertificateCode').value;
    const checkedNewStandards = Array.from(document.querySelectorAll('input[name="newStandards"]:checked')).map(cb => cb.value);
    
    const featureInputs = document.querySelectorAll('.feature-input');
    const features = [];
    featureInputs.forEach(input => {
        if(input.value.trim() !== '') features.push(input.value.trim());
    });
    
    const colorInputs = document.querySelectorAll('.color-input');
    const colors = [];
    colorInputs.forEach(input => {
        if(input.value.trim() !== '') colors.push(input.value.trim());
    });
    
    const fileInput = document.getElementById('newProductImage');
    const subImageInputs = document.querySelectorAll('.new-sub-image-input');

    if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
        try {
            let imageUrl = 'img/default.webp';
            if (fileInput.files.length > 0) {
                imageUrl = 'img/' + fileInput.files[0].name;
            }

            let subImagesArr = [];
            subImageInputs.forEach(input => {
                if(input.files.length > 0) {
                    subImagesArr.push('img/' + input.files[0].name);
                }
            });

            const insertData = {
                Name: name,
                Subtitle: subtitle,
                Description: '',
                Price: price,
                StockQuantity: 10,
                Features: JSON.stringify(features),
                ArticleCode: articleCode,
                CertificateCode: certificateCode,
                Standards: JSON.stringify(checkedNewStandards),
                Colors: JSON.stringify(colors),
                ImageUrl: imageUrl,
                SubImages: JSON.stringify(subImagesArr),
                CreatedAt: new Date().toISOString()
            };

            const { error } = await supabaseClient.from('Products').insert([insertData]);
            if (!error) {
                closeAddProductModal();
                loadProducts();
                return;
            } else {
                throw error;
            }
        } catch (err) {
            console.error("Supabase insert error: ", err);
            alert("Ürün eklenirken hata oluştu.");
            return;
        }
    }
    
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Subtitle', subtitle);
    formData.append('Description', '');
    formData.append('Price', price);
    formData.append('StockQuantity', 10);
    formData.append('Features', JSON.stringify(features));
    formData.append('ArticleCode', articleCode);
    formData.append('CertificateCode', certificateCode);
    formData.append('Standards', JSON.stringify(checkedNewStandards));
    formData.append('Colors', JSON.stringify(colors));
    
    if (fileInput.files.length > 0) {
        formData.append('ImageFile', fileInput.files[0]);
    }
    
    subImageInputs.forEach(input => {
        if(input.files.length > 0) {
            formData.append('SubImageFiles', input.files[0]);
        }
    });
    
    try {
        const res = await fetch(API_BASE_URL + '/Products', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            },
            body: formData
        });
        
        if (res.ok) {
            closeAddProductModal();
            loadProducts(); // Refresh list
        } else {
            const errText = await res.text();
            console.error("API Error Response: ", errText);
            alert('Ürün eklenirken bir hata oluştu: ' + errText);
        }
    } catch (err) {
        console.error(err);
        alert('API Bağlantı hatası!');
    }
}