// Supabase Client Yapılandırması
const SUPABASE_URL = 'https://vcmgijcjltleytlwzayx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HF5kZ1rTFx15rJes459xZA_C_rzkoc3';

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error('Supabase library is not loaded! Make sure to include Supabase CDN script tag.');
}

// SHA-256 Hashing Helper (Web Crypto API - Tarayıcıda yerel çalışır, ek kütüphane gerektirmez)
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Supabase JSON sütunları veya düz stringleri dil ayarlarına göre parse eden yardımcı fonksiyon
function getProductTranslation(product, field, lang) {
    if (!product) return '';
    let val = product[field] || product[field.toLowerCase()];
    if (!val) return '';

    // Eğer veri JSON formatında bir string ise veya doğrudan objeyse parse etmeyi dene
    if (typeof val === 'string') {
        try {
            val = JSON.parse(val);
        } catch (e) {
            // Düz metin ise doğrudan döndür
            return val;
        }
    }
    
    if (typeof val === 'object' && val !== null) {
        return val[lang] || val['tr'] || '';
    }
    
    return val.toString();
}
