// i18n.js - MeteMorali Multi-Language Support System (v4.5)
// Architecture:
// 1. URL Query Param (?lang=...) has highest priority
// 2. User Explicit Choice in localStorage has second priority
// 3. Fallback is ALWAYS 'tr' (Turkish Canonical) for optimal Google SEO & zero crawler mismatches

window.i18n = {
    // Current active language code (tr, en, de, ru, nl, fr, it)
    currentLang: (function() {
        const validLangs = ['tr', 'en', 'de', 'ru', 'nl', 'fr', 'it'];
        try {
            const params = new URLSearchParams(window.location.search);
            const urlLang = params.get('lang');
            if (urlLang && validLangs.includes(urlLang.toLowerCase())) {
                return urlLang.toLowerCase();
            }
            const storedLang = localStorage.getItem('metemorali_lang');
            if (storedLang && validLangs.includes(storedLang.toLowerCase())) {
                return storedLang.toLowerCase();
            }
        } catch (e) {
            console.warn('i18n language resolution fallback to tr', e);
        }
        return 'tr'; // Kesin varsayılan: Türkçe (Googlebot ve doğrudan ziyaretçiler için)
    })(),

    // 7 Languages Dictionary (100% key parity across all languages)
    translations: {
    "tr": {
        "whatsapp_order": "WHATSAPP İLE SİPARİŞ VER",
        "whatsapp_order_notice": "Doğrudan Müşteri Temsilcimize Bağlanırsınız",

        "checking_payment": "Ödeme Durumu Kontrol Ediliyor",
        "checking_payment_desc": "Lütfen bekleyin, ödeme sonucunuz alınıyor...",
        "payment_success": "Ödeme Başarılı!",
        "payment_success_desc": "Ödemeniz güvenli bir şekilde alınmış ve siparişiniz onaylanmıştır. Teşekkür ederiz.",
        "payment_failed": "Ödeme Başarısız",
        "payment_failed_desc": "Kredi kartı ile ödeme işlemi gerçekleştirilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
        "order_no": "Sipariş No",
        "auth_code": "Onay Kodu",
        "total_amount": "Ödenen Tutar",
        "go_to_dashboard": "Hesabıma Git",
        "error_reason": "Hata Nedeni",
        "try_again": "Sepete Dön ve Tekrar Dene",
        "credit_card_payment": "Kredi Kartı ile Güvenli Ödeme (SSL)",
        "payment_subtitle": "3D Secure ile ödemenizi tamamlamak için kart bilgilerinizi giriniz.",

        "home": "Ana Sayfa",
        "catalog": "Katalog",
        "contact": "İletişim",
        "certifications": "Sertifikalarımız",
        "cert_title": "Sertifikalarımız & Standartlar",
        "cert_subtitle": "Uluslararası Güvenlik Standartlarında Can Güvenliği Koruması",
        "cert_11612_title": "EN ISO 11612 — Isı ve Alev Koruması",
        "cert_11612_desc": "Kumaşın yüksek sıcaklık, radyan ısı ve açık alev karşısında tutuşmasını engelleyen, erimeyen ve ısıyı iletmeyen koruma standardı. Metalurji, dökümhane ve petrokimya tesisleri için zorunludur.",
        "cert_11611_title": "EN ISO 11611 — Kaynakçı Koruması",
        "cert_11611_desc": "Kaynak işlemleri esnasında sıçrayan erimiş metal çapaklarına, kıvılcımlara ve kısa süreli elektrik arkı temaslarına karşı geliştirilmiş özel dikiş ve mukavemet standardı.",
        "cert_1149_title": "EN 1149-5 — Antistatik Koruma",
        "cert_1149_desc": "Patlayıcı ve parlayıcı ortamlarda sürtünmeden kaynaklı statik elektriğin birikerek kıvılcım oluşturmasını engelleyen, kumaşın içine dokunmuş karbon lif matrisi standardı.",
        "cert_342_title": "EN 342 — Soğuk Hava Koruması",
        "cert_342_desc": "Dondurucu soğuklar ve sert rüzgarlar altında vücut ısısını ideal seviyede korurken, terlemeyi önleyen yüksek nefes alabilirlik ve termal yalıtım standardı.",
        "my_account": "Hesabım",
        "cart": "Sipariş Listesi",
        "brand_desc": "Endüstriyel iş kıyafetleri ve teknik emniyet elbiseleri üretimi.",
        "brand_desc_short": "Endüstriyel İş ve Emniyet Kıyafetleri",
        "fast_menu": "Hızlı Menü",
        "copyright": "© 2026 Mete Morali. Tüm hakları saklıdır.",
        "explore_collection": "Koleksiyonu Keşfet",
        "examine": "İncele",
        "details": "Detayları İncele",
        "cart_toast": "sepete eklendi!",
        "order_summary": "Sipariş Özeti",
        "total_qty": "Toplam Ürün",
        "total_price": "Toplam Tutar",
        "request_quote": "TEKLİF İSTE",
        "place_order": "SİPARİŞİ ONAYLA",
        "pay_now": "ÖDEME YAP",
        "alert_phone_required": "Sipariş oluşturmak için profilinizden telefon numaranızı kaydetmeniz gerekmektedir. Profil sayfasına yönlendiriliyorsunuz.",
        "alert_phone_required_toast": "Sipariş oluşturmak için lütfen profilinizden telefon numaranızı kaydedin.",
        "profile_updated_success": "Profil bilgileriniz başarıyla güncellendi!",
        "empty_cart_title": "Sipariş Listeniz Şu An Boş",
        "empty_cart_desc": "Endüstriyel iş kıyafetlerini incelemek ve listenize eklemek için kataloğumuza göz atın.",
        "write_to_us": "Bize Yazın",
        "fullname": "Adınız Soyadınız",
        "email_address": "E-Posta Adresiniz",
        "select_subject": "Konu Seçiniz",
        "general_info": "Genel Bilgi",
        "delivery": "Sipariş & Teslimat",
        "subject_dealership": "Bayilik",
        "message": "Mesajınız...",
        "send_btn": "Gönder",
        "sending": "Gönderiliyor...",
        "msg_sent": "✓ Mesajınız İletildi!",
        "msg_error": "Hata! Tekrar deneyin.",
        "or_separator": "VEYA",
        "whatsapp": "WHATSAPP",
        "phone": "TELEFON",
        "email": "E-POSTA",
        "live_support": "CANLI DESTEK",
        "spam_protection": "Spam koruması: Lütfen yeni bir mesaj göndermeden önce 1 dakika bekleyin.",
        "profil_info": "Profil Bilgilerim",
        "my_orders": "Siparişlerim",
        "my_addresses": "Adreslerim",
        "logout": "Çıkış Yap",
        "update_btn": "Güncelle",
        "new_password_optional": "Yeni Şifre (İsteğe bağlı)",
        "export_title": "İhracat Yaptığımız Tüm Ülkeler",
        "export_central_asia": "Orta Asya Ülkeleri",
        "export_central_asia_desc": "Kazakistan, Özbekistan, Türkmenistan, Kırgızistan, Tacikistan, Azerbaycan, Gürcistan, Rusya Federasyonu ve bölgedeki stratejik projeler.",
        "export_europe": "Tüm Avrupa Ülkeleri",
        "export_europe_desc": "Almanya, Fransa, İtalya, İngiltere, Hollanda, Belçika, İsviçre, Avusturya, İspanya, Portekiz, Romanya, Bulgaristan, Yunanistan ve tüm Balkan bölgesi.",
        "export_cta": "Farklı bir ülke veya bölgede misiniz? Bizimle iletişime geçin, dünyanın neresinde olursanız olun projenize güvenlik taşıyalım.",
        "empty_state_orders": "Şu an için oluşturulmuş bir siparişiniz bulunmamaktadır.",
        "empty_state_addresses": "Kayıtlı adresiniz bulunmuyor.",
        "forgot_password": "Şifremi unuttum?",
        "forgot_password_desc": "Şifrenizi sıfırlamak için e-posta adresinizi girin.",
        "send_reset_link": "Sıfırlama Bağlantısı Gönder",
        "check_inbox": "Şifre sıfırlama talimatlarını içeren bir bağlantıyı e-posta adresinize gönderdik.",
        "reset_link_sent": "Bağlantı Gönderildi!",
        "login_title": "Giriş yap veya kayıt ol",
        "phone_subtitle": "Telefon numaranızı girin",
        "email_subtitle": "Email adresinizi girin",
        "phone_btn": "Telefon ile giriş yap",
        "email_btn": "Email ile giriş yap",
        "terms_check": "\"Telefon ile giriş yap\" butonuna tıklayarak, belirtilen numara ile giriş yapmayı onaylıyorum. Aydınlatma Metni'ni ve Gizlilik Politikası'nı kabul ediyorum.",
        "terms_check_link": "Aydınlatma Metni",
        "privacy_check_link": "Gizlilik Politikası",
        "continue_btn": "Devam et",
        "back_to_phone": "Telefon ile girişe dön",
        "back_to_login": "Giriş ekranına dön",
        "size_select": "Beden Seçimi",
        "color_select": "Renk Seçimi",
        "add_to_cart": "SEPETE EKLE",
        "loading_product": "Ürün Yükleniyor...",
        "product_not_found": "Ürün bulunamadı!",
        "api_error": "API Bağlantı Hatası!",
        "error_404_title": "Aradığınız Sayfa Bulunamadı",
        "error_404_desc": "Görünüşe göre endüstriyel tesisin yanlış bir bölümündesiniz.",
        "go_home": "Ana Sayfaya Dön",
        "katalog_title": "Koleksiyonumuzu Keşfedin",
        "katalog_desc": "Zorlu koşullarda maksimum performans ve güvenlik sağlayan ürünlerimiz.",
        "legal_title": "Yasal Bilgiler",
        "user_agreement": "Kullanıcı Sözleşmesi",
        "privacy_policy": "Gizlilik Politikası",
        "kvkk_text": "KVKK Aydınlatma Metni",
        "cookie_policy": "Çerez Politikası",
        "sales_agreement": "Mesafeli Satış Sözleşmesi",
        "refund_policy": "İptal ve İade Koşulları",
        "cart_header_title": "Sipariş Listeniz",
        "cart_header_desc": "İncelediğiniz ürünlerin listesi. Fiyat teklifi veya sipariş için listeyi bize iletebilirsiniz.",
        "cart_qty_suffix": "Adet",
        "cart_item_size": "Beden",
        "cart_item_color": "Renk",
        "whatsapp_quote_title": "MeteMorali Teklif Talebi",
        "whatsapp_products": "Ürünler",
        "whatsapp_qty": "Adet",
        "whatsapp_unit_price": "Birim Fiyat",
        "whatsapp_total": "Toplam",
        "general_total": "Genel Toplam",
        "terms_check_html": "\"Telefon ile giriş yap\" butonuna tıklayarak, belirtilen numara ile giriş yapmayı onaylıyorum. <a href=\"sozlesmeler#aydinlatma\" target=\"_blank\">Aydınlatma Metni</a>'ni ve <a href=\"sozlesmeler#gizlilik\" target=\"_blank\">Gizlilik Politikası</a>'nı kabul ediyorum.",
        "or_lowercase": "veya",
        "password": "Şifre",
        "enter_password_placeholder": "Şifrenizi girin",
        "alert_enter_phone": "Lütfen telefon numaranızı girin.",
        "alert_accept_terms": "Giriş yapabilmek için sözleşmeleri ve politikaları kabul etmelisiniz.",
        "alert_enter_password": "Lütfen şifrenizi girin.",
        "alert_profile_updated": "Profil bilgileriniz başarıyla güncellendi!",
        "hello_user": "Merhaba",
        "global_network_subtitle": "KÜRESEL İHRACAT AĞI",
        "global_network_title": "Hangi Ülkelere İhracat Yapıyoruz?",
        "global_network_desc": "MeteMorali; alev geciktirici (FR) kaynakçı elbiseleri, teknik emniyet takımları ve iş parkaları ile endüstriyel iş kıyafetlerinde yüksek güvenlik sunar.",
        "country_uk": "İngiltere",
        "country_germany": "Almanya",
        "country_france": "Fransa",
        "country_turkey": "Türkiye",
        "country_poland": "Polonya",
        "country_bulgaria": "Bulgaristan",
        "country_russia": "Rusya",
        "country_azerbaijan": "Azerbaycan",
        "country_kazakhstan": "Kazakistan",
        "country_uzbekistan": "Özbekistan",
        "country_kyrgyzstan": "Kırgızistan",
        "country_qatar_sa": "Katar / Suudi Arabistan",
        "collection_title": "METE MORALI KOLEKSİYON",
        "back_to_catalog": "Kataloğa Dön",
        "filter_all": "Tümü",
        "filter_welder": "Kaynakçı",
        "filter_supervisor": "Supervisor",
        "filter_parka": "Kışlık",
        "alert_enter_email": "Lütfen e-posta adresinizi girin.",
        "country_italy": "İtalya"
    },
    "en": {
        "whatsapp_order": "ORDER VIA WHATSAPP",
        "whatsapp_order_notice": "Direct connection to our sales representative",

        "checking_payment": "Checking Payment Status",
        "checking_payment_desc": "Please wait, fetching your payment result...",
        "payment_success": "Payment Successful!",
        "payment_success_desc": "Your payment has been securely received and your order has been confirmed. Thank you.",
        "payment_failed": "Payment Failed",
        "payment_failed_desc": "Credit card payment could not be processed. Please check your details and try again.",
        "order_no": "Order No",
        "auth_code": "Auth Code",
        "total_amount": "Paid Amount",
        "go_to_dashboard": "Go to Dashboard",
        "error_reason": "Error Reason",
        "try_again": "Return to Cart & Try Again",
        "credit_card_payment": "Secure Credit Card Payment (SSL)",
        "payment_subtitle": "Enter your card details to complete payment with 3D Secure.",

        "home": "Home",
        "catalog": "Catalog",
        "contact": "Contact",
        "certifications": "Certifications",
        "cert_title": "Our Certifications & Standards",
        "cert_subtitle": "Life-Preserving Protection in Compliance with International Safety Standards",
        "cert_11612_title": "EN ISO 11612 — Heat & Flame Protection",
        "cert_11612_desc": "The protection standard that prevents fabric from igniting in the presence of high temperatures, radiant heat, and open flame, ensuring it does not melt or conduct heat. Mandatory for metallurgy, foundry, and petrochemical plants.",
        "cert_11611_title": "EN ISO 11611 — Welder Protection",
        "cert_11611_desc": "A special stitching and durability standard developed against molten metal splashes, sparks, and short-term electric arc contacts during welding processes.",
        "cert_1149_title": "EN 1149-5 — Antistatic Protection",
        "cert_1149_desc": "The carbon fiber matrix standard woven into the fabric that prevents static electricity caused by friction from accumulating and creating sparks in explosive and flammable environments.",
        "cert_342_title": "EN 342 — Cold Protection",
        "cert_342_desc": "The high breathability and thermal insulation standard that protects body temperature at the ideal level under freezing cold and harsh winds while preventing sweating.",
        "my_account": "My Account",
        "cart": "Order List",
        "brand_desc": "Production of industrial workwear and technical safety clothing.",
        "brand_desc_short": "Industrial Safety & Workwear",
        "fast_menu": "Quick Menu",
        "copyright": "© 2026 Mete Morali. All rights reserved.",
        "explore_collection": "Explore Collection",
        "examine": "Examine",
        "details": "View Details",
        "cart_toast": "added to cart!",
        "order_summary": "Order Summary",
        "total_qty": "Total Items",
        "total_price": "Total Amount",
        "request_quote": "REQUEST QUOTE",
        "place_order": "CONFIRM ORDER",
        "pay_now": "PAY NOW",
        "alert_phone_required": "You must save your phone number in your profile to place an order. Redirecting to profile page.",
        "alert_phone_required_toast": "Please save your phone number in your profile to place an order.",
        "profile_updated_success": "Your profile details have been successfully updated!",
        "empty_cart_title": "Your Order List is Currently Empty",
        "empty_cart_desc": "Browse our catalog to review industrial workwear and add to your list.",
        "write_to_us": "Write to Us",
        "fullname": "Full Name",
        "email_address": "Email Address",
        "select_subject": "Select Subject",
        "general_info": "General Info",
        "delivery": "Order & Delivery",
        "subject_dealership": "Dealership",
        "message": "Your Message...",
        "send_btn": "Send",
        "sending": "Sending...",
        "msg_sent": "✓ Message Sent!",
        "msg_error": "Error! Try again.",
        "or_separator": "OR",
        "whatsapp": "WHATSAPP",
        "phone": "PHONE",
        "email": "EMAIL",
        "live_support": "LIVE SUPPORT",
        "spam_protection": "Spam protection: Please wait 1 minute before sending a new message.",
        "profil_info": "Profile Info",
        "my_orders": "My Orders",
        "my_addresses": "My Addresses",
        "logout": "Log Out",
        "update_btn": "Update",
        "new_password_optional": "New Password (Optional)",
        "export_title": "All Countries We Export To",
        "export_central_asia": "Central Asian Countries",
        "export_central_asia_desc": "Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, Tajikistan, Azerbaijan, Georgia, Russian Federation and strategic projects in the region.",
        "export_europe": "All European Countries",
        "export_europe_desc": "Germany, France, Italy, United Kingdom, Netherlands, Belgium, Switzerland, Austria, Spain, Portugal, Romania, Bulgaria, Greece and the entire Balkan region.",
        "export_cta": "Are you in a different country or region? Contact us, and we will bring safety to your project wherever you are in the world.",
        "empty_state_orders": "You have no orders placed at the moment.",
        "empty_state_addresses": "You have no saved addresses.",
        "forgot_password": "Forgot Password?",
        "forgot_password_desc": "Enter your email address to reset your password.",
        "send_reset_link": "Send Reset Link",
        "check_inbox": "We have sent a link containing password reset instructions to your email address.",
        "reset_link_sent": "Link Sent!",
        "login_title": "Log in or register",
        "phone_subtitle": "Enter your phone number",
        "email_subtitle": "Enter your email address",
        "phone_btn": "Log in with Phone",
        "email_btn": "Log in with Email",
        "terms_check": "By clicking \"Log in with Phone\", I approve logging in with the specified number. I accept the Disclosure Text and Privacy Policy.",
        "terms_check_link": "Disclosure Text",
        "privacy_check_link": "Privacy Policy",
        "continue_btn": "Continue",
        "back_to_phone": "Return to Phone Login",
        "size_select": "Size Selection",
        "color_select": "Color Selection",
        "add_to_cart": "ADD TO CART",
        "loading_product": "Loading Product...",
        "product_not_found": "Product not found!",
        "api_error": "API Connection Error!",
        "error_404_title": "Page Not Found",
        "error_404_desc": "It looks like you're in the wrong section of the industrial facility.",
        "go_home": "Go to Home",
        "katalog_title": "Discover Our Collection",
        "katalog_desc": "Our products that provide maximum performance and safety in challenging conditions.",
        "legal_title": "Legal Information",
        "user_agreement": "User Agreement",
        "privacy_policy": "Privacy Policy",
        "kvkk_text": "KVKK Disclosure Text",
        "cookie_policy": "Cookie Policy",
        "sales_agreement": "Distance Sales Agreement",
        "refund_policy": "Cancellation & Return Policy",
        "cart_header_title": "Your Order List",
        "cart_header_desc": "List of products you reviewed. You can send this list to us for a quote or order.",
        "cart_qty_suffix": "pcs",
        "cart_item_size": "Size",
        "cart_item_color": "Color",
        "whatsapp_quote_title": "MeteMorali Quote Request",
        "whatsapp_products": "Products",
        "whatsapp_qty": "Qty",
        "whatsapp_unit_price": "Unit Price",
        "whatsapp_total": "Total",
        "general_total": "Grand Total",
        "terms_check_html": "By clicking \"Log in with Phone\", I approve logging in with the specified number. I accept the <a href=\"sozlesmeler#aydinlatma\" target=\"_blank\">Disclosure Text</a> and <a href=\"sozlesmeler#gizlilik\" target=\"_blank\">Privacy Policy</a>.",
        "or_lowercase": "or",
        "password": "Password",
        "enter_password_placeholder": "Enter your password",
        "alert_enter_phone": "Please enter your phone number.",
        "alert_accept_terms": "You must accept the terms and policies to log in.",
        "alert_enter_email": "Please enter your email address.",
        "alert_enter_password": "Please enter your password.",
        "alert_profile_updated": "Your profile information has been successfully updated!",
        "hello_user": "Hello",
        "global_network_subtitle": "GLOBAL EXPORT NETWORK",
        "global_network_title": "Which Countries Do We Export To?",
        "global_network_desc": "Mete Morali quality carries safety to challenging projects all over the world. Hover over the dots to see our export locations.",
        "country_uk": "United Kingdom",
        "country_germany": "Germany",
        "country_france": "France",
        "country_italy": "Italy",
        "country_turkey": "Turkey",
        "country_poland": "Poland",
        "country_bulgaria": "Bulgaria",
        "country_russia": "Russia",
        "country_azerbaijan": "Azerbaijan",
        "country_kazakhstan": "Kazakhstan",
        "country_uzbekistan": "Uzbekistan",
        "country_kyrgyzstan": "Kyrgyzstan",
        "country_qatar_sa": "Qatar / Saudi Arabia",
        "collection_title": "METE MORALI COLLECTION",
        "back_to_catalog": "Back to Catalog",
        "filter_all": "All",
        "filter_welder": "Welder",
        "filter_supervisor": "Supervisor",
        "filter_parka": "Winter",
        "back_to_login": "Back to Login"
    },
    "de": {
        "whatsapp_order": "ÜBER WHATSAPP BESTELLEN",
        "whatsapp_order_notice": "Direkte Verbindung zu unserem Kundenberater",

        "checking_payment": "Zahlungsstatus wird überprüft",
        "checking_payment_desc": "Bitte warten, Ihr Zahlungsergebnis wird abgerufen...",
        "payment_success": "Zahlung erfolgreich!",
        "payment_success_desc": "Ihre Zahlung wurde sicher empfangen und Ihre Bestellung bestätigt. Vielen Dank.",
        "payment_failed": "Zahlung fehlgeschlagen",
        "payment_failed_desc": "Die Kreditkartenzahlung konnte nicht verarbeitet werden. Bitte überprüfen Sie Ihre Angaben und versuchen Sie es erneut.",
        "order_no": "Bestellnr.",
        "auth_code": "Autorisierungscode",
        "total_amount": "Gezahlter Betrag",
        "go_to_dashboard": "Zum Kundenkonto",
        "error_reason": "Fehlergrund",
        "try_again": "Zurück zum Warenkorb und erneut versuchen",
        "credit_card_payment": "Sichere Kreditkartenzahlung (SSL)",
        "payment_subtitle": "Geben Sie Ihre Kartendaten ein, um die Zahlung mit 3D Secure abzuschließen.",

        "home": "Startseite",
        "catalog": "Katalog",
        "contact": "Kontakt",
        "certifications": "Zertifikate",
        "cert_title": "Unsere Zertifikate & Standards",
        "cert_subtitle": "Lebensrettender Schutz in Übereinstimmung mit internationalen Sicherheitsstandards",
        "cert_11612_title": "EN ISO 11612 — Hitze- und Flammschutz",
        "cert_11612_desc": "Der Schutzstandard, der das Entzünden des Gewebes bei hohen Temperaturen, Strahlungswärme und offener Flamme verhindert, um sicherzustellen, dass es nicht schmilzt oder Wärme leitet. Vorgeschrieben für Metallurgie, Gießereien und petrochemische Anlagen.",
        "cert_11611_title": "EN ISO 11611 — Schweißerschutz",
        "cert_11611_desc": "Ein spezieller Naht- und Haltbarkeitsstandard, der gegen geschmolzene Metallspritzer, Funken und kurzzeitigen Lichtbogenkontakt bei Schweißprozessen entwickelt wurde.",
        "cert_1149_title": "EN 1149-5 — Antistatischer Schutz",
        "cert_1149_desc": "Der in den Stoff eingewebte Kohlefasermatrix-Standard, der verhindert, dass sich durch Reibung verursachte statische Elektrizität in explosiven und entflammbaren Umgebungen ansammelt und Funken erzeugt.",
        "cert_342_title": "EN 342 — Kälteschutz",
        "cert_342_desc": "Der Standard für hohe Atmungsaktivität und Wärmeisolierung, der die Körpertemperatur bei eisiger Kälte und starkem Wind auf idealem Niveau schützt und gleichzeitig das Schwitzen verhindert.",
        "my_account": "Mein Konto",
        "cart": "Bestellliste",
        "brand_desc": "Herstellung von industrieller Arbeitskleidung und technischer Sicherheitsbekleidung.",
        "brand_desc_short": "Industrielle Arbeits- & Schutzkleidung",
        "fast_menu": "Schnellmenü",
        "copyright": "© 2026 Mete Morali. Alle Rechte vorbehalten.",
        "explore_collection": "Kollektion entdecken",
        "examine": "Bekijken",
        "details": "Details anzeigen",
        "cart_toast": "in den Warenkorb gelegt!",
        "order_summary": "Bestellübersicht",
        "total_qty": "Gesamtartikel",
        "total_price": "Gesamtbetrag",
        "request_quote": "ANGEBOT ANFORDERN",
        "place_order": "BESTELLUNG BESTÄTIGEN",
        "pay_now": "JETZT BEZAHLEN",
        "alert_phone_required": "Sie müssen Ihre Telefonnummer in Ihrem Profil speichern, um eine Bestellung aufzugeben. Weiterleitung zur Profilseite.",
        "alert_phone_required_toast": "Bitte speichern Sie Ihre Telefonnummer in Ihrem Profil, um eine Bestellung aufzugeben.",
        "profile_updated_success": "Ihre Profilinformationen wurden erfolgreich aktualisiert!",
        "empty_cart_title": "Ihre Bestellliste ist derzeit leer",
        "empty_cart_desc": "Durchsuchen Sie unseren Katalog, um Arbeitskleidung zu prüfen und Ihrer Liste hinzuzufügen.",
        "write_to_us": "Schreiben Sie uns",
        "fullname": "Vor- und Nachname",
        "email_address": "E-Mail-Adresse",
        "select_subject": "Betreff auswählen",
        "general_info": "Allg. Informationen",
        "delivery": "Bestellung & Lieferung",
        "subject_dealership": "Händlerschaft",
        "message": "Ihre Nachricht...",
        "send_btn": "Senden",
        "sending": "Wird gesendet...",
        "msg_sent": "✓ Nachricht gesendet!",
        "msg_error": "Fehler! Nochmal versuchen.",
        "or_separator": "ODER",
        "whatsapp": "WHATSAPP",
        "phone": "TELEFON",
        "email": "E-MAIL",
        "live_support": "LIVE-SUPPORT",
        "spam_protection": "Spamschutz: Bitte warten Sie 1 minute, bevor Sie eine neue Nachricht senden.",
        "profil_info": "Profilinformationen",
        "my_orders": "Meine Bestellungen",
        "my_addresses": "Meine Adressen",
        "logout": "Abmelden",
        "update_btn": "Aktualisieren",
        "new_password_optional": "Neues Passwort (Optional)",
        "export_title": "Alle Länder, in die wir exportieren",
        "export_central_asia": "Zentralasiatische Länder",
        "export_central_asia_desc": "Kasachstan, Usbekistan, Turkmenistan, Kirgisistan, Tadschikistan, Aserbaidschan, Georgien, Russische Föderation und strategische Projekte in der Region.",
        "export_europe": "Alle europäischen Länder",
        "export_europe_desc": "Deutschland, Frankreich, Italien, Vereinigtes Königreich, Niederlande, Belgien, Schweiz, Österreich, Spanien, Portugal, Rumänien, Bulgarien, Griechenland und die gesamte Balkanregion.",
        "export_cta": "Sind Sie in einem anderen Land oder einer anderen Region? Kontaktieren Sie uns, und wir bringen Sicherheit in Ihr Projekt, wo immer Sie sich auf der Welt befinden.",
        "empty_state_orders": "Sie haben derzeit keine Bestellungen.",
        "empty_state_addresses": "Sie haben keine gespeicherten Adressen.",
        "forgot_password": "Passwort vergessen?",
        "forgot_password_desc": "Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen.",
        "send_reset_link": "Reset-Link senden",
        "check_inbox": "Wir haben einen Link mit Anweisungen zum Zurücksetzen des Passworts an Ihre E-Mail-Adresse gesendet.",
        "reset_link_sent": "Link gesendet!",
        "login_title": "Einloggen oder registrieren",
        "phone_subtitle": "Telefonnummer eingeben",
        "email_subtitle": "E-Mail-Adresse eingeben",
        "phone_btn": "Mit Telefon einloggen",
        "email_btn": "Mit E-Mail einloggen",
        "terms_check": "Mit dem Klick auf \"Mit Telefon einloggen\" stimme ich dem Login mit der angegebenen Nummer zu. Ich akzeptiere den Aufklärungstext und die Datenschutzrichtlinie.",
        "terms_check_link": "Aufklärungstext",
        "privacy_check_link": "Datenschutzrichtlinie",
        "continue_btn": "Weiter",
        "back_to_phone": "Zurück zum Telefon-Login",
        "back_to_login": "Zurück zum Login",
        "size_select": "Größenauswahl",
        "color_select": "Farbwahl",
        "add_to_cart": "IN WARENKORB",
        "loading_product": "Produkt wird geladen...",
        "product_not_found": "Produkt nicht gefunden!",
        "api_error": "API-Verbindungsfehler!",
        "error_404_title": "Seite nicht gefunden",
        "error_404_desc": "Es sieht so aus, als ob Sie sich im falschen Bereich der Industrieanlage befinden.",
        "go_home": "Zur Startseite",
        "katalog_title": "Entdecken Sie unsere Kollektion",
        "katalog_desc": "Unsere Produkte, die maximale Leistung und Sicherheit unter anspruchsvollen Bedingungen bieten.",
        "legal_title": "Rechtliche Informationen",
        "user_agreement": "Nutzungsvereinbarung",
        "privacy_policy": "Datenschutzrichtlinie",
        "kvkk_text": "KVKK Aufklärungstext",
        "cookie_policy": "Cookie-Richtlinie",
        "sales_agreement": "Fernabsatzvertrag",
        "refund_policy": "Stornierungs- und Rückgabebedingungen",
        "cart_header_title": "Ihre Bestellliste",
        "cart_header_desc": "Liste der von Ihnen überprüften Produkte. Sie können uns diese Liste für ein Angebot oder eine Bestellung senden.",
        "cart_qty_suffix": "Stk",
        "cart_item_size": "Größe",
        "cart_item_color": "Farbe",
        "whatsapp_quote_title": "MeteMorali Angebotsanfrage",
        "whatsapp_products": "Produkte",
        "whatsapp_qty": "Menge",
        "whatsapp_unit_price": "Einzelpreis",
        "whatsapp_total": "Gesamt",
        "general_total": "Gesamtsumme",
        "terms_check_html": "Durch Klicken auf \"Mit Telefon anmelden\" stimme ich der Anmeldung mit der angegebenen Nummer zu. Ich akzeptiere die <a href=\"sozlesmeler#aydinlatma\" target=\"_blank\">Datenschutzerklärung</a> und die <a href=\"sozlesmeler#gizlilik\" target=\"_blank\">Cookie-Richtlinie</a>.",
        "or_lowercase": "oder",
        "password": "Passwort",
        "enter_password_placeholder": "Geben Sie Ihr Passwort ein",
        "alert_enter_phone": "Bitte geben Sie Ihre Telefonnummer ein.",
        "alert_accept_terms": "Sie müssen die Bedingungen und Richtlinien akzeptieren, um sich anzumelden.",
        "alert_enter_email": "Bitte geben Sie Ihre E-Mail-Adresse ein.",
        "alert_enter_password": "Bitte geben Sie Ihr Passwort ein.",
        "alert_profile_updated": "Ihre Profilinformationen wurden erfolgreich aktualisiert!",
        "hello_user": "Hallo",
        "global_network_subtitle": "GLOBALES EXPORTNETZWERK",
        "global_network_title": "In welche Länder exportieren wir?",
        "global_network_desc": "Die Qualität von Mete Morali bringt Sicherheit in anspruchsvolle Projekte weltweit. Bewegen Sie den Mauszeiger über die Punkte, um unsere Exportstandorte zu sehen.",
        "country_uk": "Vereinigtes Königreich",
        "country_germany": "Deutschland",
        "country_france": "Frankreich",
        "country_italy": "Italien",
        "country_turkey": "Türkei",
        "country_poland": "Polen",
        "country_bulgaria": "Bulgarien",
        "country_russia": "Russland",
        "country_azerbaijan": "Aserbaidschan",
        "country_kazakhstan": "Kasachstan",
        "country_uzbekistan": "Usbekistan",
        "country_qatar_sa": "Katar / Saudi-Arabien",
        "collection_title": "METE MORALI KOLLEKTION",
        "back_to_catalog": "Zurück zum Katalog",
        "filter_all": "Alle",
        "filter_welder": "Schweißer",
        "filter_supervisor": "Supervisor",
        "filter_parka": "Winter",
        "country_kyrgyzstan": "Kirgisistan"
    },
    "ru": {
        "whatsapp_order": "ЗАКАЗАТЬ ЧЕРЕЗ WHATSAPP",
        "whatsapp_order_notice": "Прямая связь с нашим представителем",

        "checking_payment": "Проверка статуса платежа",
        "checking_payment_desc": "Пожалуйста, подождите, получаем результат оплаты...",
        "payment_success": "Оплата прошла успешно!",
        "payment_success_desc": "Ваш платеж успешно принят, и ваш заказ подтвержден. Спасибо.",
        "payment_failed": "Ошибка оплаты",
        "payment_failed_desc": "Платеж банковской картой не удался. Проверьте данные и попробуйте снова.",
        "order_no": "Номер заказа",
        "auth_code": "Код подтверждения",
        "total_amount": "Оплаченная сумма",
        "go_to_dashboard": "Перейти в личный кабинет",
        "error_reason": "Причина ошибки",
        "try_again": "Вернуться в корзину и повторить",
        "credit_card_payment": "Безопасная оплата картой (SSL)",
        "payment_subtitle": "Введите данные карты для завершения оплаты через 3D Secure.",

        "home": "Главная",
        "catalog": "Каталог",
        "contact": "Контакты",
        "certifications": "Сертификаты",
        "cert_title": "Наши сертификаты и стандарты",
        "cert_subtitle": "Защита жизни в соответствии с международными стандартами безопасности",
        "cert_11612_title": "EN ISO 11612 — Защита от тепла и пламени",
        "cert_11612_desc": "Стандарт защиты, предотвращающий воспламенение ткани при воздействии высоких температур, теплового излучения и открытого пламени, гарантирующий, что она не плавится и не проводит тепло. Обязателен для металлургии, литейных цехов и нефтехимических заводов.",
        "cert_11611_title": "EN ISO 11611 — Защита сварщика",
        "cert_11611_desc": "Специальный стандарт швов и износостойкости, разработанный для защиты от брызг расплавленного металла, искр и кратковременного контакта с электрической дугой во время сварочных процессов.",
        "cert_1149_title": "EN 1149-5 — Антистатическая защита",
        "cert_1149_desc": "Стандарт углеродной волокнистой матрицы, вплетенной в ткань, который предотвращает накопление статического электричества от трения и образование искр во взрывоопасных и легковоспламеняющихся средах.",
        "cert_342_title": "EN 342 — Защита от холода",
        "cert_342_desc": "Стандарт высокой воздухопроницаемости и теплоизоляции, защищающий температуру тела на идеальном уровне при сильном холоде и ветре, предотвращая потоотделение.",
        "my_account": "Кабинет",
        "cart": "Список заказа",
        "brand_desc": "Производство промышленной спецодежды и технической защитной одежды.",
        "brand_desc_short": "Промышленная спецодежда и защита",
        "fast_menu": "Быстрое меню",
        "copyright": "© 2026 Mete Morali. Все права защищены.",
        "explore_collection": "Открыть коллекцию",
        "examine": "Изучить",
        "details": "Посмотреть детали",
        "cart_toast": "добавлено в корзину!",
        "order_summary": "Сводка заказа",
        "total_qty": "Всего товаров",
        "total_price": "Итоговая сумма",
        "request_quote": "ЗАПРОСИТЬ ЦЕНУ",
        "place_order": "ПОДТВЕРДИТЬ ЗАКАЗ",
        "pay_now": "ОПЛАТИТЬ",
        "alert_phone_required": "Для оформления заказа необходимо сохранить номер телефона в профиле. Перенаправление на страницу профиля.",
        "alert_phone_required_toast": "Пожалуйста, сохраните номер телефона в вашем профиле, чтобы оформить заказ.",
        "profile_updated_success": "Информация вашего профиля была успешно обновлена!",
        "empty_cart_title": "Ваш список заказов пуст",
        "empty_cart_desc": "Просмотрите наш каталог, чтобы ознакомиться со спецодеждой.",
        "write_to_us": "Напишите нам",
        "fullname": "Имя Фамилия",
        "email_address": "Электронная почта",
        "select_subject": "Выберите тему",
        "general_info": "Общая информация",
        "delivery": "Заказ и доставка",
        "subject_dealership": "Дилерство",
        "message": "Ваше сообщение...",
        "send_btn": "Отправить",
        "sending": "Отправка...",
        "msg_sent": "✓ Сообщение отправлено!",
        "msg_error": "Ошибка! Повторите.",
        "or_separator": "ИЛИ",
        "whatsapp": "WHATSAPP",
        "phone": "ТЕЛЕФОН",
        "email": "ЭЛ. ПОЧТА",
        "live_support": "ОНЛАЙН-ПОДДЕРЖКА",
        "spam_protection": "Защита от спама: подождите 1 минуту перед отправкой нового сообщения.",
        "profil_info": "Данные профиля",
        "my_orders": "Мои заказы",
        "my_addresses": "Мои адреса",
        "logout": "Выйти",
        "update_btn": "Обновить",
        "new_password_optional": "Новый пароль (Необязательно)",
        "export_title": "Все страны, в которые мы экспортируем",
        "export_central_asia": "Страны Центральной Азии",
        "export_central_asia_desc": "Казахстан, Узбекистан, Туркменистан, Кыргызстан, Таджикистан, Азербайджан, Грузия, Российская Федерация и стратегические проекты в регионе.",
        "export_europe": "Все европейские страны",
        "export_europe_desc": "Германия, Франция, Италия, Великобритания, Нидерланды, Бельгия, Швейцария, Австрия, Испания, Португалия, Румыния, Болгария, Греция и весь Балканский регион.",
        "export_cta": "Вы находитесь в другой стране или регионе? Свяжитесь с нами, и мы обеспечим безопасность вашего проекта, где бы вы ни находились.",
        "empty_state_orders": "У вас пока нет оформленных заказов.",
        "empty_state_addresses": "У вас нет сохраненных адресов.",
        "forgot_password": "Забыли пароль?",
        "forgot_password_desc": "Введите ваш e-mail для сброса пароля.",
        "send_reset_link": "Отправить ссылку",
        "check_inbox": "Мы отправили ссылку для сброса пароля на ваш адрес электронной почты.",
        "reset_link_sent": "Ссылка отправлена!",
        "login_title": "Войти или зарегистрироваться",
        "phone_subtitle": "Введите номер телефона",
        "email_subtitle": "Введите e-mail адрес",
        "phone_btn": "Войти по телефону",
        "email_btn": "Войти по e-mail",
        "terms_check": "Нажимая «Войти по телефону», я подтверждаю вход с указанным номером. Я принимаю Информационный текст и Политику конфиденциальности.",
        "terms_check_link": "Информационный текст",
        "privacy_check_link": "Политика конфиденциальности",
        "continue_btn": "Продолжить",
        "back_to_phone": "Войти по телефону",
        "back_to_login": "Вернуться к входу",
        "size_select": "Выбор размера",
        "color_select": "Выбор цвета",
        "add_to_cart": "ДОБАВИТЬ В КОРЗИНУ",
        "loading_product": "Товар загружается...",
        "product_not_found": "Товар не найден!",
        "api_error": "Ошибка подключения к API!",
        "error_404_title": "Страница не найдена",
        "error_404_desc": "Похоже, вы находитесь не в том секторе промышленного объекта.",
        "go_home": "На главную",
        "katalog_title": "Откройте нашу коллекцию",
        "katalog_desc": "Наши продукты, обеспечивающие максимальную безопасность в сложных условиях.",
        "legal_title": "Юридическая информация",
        "user_agreement": "Пользовательское соглашение",
        "privacy_policy": "Политика конфиденциальности",
        "kvkk_text": "Информационный текст KVKK",
        "cookie_policy": "Политика файлов cookie",
        "sales_agreement": "Договор дистанционной продажи",
        "refund_policy": "Условия отмены и возврата",
        "cart_header_title": "Ваш список заказа",
        "cart_header_desc": "Список продуктов, которые вы просмотрели. Вы можете отправить этот список нам для запроса цены или заказа.",
        "cart_qty_suffix": "шт",
        "cart_item_size": "Размер",
        "cart_item_color": "Цвет",
        "whatsapp_quote_title": "MeteMorali Запрос цены",
        "whatsapp_products": "Продукты",
        "whatsapp_qty": "Кол-во",
        "whatsapp_unit_price": "Цена за ед.",
        "whatsapp_total": "Итого",
        "general_total": "Общий итог",
        "terms_check_html": "Нажимая кнопку \"Войти с помощью телефона\", я подтверждаю вход под указанным номером. Я принимаю <a href=\"sozlesmeler#aydinlatma\" target=\"_blank\">Информационный текст</a> и <a href=\"sozlesmeler#gizlilik\" target=\"_blank\">Политику конфиденциальности</a>.",
        "or_lowercase": "или",
        "password": "Пароль",
        "enter_password_placeholder": "Введите ваш пароль",
        "alert_enter_phone": "Пожалуйста, введите свой номер телефона.",
        "alert_accept_terms": "Вы должны принять условия и политику для входа.",
        "alert_enter_email": "Пожалуйста, введите свой адрес электронной почты.",
        "alert_enter_password": "Пожалуйста, введите свой пароль.",
        "alert_profile_updated": "Информация вашего профиля была успешно обновлена!",
        "hello_user": "Здравствуйте",
        "global_network_subtitle": "ГЛОБАЛЬНАЯ ЭКСПОРТНАЯ СЕТЬ",
        "global_network_title": "В какие страны мы экспортируем?",
        "global_network_desc": "Качество Mete Morali обеспечивает безопасность в сложных проектах по всему миру. Наведите курсор на точки, чтобы увидеть наши направления экспорта.",
        "country_uk": "Великобритания",
        "country_germany": "Германия",
        "country_france": "Франция",
        "country_italy": "Италия",
        "country_turkey": "Турция",
        "country_poland": "Польша",
        "country_bulgaria": "Болгария",
        "country_russia": "Россия",
        "country_azerbaijan": "Азербайджан",
        "country_kazakhstan": "Казахстан",
        "country_uzbekistan": "Узбекистан",
        "country_kyrgyzstan": "Кыргызстан",
        "country_qatar_sa": "Катар / Саудовская Аравия",
        "collection_title": "КОЛЛЕКЦИЯ METE MORALI",
        "back_to_catalog": "Назад в каталог",
        "filter_all": "Все",
        "filter_welder": "Сварщик",
        "filter_supervisor": "Супервайзер",
        "filter_parka": "Зимние"
    },
    "nl": {
        "whatsapp_order": "BESTELLEN VIA WHATSAPP",
        "whatsapp_order_notice": "Direct contact met onze verkoopvertegenwoordiger",

        "checking_payment": "Betalingsstatus controleren",
        "checking_payment_desc": "Even geduld, uw betalingsresultaat wordt opgehaald...",
        "payment_success": "Betaling geslaagd!",
        "payment_success_desc": "Uw betaling is veilig ontvangen en uw bestelling is bevestigd. Bedankt.",
        "payment_failed": "Betaling mislukt",
        "payment_failed_desc": "De creditcardbetaling kon niet worden verwerkt. Controleer uw gegevens en probeer het opnieuw.",
        "order_no": "Bestelnummer",
        "auth_code": "Autorisatiecode",
        "total_amount": "Betaald bedrag",
        "go_to_dashboard": "Ga naar dashboard",
        "error_reason": "Reden van fout",
        "try_again": "Terug naar winkelmand en opnieuw proberen",
        "credit_card_payment": "Veilige creditcardbetaling (SSL)",
        "payment_subtitle": "Voer uw kaartgegevens in om de betaling te voltooien met 3D Secure.",

        "home": "Home",
        "catalog": "Catalogus",
        "contact": "Contact",
        "certifications": "Certificeringen",
        "cert_title": "Onze Certificeringen & Standaarden",
        "cert_subtitle": "Levensreddende bescherming in overeenstemming met internationale veiligheidsnormen",
        "cert_11612_title": "EN ISO 11612 — Hitte- en vlamkennis",
        "cert_11612_desc": "De beschermingsnorm die voorkomt dat stof ontbrandt bij hoge temperaturen, stralingshitte en open vuur, waardoor het niet smelt of warmte geleidt. Verplicht voor metallurgie, gieterijen en petrochemische fabrieken.",
        "cert_11611_title": "EN ISO 11611 — Lassersbescherming",
        "cert_11611_desc": "Een speciale stiksel- en duurzaamheidsnorm ontwikkeld tegen spatten van gesmolten metaal, vonken en kortstondige elektrische boogcontacten tijdens lasprocessen.",
        "cert_1149_title": "EN 1149-5 — Antistatische bescherming",
        "cert_1149_desc": "De in de stof geweven koolstofvezelmatrixnorm die voorkomt dat statische elektriciteit veroorzaakt door wrijving zich ophoopt en vonken veroorzaakt in explosieve en ontvlambare omgevingen.",
        "cert_342_title": "EN 342 — Koud bescherming",
        "cert_342_desc": "De norm voor hoog ademend vermogen en thermische isolatie die de lichaamstemperatuur op het ideale niveau beschermt bij ijzige kou en harde wind, terwijl zweten wordt voorkomen.",
        "my_account": "Mijn account",
        "cart": "Bestellijst",
        "brand_desc": "Productie van industriële werkkleding en technische veiligheidskleding.",
        "brand_desc_short": "Industriële Werk- en Veiligheidskleding",
        "fast_menu": "Snelmenu",
        "copyright": "© 2026 Mete Morali. Alle rechten voorbehouden.",
        "explore_collection": "Ontdek de collectie",
        "examine": "Bekijken",
        "details": "Details bekijken",
        "cart_toast": "toegevoegd aan winkelwagen!",
        "order_summary": "Besteloverzicht",
        "total_qty": "Totaal artikelen",
        "total_price": "Totale prijs",
        "request_quote": "OFFERTE AANVRAGEN",
        "place_order": "BESTELLING BEVESTIGEN",
        "empty_cart_title": "Uw bestellijst is momenteel leeg",
        "empty_cart_desc": "Blader door onze catalogus om industriële werkkleding te bekijken.",
        "write_to_us": "Schrijf ons",
        "fullname": "Voor- en achternaam",
        "email_address": "E-mailadres",
        "select_subject": "Selecteer onderwerp",
        "general_info": "Algemene informatie",
        "delivery": "Bestelling & Levering",
        "subject_dealership": "Dealerschap",
        "message": "Uw bericht...",
        "send_btn": "Verzenden",
        "sending": "Verzenden...",
        "msg_sent": "✓ Bericht verzonden!",
        "msg_error": "Fout! Probeer het opnieuw.",
        "or_separator": "OF",
        "whatsapp": "WHATSAPP",
        "phone": "TELEFOON",
        "email": "E-MAIL",
        "live_support": "LIVE-SUPPORT",
        "spam_protection": "Spambeveiliging: wacht 1 minuut voordat u een nieuw bericht verzendt.",
        "profil_info": "Profielinfo",
        "my_orders": "Mijn bestellingen",
        "my_addresses": "Mijn adressen",
        "logout": "Uitloggen",
        "update_btn": "Bijwerken",
        "new_password_optional": "Nieuw wachtwoord (Optioneel)",
        "export_title": "Alle landen waarnaar we exporteren",
        "export_central_asia": "Centraal-Aziatische landen",
        "export_central_asia_desc": "Kazachstan, Oezbekistan, Turkmenistan, Kirgizië, Tadzjikistan, Azerbeidzjan, Georgië, Russische Federatie en strategische projecten in de regio.",
        "export_europe": "Alle Europese landen",
        "export_europe_desc": "Duitsland, Frankrijk, Italië, Verenigd Koninkrijk, Nederland, Belgien, Zwitserland, Oostenrijk, Spanje, Portugal, Roemenië, Bulgarije, Griekenland en de hele Balkanregio.",
        "export_cta": "Bent u in een ander land of regio? Neem contact met ons op en we brengen veiligheid naar uw project, waar ter wereld u ook bent.",
        "empty_state_orders": "U heeft momenteel geen bestellingen geplaatst.",
        "empty_state_addresses": "U heeft geen opgeslagen adressen.",
        "forgot_password": "Wachtwoord vergeten?",
        "forgot_password_desc": "Voer uw e-mailadres in om uw wachtwoord te herstellen.",
        "send_reset_link": "Resetlink verzenden",
        "check_inbox": "We hebben een link met instructies naar uw e-mailadres gestuurd.",
        "reset_link_sent": "Link verzonden!",
        "login_title": "Inloggen of registreren",
        "phone_subtitle": "Voer uw telefoonnummer in",
        "email_subtitle": "Voer uw e-mailadres in",
        "phone_btn": "Inloggen met telefoon",
        "email_btn": "Inloggen met e-mail",
        "terms_check": "Door op \"Inloggen met telefoon\" te klikken, keur ik inloggen met het opgegeven nummer goed. Ik accepteer de Toelichtingsgids en het Privacybeleid.",
        "terms_check_link": "Toelichtingsgids",
        "privacy_check_link": "Privacybeleid",
        "continue_btn": "Doorgaan",
        "back_to_phone": "Terug naar inloggen met telefoon",
        "back_to_login": "Terug naar inloggen",
        "size_select": "Maatselectie",
        "color_select": "Kleurselectie",
        "add_to_cart": "IN WINKELWAGEN",
        "loading_product": "Product laden...",
        "product_not_found": "Product niet gevonden!",
        "api_error": "API-verbindingsfout!",
        "error_404_title": "Pagina niet gevonden",
        "error_404_desc": "Het lijkt erop dat u zich in het verkeerde deel van de industriële faciliteit bevindt.",
        "go_home": "Terug naar startpagina",
        "katalog_title": "Ontdek onze collectie",
        "katalog_desc": "Onze producten die maximale veiligheid bieden in uitdagende omstandigheden.",
        "legal_title": "Juridische informatie",
        "user_agreement": "Gebruikersovereenkomst",
        "privacy_policy": "Privacybeleid",
        "kvkk_text": "KVKK Toelichtingsgids",
        "cookie_policy": "Cookiebeleid",
        "sales_agreement": "Overeenkomst op afstand",
        "refund_policy": "Annulerings- en retourbeleid",
        "cart_header_title": "Uw Bestellijst",
        "cart_header_desc": "Lijst met producten die u hebt beoordeeld. U kunt deze lijst naar ons sturen voor een offerte of bestelling.",
        "cart_qty_suffix": "st",
        "cart_item_size": "Maat",
        "cart_item_color": "Kleur",
        "whatsapp_quote_title": "MeteMorali Offerteaanvraag",
        "whatsapp_products": "Producten",
        "whatsapp_qty": "Aantal",
        "whatsapp_unit_price": "Stukprijs",
        "whatsapp_total": "Totaal",
        "general_total": "Eindtotaal",
        "terms_check_html": "Door op \"Inloggen met telefoon\" te klikken, keur ik het inloggen met het opgegeven nummer goed. Ik accepteer de <a href=\"sozlesmeler#aydinlatma\" target=\"_blank\">Informatieve Tekst</a> en het <a href=\"sozlesmeler#gizlilik\" target=\"_blank\">Privacybeleid</a>.",
        "or_lowercase": "of",
        "password": "Wachtwoord",
        "enter_password_placeholder": "Voer uw wachtwoord in",
        "alert_enter_phone": "Voer uw telefoonnummer in.",
        "alert_accept_terms": "U moet de voorwaarden en het beleid accepteren om in te loggen.",
        "alert_enter_email": "Voer uw e-mailadres in.",
        "alert_enter_password": "Voer uw wachtwoord in.",
        "alert_profile_updated": "Uw profielgegevens zijn succesvol bijgewerkt!",
        "hello_user": "Hallo",
        "global_network_subtitle": "WERELDWIJD EXPORTNETWERK",
        "global_network_title": "Naar welke landen exporteren we?",
        "global_network_desc": "De kwaliteit van Mete Morali brengt veiligheid naar uitdagende projecten over de hele wereld. Beweeg de muisaanwijzer over de stippen om onze exportlocaties te zien.",
        "country_uk": "Verenigd Koninkrijk",
        "country_germany": "Duitsland",
        "country_france": "Frankrijk",
        "country_italy": "Italië",
        "country_turkey": "Turkije",
        "country_poland": "Polen",
        "country_bulgaria": "Bulgarije",
        "country_russia": "Rusland",
        "country_azerbaijan": "Azerbeidzjan",
        "country_kazakhstan": "Kazakistan",
        "country_uzbekistan": "Oezbekistan",
        "country_kyrgyzstan": "Kirgizië",
        "country_qatar_sa": "Qatar / Saoedi-Arabië",
        "collection_title": "METE MORALI COLLECTIE",
        "back_to_catalog": "Terug naar catalogus",
        "filter_all": "Alle",
        "filter_welder": "Lasser",
        "filter_supervisor": "Supervisor",
        "filter_parka": "Winter",
        "pay_now": "Nu betalen",
        "alert_phone_required": "Om een bestelling te plaatsen, moet u uw telefoonnummer opslaan in uw profiel. U wordt doorgestuurd naar de profielpagina.",
        "alert_phone_required_toast": "Sla uw telefoonnummer op in uw profiel om een bestelling te plaatsen.",
        "profile_updated_success": "Uw profielgegevens zijn succesvol bijgewerkt!"
    },
    "fr": {
        "whatsapp_order": "COMMANDER VIA WHATSAPP",
        "whatsapp_order_notice": "Connexion directe avec notre représentant commercial",

        "checking_payment": "Vérification du statut du paiement",
        "checking_payment_desc": "Veuillez patienter, récupération du résultat de votre paiement...",
        "payment_success": "Paiement réussi !",
        "payment_success_desc": "Votre paiement a été reçu en toute sécurité et votre commande a été confirmée. Merci.",
        "payment_failed": "Échec du paiement",
        "payment_failed_desc": "Le paiement par carte n'a pas pu être traité. Veuillez vérifier vos coordonnées et réessayer.",
        "order_no": "N° de commande",
        "auth_code": "Code d'autorisation",
        "total_amount": "Montant payé",
        "go_to_dashboard": "Aller au tableau de bord",
        "error_reason": "Raison de l'erreur",
        "try_again": "Retourner au panier et réessayer",
        "credit_card_payment": "Paiement sécurisé par carte bancaire (SSL)",
        "payment_subtitle": "Saisissez les coordonnées de votre carte pour finaliser le paiement avec 3D Secure.",

        "home": "Accueil",
        "catalog": "Catalogue",
        "contact": "Contact",
        "certifications": "Certifications",
        "cert_title": "Nos Certifications & Normes",
        "cert_subtitle": "Protection de la vie humaine conforme aux normes de sécurité internationales",
        "cert_11612_title": "EN ISO 11612 — Protection contre la chaleur et les flammes",
        "cert_11612_desc": "La norme de protection qui empêche le tissu de s'enflammer en présence de températures élevées, de chaleur radiante et de flamme nue, garantissant qu'il ne fond pas et ne conduit pas la chaleur. Obligatoire pour la métallurgie, la fonderie et les usines pétrochimiques.",
        "cert_11611_title": "EN ISO 11611 — Protection du soudeur",
        "cert_11611_desc": "Une norme spéciale de couture et de durabilité développée contre les projections de métal fondu, les étincelles et les contacts de courte durée avec l'arc électrique pendant les processus de soudage.",
        "cert_1149_title": "EN 1149-5 — Protection antistatique",
        "cert_1149_desc": "La norme de matrice de fibres de carbone tissée dans le tissu qui empêche l'électricité statique causée par la friction de s'accumuler et de créer des étincelles dans les environnements explosifs et inflammables.",
        "cert_342_title": "EN 342 — Protection contre le froid",
        "cert_342_desc": "La norme de haute respirabilité et d'isolation thermique qui maintient la température corporelle au niveau idéal sous un froid glacial et des vents violents tout en empêchant la transpiration.",
        "my_account": "Mon compte",
        "cart": "Liste de commande",
        "brand_desc": "Production de vêtements de travail industriels et de vêtements de sécurité technique.",
        "brand_desc_short": "Vêtements de Travail & Protection",
        "fast_menu": "Menu rapide",
        "copyright": "© 2026 Mete Morali. Tous droits réservés.",
        "explore_collection": "Explorer la collection",
        "examine": "Examiner",
        "details": "Voir les détails",
        "cart_toast": "ajouté au panier!",
        "order_summary": "Résumé de commande",
        "total_qty": "Articles totaux",
        "total_price": "Montant total",
        "request_quote": "DEMANDER UN DEVIS",
        "place_order": "CONFIRMER LA COMMANDE",
        "empty_cart_title": "Votre liste de commande est vide",
        "empty_cart_desc": "Parcourez notre catalogue pour découvrir nos vêtements de travail industriels.",
        "write_to_us": "Écrivez-nous",
        "fullname": "Nom et prénom",
        "email_address": "Adresse e-mail",
        "select_subject": "Choisir un sujet",
        "general_info": "Informations générales",
        "delivery": "Commande & Livraison",
        "subject_dealership": "Concessionnaire",
        "message": "Votre message...",
        "send_btn": "Envoyer",
        "sending": "Envoi...",
        "msg_sent": "✓ Message envoyé!",
        "msg_error": "Erreur! Réessayer.",
        "or_separator": "OU",
        "whatsapp": "WHATSAPP",
        "phone": "TÉLÉPHONE",
        "email": "E-MAIL",
        "live_support": "SUPPORT EN DIRECT",
        "spam_protection": "Protection anti-spam: veuillez patienter 1 minute avant d'envoyer un nouveau message.",
        "profil_info": "Infos profil",
        "my_orders": "Mes commandes",
        "my_addresses": "Mes adresses",
        "logout": "Se déconnecter",
        "update_btn": "Mettre à jour",
        "new_password_optional": "Nouveau Mot de Passe (Optionnel)",
        "export_title": "Tous les pays vers lesquels nous exportons",
        "export_central_asia": "Pays d'Asie Centrale",
        "export_central_asia_desc": "Kazakhstan, Ouzbékistan, Turkménistan, Kirghizistan, Tadjikistan, Azerbaïdjan, Géorgie, Fédération de Russie et projets stratégiques dans la région.",
        "export_europe": "Tous les pays européens",
        "export_europe_desc": "Allemagne, France, Italie, Royaume-Uni, Pays-Bas, Belgique, Suisse, Autriche, Espagne, Portugal, Roumanie, Bulgarie, Grèce et toute la région des Balkans.",
        "export_cta": "Êtes-vous dans un pays ou une région différente ? Contactez-nous, et nous apporterons de la sécurité à votre projet où que vous soyez dans le monde.",
        "empty_state_orders": "Vous n'avez pas de commande en cours pour le moment.",
        "empty_state_addresses": "Vous n'avez pas d'adresse enregistrée.",
        "forgot_password": "Mot de passe oublié ?",
        "forgot_password_desc": "Entrez votre adresse e-mail pour réinitialiser le mot de passe.",
        "send_reset_link": "Envoyer le lien",
        "check_inbox": "Nous avons envoyé les instructions de réinitialisation du mot de passe à votre adresse e-mail.",
        "reset_link_sent": "Lien envoyé !",
        "login_title": "Se connecter ou s'inscrire",
        "phone_subtitle": "Entrez votre numéro de téléphone",
        "email_subtitle": "Entrez votre adresse e-mail",
        "phone_btn": "Se connecter par téléphone",
        "email_btn": "Se connecter par e-mail",
        "terms_check": "En cliquant sur \"Se connecter par téléphone\", j'approuve la connexion avec le numéro spécifié. J'accepte la charte d'information et la politique de confidentialité.",
        "terms_check_link": "Charte d'information",
        "privacy_check_link": "Politique de confidentialité",
        "continue_btn": "Continuer",
        "back_to_phone": "Connexion par téléphone",
        "back_to_login": "Retour à la connexion",
        "size_select": "Choix de la taille",
        "color_select": "Choix de la couleur",
        "add_to_cart": "AJOUTER AU PANIER",
        "loading_product": "Chargement du produit...",
        "product_not_found": "Produit non trouvé !",
        "api_error": "Erreur de connexion API !",
        "error_404_title": "Page non trouvée",
        "error_404_desc": "Il semblerait que vous soyez dans la mauvaise section du site industriel.",
        "go_home": "Retourner à l'accueil",
        "katalog_title": "Découvrez notre collection",
        "katalog_desc": "Nos produits offrant une sécurité maximale dans des conditions difficiles.",
        "legal_title": "Informations légales",
        "user_agreement": "Conditions d'utilisation",
        "privacy_policy": "Politique de confidentialité",
        "kvkk_text": "Charte d'information KVKK",
        "cookie_policy": "Politique de cookies",
        "sales_agreement": "Contrat de vente à distance",
        "refund_policy": "Conditions d'annulation et de retour",
        "cart_header_title": "Votre Liste de Commande",
        "cart_header_desc": "Liste des produits que vous avez consultés. Vous pouvez nous envoyer cette liste pour un devis ou une commande.",
        "cart_qty_suffix": "pcs",
        "cart_item_size": "Taille",
        "cart_item_color": "Couleur",
        "whatsapp_quote_title": "MeteMorali Demande de Devis",
        "whatsapp_products": "Produits",
        "whatsapp_qty": "Qté",
        "whatsapp_unit_price": "Prix Unitaire",
        "whatsapp_total": "Total",
        "general_total": "Total Général",
        "terms_check_html": "En cliquant sur \"Se connecter avec le téléphone\", j'approuve la connexion avec le numéro spécifié. J'accepte la <a href=\"sozlesmeler#aydinlatma\" target=\"_blank\">Charte de Confidentialité</a> et les <a href=\"sozlesmeler#gizlilik\" target=\"_blank\">Politiques de Confidentialité</a>.",
        "or_lowercase": "ou",
        "password": "Mot de passe",
        "enter_password_placeholder": "Saisissez votre mot de passe",
        "alert_enter_phone": "Veuillez entrer votre numéro de téléphone.",
        "alert_accept_terms": "Vous devez accepter les conditions et les politiques pour vous connecter.",
        "alert_enter_email": "Veuillez entrer votre adresse e-mail.",
        "alert_enter_password": "Veuillez entrer votre mot de passe.",
        "alert_profile_updated": "Les informations de votre profil ont été mises à jour avec succès !",
        "hello_user": "Bonjour",
        "global_network_subtitle": "RÉSEAU GLOBAL D'EXPORTATION",
        "global_network_title": "Dans quels pays exportons-nous ?",
        "global_network_desc": "La qualité de Mete Morali apporte la sécurité aux projets difficiles partout dans le monde. Survolez les points pour voir nos destinations d'exportation.",
        "country_uk": "Royaume-Uni",
        "country_germany": "Allemagne",
        "country_france": "France",
        "country_italy": "Italie",
        "country_turkey": "Turquie",
        "country_poland": "Pologne",
        "country_bulgaria": "Bulgarie",
        "country_russia": "Russie",
        "country_azerbaijan": "Azerbaïdjan",
        "country_kazakhstan": "Kazakhstan",
        "country_uzbekistan": "Ouzbékistan",
        "country_kyrgyzstan": "Kirghizistan",
        "country_qatar_sa": "Qatar / Arabie Saoudite",
        "collection_title": "COLLECTION METE MORALI",
        "back_to_catalog": "Retour au catalogue",
        "filter_all": "Tous",
        "filter_welder": "Soudeur",
        "filter_supervisor": "Superviseur",
        "filter_parka": "Hiver",
        "pay_now": "Payer maintenant",
        "alert_phone_required": "Pour passer une commande, vous devez enregistrer votre numéro de téléphone dans votre profil. Vous êtes redirigé vers la page de profil.",
        "alert_phone_required_toast": "Veuillez enregistrer votre numéro de téléphone dans votre profil pour passer une commande.",
        "profile_updated_success": "Les informations de votre profil ont été mises à jour avec succès !"
    },
    "it": {
        "whatsapp_order": "ORDINA SU WHATSAPP",
        "whatsapp_order_notice": "Collegamento diretto con il nostro rappresentante",

        "checking_payment": "Verifica dello stato del pagamento",
        "checking_payment_desc": "Attendere prego, recupero dell'esito del pagamento in corso...",
        "payment_success": "Pagamento riuscito!",
        "payment_success_desc": "Il pagamento è stato ricevuto in modo sicuro e l'ordine è stato confermato. Grazie.",
        "payment_failed": "Pagamento non riuscito",
        "payment_failed_desc": "Impossibile elaborare il pagamento con carta di credito. Verificare i dati e riprovare.",
        "order_no": "N. Ordine",
        "auth_code": "Codice di autorizzazione",
        "total_amount": "Importo pagato",
        "go_to_dashboard": "Vai al pannello personale",
        "error_reason": "Motivo dell'errore",
        "try_again": "Torna al carrello e riprova",
        "credit_card_payment": "Pagamento sicuro con carta di credito (SSL)",
        "payment_subtitle": "Inserisci i dati della carta per completare il pagamento con 3D Secure.",

        "home": "Home",
        "catalog": "Catalogo",
        "contact": "Contatti",
        "certifications": "Certificazioni",
        "cert_title": "Le Nostre Certificazioni & Standard",
        "cert_subtitle": "Protezione salvavita in conformità con gli standard internazionali di sicurezza",
        "cert_11612_title": "EN ISO 11612 — Protezione da calore e fiamme",
        "cert_11612_desc": "Lo standard di protezione che impedisce al tessuto di infiammarsi in presenza di alte temperature, calore radiante e fiamma libera, garantendo che non si fonda o conduca calore. Obbligatorio per impianti metallurgici, fonderie e petrolchimici.",
        "cert_11611_title": "EN ISO 11611 — Protezione del saldatore",
        "cert_11611_desc": "Uno standard speciale di cucitura e durata sviluppato contro gli schizzi di metallo fuso, le scintille e i contatti con l'arco elettrico a breve termine durante i processi di saldatura.",
        "cert_1149_title": "EN 1149-5 — Protezione antistatica",
        "cert_1149_desc": "Lo standard di matrice in fibra di carbonio tessuta nel tessuto che impedisce all'elettricità statica causata dall'attrito di accumularsi e creare scintille in ambienti esplosivi e infiammabili.",
        "cert_342_title": "EN 342 — Protezione dal freddo",
        "cert_342_desc": "Lo standard di elevata traspirabilità e isolamento termico che protegge la temperatura corporea al livello ideale sotto il freddo gelido e venti forti, prevenendo la sudorazione.",
        "my_account": "Il mio account",
        "cart": "Lista d'ordine",
        "brand_desc": "Produzione di abbigliamento da lavoro industriale e abbigliamento di sicurezza tecnica.",
        "brand_desc_short": "Abbigliamento da Lavoro & Sicurezza",
        "fast_menu": "Menu rapido",
        "copyright": "© 2026 Mete Morali. Tutti i diritti riservati.",
        "explore_collection": "Esplora la collezione",
        "examine": "Esamina",
        "details": "Dettagli",
        "cart_toast": "aggiunto al carrello!",
        "order_summary": "Riepilogo dell'ordine",
        "total_qty": "Articoli totali",
        "total_price": "Importo totale",
        "request_quote": "RICHIEDI PREVENTIVO",
        "place_order": "CONFERMA L'ORDINE",
        "empty_cart_title": "La tua lista d'ordine è vuota",
        "empty_cart_desc": "Sfoglia il nostro catalogo per esaminare l'abbigliamento da lavoro.",
        "write_to_us": "Scrivici",
        "fullname": "Nome e cognome",
        "email_address": "Indirizzo e-mail",
        "select_subject": "Seleziona oggetto",
        "general_info": "Informazioni generali",
        "delivery": "Ordine & Consegna",
        "subject_dealership": "Concessionaria",
        "message": "Il tuo messaggio...",
        "send_btn": "Invia",
        "sending": "Invio...",
        "msg_sent": "✓ Messaggio inviato!",
        "msg_error": "Errore! Riprova.",
        "or_separator": "O",
        "whatsapp": "WHATSAPP",
        "phone": "TELEFONO",
        "email": "E-MAIL",
        "live_support": "ONLINE SUPPORT",
        "spam_protection": "Protezione antispam: attendere 1 minuto prima di inviare un nuovo messaggio.",
        "profil_info": "Informazioni profilo",
        "my_orders": "I miei ordini",
        "my_addresses": "I miei indirizzi",
        "logout": "Disconnettersi",
        "update_btn": "Aggiornare",
        "new_password_optional": "Nuova password (Opzionale)",
        "export_title": "Tutti i paesi in cui esportiamo",
        "export_central_asia": "Paesi dell'Asia centrale",
        "export_central_asia_desc": "Kazakistan, Uzbekistan, Turkmenistan, Kirghizistan, Tagikistan, Azerbaigian, Georgia, Federazione Russa e progetti strategici nella regione.",
        "export_europe": "Tutti i paesi europei",
        "export_europe_desc": "Germania, Francia, Italia, Regno Unito, Paesi Bassi, Belgio, Svizzera, Austria, Spagna, Portogallo, Romania, Bulgaria, Grecia e tutta la regione dei Balcani.",
        "export_cta": "Ti trovi in un paese o in una regione diversa? Contattaci e porteremo la sicurezza nel tuo progetto, ovunque tu sia nel mondo.",
        "empty_state_orders": "Non hai ordini effettuati al momento.",
        "empty_state_addresses": "Non hai indirizzi salvati.",
        "forgot_password": "Password dimenticata?",
        "forgot_password_desc": "Inserisci il tuo indirizzo email per reimpostare la password.",
        "send_reset_link": "Invia link di ripristino",
        "check_inbox": "Abbiamo inviato un link contenente le istruzioni per il ripristino della password al tuo indirizzo email.",
        "reset_link_sent": "Link inviato!",
        "login_title": "Accedi o registrati",
        "phone_subtitle": "Inserisci il tuo numero di telefono",
        "email_subtitle": "Inserisci il tuo indirizzo e-mail",
        "phone_btn": "Accedi con il telefono",
        "email_btn": "Accedi con l'e-mail",
        "terms_check": "Cliccando su \"Accedi con il telefono\", approvo l'accesso con il numero specificato. Accetto l'Informativa e l'Informativa sulla privacy.",
        "terms_check_link": "Informativa",
        "privacy_check_link": "Informativa sulla privacy",
        "continue_btn": "Continua",
        "back_to_phone": "Accedi con il telefono",
        "back_to_login": "Torna all'accesso",
        "size_select": "Scelta della taglia",
        "color_select": "Scelta del colore",
        "add_to_cart": "AGGIUNGI AL CARRELLO",
        "loading_product": "Caricamento del prodotto...",
        "product_not_found": "Prodotto non trovato!",
        "api_error": "Errore di connessione API!",
        "error_404_title": "Pagina non trovata",
        "error_404_desc": "Sembra che tu sia nella sezione sbagliata dell'impianto industriale.",
        "go_home": "Torna alla Home",
        "katalog_title": "Scopri la nostra collezione",
        "katalog_desc": "I nostri prodotti che garantiscono la massima sicurezza in condizioni difficili.",
        "legal_title": "Informazioni legali",
        "user_agreement": "Accordo per gli utenti",
        "privacy_policy": "Informativa sulla privacy",
        "kvkk_text": "Informativa KVKK",
        "cookie_policy": "Informativa sui cookie",
        "sales_agreement": "Contratto di vendita a distanza",
        "refund_policy": "Condizioni di annullamento e reso",
        "cart_header_title": "La tua Lista d'Ordine",
        "cart_header_desc": "Elenco dei prodotti che hai esaminato. Puoi inviarci questo elenco per un preventivo o un ordine.",
        "cart_qty_suffix": "pz",
        "cart_item_size": "Taglia",
        "cart_item_color": "Colore",
        "whatsapp_quote_title": "MeteMorali Richiesta di Preventivo",
        "whatsapp_products": "Prodotti",
        "whatsapp_qty": "Qtà",
        "whatsapp_unit_price": "Prezzo Unitario",
        "whatsapp_total": "Totale",
        "general_total": "Totale Generale",
        "terms_check_html": "Cliccando su \"Accedi con telefono\", approvo l'accesso con il numero specificato. Accetto l'<a href=\"sozlesmeler#aydinlatma\" target=\"_blank\">Informativa sul Trattamento Dati</a> e l'<a href=\"sozlesmeler#gizlilik\" target=\"_blank\">Informativa sulla Privacy</a>.",
        "or_lowercase": "o",
        "password": "Password",
        "enter_password_placeholder": "Inserisci la tua password",
        "alert_enter_phone": "Si prega di inserire il proprio numero di telefono.",
        "alert_accept_terms": "Devi accettare i termini e le politiche per accedere.",
        "alert_enter_email": "Si prega di inserire il proprio indirizzo e-mail.",
        "alert_enter_password": "Si prega di inserire la password.",
        "alert_profile_updated": "Le informazioni del tuo profilo sono state aggiornate con successo!",
        "hello_user": "Ciao",
        "global_network_subtitle": "RETE DI ESPORTAZIONE GLOBALE",
        "global_network_title": "In quali paesi esportiamo?",
        "global_network_desc": "La qualità di Mete Morali garantisce sicurezza in progetti complessi in tutto il mondo. Passa il mouse sui punti per visualizzare le nostre destinazioni di esportazione.",
        "country_uk": "Regno Unito",
        "country_germany": "Germania",
        "country_france": "Francia",
        "country_italy": "Italia",
        "country_turkey": "Turchia",
        "country_poland": "Polonia",
        "country_bulgaria": "Bulgaria",
        "country_russia": "Russia",
        "country_azerbaijan": "Azerbaigian",
        "country_kazakhstan": "Kazakistan",
        "country_uzbekistan": "Uzbekistan",
        "country_kyrgyzstan": "Kirghizistan",
        "country_qatar_sa": "Qatar / Arabia Saudita",
        "collection_title": "COLLEZIONE METE MORALI",
        "back_to_catalog": "Torna al catalogo",
        "filter_all": "Tutti",
        "filter_welder": "Saldatore",
        "filter_supervisor": "Supervisor",
        "filter_parka": "Invernale",
        "pay_now": "Paga ora",
        "alert_phone_required": "Per effettuare un ordine, devi salvare il tuo numero di telefono nel tuo profilo. Verrai reindirizzato alla pagina del profilo.",
        "alert_phone_required_toast": "Salva il tuo numero di telefono nel tuo profilo per effettuare un ordine.",
        "profile_updated_success": "I dati del tuo profilo sono stati aggiornati con successo!"
    }
},

    // Helper: translate a key dynamically with optional fallback
    t(key, fallback = '') {
        const lang = this.currentLang || 'tr';
        const dict = (this.translations && this.translations[lang]) || (this.translations && this.translations['tr']);
        if (dict && dict[key] !== undefined && dict[key] !== '') {
            return dict[key];
        }
        if (this.translations && this.translations['tr'] && this.translations['tr'][key] !== undefined) {
            return this.translations['tr'][key];
        }
        return fallback || key;
    },

    // Set user language, store in localStorage, update URL and navigate
    setLanguage(lang) {
        const validLangs = ['tr', 'en', 'de', 'ru', 'nl', 'fr', 'it'];
        if (!validLangs.includes(lang)) lang = 'tr';

        localStorage.setItem('metemorali_lang', lang);
        this.currentLang = lang;

        try {
            const url = new URL(window.location.href);
            if (lang === 'tr') {
                url.searchParams.delete('lang');
            } else {
                url.searchParams.set('lang', lang);
            }
            window.location.href = url.toString();
        } catch (e) {
            window.location.reload();
        }
    },

    // Translate a single DOM element based on its data-i18n attribute
    translateElement(element) {
        if (!element) return;
        const key = element.getAttribute('data-i18n');
        if (!key) return;

        const translation = this.t(key);
        if (!translation) return;

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.setAttribute('placeholder', translation);
        } else if (element.tagName === 'SELECT') {
            if (element.options.length > 0 && element.options[0].disabled) {
                element.options[0].text = translation;
            }
        } else {
            element.innerHTML = translation;
        }

        // Support data-i18n-title
        const titleKey = element.getAttribute('data-i18n-title');
        if (titleKey) {
            element.setAttribute('title', this.t(titleKey));
        }
        // Support data-i18n-aria
        const ariaKey = element.getAttribute('data-i18n-aria');
        if (ariaKey) {
            element.setAttribute('aria-label', this.t(ariaKey));
        }
    },

    // Translate the entire page and trigger SEO meta updates
    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            this.translateElement(el);
        });

        document.documentElement.lang = this.currentLang || 'tr';
        this.updateSeoMeta();
    },

    // Manage title, meta description & canonical URL for international SEO
    updateSeoMeta() {
        const cleanPath = (window.location.pathname || '').toLowerCase();
        const isHomePage = cleanPath === '/' || cleanPath === '' || cleanPath.endsWith('/index.html') || cleanPath.endsWith('/index') || cleanPath.endsWith('/anasayfa.html') || cleanPath.endsWith('/anasayfa');

        if (!isHomePage) {
            return;
        }

        const lang = this.currentLang || 'tr';

        // Türkçe ana sayfa için statik HTML başlığı, meta etiketleri ve canonical zaten mükemmeldir.
        // Google botun render sırasında statik vs JS çelişkisi tespit etmesini önlemek için TR'de DOM başlığına ve canonical'a dokunmuyoruz:
        if (lang === 'tr') {
            const canonicalLink = document.querySelector('link[rel="canonical"]');
            if (canonicalLink) {
                canonicalLink.setAttribute('href', 'https://www.mete-morali.com/');
            }
            return;
        }

        const seoData = {
            en: {
                title: 'MeteMorali | Industrial Workwear & Technical Safety Clothing',
                desc: 'MeteMorali - Production of industrial workwear, welder suits, flame retardant garments, and winter parkas.'
            },
            de: {
                title: 'MeteMorali | Industrielle Arbeitskleidung & Schutzkleidung',
                desc: 'MeteMorali - Herstellung von industrieller Arbeitskleidung, Schweißerschutzkleidung, flammhemmender Kleidung und Winterparkas.'
            },
            ru: {
                title: 'MeteMorali | Промышленная спецодежда и защитная одежда',
                desc: 'MeteMorali - Производство промышленной спецодежды, костюмов сварщика, огнестойкой одежды и зимних парков.'
            },
            fr: {
                title: 'MeteMorali | Vêtements de Travail Industriels & Protection Technique',
                desc: 'MeteMorali - Fabrication de vêtements de travail industriels, tenues de soudeur, vêtements ignifuges et parkas d\'hiver.'
            },
            nl: {
                title: 'MeteMorali | Industriële Werkkleding & Veiligheidskleding',
                desc: 'MeteMorali - Productie van industriële werkkleding, lasuitrusting, vlamvertragende kleding en winterparka\'s.'
            },
            it: {
                title: 'MeteMorali | Abbigliamento da Lavoro Industriale e Protezione',
                desc: 'MeteMorali - Produzione di abbigliamento da lavoro industriale, tute per saldatori, abiti ignifughi e parka invernali.'
            }
        };

        const currentSeo = seoData[lang];
        if (currentSeo) {
            document.title = currentSeo.title;

            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', currentSeo.desc);

            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', currentSeo.title);

            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', currentSeo.desc);

            const canonicalLink = document.querySelector('link[rel="canonical"]');
            if (canonicalLink) {
                try {
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('lang', lang);
                    canonicalLink.setAttribute('href', currentUrl.href);
                } catch (e) {}
            }
        }
    },

    // Bind event listeners to navbar dropdown & mobile menu language selectors
    setupLanguageSelectors() {
        const current = (this.currentLang || 'tr').toLowerCase();

        // 1. Desktop dropdown selectors
        const selectors = document.querySelectorAll('.lang-selector');
        selectors.forEach(sel => {
            const btn = sel.querySelector('.lang-btn');
            const dropdown = sel.querySelector('.lang-dropdown');
            if (btn && dropdown) {
                const codeEl = btn.querySelector('.active-lang-code');
                if (codeEl) codeEl.textContent = current.toUpperCase();

                if (!btn.dataset.langBound) {
                    btn.dataset.langBound = 'true';
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                        btn.setAttribute('aria-expanded', !isExpanded);
                        dropdown.classList.toggle('active');
                    });
                }

                dropdown.querySelectorAll('a[data-lang]').forEach(link => {
                    const lang = link.getAttribute('data-lang');
                    if (lang === current) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                    if (!link.dataset.langBound) {
                        link.dataset.langBound = 'true';
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.setLanguage(lang);
                        });
                    }
                });
            }
        });

        // 2. Mobile menu language buttons
        document.querySelectorAll('.mobile-lang-item[data-lang]').forEach(link => {
            const lang = link.getAttribute('data-lang');
            if (lang === current) {
                link.style.color = '#ffffff';
                link.style.background = 'rgba(255, 255, 255, 0.15)';
                link.style.fontWeight = 'bold';
            } else {
                link.style.color = '#a0a0a0';
                link.style.background = 'transparent';
                link.style.fontWeight = 'normal';
            }

            if (!link.dataset.langBound) {
                link.dataset.langBound = 'true';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setLanguage(lang);
                });
            }
        });

        // Close dropdowns on outside click
        if (!document.body.dataset.langOutsideBound) {
            document.body.dataset.langOutsideBound = 'true';
            document.addEventListener('click', () => {
                selectors.forEach(sel => {
                    const btn = sel.querySelector('.lang-btn');
                    const dropdown = sel.querySelector('.lang-dropdown');
                    if (btn && dropdown) {
                        btn.setAttribute('aria-expanded', 'false');
                        dropdown.classList.remove('active');
                    }
                });
            });
        }
    }
};

// Global shorthand
window.t = function(key, fallback) {
    return window.i18n ? window.i18n.t(key, fallback) : (fallback || key);
};

// Auto-run translation on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.i18n) {
        window.i18n.translatePage();
    }
});

// Run translation when components are dynamically loaded (navbar, footer, sidebar)
document.addEventListener('componentsLoaded', () => {
    if (window.i18n) {
        window.i18n.translatePage();
        window.i18n.setupLanguageSelectors();
    }
});
