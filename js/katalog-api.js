// MeteMorali — Katalog Render Motoru
// Ürün verileri js/products.js dosyasından (window.MOCK_PRODUCTS) beslenir.


const EXAMINE_TRANSLATIONS = {
    tr: "İncele",
    en: "Examine",
    de: "Bekijken",
    ru: "Изучить",
    nl: "Bekijken",
    fr: "Examiner",
    it: "Esamina"
};

function getProductTranslation(product, field, lang) {
    if (!product) return '';
    const val = product[field];
    if (!val) return '';
    if (typeof val === 'object') {
        return val[lang] || val['tr'] || '';
    }
    return val;
}

function getProductFeatures(product, lang) {
    if (!product || !product.features) return [];
    let val = product.features;
    if (typeof val === 'object' && !Array.isArray(val)) {
        val = val[lang] || val['tr'] || [];
    }
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch (e) {
            return [];
        }
    }
    return Array.isArray(val) ? val : [];
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('catalog-grid')) {
        loadCatalogProducts();
    }
});

async function loadCatalogProducts() {
    try {
        const lang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
        let products = (typeof MOCK_PRODUCTS !== 'undefined') ? MOCK_PRODUCTS : (window.MOCK_PRODUCTS || []);
        
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            try {
                const { data, error } = await supabaseClient.from('Products').select('*').order('Id');
                if (data && data.length > 0) {
                    const mockList = (typeof MOCK_PRODUCTS !== 'undefined') ? MOCK_PRODUCTS : (window.MOCK_PRODUCTS || []);
                    products = data.map(p => {
                        const id = p.Id || p.id;
                        const mock = mockList.find(m => m.id === id);
                        return {
                            id: id,
                            name: (mock && mock.name) ? mock.name : (p.Name || p.name),
                            subtitle: (mock && mock.subtitle) ? mock.subtitle : (p.Subtitle || p.subtitle),
                            description: (mock && mock.description) ? mock.description : (p.Description || p.description),
                            features: (mock && mock.features) ? mock.features : (p.Features || p.features),
                            price: Number(p.Price || p.price),
                            imageUrl: p.ImageUrl || p.image_url || p.imageUrl || (mock && mock.imageUrl),
                            subImages: p.SubImages || p.sub_images || p.subImages || (mock && mock.subImages),
                            articleCode: p.ArticleCode || p.article_code || p.articleCode || (mock && mock.articleCode),
                            certificateCode: p.CertificateCode || p.certificate_code || p.certificateCode || (mock && mock.certificateCode),
                            standards: p.Standards || p.standards || (mock && mock.standards),
                            colors: p.Colors || p.colors || (mock && mock.colors)
                        };
                    });
                }
            } catch (err) {
                console.warn("Supabase'den ürünler çekilemedi, mock verilere geçiliyor.", err);
            }
        }

        const grid = document.getElementById('catalog-grid');
        grid.innerHTML = '';

        if (products.length === 0) {
            grid.innerHTML = '<p style="color: white; text-align: center; width: 100%;">Henüz ürün eklenmemiş.</p>';
            return;
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        products.forEach(p => {
            if (!p || !p.imageUrl || p.imageUrl.trim() === '') return;
            const rawName = getProductTranslation(p, 'name', lang) || '';
            const rawSubtitle = getProductTranslation(p, 'subtitle', lang) || '';
            const rawDesc = getProductTranslation(p, 'description', lang) || '';
            const examineBtnText = escapeHtml(EXAMINE_TRANSLATIONS[lang] || (window.i18n && window.i18n.t('examine')) || EXAMINE_TRANSLATIONS['tr']);

            // Determine category dynamically based on product ID
            let category = "welder";
            if (p.id === 1) category = "parka";
            else if (p.id === 2 || p.id === 6) category = "supervisor";

            const safeName = escapeHtml(rawName);
            const safeDesc = escapeHtml(rawSubtitle || rawDesc);
            const safeCategory = escapeHtml(category);
            const safeImg = encodeURI(p.imageUrl || '');
            const safeId = encodeURIComponent(p.id || '');
            const detailUrl = (lang && lang !== 'tr') ? `urun-detay.html?id=${safeId}&lang=${encodeURIComponent(lang)}` : `urun-detay.html?id=${safeId}`;

            // "Katalog" kartı tasarımı
            const cardHTML = `
            <div class="product-card" data-category="${safeCategory}" style="cursor: pointer;" onclick="if (!event.target.closest('a')) window.location.href='${detailUrl}'">
                <!-- Sparks Animasyonu -->
                <div class="sparks-container">
                    <div class="spark"></div><div class="spark"></div><div class="spark"></div><div class="spark"></div><div class="spark"></div>
                </div>
                
                <div class="card-image-wrapper">
                    <img src="${p.imageUrl || ''}" alt="${safeName}">
                </div>
                
                <div class="card-content">
                    <h3 class="card-title">${safeName}</h3>
                    <p class="card-desc">${safeDesc}</p>
                    <div class="card-actions" style="display: flex; justify-content: center; align-items: center; margin-top: 15px;">
                        <a href="${detailUrl}" class="btn btn-outline" style="width: 100%; text-align: center;">${examineBtnText}</a>
                    </div>
                </div>
            </div>`;

            grid.innerHTML += cardHTML;
        });

        // Dispatch custom event to notify main.js that product cards are loaded
        document.dispatchEvent(new CustomEvent('catalogProductsRendered'));

    } catch (err) {
        console.error('Ürünler yüklenirken hata oluştu:', err);
        const grid = document.getElementById('catalog-grid');
        grid.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Ürünler yüklenemedi.</p>';
    }
}

// Re-render when components and i18n finish loading
document.addEventListener('componentsLoaded', () => {
    if (document.getElementById('catalog-grid')) {
        loadCatalogProducts();
    }
});
