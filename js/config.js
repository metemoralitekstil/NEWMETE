const SITE_CONFIG = {
    phone: '+905322144553',
    whatsapp: '905322144553',
    email: 'info@mete-morali.com',
    emailjsPublicKey: '27cPi0XJVSKSExs8L',
    // API Base: Yerelde localhost'u, canlı yayında ise canlı API sunucunuzun adresini kullanır (örn: https://metemorali-backend-api.onrender.com)
    apiBase: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5055'
        : 'https://metemorali-backend-api.onrender.com', // Canlı backend API adresinizi buraya yazın (Render URL'si)
    useMockOnly: false, // Canlı veritabanı (Supabase) kullanmak için mock verileri kapatıyoruz
    version: '4.3'
};
