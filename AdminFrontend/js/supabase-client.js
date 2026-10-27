// Supabase Client Yapılandırması
window.SUPABASE_URL = window.SUPABASE_URL || 'https://vcmgijcjltleytlwzayx.supabase.co';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'sb_publishable_HF5kZ1rTFx15rJes459xZA_C_rzkoc3';

if (typeof supabase !== 'undefined' && !window.supabaseClient) {
    window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}

// SHA-256 Hashing Helper (Web Crypto API - Tarayıcıda yerel çalışır, ek kütüphane gerektirmez)
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Supabase JSON sütunları veya düz stringleri dil ayarlarına göre parse eden yardımcı fonksiyon
if (typeof window.getProductTranslation !== 'function') {
    window.getProductTranslation = function (product, field, lang) {
        if (!product) return '';
        let val = product[field] || product[field.toLowerCase()];
        if (!val) return '';

        if (typeof val === 'string') {
            try {
                val = JSON.parse(val);
            } catch (e) {
                return val;
            }
        }
        
        if (typeof val === 'object' && val !== null) {
            return val[lang] || val['tr'] || '';
        }
        
        return val.toString();
    };
}

// Silent Keep-Alive Heartbeat (Sitenin ziyaretçileri aracılığıyla Supabase'in 7 gün kuralı ile uykuya geçmesini önler)
(function pingSupabaseKeepAlive() {
    try {
        const lastPing = localStorage.getItem('mm_sb_last_ping');
        const now = Date.now();
        // Ziyaretçi başına her 6 saatte en fazla 1 kez hafif arka plan isteği at
        if (!lastPing || (now - Number(lastPing) > 6 * 60 * 60 * 1000)) {
            localStorage.setItem('mm_sb_last_ping', String(now));
            const pingUrl = `${window.SUPABASE_URL}/rest/v1/Products?select=Id&limit=1`;
            fetch(pingUrl, {
                method: 'GET',
                headers: {
                    'apikey': window.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`
                },
                mode: 'cors',
                cache: 'no-cache'
            }).catch(() => {});
        }
    } catch (e) {}
})();

