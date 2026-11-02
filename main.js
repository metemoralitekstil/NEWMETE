const isMobileOrTablet = () => window.innerWidth <= 1024;

const particleConfigs = {
    fire: {
        fpsLimit: 60,
        detectRetina: false,
        particles: {
            number: { value: 30 },
            color: { value: ["#ff5722", "#ff9800", "#ffc107"] },
            shape: { type: "circle" },
            opacity: { value: { min: 0.3, max: 0.8 } },
            size: { value: { min: 1, max: 4 } },
            move: { enable: true, speed: 2.2, direction: "top", random: true, outModes: "out" }
        },
        interactivity: { events: { onHover: { enable: true, mode: "repulse" } }, modes: { repulse: { distance: 70, duration: 0.4 } } }
    },
    snow: {
        fpsLimit: 60,
        detectRetina: false,
        particles: {
            number: { value: 45 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: { min: 0.3, max: 0.8 } },
            size: { value: { min: 1, max: 3.5 } },
            move: { enable: true, speed: 1.6, direction: "bottom", random: false, outModes: "out" }
        },
        interactivity: { events: { onHover: { enable: true, mode: "bubble" } }, modes: { bubble: { distance: 100, size: 4.5, duration: 1.5, opacity: 0.8 } } }
    },
    dust: {
        fpsLimit: 60,
        detectRetina: false,
        particles: {
            number: { value: 32 },
            color: { value: ["#f1c40f", "#ffffff", "#e67e22"] },
            shape: { type: "circle" },
            opacity: { value: { min: 0.15, max: 0.5 } },
            size: { value: { min: 1, max: 2.5 } },
            move: { enable: true, speed: 1.1, direction: "none", random: true, outModes: "out" }
        },
        interactivity: { events: { onHover: { enable: false } } }
    }
};

const getTranslation = (field, lang) => {
    if (typeof field === 'object' && field !== null) {
        return field[lang] || field['tr'] || '';
    }
    return field || '';
};

