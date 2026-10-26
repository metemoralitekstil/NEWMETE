// MeteMorali — Ürün Detay Sayfası Mantığı (js/urun-detay.js)

let currentProductData = null;

// --- Miktar Güncelleme ---
function updateQty(change) {
    const input = document.getElementById('qty-input');
    if (!input) return;
    let val = parseInt(input.value) + change;
    if (val < 1) val = 1;
    input.value = val;
}

// --- Renk CSS Değeri ---
function getColorCssValue(colorName) {
    const name = colorName.trim().toLowerCase();
    const colorMap = {
        'turkuaz': '#00ced1',
        'turquoise': '#00ced1',
        'mavi': '#1e3799',
        'lacivert': '#0c2461',
        'sarı': '#f1c40f',
        'neon sarı': '#e2f10f',
        'turuncu': '#e67e22',
        'gri': '#7f8c8d',
        'çelik grisi': '#7f8c8d',
        'antrasit': '#2c3e50',
        'siyah': '#1e272e',
        'kırmızı': '#cf1b1b',
        'yeşil': '#27ae60',
        'haki': '#556b2f',
        'bordo': '#800020',
        'beyaz': '#ffffff',
        'bej': '#d7c4a7',
        'kahverengi': '#795548',
        'petrol': '#005f73',
        'petrol mavisi': '#005f73',
        'saks': '#2980b9',
        'mor': '#8e44ad',
        'pembe': '#e84393'
    };

    if (colorMap[name]) return colorMap[name];

    for (const [key, hex] of Object.entries(colorMap)) {
        if (name.includes(key)) return hex;
    }

    if (name.includes('/')) {
        const parts = name.split('/');
        const color1 = colorMap[parts[0].trim()] || '#ccc';
        const color2 = colorMap[parts[1].trim()] || '#ccc';
        return `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;
    }

    return '#00ced1';
}

// --- Sepete Ekleme ---
function addToCartAnimation() {
    if (!currentProductData) return;

    const activeSizeBtn = document.querySelector('.size-btn.active');
    const size = activeSizeBtn ? activeSizeBtn.textContent : 'Standart';
    const activeColorBtn = document.querySelector('.color-btn.active');
    const color = activeColorBtn ? activeColorBtn.getAttribute('data-color') : '';
    const qtyInput = document.getElementById('qty-input');
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    if (typeof addToCart === 'function') {
        addToCart({
            id: currentProductData.id.toString(),
            title: currentProductData.name,
            image: currentProductData.imageUrl,
            size: size,
            color: color,
            quantity: quantity,
            price: currentProductData.price
        });
    }
}

// --- Ana Görsel Değiştirme ---
function changeMainImage(src, element) {
    const mainImg = document.getElementById('main-image');
    if (!mainImg) return;
    mainImg.style.opacity = 0;
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = 1;
    }, 150);

    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    if (element) element.classList.add('active');
}

// --- Ürün Detayını Yükleme (Temiz & Hızlı Mimari) ---
async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');

    const loadingContainer = document.getElementById('loading-container');
    const detailContainer = document.getElementById('detail-container');
    const productsList = (typeof MOCK_PRODUCTS !== 'undefined') ? MOCK_PRODUCTS : (window.MOCK_PRODUCTS || []);

    if (!productId) {
        if (productsList.length > 0) {
            productId = String(productsList[0].id);
            try {
                window.history.replaceState({}, '', `?id=${productId}`);
            } catch (e) {}
        } else {
            if (loadingContainer) {
                loadingContainer.innerHTML = '<h2 style="width: 100%; text-align: center; color: red;">Ürün bulunamadı!</h2>';
            }
            return;
        }
    }

    try {
        let mockProduct = productsList.find(p => String(p.id) === String(productId));
        if (!mockProduct && productsList.length > 0) {
            mockProduct = productsList[0];
            productId = String(mockProduct.id);
        }
        let product = null;

        // 1. Supabase'den çek (ArticleCode veya ID ile)
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            try {
                let query = supabaseClient.from('Products').select('*');
                if (mockProduct && mockProduct.articleCode) {
                    query = query.eq('ArticleCode', mockProduct.articleCode);
                } else {
                    const idVal = parseInt(productId);
                    if (!isNaN(idVal)) {
                        query = query.eq('Id', idVal);
                    }
                }
                const { data, error } = await query.maybeSingle();
                if (data && !error) {
                    product = {
                        id: data.Id || data.id,
                        name: (mockProduct && mockProduct.name) ? mockProduct.name : (data.Name || data.name),
                        subtitle: (mockProduct && mockProduct.subtitle) ? mockProduct.subtitle : (data.Subtitle || data.subtitle),
                        description: (mockProduct && mockProduct.description) ? mockProduct.description : (data.Description || data.description),
                        features: (mockProduct && mockProduct.features) ? mockProduct.features : (data.Features || data.features),
                        price: Number(data.Price || data.price),
                        imageUrl: data.ImageUrl || data.image_url || data.imageUrl || (mockProduct && mockProduct.imageUrl),
                        subImages: data.SubImages || data.sub_images || data.subImages || (mockProduct && mockProduct.subImages),
                        articleCode: data.ArticleCode || data.article_code || data.articleCode || (mockProduct && mockProduct.articleCode),
                        certificateCode: data.CertificateCode || data.certificate_code || data.certificateCode || (mockProduct && mockProduct.certificateCode),
                        standards: data.Standards || data.standards || (mockProduct && mockProduct.standards),
                        colors: data.Colors || data.colors || (mockProduct && mockProduct.colors),
                        stockQuantity: (data.StockQuantity !== undefined ? data.StockQuantity : (data.stockQuantity !== undefined ? data.stockQuantity : (data.stock_quantity !== undefined ? data.stock_quantity : 100)))
                    };
                }
            } catch (err) {
                console.warn("Supabase'den ürün detayı çekilemedi:", err);
            }
        }

        // 2. Supabase yoksa veya bulunamadıysa doğrudan mockProduct (js/products.js) kullan
        if (!product && mockProduct) {
            product = mockProduct;
        }

        if (!product) {
            throw new Error('Ürün yüklenemedi');
        }

        currentProductData = product;

        // Bilgileri Doldur
        const lang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
        const productName = (typeof getProductTranslation === 'function') 
            ? getProductTranslation(product, 'name', lang) 
            : (product.name && product.name[lang] ? product.name[lang] : product.name);
            
        const productDesc = (typeof getProductTranslation === 'function')
            ? (getProductTranslation(product, 'subtitle', lang) || getProductTranslation(product, 'description', lang))
            : (product.subtitle || product.description || '');

        const titleEl = document.getElementById('product-title');
        const subtitleEl = document.getElementById('product-subtitle');
        const priceEl = document.getElementById('product-price');

        if (titleEl) titleEl.textContent = productName;
        if (subtitleEl) subtitleEl.textContent = productDesc;
        if (priceEl) priceEl.textContent = '€' + (typeof product.price === 'number' ? product.price.toFixed(2) : product.price);

        // Dinamik SEO: Title + Meta Description + Canonical + OG Tags güncelle
        document.title = `${productName} - MeteMorali`;

        const metaDesc = document.querySelector('meta[name="description"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogImg = document.querySelector('meta[property="og:image"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        const twImg = document.querySelector('meta[name="twitter:image"]');
        const canonicalLink = document.querySelector('link[rel="canonical"]');

        const currentProductUrl = `https://www.mete-morali.com/urun-detay?id=${product.id}`;

        if (metaDesc) metaDesc.setAttribute('content', productDesc);
        if (ogTitle) ogTitle.setAttribute('content', `${productName} | MeteMorali`);
        if (ogDesc) ogDesc.setAttribute('content', productDesc);
        if (ogImg && product.imageUrl) ogImg.setAttribute('content', `https://www.mete-morali.com/${product.imageUrl}`);
        if (ogUrl) ogUrl.setAttribute('content', currentProductUrl);
        if (twTitle) twTitle.setAttribute('content', `${productName} | MeteMorali`);
        if (twDesc) twDesc.setAttribute('content', productDesc);
        if (twImg && product.imageUrl) twImg.setAttribute('content', `https://www.mete-morali.com/${product.imageUrl}`);
        if (canonicalLink) canonicalLink.setAttribute('href', currentProductUrl);

        // Schema.org Product JSON-LD
        const existingSchema = document.getElementById('product-schema-ld');
        if (existingSchema) existingSchema.remove();

        const stockVal = (product.stockQuantity !== undefined && product.stockQuantity !== null) ? Number(product.stockQuantity) : 100;
        const isAvailable = stockVal > 0;

        const schemaScript = document.createElement('script');
        schemaScript.id = 'product-schema-ld';
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productName,
            "description": productDesc,
            "image": product.imageUrl ? `https://www.mete-morali.com/${product.imageUrl}` : undefined,
            "sku": product.articleCode || '',
            "brand": {
                "@type": "Brand",
                "name": "MeteMorali"
            },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "price": product.price,
                "priceValidUntil": "2027-12-31",
                "availability": isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "itemCondition": "https://schema.org/NewCondition",
                "url": currentProductUrl,
                "seller": {
                    "@type": "Organization",
                    "name": "MeteMorali"
                }
            }
        });
        document.head.appendChild(schemaScript);

        // Schema.org BreadcrumbList JSON-LD
        const existingBreadcrumbSchema = document.getElementById('breadcrumb-schema-ld');
        if (existingBreadcrumbSchema) existingBreadcrumbSchema.remove();
        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.id = 'breadcrumb-schema-ld';
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Ana Sayfa",
                    "item": "https://www.mete-morali.com/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Katalog",
                    "item": "https://www.mete-morali.com/katalog"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": productName,
                    "item": currentProductUrl
                }
            ]
        });
        document.head.appendChild(breadcrumbScript);

        // Sertifika ve Ürün Kodu Bilgileri
        const metaTranslations = {
            tr: { code: "Ürün Kodu", cert: "AB Tip Sertifikası" },
            en: { code: "Article Code", cert: "EU Type-Examination Certificate" },
            de: { code: "Artikelnummer", cert: "EU-Baumusterprüfbescheinigung" },
            ru: { code: "Артикул", cert: "Сертификат ЕС" },
            nl: { code: "Artikelcode", cert: "EU-typeonderzoekscertificaat" },
            fr: { code: "Code de l'article", cert: "Certificat d'examen UE" },
            it: { code: "Codice articolo", cert: "Certificato UE del tipo" }
        };
        const tMeta = metaTranslations[lang] || metaTranslations['tr'];
        const metaCodeEl = document.getElementById('meta-code-label');
        const metaCertEl = document.getElementById('meta-cert-label');
        const prodCodeEl = document.getElementById('product-code');
        const prodCertEl = document.getElementById('product-certificate');

        if (metaCodeEl) metaCodeEl.textContent = tMeta.code;
        if (metaCertEl) metaCertEl.textContent = tMeta.cert;
        if (prodCodeEl) prodCodeEl.textContent = product.articleCode || '-';
        if (prodCertEl) prodCertEl.textContent = product.certificateCode || '-';

        // Ana Resim
        const mainImageEl = document.getElementById('main-image');
        if (mainImageEl) mainImageEl.src = product.imageUrl || '';

        // Küçük Resimler (Galeri)
        const thumbnailsContainer = document.getElementById('thumbnails-container');
        let subImages = [];
        try {
            if (product.subImages) {
                subImages = (typeof product.subImages === 'string') ? JSON.parse(product.subImages) : product.subImages;
            }
        } catch(e) {}

        const currentMainImg = (product.imageUrl || '').normalize('NFC');
        let cleanSubImages = (subImages || []).map(u => (u || '').normalize('NFC')).filter(Boolean);
        cleanSubImages = [...new Set(cleanSubImages)];
        let validSubImages = cleanSubImages.filter(imgUrl => imgUrl !== currentMainImg);

        // Populate global image list for lightbox navigation
        lightboxImages = [currentMainImg, ...validSubImages].filter(Boolean);

        if (thumbnailsContainer) {
            if (validSubImages.length > 0) {
                let galleryHtml = `<div class="thumbnail active" onclick="changeMainImage('${product.imageUrl}', this)">
                                      <img loading="lazy" src="${product.imageUrl}" alt="Ana Resim">
                                   </div>`;

                validSubImages.forEach(imgUrl => {
                    galleryHtml += `<div class="thumbnail" onclick="changeMainImage('${imgUrl}', this)">
                                      <img loading="lazy" src="${imgUrl}" alt="Alt Resim">
                                    </div>`;
                });
                thumbnailsContainer.innerHTML = galleryHtml;
                thumbnailsContainer.style.display = 'flex';
            } else {
                thumbnailsContainer.style.display = 'none';
            }
        }

        // Tikli Özellikler (Features)
        const featuresList = document.getElementById('features-list');
        const features = (typeof getProductFeatures === 'function') 
            ? getProductFeatures(product, lang)
            : (product.features && product.features[lang] ? product.features[lang] : []);

        if (featuresList) {
            let featuresHtml = '';
            features.forEach(f => {
                featuresHtml += `<li><i class="fa-solid fa-check"></i> ${f}</li>`;
            });
            featuresList.innerHTML = featuresHtml;
        }

        // Koruma Standartları ve Sertifikalar
        const standardsContainer = document.getElementById('standards-section');
        const pictogramsGrid = document.getElementById('pictograms-grid');

        const standardsTitleTranslations = {
            tr: "Uluslararası Koruma Standartları & Sertifikalar",
            en: "International Protection Standards & Certifications",
            de: "Internationale Schutzstandards & Zertifikate",
            ru: "Международные стандарты защиты и сертификаты",
            nl: "Internationale Beschermingsnormen & Certificaten",
            fr: "Normes de Protection Internationales & Certificats",
            it: "Standard di Protezione Internazionali e Certificazioni"
        };

        const standardsTitleLabel = document.getElementById('standards-title-label');
        if (standardsTitleLabel) {
            standardsTitleLabel.textContent = standardsTitleTranslations[lang] || standardsTitleTranslations['tr'];
        }

        const STANDARDS_DATA = {
            "EN 11611": {
                svg: `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 15 L 80 15 L 80 50 C 80 68 50 85 50 85 C 50 85 20 68 20 50 Z" fill="#ffbe00" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 33 28 L 47 42" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <path d="M 45 40 L 49 44" stroke="#0f172a" stroke-width="6.5" stroke-linecap="round"/>
    <path d="M 48 43 L 56 51" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 26 65 H 74" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 48 65 H 56" stroke="#ffbe00" stroke-width="2" stroke-linecap="round"/>
    <path d="M 54 47 L 60 53 M 60 47 L 54 53" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
    <path d="M 43 55 L 47 59 M 47 55 L 43 59" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="36" cy="48" r="1.5" fill="#0f172a"/>
    <circle cx="64" cy="44" r="2" fill="#0f172a"/>
    <circle cx="62" cy="58" r="1.5" fill="#0f172a"/>
</svg>`,
                name: {
                    tr: "Kaynakçı Koruması",
                    en: "Welder Protection",
                    de: "Schweißerschutz",
                    ru: "Защита сварщика",
                    nl: "Lassersbescherming",
                    fr: "Protection du Soudeur",
                    it: "Protezione del Saldatore"
                },
                desc: {
                    tr: "Kaynak işlemlerinde sıçrayan erimiş metallere ve kıvılcımlara karşı koruma standardı.",
                    en: "Protection standard against molten metal splashes and sparks during welding operations.",
                    de: "Schutzstandard gegen geschmolzene Metallspritzer und Funken bei Schweißarbeiten.",
                    ru: "Стандарт защиты от брызг расплавленного металла и искр при сварочных работах.",
                    nl: "Beschermingsnorm tegen spatten van gesmolten metaal en vonken tijdens het lassen.",
                    fr: "Norme de protection contre les projections de métal fondu et les étincelles lors du soudage.",
                    it: "Standard di protezione contre les projections de métal fondu et les étincelles lors du soudage."
                }
            },
            "EN 11612": {
                svg: `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 15 L 80 15 L 80 50 C 80 68 50 85 50 85 C 50 85 20 68 20 50 Z" fill="#ffbe00" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 50 68 C 41 68, 33 60, 33 50 C 33 42, 39 36, 41 33 C 41 37, 43 41, 46 43 C 46 43, 47 28, 50 22 C 53 28, 54 43, 54 43 C 57 41, 59 37, 59 33 C 61 36, 67 42, 67 50 C 67 60, 59 68, 50 68 Z" fill="none" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 50 60 C 45 60, 41 55, 41 48 C 41 43, 45 40, 47 38 C 47 40, 48 42, 50 43 C 52 42, 53 40, 53 38 C 55 40, 59 43, 59 48 C 59 55, 55 60, 50 60 Z" fill="#0f172a"/>
</svg>`,
                name: {
                    tr: "Isı ve Alev Koruması",
                    en: "Heat & Flame Protection",
                    de: "Hitze- und Flammschutz",
                    ru: "Защита от тепла и пламени",
                    nl: "Hitte- ve Vlammenscherm",
                    fr: "Chaleur et Flammes",
                    it: "Calore e Fiamme"
                },
                desc: {
                    tr: "Açık alev teması, radyan ısı ve yüksek sıcaklıklar altında kumaşın alev almasını önleyen koruma.",
                    en: "Protection preventing the fabric from igniting under open flame contact, radiant heat, and high temperatures.",
                    de: "Schutz, der verhindert, dass sich das Gewebe bei kontakt mit offener Flamme, Strahlungswärme und hohen Temperaturen entzündet.",
                    ru: "Защита, предотвращающая воспламенение ткани при контакте с открытым пламенем, тепловом излучении и высоких температурах.",
                    nl: "Bescherming die voorkomt dat de stof ontbrandt bij contact met open vuur, stralingshitte en hoge temperaturen.",
                    fr: "Protection empêchant le tissu de s'enflammer au contact d'une flamme nue, d'une chaleur radiante et de températures élevées.",
                    it: "Protezione che impedisce al tessuto di infiammarsi a contatto con fiamme libere, calore radiante ed elevate temperature."
                }
            },
            "EN 1149-5": {
                svg: `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 15 L 80 15 L 80 50 C 80 68 50 85 50 85 C 50 85 20 68 20 50 Z" fill="#ffbe00" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 55 24 L 37 46 H 48 L 44 65 L 63 41 H 52 L 55 24 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`,
                name: {
                    tr: "Antistatik Koruma",
                    en: "Antistatic Protection",
                    de: "Antistatischer Schutz",
                    ru: "Антистатическая защита",
                    nl: "Antistatische Bescherming",
                    fr: "Protection Antistatique",
                    it: "Protezione Antistatica"
                },
                desc: {
                    tr: "Sürtünme kaynaklı elektriklenmeyi önleyerek patlayıcı/parlayıcı ortamlarda kıvılcım oluşmasını engelleyen karbon lif yapısı.",
                    en: "Carbon fiber structure that prevents spark formation in explosive/flammable environments by preventing static electricity buildup.",
                    de: "Kohlefaserstruktur, die Funkenbildung in explosionsgefährdeten/brennbaren Umgebungen durch Vermeidung statischer Elektrizität verhindert.",
                    ru: "Углеродная структура, предотвращающая искрообразование во взрывоопасных средах за счет исключения накопления статического электричества.",
                    nl: "Koolstofvezelstructuur die vonkvorming in explosieve/brandbare omgevingen voorkomt door statische elektriciteit te vermijden.",
                    fr: "Structure en fibre de carbone empêchant la formation d'étincelles dans les zones explosives en évitant l'électricité statique.",
                    it: "Struttura in fibre di carbonio che previene la formazione di scintille in ambienti esplosivi prevenendo l'accumulo di elettricità statica."
                }
            },
            "EN 20471": {
                svg: `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 15 L 80 15 L 80 50 C 80 68 50 85 50 85 C 50 85 20 68 20 50 Z" fill="#ffbe00" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 36 28 L 43 28 C 45 32 55 32 57 28 L 64 28 L 68 36 L 64 39 V 64 H 36 V 39 L 32 36 L 36 28 Z" fill="none" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 50 32 V 64" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="2 2"/>
    <path d="M 43 28 V 64" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 57 28 V 64" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 36 46 H 64" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 36 55 H 64" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,
                name: {
                    tr: "Yüksek Görünürlük",
                    en: "High Visibility",
                    de: "Hohe Sichtbarkeit",
                    ru: "Высокая видимость",
                    nl: "Hoge Zichtbaarheid",
                    fr: "Haute Visibilité",
                    it: "Alta Visibilità"
                },
                desc: {
                    tr: "Gündüz ve gece araç farı ışığı altında çalışanın en yüksek düzeyde fark edilmesini sağlayan reflektif donanım.",
                    en: "Reflective equipment ensuring maximum visibility of the worker under daylight and vehicle headlights at night.",
                    de: "Reflektierende Ausrüstung zur Gewährleistung maximaler Sichtbarkeit des Arbeiters bei Tageslicht und Scheinwerferlicht bei Nacht.",
                    ru: "Светоотражающая экипировка для максимальной видимости работника при дневном и ночном свете фар.",
                    nl: "Reflecterende uitrusting die zorgt voor maximale zichtbaarheid van de werknemer bij daglicht en onder koplampen in de nacht.",
                    fr: "Équipement réfléchissant assurant une visibilité maximale du travailleur de jour comme de nuit sous les phares.",
                    it: "Equipaggiamento riflettente che garantisce la massima visibilità del lavoratore di giorno e di notte sotto i fari."
                }
            },
            "EN 17353": {
                svg: `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 15 L 80 15 L 80 50 C 80 68 50 85 50 85 C 50 85 20 68 20 50 Z" fill="#ffbe00" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="34" cy="30" r="5" stroke="#0f172a" stroke-width="2" fill="none"/>
    <path d="M 34 21 V 23 M 34 37 V 39 M 25 30 H 27 M 41 30 H 43" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 61 25 C 65 25, 68 28, 68 32 C 68 36, 64 39, 60 39 C 62 36, 62 30, 60 26 C 60.3 25.5, 60.6 25, 61 25 Z" fill="#0f172a"/>
    <path d="M 40 45 L 45 45 C 47 48, 53 48, 55 45 L 60 45 L 63 51 L 60 53 V 70 H 40 V 53 L 37 51 L 40 45 Z" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M 44 45 V 70" stroke="#0f172a" stroke-width="2" stroke-dasharray="3 3"/>
    <path d="M 56 45 V 70" stroke="#0f172a" stroke-width="2" stroke-dasharray="3 3"/>
    <path d="M 40 56 H 60" stroke="#0f172a" stroke-width="2" stroke-dasharray="3 3"/>
</svg>`,
                name: {
                    tr: "Geliştirilmiş Görünürlük",
                    en: "Enhanced Visibility",
                    de: "Geliştirte Sichtbarkeit",
                    ru: "Повышенная видимость",
                    nl: "Verbeterde Zichtbaarheid",
                    fr: "Visibilité Accrue",
                    it: "Visibilità Migliorata"
                },
                desc: {
                    tr: "Düşük ışıklı ve orta riskli endüstriyel ortamlarda çalışanın görünürlüğünü artıran geliştirilmiş yansıtıcı tasarım standardı.",
                    en: "Enhanced reflective design standard increasing worker visibility in low-light and medium-risk industrial environments.",
                    de: "Verbesserter Standard für reflektierendes Design zur Erhöhung the Sichtbarkeit der Mitarbeiter in industriellen Umgebungen mit geringem Lichtrisiko.",
                    ru: "Улучшенный стандарт светоотражающего дизайна, повышающий видимость работников в промышленных условиях со средним уровнем риска.",
                    nl: "Verbeterde reflecterende ontwerpnorm die de zichtbaarheid van werknemers verhoogt in industriële omgevingen met weinig licht en een gemiddeld risico.",
                    fr: "Norme de conception réfléchissante améliorée augmentant la visibilité des travailleurs dans des environnements industriels à faible luminosité.",
                    it: "Standard di progettazione riflettente migliorato che aumenta la visibilità del lavoratore in ambienti industriali a bassa luminosità."
                }
            },
            "EN 342": {
                svg: `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 15 L 80 15 L 80 50 C 80 68 50 85 50 85 C 50 85 20 68 20 50 Z" fill="#ffbe00" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 50 25 V 65" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    <path d="M 33 35 L 67 55" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    <path d="M 33 55 L 67 35" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    <path d="M 45 30 L 50 25 L 55 30" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 45 60 L 50 65 L 55 60" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 34 42 L 33 35 L 40 36" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 60 54 L 67 55 L 66 48" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 40 54 L 33 55 L 34 48" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 66 42 L 67 35 L 60 36" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="45" r="4.5" stroke="#0f172a" stroke-width="2" fill="#ffbe00"/>
</svg>`,
                name: {
                    tr: "Soğuk Hava Koruması",
                    en: "Cold Weather Protection",
                    de: "Kälteschutz",
                    ru: "Защита от холода",
                    nl: "Koudeweerscherm",
                    fr: "Froid et Intempéries",
                    it: "Calore e Freddo"
                },
                desc: {
                    tr: "Dondurucu soğuklar ve sert rüzgarlar altında vücut ısısını korurken terlemeyi önleyen yalıtım standardı.",
                    en: "Insulation standard preventing sweating while maintaining body temperature under freezing cold and harsh winds.",
                    de: "Isolierungsstandard, der das Schwitzen verhindert, während die Körpertemperatur bei eiskaltem und rauem Wind gehalten wird.",
                    ru: "Стандарт изоляции, предотвращающий потоотделение при сохранении температуры тела при сильном холоде и ветре.",
                    nl: "Isolatienorm die zweten voorkomt en tegelijkertijd de lichaamstemperatuur handhaaft onder ijskoude en gure wind.",
                    fr: "Norme d'isolation empêchant la transpiration tout en maintenant la température corporelle par grand froid et vents violents.",
                    it: "Standard di isolamento che previene la sudorazione mantenendo la temperatura corporea sotto il freddo gelido e venti sferzanti."
                }
            }
        };

        let standardsList = [];
        if (product.standards) {
            try {
                if (typeof product.standards === 'string') {
                    standardsList = JSON.parse(product.standards);
                } else if (Array.isArray(product.standards)) {
                    standardsList = product.standards;
                }
            } catch (e) {
                console.error("Standartlar ayrıştırılamadı:", e);
            }
        }

        if (standardsContainer && pictogramsGrid) {
            if (standardsList && standardsList.length > 0) {
                let standardsHtml = '';
                standardsList.forEach(stdCode => {
                    const std = STANDARDS_DATA[stdCode];
                    if (std) {
                        const name = std.name[lang] || std.name['tr'];
                        const desc = std.desc[lang] || std.desc['tr'];
                        standardsHtml += `
                        <div class="standard-card">
                            <div class="standard-icon-wrapper">
                                ${std.svg}
                            </div>
                            <div class="standard-info">
                                <span class="standard-code-badge">${stdCode}</span>
                                <div class="standard-name">${name}</div>
                                <div class="standard-desc">${desc}</div>
                            </div>
                        </div>`;
                    }
                });
                pictogramsGrid.innerHTML = standardsHtml;
                standardsContainer.style.display = 'block';
            } else {
                standardsContainer.style.display = 'none';
            }
        }

        // Görünürlüğü Ayarla
        if (loadingContainer) loadingContainer.style.display = 'none';
        if (detailContainer) detailContainer.style.display = 'flex';

        // Beden seçimi butonları
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Renk Seçimi butonları (Renk halkası olarak)
        const colorSection = document.getElementById('color-header-selection');
        const colorOptions = document.getElementById('color-options');
        const activeColorNameEl = document.getElementById('active-color-name');
        if (colorSection && colorOptions) {
            let colors = [];
            if (product.colors) {
                try {
                    if (typeof product.colors === 'string') {
                        colors = JSON.parse(product.colors);
                    } else if (Array.isArray(product.colors)) {
                        colors = product.colors;
                    }
                } catch (e) {
                    console.error("Renkler ayrıştırılamadı:", e);
                }
            }
            if (colors && colors.length > 0) {
                let colorHtml = '';
                colors.forEach((col, idx) => {
                    const activeClass = idx === 0 ? 'active' : '';
                    const bgValue = getColorCssValue(col);
                    colorHtml += `<button class="color-btn ${activeClass}" data-color="${col}" title="${col}" style="background: ${bgValue};"></button>`;
                });
                colorOptions.innerHTML = colorHtml;
                colorSection.style.display = 'block';

                if (activeColorNameEl) {
                    activeColorNameEl.textContent = colors[0];
                }

                document.querySelectorAll('.color-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        if (activeColorNameEl) {
                            activeColorNameEl.textContent = this.getAttribute('data-color');
                        }
                    });
                });
            } else {
                colorSection.style.display = 'none';
            }
        }

    } catch (err) {
        console.error("Ürün yükleme hatası:", err);
        if (loadingContainer) {
            loadingContainer.innerHTML = '<h2 style="width: 100%; text-align: center; color: red;">Ürün Yüklenemedi!</h2>';
        }
    }
}


// --- Lightbox / Büyüteç Modal İşlevleri ---
let zoomScale = 1;
let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;
let currentTranslateX = 0, currentTranslateY = 0;
let tpDistStart = 0;
let tpZoomStart = 1;

let lightboxImages = [];
let currentLightboxIndex = 0;

let lastTap = 0;
let swipeStartX = 0;
let swipeStartY = 0;
let isSwipeRegistered = false;
let indicatorTimeout;

function showZoomIndicator() {
    const indicator = document.getElementById('lightbox-zoom-indicator');
    if (indicator) {
        indicator.textContent = `${zoomScale.toFixed(1)}x`;
        indicator.classList.add('visible');
        clearTimeout(indicatorTimeout);
        indicatorTimeout = setTimeout(() => {
            indicator.classList.remove('visible');
        }, 1500);
    }
}

function updateLightboxNavigation() {
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    if (prevBtn && nextBtn) {
        prevBtn.style.display = currentLightboxIndex > 0 ? 'flex' : 'none';
        nextBtn.style.display = currentLightboxIndex < lightboxImages.length - 1 ? 'flex' : 'none';
    }
}

function lightboxPrev() {
    if (currentLightboxIndex > 0) {
        currentLightboxIndex--;
        updateLightboxImage();
    }
}

function lightboxNext() {
    if (currentLightboxIndex < lightboxImages.length - 1) {
        currentLightboxIndex++;
        updateLightboxImage();
    }
}

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-image');
    if (lightboxImg && lightboxImages[currentLightboxIndex]) {
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.src = lightboxImages[currentLightboxIndex];
            lightboxImg.style.opacity = 1;
            resetZoom();
            updateLightboxNavigation();
        }, 150);
    }
}

function openLightbox() {
    const mainImg = document.getElementById('main-image');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');

    if (!mainImg || !lightbox || !lightboxImg) return;

    const currentSrc = mainImg.getAttribute('src');
    currentLightboxIndex = lightboxImages.indexOf(currentSrc);
    if (currentLightboxIndex === -1) {
        currentLightboxIndex = 0;
    }

    lightboxImg.src = mainImg.src;
    lightbox.style.display = 'flex';

    setTimeout(() => {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);

    resetZoom();
    updateLightboxNavigation();
}

function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
        lightbox.style.display = 'none';
        ticking = false;
    }, 300);
}

let ticking = false;
function updateImageTransform() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const img = document.getElementById('lightbox-image');
            if (img) {
                img.style.transform = `scale(${zoomScale}) translate(${translateX / zoomScale}px, ${translateY / zoomScale}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
}

function clampTransitions() {
    const img = document.getElementById('lightbox-image');
    if (!img) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = img.getBoundingClientRect();

    const widthAtScale1 = rect.width / zoomScale;
    const heightAtScale1 = rect.height / zoomScale;

    const zoomedWidth = widthAtScale1 * zoomScale;
    const zoomedHeight = heightAtScale1 * zoomScale;

    let maxTx = 0;
    if (zoomedWidth > viewportWidth) {
        maxTx = (zoomedWidth - viewportWidth) / 2;
    }

    let maxTy = 0;
    if (zoomedHeight > viewportHeight) {
        maxTy = (zoomedHeight - viewportHeight) / 2;
    }

    translateX = Math.min(Math.max(translateX, -maxTx), maxTx);
    translateY = Math.min(Math.max(translateY, -maxTy), maxTy);
}

function zoomImage(amount) {
    const oldZoomScale = zoomScale;
    zoomScale += amount;
    if (zoomScale < 1) zoomScale = 1;
    if (zoomScale > 6) zoomScale = 6;

    if (zoomScale <= 1) {
        translateX = 0;
        translateY = 0;
        currentTranslateX = 0;
        currentTranslateY = 0;
    } else {
        const ratio = zoomScale / oldZoomScale;
        translateX = translateX * ratio;
        translateY = translateY * ratio;
        clampTransitions();
        currentTranslateX = translateX;
        currentTranslateY = translateY;
    }
    updateImageTransform();
    showZoomIndicator();
}

function resetZoom() {
    zoomScale = 1;
    translateX = 0;
    translateY = 0;
    currentTranslateX = 0;
    currentTranslateY = 0;
    updateImageTransform();
    showZoomIndicator();
}

function handleDoubleTap(e) {
    const img = document.getElementById('lightbox-image');
    if (!img) return;

    if (zoomScale > 1) {
        resetZoom();
    } else {
        zoomScale = 2.5;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const rect = img.getBoundingClientRect();
        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;

        translateX = (clientX - imgCenterX) * (1 - zoomScale);
        translateY = (clientY - imgCenterY) * (1 - zoomScale);

        clampTransitions();
        currentTranslateX = translateX;
        currentTranslateY = translateY;

        updateImageTransform();
        showZoomIndicator();
    }
}

// Global expose for inline HTML event handlers
window.updateQty = updateQty;
window.addToCartAnimation = addToCartAnimation;
window.changeMainImage = changeMainImage;
window.loadProductDetail = loadProductDetail;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.lightboxPrev = lightboxPrev;
window.lightboxNext = lightboxNext;
window.zoomImage = zoomImage;
window.resetZoom = resetZoom;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail();

    const lightbox = document.getElementById('image-lightbox');
    const wrapper = document.getElementById('lightbox-img-wrapper');
    const mainImg = document.getElementById('main-image');

    if (mainImg && mainImg.parentElement) {
        mainImg.parentElement.addEventListener('click', openLightbox);
    }

    if (lightbox) {
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                else if (e.key === 'ArrowLeft') lightboxPrev();
                else if (e.key === 'ArrowRight') lightboxNext();
            }
        });

        lightbox.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.25 : -0.25;
            zoomImage(delta);
        }, { passive: false });
    }

    if (wrapper) {
        const startDrag = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            if (zoomScale <= 1) {
                swipeStartX = clientX;
                swipeStartY = clientY;
                isSwipeRegistered = true;
                return;
            }

            if (e.touches && e.touches.length > 1) return;

            isDragging = true;
            wrapper.classList.add('dragging');

            startX = clientX - currentTranslateX;
            startY = clientY - currentTranslateY;
        };

        const doDrag = (e) => {
            if (zoomScale <= 1) return;
            if (!isDragging) return;
            if (e.touches && e.touches.length > 1) return;
            e.preventDefault();

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            translateX = clientX - startX;
            translateY = clientY - startY;

            clampTransitions();
            updateImageTransform();
        };

        const stopDrag = (e) => {
            if (isSwipeRegistered && zoomScale <= 1) {
                const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

                const deltaX = clientX - swipeStartX;
                const deltaY = clientY - swipeStartY;

                if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 45) {
                    if (deltaX > 0) lightboxPrev();
                    else lightboxNext();
                }
            }
            isSwipeRegistered = false;

            if (!isDragging) return;
            isDragging = false;
            wrapper.classList.remove('dragging');
            currentTranslateX = translateX;
            currentTranslateY = translateY;
        };

        wrapper.addEventListener('mousedown', startDrag);
        wrapper.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        wrapper.addEventListener('mouseleave', stopDrag);

        wrapper.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 300 && tapLength > 0) {
                    e.preventDefault();
                    handleDoubleTap(e);
                }
                lastTap = currentTime;
            }

            if (e.touches.length !== 2) {
                tpDistStart = 0;
            }
            startDrag(e);
        }, { passive: false });

        wrapper.addEventListener('touchmove', (e) => {
            if (zoomScale > 1) doDrag(e);
        }, { passive: false });

        wrapper.addEventListener('touchend', stopDrag);

        wrapper.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();

                const touch1 = e.touches[0];
                const touch2 = e.touches[1];

                const dist = Math.hypot(
                    touch1.clientX - touch2.clientX,
                    touch1.clientY - touch2.clientY
                );
                const midX = (touch1.clientX + touch2.clientX) / 2;
                const midY = (touch1.clientY + touch2.clientY) / 2;

                if (tpDistStart === 0) {
                    tpDistStart = dist;
                    tpZoomStart = zoomScale;
                } else {
                    const factor = dist / tpDistStart;
                    const newZoomScale = Math.min(Math.max(tpZoomStart * factor, 1), 6);

                    if (newZoomScale !== zoomScale) {
                        const ratio = newZoomScale / zoomScale;
                        translateX = midX - (midX - translateX) * ratio;
                        translateY = midY - (midY - translateY) * ratio;

                        zoomScale = newZoomScale;

                        clampTransitions();
                        updateImageTransform();
                    }
                }
            }
        }, { passive: false });

        wrapper.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                tpDistStart = 0;
                currentTranslateX = translateX;
                currentTranslateY = translateY;
            }
        });
    }
});