// Ana sayfa slider verisi — Urun detay verisi icin js/products.js bakin
// Slider ID'leri MOCK_PRODUCTS ID'leriyle eslestirilmistir
const products = [
    {
        id: 0,
        title: {
            tr: "Kaynakçı Kıyafeti",
            en: "Welder Jacket",
            de: "Schweißerjacke",
            ru: "Куртка сварщика",
            nl: "Lassersjas",
            fr: "Veste de Soudeur",
            it: "Giacca da Saldatore"
        },
        subtitle: {
            tr: "BÜTÜN KAYNAKLARA KARŞI KORUMA",
            en: "PROTECTION AGAINST ALL WELDING HAZARDS",
            de: "SCHUTZ GEGEN ALLE SCHWEISSGEFAHREN",
            ru: "ЗАЩИТА ОТ ВСЕХ ОПАСНОСТЕЙ СВАРКИ",
            nl: "BESCHERMING TEGEN ALLE LASGEVAREN",
            fr: "PROTECTION CONTRE TOUS LES RISQUES DE SOUDAGE",
            it: "PROTEZIONE CONTRO TUTTI I RISCHI DI SALDATURA"
        },
        desc1: {
            tr: "Alev Geciktirici (FR) Kumaş",
            en: "Flame Retardant (FR) Fabric",
            de: "Flammhemmendes (FR) Gewebe",
            ru: "Огнестойкая (FR) ткань",
            nl: "Vlamvertragende (FR) stof",
            fr: "Tissu Ignifuge (FR)",
            it: "Tessuto Ignifugo (FR)"
        },
        desc2: {
            tr: "%99 Pamuk, %1 Karbon Fiber yapısıyla yüksek koruma",
            en: "High protection with 99% Cotton, 1% Carbon Fiber",
            de: "Hoher Schutz mit 99% Baumwolle, 1% Kohlefaser",
            ru: "Высокая защита: 99% хлопок, 1% углеродное волокно",
            nl: "Hoge bescherming met 99% katoen, 1% koolstofvezel",
            fr: "Haute protection avec 99% Coton, 1% Fibre de Carbone",
            it: "Elevata protezione con 99% Cotone, 1% Fibra di Carbonio"
        },
        image: "img/mavi-reflektorlu-is-uniformasi.webp",
        fsImage: "img/mavi-reflektorlu-is-guvenligi-montu.webp",
        label: {
            tr: "Kaynakçı Kıyafeti (Düz)",
            en: "Welder Jacket (Plain)",
            de: "Schweißerjacke (Einfach)",
            ru: "Куртка сварщика (Однотонная)",
            nl: "Lassersjas (Eenvoudig)",
            fr: "Veste de Soudeur (Simple)",
            it: "Giacca da Saldatore (Semplice)"
        },
        accentColor: "#00a8ff",
        bgImage: "img/arkaplankaynakci.webp",
        bgPosition: "left center",
        particleType: "fire",
        link: "urun-detay?id=5",
        fsCapsule: "CAPSULE COLLECTION // 01",
        fsTitle: {
            tr: "KAYNAKÇI",
            en: "WELDER",
            de: "SCHWEISSER",
            ru: "СВАРЩИК",
            nl: "LASSER",
            fr: "SOUDEUR",
            it: "SALDATORE"
        },
        fsDesc: {
            tr: "Alev Almaz & Antistatik",
            en: "Flame Retardant & Antistatic",
            de: "Flammhemmend & Antistatisch",
            ru: "Огнестойкий и антистатический",
            nl: "Vlamvertragend & Antistatisch",
            fr: "Ignifuge & Antistatique",
            it: "Ignifugo & Antistatico"
        },
        fsSeason: "2026 EDITION",
        fsCustomClass: "fs-medium-jacket first-jacket",
        features: [
            { top: "30%", left: "55%", text: "Alev Almaz", color: "#8c929c" },
            { top: "70%", left: "45%", text: "FR Kumaş", color: "#1a73e8" }
        ]
    },
    {
        id: 1,
        title: {
            tr: "Kaynakçı Takımı",
            en: "Welder Suit",
            de: "Schweißeranzug",
            ru: "Костюм сварщика",
            nl: "Lasserspak",
            fr: "Combinaison de Soudeur",
            it: "Completo da Saldatore"
        },
        subtitle: {
            tr: "YÜKSEK GÖRÜNÜRLÜK (CLASS 2)",
            en: "HIGH VISIBILITY (CLASS 2)",
            de: "HOHE SICHTBARKEIT (KLASSE 2)",
            ru: "ВЫСОКАЯ ВИДИМОСТЬ (КЛАСС 2)",
            nl: "HOGE ZICHTBAARHEID (KLASSE 2)",
            fr: "HAUTE VISIBILITÉ (CLASSE 2)",
            it: "ALTA VISIBILITÀ (CLASSE 2)"
        },
        desc1: {
            tr: "%48 Modakrilik, %33 Pamuk, %18 Poliamid",
            en: "48% Modacrylic, 33% Cotton, 18% Polyamide",
            de: "48% Modacryl, 33% Baumwolle, 18% Polyamid",
            ru: "48% модакрил, 33% хлопок, 18% полиамид",
            nl: "48% modacryl, 33% katoen, 18% polyamide",
            fr: "48% Modacrylique, 33% Coton, 18% Polyamide",
            it: "48% Modacrilico, 33% Cotone, 18% Poliammide"
        },
        desc2: {
            tr: "Reflektörlü, Isı ve Aleve Dayanıklı",
            en: "Reflective, Heat and Flame Resistant",
            de: "Reflektierend, Hitze- und Flammbeständig",
            ru: "Светоотражающий, термо- и огнестойкий",
            nl: "Reflecterend, Hitte- en Vlambestendig",
            fr: "Réfléchissant, Résistant à la Chaleur et aux Flammes",
            it: "Riflettente, Resistente al Calore e alle Fiamme"
        },
        image: "img/reflektorlu-mavi-lime-is-elbisesi.webp",
        fsImage: "img/kobalt-mavi-ve-neon-sari-is-montu.webp",
        label: {
            tr: "Yüksek Görünürlük Kaynakçı",
            en: "High Visibility Welder",
            de: "Hi-Vis Schweißer",
            ru: "Сварщик высокой видимости",
            nl: "Hi-Vis Lasser",
            fr: "Soudeur Haute Visibilité",
            it: "Saldatore Alta Visibilità"
        },
        accentColor: "#ffcc00",
        bgImage: "img/Arkaplan1.webp",
        particleType: "dust",
        link: "urun-detay?id=3",
        fsCapsule: "CAPSULE COLLECTION // 02",
        fsTitle: {
            tr: "HI-VIS KAYNAKÇI",
            en: "HI-VIS WELDER",
            de: "HI-VIS SCHWEISSER",
            ru: "СВАРЩИК HI-VIS",
            nl: "HI-VIS LASSER",
            fr: "SOUDEUR HI-VIS",
            it: "SALDATORE HI-VIS"
        },
        fsDesc: {
            tr: "Reflektörlü & Isıya Dayanıklı",
            en: "Reflective & Heat Resistant",
            de: "Reflektierend & Hitzebeständig",
            ru: "Светоотражающий и термостойкий",
            nl: "Reflecterend & Hitzebestendig",
            fr: "Réfléchissant & Résistant à la Chaleur",
            it: "Riflettente & Resistente al Calore"
        },
        fsSeason: "2026 EDITION",
        fsCustomClass: "fs-medium-jacket second-jacket",
        features: [
            { top: "25%", left: "60%", text: "Reflektör Bant", color: "#f1c40f" },
            { top: "65%", left: "45%", text: "Isı Kalkanı", color: "#8c929c" }
        ]
    },
    {
        id: 2,
        title: {
            tr: "Lacivert Kaynakçı Takımı",
            en: "Navy Blue Welder Suit",
            de: "Marineblauer Schweißeranzug",
            ru: "Темно-синий костюм сварщика",
            nl: "Marineblauw Lasserspak",
            fr: "Combinaison de Soudeur Bleu Marine",
            it: "Completo da Saldatore Blu Navy"
        },
        subtitle: {
            tr: "ALEV ALMAZ & ANTİSTATİK KORUMA",
            en: "FLAME RETARDANT & ANTISTATIC PROTECTION",
            de: "FLAMMHEMMENDER & ANTISTATISCHER SCHUTZ",
            ru: "ОГНЕСТОЙКАЯ И АНТИСТАТИЧЕСКАЯ ЗАЩИТА",
            nl: "VLAMVERTRAGENDE & ANTISTATISCHE BESCHERMING",
            fr: "PROTECTION IGNIFUGE ET ANTISTATIQUE",
            it: "PROTEZIONE IGNIFUGA E ANTISTATICA"
        },
        desc1: {
            tr: "Alev Geciktirici & Antistatik Kalın Kumaş",
            en: "Flame Retardant & Antistatic Heavy Fabric",
            de: "Flammhemmender und antistatischer schwerer Stoff",
            ru: "Огнестойкая и антистатическая плотная ткань",
            nl: "Vlamvertragende & antistatische zware stof",
            fr: "Tissu lourd ignifuge et antistatique",
            it: "Tessuto pesante ignifugo e antistatico"
        },
        desc2: {
            tr: "Kaynak ve Metal Çapaklarına Dayanıklı Yapı",
            en: "Structure Resistant to Welding & Metal Splashes",
            de: "Struktur beständig gegen Schweiß- und Metallspritzer",
            ru: "Структура, устойчивая к сварке и брызгам металла",
            nl: "Structuur bestand tegen las- en metaalspatten",
            fr: "Structure résistante au soudage et aux projections de métal",
            it: "Struttura resistente a saldatura e schizzi di metallo"
        },
        image: "img/lacivert-1.webp",
        fsImage: "img/lacivert-4.webp",
        label: {
            tr: "Lacivert Ceket ve Pantolon",
            en: "Navy Blue Jacket and Pants",
            de: "Marineblaue Jacke und Hose",
            ru: "Темно-синяя куртка и брюки",
            nl: "Marineblauwe Jas en Broek",
            fr: "Veste et Pantalon Bleu Marine",
            it: "Giacca e Pantaloni Blu Navy"
        },
        accentColor: "#2563eb",
        bgImage: "img/Arkaplan2.webp",
        particleType: "dust",
        link: "urun-detay?id=6",
        fsCapsule: "CAPSULE COLLECTION // 03",
        fsTitle: {
            tr: "LACİVERT",
            en: "NAVY BLUE",
            de: "MARINEBLAU",
            ru: "ТЕМНО-СИНИЙ",
            nl: "MARINEBLAUW",
            fr: "BLEU MARINE",
            it: "BLU NAVY"
        },
        fsDesc: {
            tr: "Alev Almaz & Antistatik",
            en: "Flame Retardant & Antistatic",
            de: "Flammhemmend & Antistatisch",
            ru: "Огнестойкий и антистатический",
            nl: "Vlamvertragend & Antistatisch",
            fr: "Ignifuge & Antistatique",
            it: "Ignifugo & Antistatico"
        },
        fsSeason: "2026 EDITION",
        fsCustomClass: "fs-medium-jacket third-jacket",
        features: [
            { top: "35%", left: "55%", text: "Alev Almaz", color: "#2563eb" },
            { top: "75%", left: "45%", text: "Antistatik", color: "#8c929c" }
        ]
    },
    {
        id: 3,
        title: {
            tr: "Termal Kışlık Parka",
            en: "Thermal Winter Parka",
            de: "Thermischer Winterparka",
            ru: "Теплая зимняя парка",
            nl: "Thermische Winterparka",
            fr: "Parka d'Hiver Thermique",
            it: "Parka Invernale Termico"
        },
        subtitle: {
            tr: "YÜKSEK GÖRÜNÜRLÜK (CLASS 3) - FR PARKA",
            en: "HIGH VISIBILITY (CLASS 3) - FR PARKA",
            de: "HOHE SICHTBARKEIT (KLASSE 3) - FR-PARKA",
            ru: "ВЫСОКАЯ ВИДИМОСТЬ (КЛАСС 3) - ОГНЕСТОЙКАЯ ПАРКА",
            nl: "HOGE ZICHTBAARHEID (KLASSE 3) - FR PARKA",
            fr: "HAUTE VISIBILITÉ (CLASSE 3) - PARKA FR",
            it: "ALTA VISIBILITÀ (CLASSE 3) - PARKA FR"
        },
        desc1: {
            tr: "Dış Kumaş: %75 Pamuk, %24 Poliester, %1 Karbon Fiber (275 g/m²)",
            en: "Outer Fabric: 75% Cotton, 24% Polyester, 1% Carbon Fiber (275 g/m²)",
            de: "Außenstoff: 75% Baumwolle, 24% Polyester, 1% Kohlefaser (275 g/m²)",
            ru: "Внешняя ткань: 75% хлопок, 24% полиэстер, 1% углеродное волокно (275 г/м²)",
            nl: "Buitenstof: 75% katoen, 24% polyester, 1% koolstofvezel (275 g/m²)",
            fr: "Tissu Extérieur : 75% Coton, 24% Polyester, 1% Fibre de Carbone (275 g/m²)",
            it: "Tessuto Esterno: 75% Cotone, 24% Poliestere, 1% Fibra di Carbonio (275 g/m²)"
        },
        desc2: {
            tr: "İç Astar: %79 Pamuk, %20 Poliester, %1 Karbon Fiber (170 g/m²)",
            en: "Inner Lining: 79% Cotton, 20% Polyester, 1% Carbon Fiber (170 g/m²)",
            de: "Innenfutter: 79% Baumwolle, 20% Polyester, 1% Kohlefaser (170 g/m²)",
            ru: "Внутренняя подкладка: 79% хлопок, 20% полиэстер, 1% углеродное волокно (170 г/м²)",
            nl: "Binnenvoering: 79% katoen, 20% polyester, 1% koolstofvezel (170 g/m²)",
            fr: "Doublure Intérieure : 79% Coton, 20% Polyester, 1% Fibre de Carbone (170 g/m²)",
            it: "Fodera Interna: 79% Cotone, 20% Poliestere, 1% Fibra di Carbonio (170 g/m²)"
        },
        image: "img/beyaz-zeminde-yuksek-gorunurluklu-is-parkasi.webp",
        fsImage: "img/neon-sari-reflektif-guvenlik-parkasi.webp",
        label: {
            tr: "Termal Kışlık Parka",
            en: "Thermal Winter Parka",
            de: "Thermischer Winterparka",
            ru: "Теплая зимняя парка",
            nl: "Thermische Winterparka",
            fr: "Parka d'Hiver Thermique",
            it: "Parka Invernale Termico"
        },
        accentColor: "#cd84f1",
        bgImage: "img/Arkaplan1.webp",
        particleType: "snow",
        link: "urun-detay?id=1",
        fsCapsule: "CAPSULE COLLECTION // 04",
        fsTitle: {
            tr: "KIŞLIK PARKA",
            en: "WINTER PARKA",
            de: "WINTERPARKA",
            ru: "ЗИМНЯЯ ПАРКА",
            nl: "WINTERPARKA",
            fr: "PARKA D'HIVER",
            it: "PARKA INVERNALE"
        },
        fsDesc: {
            tr: "Zorlu Kış Şartları İçin",
            en: "For Harsh Winter Conditions",
            de: "Für raue Winterbedingungen",
            ru: "Для суровых зимних условий",
            nl: "Voor barre winterse omstandigheden",
            fr: "Pour les Conditions Hivernales Rigoureuses",
            it: "Per Condizioni Invernali Rigide"
        },
        fsSeason: "2026 EDITION",
        fsCustomClass: "fs-medium-jacket fourth-jacket",
        features: [
            { top: "30%", left: "75%", text: "Su İtici", color: "#9b59b6" },
            { top: "85%", left: "70%", text: "Kalın Astar", color: "#8c929c" }
        ]
    }
];

const iconCoordinates = [
    { x: 73.5, y: 144.4 },   
    { x: 194.4, y: 23.5 },   
    { x: 405.6, y: 23.5 },   
    { x: 526.5, y: 144.4 }   
];

// Bellekte decode edilmiş görselleri tutarak ikon geçişlerinde sıfır gecikme sağlar
const preloadedImages = new Map();

function preloadAndDecode(src) {
    if (!src || preloadedImages.has(src)) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    if (typeof img.decode === "function") {
        img.decode().catch(() => {});
    }
    preloadedImages.set(src, img);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Önce sadece Hero vitrin görsellerini (kıyafet + arkaplan) belleğe alıp GPU için decode et
    products.forEach(p => {
        preloadAndDecode(p.image);
        preloadAndDecode(p.bgImage);
    });

    // 2. Alt kısımdaki slider görsellerini ana ekran yüklendikten sonra boşta (idle) yükle
    const preloadSliderImages = () => {
        products.forEach(p => {
            if (p.fsImage) preloadAndDecode(p.fsImage);
        });
    };
    if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadSliderImages, { timeout: 1500 });
    } else {
        setTimeout(preloadSliderImages, 600);
    }

    let currentParticleType = "fire";
    let currentBgImage = products[0].bgImage;
    let isHeroVisible = true;

    if (document.getElementById("tsparticles") && window.tsParticles) {
        if (isMobileOrTablet()) {
            particleConfigs.fire.particles.number.value = 12;
            particleConfigs.snow.particles.number.value = 16;
            particleConfigs.dust.particles.number.value = 12;
            particleConfigs.fire.fpsLimit = 40;
            particleConfigs.snow.fpsLimit = 40;
            particleConfigs.dust.fpsLimit = 40;
            particleConfigs.fire.interactivity.events.onHover.enable = false;
            particleConfigs.snow.interactivity.events.onHover.enable = false;
            particleConfigs.dust.interactivity.events.onHover.enable = false;
        }
        tsParticles.load("tsparticles", particleConfigs.fire);
    }

    // Hero vitrin ekran dışına kaydırıldığında partikülleri durdurarak telefon/PC GPU yükünü sıfırla
    const showcaseEl = document.querySelector('.showcase-container');
    if (showcaseEl && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isHeroVisible = entry.isIntersecting;
                if (!window.tsParticles) return;
                const containers = tsParticles.dom();
                if (!containers || containers.length === 0) return;
                containers.forEach(c => {
                    if (entry.isIntersecting) {
                        c.play();
                    } else {
                        c.pause();
                    }
                });
            });
        }, { threshold: 0.05 });
        heroObserver.observe(showcaseEl);
    }

    const icons = document.querySelectorAll('.arc-icon');
    const productImg = document.getElementById('product-img');
    const floorShadow = document.getElementById('floor-shadow');
    const productTitle = document.getElementById('product-title');
    const productSubtitle = document.getElementById('product-subtitle');
    const productDesc = document.getElementById('product-desc');
    const arcLabel = document.getElementById('arc-label');
    const bgElement = document.querySelector('.background');
    const root = document.documentElement;

    const lang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
    const initialData = products[0];
    if (root) {
        root.style.setProperty('--accent', initialData.accentColor);
    }

    if (productTitle) {
        productTitle.style.color = initialData.accentColor;
        productTitle.style.textShadow = `0 8px 20px rgba(0,0,0,0.95), 0 3px 6px rgba(0,0,0,0.9)`;
    }

    if (productSubtitle) {
        productSubtitle.style.color = "#ffffff";
        productSubtitle.style.textShadow = "0 8px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)";
    }
    if (productDesc) {
        productDesc.style.color = "#ffffff";
        productDesc.style.textShadow = "0 4px 15px rgba(0,0,0,0.95), 0 2px 5px rgba(0,0,0,0.8)";
    }

    if (productTitle) productTitle.textContent = getTranslation(initialData.title, lang);
    if (productSubtitle) productSubtitle.textContent = getTranslation(initialData.subtitle, lang);
    if (productDesc) productDesc.innerHTML = `<p>${getTranslation(initialData.desc1, lang)}</p><p>${getTranslation(initialData.desc2, lang)}</p>`;
    if (arcLabel) arcLabel.textContent = getTranslation(initialData.label, lang);

    if (bgElement) {
        bgElement.style.backgroundImage = `url('${initialData.bgImage}')`;
        bgElement.style.backgroundPosition = initialData.bgPosition || "center";
        bgElement.style.opacity = "1";
    }
    
    if (productImg) {
        const initialSource = productImg.parentElement ? productImg.parentElement.querySelector('source') : null;
        if (initialSource) {
            initialSource.srcset = initialData.image;
        }
        productImg.src = initialData.image;
        productImg.alt = `${getTranslation(initialData.title, lang)} - MeteMorali`;
        productImg.style.opacity = "1";
    }

    let activeTransitionTl = null;
    let particleSwitchTimer = null;

    let xTo, yTo, rotYTo, rotXTo, shadowXTo, shadowOpacityTo;
    
    if (productImg && !isMobileOrTablet()) {
        xTo = gsap.quickTo(productImg, "x", { duration: 0.5, ease: "power2.out" });
        yTo = gsap.quickTo(productImg, "y", { duration: 0.5, ease: "power2.out" });
        rotYTo = gsap.quickTo(productImg, "rotationY", { duration: 0.5, ease: "power2.out" });
        rotXTo = gsap.quickTo(productImg, "rotationX", { duration: 0.5, ease: "power2.out" });
        
        if (floorShadow) {
            shadowXTo = gsap.quickTo(floorShadow, "x", { duration: 0.5, ease: "power2.out" });
            shadowOpacityTo = gsap.quickTo(floorShadow, "opacity", { duration: 0.5, ease: "power2.out" });
        }

        document.addEventListener('mousemove', (e) => {
            if (!productImg || !isHeroVisible || isMobileOrTablet()) return;

            const loginSidebar = document.getElementById('login-sidebar');
            if (loginSidebar && loginSidebar.classList.contains('active')) return;
            
            const x = (window.innerWidth / 2 - e.pageX) / 35; 
            const y = (window.innerHeight / 2 - e.pageY) / 35;
            
            if (xTo) xTo(x);
            if (yTo) yTo(y);
            if (rotYTo) rotYTo(x / 2);
            if (rotXTo) rotXTo(-y / 2);

            if (shadowXTo) shadowXTo(-x * 0.4);
            if (shadowOpacityTo) shadowOpacityTo(1 - Math.abs(y)/150);
        }, { passive: true });
    }

    // Reset GSAP defaults for elements
    const textElements = [productTitle, productSubtitle, productDesc, arcLabel].filter(Boolean);
    if (textElements.length > 0) gsap.set(textElements, { opacity: 1, y: 0 });

    const imgElements = [productImg, floorShadow].filter(Boolean);
    if (imgElements.length > 0) gsap.set(imgElements, { opacity: 1, scale: 1 });

    // Init Details Line
    const connectingLine = document.getElementById('connecting-line');
    const detailsBtn = document.getElementById('details-btn');
    const rightContainer = document.querySelector('.showcase-right');
    const pictureSource = productImg && productImg.parentElement ? productImg.parentElement.querySelector('source') : null;

    if (productImg && detailsBtn) {
        productImg.style.cursor = 'pointer';
        productImg.addEventListener('click', () => {
            window.location.href = detailsBtn.href;
        });
    }
    
    // Set initial line position to icon 0
    if (connectingLine && iconCoordinates && iconCoordinates.length > 0) {
        gsap.set(connectingLine, { attr: { x2: iconCoordinates[0].x, y2: iconCoordinates[0].y } });
    }

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            if (icon.classList.contains('active')) return;

            // Devam eden geçiş varsa kes ve anında yeni seçime geç (telefonda takılma hissini tamamen bitirir)
            if (activeTransitionTl) {
                activeTransitionTl.kill();
                activeTransitionTl = null;
            }
            if (particleSwitchTimer) {
                clearTimeout(particleSwitchTimer);
                particleSwitchTimer = null;
            }

            const index = parseInt(icon.getAttribute('data-index'));
            const data = products[index];
            const bgChanged = data.bgImage !== currentBgImage;
            const particleChanged = data.particleType !== currentParticleType;

            // Update Active Icon immediately
            icons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            root.style.setProperty('--accent', data.accentColor);

            // Animate connecting line
            gsap.to(connectingLine, { 
                attr: { x2: iconCoordinates[index].x, y2: iconCoordinates[index].y },
                duration: 0.45,
                ease: "power2.out",
                overwrite: "auto"
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    activeTransitionTl = null;
                }
            });
            activeTransitionTl = tl;

            // Hızlı ve akıcı çıkış (Outro)
            if (bgChanged && bgElement) {
                tl.to(bgElement, { opacity: 0.15, duration: 0.2, ease: "power1.out" }, 0);
            }
            tl.to(productImg, { opacity: 0, scale: 0.94, duration: 0.2, ease: "power1.in" }, 0)
              .to(floorShadow, { opacity: 0, scale: 0.92, duration: 0.2, ease: "power1.in" }, 0)
              .to([productTitle, productSubtitle, productDesc], { opacity: 0, y: -12, duration: 0.18, ease: "power1.in" }, 0)
              .to(arcLabel, { opacity: 0, y: -6, duration: 0.16, ease: "power1.in" }, 0);

            // İçerik değişimi
            tl.add(() => {
                const curLang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
                if (pictureSource) {
                    pictureSource.srcset = data.image;
                }
                productImg.src = data.image;
                productImg.alt = `${getTranslation(data.title, curLang)} - MeteMorali`;
                productTitle.textContent = getTranslation(data.title, curLang);
                productTitle.style.color = data.accentColor;
                productTitle.style.textShadow = `0 8px 20px rgba(0,0,0,0.95), 0 3px 6px rgba(0,0,0,0.9)`;
                
                productSubtitle.textContent = getTranslation(data.subtitle, curLang);
                productDesc.innerHTML = `<p>${getTranslation(data.desc1, curLang)}</p><p>${getTranslation(data.desc2, curLang)}</p>`;
                if (arcLabel) arcLabel.textContent = getTranslation(data.label, curLang);
                if (data.link && detailsBtn) detailsBtn.href = data.link;
                
                if (rightContainer) {
                    if (data.id !== 3) {
                        rightContainer.classList.add('large-typography');
                    } else {
                        rightContainer.classList.remove('large-typography');
                    }
                }
                
                if (bgChanged && bgElement) {
                    currentBgImage = data.bgImage;
                    bgElement.style.backgroundImage = `url('${data.bgImage}')`;
                    bgElement.style.backgroundPosition = data.bgPosition || "center";
                }

                // Partikül sadece tip değiştiyse ve giriş animasyonunun ilk karelerini bloklamadan güncellenir
                if (particleChanged && document.getElementById("tsparticles") && window.tsParticles) {
                    currentParticleType = data.particleType;
                    particleSwitchTimer = setTimeout(() => {
                        requestAnimationFrame(() => {
                            const activeContainers = tsParticles.dom();
                            if (activeContainers && activeContainers.length > 0) {
                                activeContainers.forEach(c => c.destroy());
                            }
                            tsParticles.load("tsparticles", particleConfigs[data.particleType]);
                        });
                    }, 180);
                }
            });

            // Pürüzsüz giriş (Intro)
            if (bgChanged && bgElement) {
                tl.to(bgElement, { opacity: 1, duration: 0.35, ease: "power2.out" }, ">");
            }
            tl.fromTo([productImg, floorShadow],
                { opacity: 0, scale: 0.94 },
                { opacity: 1, scale: 1, duration: 0.42, ease: "power2.out" },
                bgChanged ? "<" : ">"
            )
            .fromTo([productTitle, productSubtitle, productDesc],
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.38, stagger: 0.05, ease: "power2.out" },
                "<0.04"
            )
            .fromTo(arcLabel,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
                "<0.04"
            );
        });
    });

    // --- SWIPER SLIDER LOGIC (Feature Slider) ---
    const swiperWrapper = document.getElementById('fs-swiper-wrapper');
    if (swiperWrapper) {
        const curLang = (window.i18n && window.i18n.currentLang) || (new URLSearchParams(window.location.search).get('lang')) || localStorage.getItem('metemorali_lang') || 'tr';
        const examineTranslations = {
            tr: 'İncele',
            en: 'Examine',
            de: 'Bekijken',
            nl: 'Bekijken',
            ru: 'Изучить',
            it: 'Esamina',
            fr: 'Examiner'
        };
        const examineText = (window.i18n && window.i18n.translations[curLang] && window.i18n.translations[curLang]['examine']) || examineTranslations[curLang] || 'İncele';
        
        let slidesHtml = '';
        products.forEach((data) => {
            slidesHtml += `
                <div class="swiper-slide">
                    <div class="fs-container">
                        <div class="fs-left">
                            <div class="fs-image-wrapper ${data.fsCustomClass || ''}">
                                <div class="fs-image-picture">
                                    <img src="${data.fsImage || data.image}" alt="${getTranslation(data.fsTitle, curLang)}" class="fs-product-image" loading="lazy" decoding="async" width="450" height="450">
                                </div>
                            </div>
                        </div>
                        <div class="fs-right">
                            <div class="fs-details">
                                <span class="fs-capsule">${data.fsCapsule}</span>
                                <h2 class="fs-title" style="color: #111;">${getTranslation(data.fsTitle, curLang)}</h2>
                                <p class="fs-desc" style="color: #555;">${getTranslation(data.fsDesc, curLang)}</p>
                                <span class="fs-season" style="color: #999;">${data.fsSeason}</span>
                            </div>
                            <div class="fs-actions">
                                <a href="${data.link || '#'}" class="fs-btn" data-i18n="examine" style="background-color: #111; color: #fff;">${examineText}</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        swiperWrapper.innerHTML = slidesHtml;

        // Swiper'ı başlat
        new Swiper('.fs-swiper-container', {
            loop: true,
            grabCursor: true,
            spaceBetween: 30,
             navigation: {
                nextEl: '.fs-next-btn',
                prevEl: '.fs-prev-btn',
            },
            pagination: {
                el: '.fs-pagination',
                clickable: true,
            },
            breakpoints: {
                320: { spaceBetween: 100 },
                768: { spaceBetween: 30 }
            }
        });
    }

    // --- GLOBAL MAP SECTION ANIMATION ---
    gsap.registerPlugin(ScrollTrigger);

    const globalMapSection = document.getElementById('global-network');
    const mapPins = document.querySelectorAll('.map-pin');

    if (globalMapSection) {
        ScrollTrigger.create({
            trigger: globalMapSection,
            start: "top 65%",
            once: true,
            onEnter: () => {
                if (mapPins.length > 0) {
                    gsap.to(mapPins, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.45,
                        stagger: 0.06,
                        ease: "back.out(1.4)"
                    });
                }
            }
        });

        // Harita görünür değilken 13 adet sonsuz pin-pulse animasyonunu durdur
        if ('IntersectionObserver' in window) {
            const mapObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    globalMapSection.classList.toggle('map-in-view', entry.isIntersecting);
                });
            }, { threshold: 0.05 });
            mapObserver.observe(globalMapSection);
        } else {
            globalMapSection.classList.add('map-in-view');
        }
    }

    // --- ACCORDION LOGIC ---
    const accordions = document.querySelectorAll('.accordion-btn');
    accordions.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.classList.toggle('open');
        });
    });
});
