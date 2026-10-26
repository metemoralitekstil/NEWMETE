// MeteMorali — Merkezi Ürün Veritabanı ve Yardımcı Fonksiyonlar (Single Source of Truth)

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: {
            tr: "Alev Almaz Termal Kışlık Parka",
            en: "Flame Retardant Thermal Winter Parka",
            de: "Flammhemmender Thermo-Winterparka",
            ru: "Огнестойкая термопарка",
            nl: "Vlamvertragende Thermische Winterparka",
            fr: "Parka d'hiver Thermique Ignifuge",
            it: "Parka Invernale Termico Ignifugo"
        },
        subtitle: {
            tr: "Alev Almaz & Antistatik Termal Kışlık İş Parkası",
            en: "Flame Retardant & Antistatic Thermal Winter Parka",
            de: "Flammhemmender und antistatischer Thermo-Winterparka",
            ru: "Огнестойкая и антистатическая зимняя термопарка",
            nl: "Vlamvertragende & Antistatische Thermische Winterparka",
            fr: "Parka de Travail Thermique Ignifuge et Antistatique",
            it: "Parka da Lavoro Termico Ignifugo e Antistatico"
        },
        description: {
            tr: "Zorlu kış şartlarında ve patlayıcı ortamlarda alev geciktirici, su geçirmez ve antistatik koruma sağlayan, reflektörlü yüksek korumalı termal kışlık iş parkası.",
            en: "High-protection thermal winter work parka with reflective bands, providing flame retardant, waterproof, and antistatic safety in harsh winter conditions and explosive zones.",
            de: "Hochgeschützter Thermo-Winterparka mit Reflexstreifen, der bei rauen Winterbedingungen flammhemmenden, wasserdichten und antistatischen Schutz bietet.",
            ru: "Высокозащитная зимняя рабочая термопарка со светоотражающими полосами, обеспечивающая огнестойкую, водонепроницаемую и антистатическую защиту.",
            nl: "Hoogwaardige thermische winterparka met reflecterende banden, voor vlamvertragende, waterdichte en antistatische bescherming in winterse omstandigheden.",
            fr: "Parka de travail thermique haute protection avec bandes réfléchissantes, assurant une protection ignifuge, imperméable et antistatique dans les conditions hivernales rigoureuses.",
            it: "Parka da lavoro termico ad alta protezione con bande riflettenti, che offre protezione ignifuga, impermeabile e antistatica in condizioni invernali difficili."
        },
        price: 290.00,
        imageUrl: "img/Neon Sarı Reflektif Güvenlik Parkası.png",
        subImages: '["img/Neon Sarı Reflektif Güvenlik Parkası.png", "img/Neon Sarı Reflektif İş Parkası.png", "img/Neon Sarı Kapüşonlu Güvenlik Montu.png", "img/Profilde Neon Sarı Reflektörlü İş Parkası.png"]',
        articleCode: "910404",
        certificateCode: "OZO 1117-CPT004/26",
        standards: ["EN 11611", "EN 11612", "EN 1149-5", "EN 20471", "EN 342"],
        features: {
            tr: [
                "Su ve Rüzgar Geçirmez Dış Katman",
                "Yüksek Görünürlüklü Reflektif Bantlar",
                "Alev Geciktirici & Antistatik Koruma",
                "Termal Isı Yalıtımlı İç Astar"
            ],
            en: [
                "Waterproof & Windproof Outer Shell",
                "High-Visibility Reflective Tapes",
                "Flame Retardant & Antistatic Protection",
                "Thermal Insulated Inner Lining"
            ],
            de: [
                "Wasser- und winddichte Außenschale",
                "Gut sichtbare Reflexstreifen",
                "Flammhemmender und antistatischer Schutz",
                "Wärmeisolierendes Thermo-Innenfutter"
            ],
            ru: [
                "Водонепроницаемый и ветрозащитный внешний слой",
                "Светоотражающие ленты высокой видимости",
                "Огнестойкая и антистатическая защита",
                "Теплоизоляционная внутренняя подкладка"
            ],
            nl: [
                "Water- en winddichte buitenlaag",
                "Hoge zichtbaarheid reflecterende tapes",
                "Vlamvertragende & antistatische bescherming",
                "Warmte-isolerende binnenvoering"
            ],
            fr: [
                "Couche extérieure imperméable et coupe-vent",
                "Bandes réfléchissantes haute visibilité",
                "Protection ignifuge et antistatique",
                "Doublure intérieure thermo-isolante"
            ],
            it: [
                "Strato esterno impermeabile e antivento",
                "Bande riflettenti ad alta visibilità",
                "Protezione ignifuga e antistatica",
                "Fodera interna termoisolante"
            ]
        }
    },
    {
        id: 3,
        name: {
            tr: "Hi-Vis Alev Almaz Kaynakçı Takımı",
            en: "Hi-Vis Flame Retardant Welder Suit",
            de: "Hi-Vis Flammhemmender Schweißeranzug",
            ru: "Огнестойкий костюм сварщика Hi-Vis",
            nl: "Hi-Vis Vlamvertragend Lasserspak",
            fr: "Combinaison de Soudeur Haute Visibilité Ignifuge",
            it: "Completo da Saldatore Hi-Vis Ignifugo"
        },
        subtitle: {
            tr: "Yüksek Görünürlüklü Alev Almaz Kaynakçı Takımı",
            en: "High-Visibility Flame Retardant Welder Suit",
            de: "Gut sichtbarer, flammhemmender Schweißeranzug",
            ru: "Огнестойкий костюм сварщика повышенной видимости",
            nl: "Hoge Zichtbaarheid Vlamvertragend Lasserspak",
            fr: "Combinaison de Soudeur Ignifuge Haute Visibilité",
            it: "Completo da Saldatore Ignifugo ad Alta Visibilità"
        },
        description: {
            tr: "Loş ve karanlık sahalarda yüksek görünürlük sağlayan reflektörlü şeritlere sahip, alev almaz ve erimiş metal çapaklarına karşı koruma sunan kaynakçı iş takımı.",
            en: "Flame retardant welder suit with reflective strips providing high visibility in dim work environments and protection against molten metal splashes.",
            de: "Flammhemmender Schweißeranzug mit Reflexstreifen für hohe Sichtbarkeit und Schutz vor geschmolzenen Metallspritzern in dunklen Arbeitsumgebungen.",
            ru: "Огнестойкий костюм сварщика со светоотражающими полосами для высокой видимости и защиты от брызг расплавленного металла.",
            nl: "Vlamvertragend lasserspak met reflecterende strips voor hoge zichtbaarheid en bescherming tegen lasspatten.",
            fr: "Combinaison de soudeur ignifuge avec bandes réfléchissantes assurant une haute visibilité et une protection contre les projections de métal fondu.",
            it: "Completo da saldatore ignifugo con strisce riflettenti per un'elevata visibilità e protezione contro gli schizzi di metallo fuso."
        },
        price: 275.00,
        imageUrl: "img/Reflektörlü Mavi-Lime İş Elbisesi.png",
        subImages: '["img/Reflektörlü Mavi-Lime İş Elbisesi.png", "img/Arka Görünüm Reflektif İş Elbisesi.png", "img/Mavi ve Neon Sarı Reflektif İş Tulumu.png", "img/Kobalt Mavi ve Neon Sarı İş Montu.png", "img/Mavi Sarı Reflektörlü İş Montu.png", "img/Yandan Görünüm Hi-Vis İş Montu.png", "img/Mavi ve Neon Reflektif İş Pantolonu.png", "img/Mavi-Sarı Reflektif İş Pantolonu.png", "img/Yüksek Görünürlüklü İş Pantolonu.png"]',
        articleCode: "910401",
        certificateCode: "OZO 1117-CPT001/26",
        standards: ["EN 11611", "EN 11612", "EN 1149-5", "EN 20471"],
        features: {
            tr: [
                "Isı ve Aleve Karşı Tam Termal Koruma",
                "Yüksek Görünürlüklü EN 20471 Sertifikalı Şeritler",
                "Kaynak Kıvılcımlarına Dayanıklı Dikişler",
                "Ergonomik Tasarım ve Antistatik Özellikler"
            ],
            en: [
                "Full Thermal Protection Against Heat & Flame",
                "High-Visibility EN 20471 Certified Strips",
                "Welding Spark Resistant Stitching",
                "Ergonomic Design & Antistatic Properties"
            ],
            de: [
                "Vollständiger Hitzeschutz gegen Hitze und Flammen",
                "Gut sichtbare EN 20471 zertifizierte Streifen",
                "Schweißfunkenbeständige Nähte",
                "Ergonomisches Design und antistatische Eigenschaften"
            ],
            ru: [
                "Полная тепловая защита от тепла и пламени",
                "Сертифицированные полосы повышенной видимости EN 20471",
                "Швы, устойчивые к сварочным искрам",
                "Эргономичный дизайн и антистатические свойства"
            ],
            nl: [
                "Volledige thermische bescherming tegen hitte en vlammen",
                "Hoge zichtbaarheid EN 20471 gecertificeerde strips",
                "Lasspatbestendige stiksels",
                "Ergonomisch ontwerp & antistatische eigenschappen"
            ],
            fr: [
                "Protection thermique complète contre la chaleur et les flammes",
                "Bandes réfléchissantes certifiées EN 20471",
                "Coutures résistantes aux étincelles de soudage",
                "Design ergonomique et propriétés antistatiques"
            ],
            it: [
                "Protezione termica completa contro calore e fiamme",
                "Strisce riflettenti certificate EN 20471",
                "Cuciture resistenti alle scintille di saldatura",
                "Design ergonomico e proprietà antistatiche"
            ]
        }
    },
    {
        id: 4,
        name: {
            tr: "Alev Almaz Profesyonel Kaynakçı Takımı (Çelik Grisi)",
            en: "Flame Retardant Professional Welder Suit (Steel Gray)",
            de: "Flammhemmender professioneller Schweißeranzug (Stahlgrau)",
            ru: "Профессиональный огнестойкий костюм сварщика (стальной серый)",
            nl: "Vlamvertragend Professioneel Lasserspak (Staalrijs)",
            fr: "Combinaison Professionnelle de Soudeur Ignifuge (Gris Acier)",
            it: "Completo Professionale da Saldatore Ignifugo (Grigio Acciaio)"
        },
        subtitle: {
            tr: "Alev Almaz & Antistatik Reflektörlü Kaynakçı Takımı (Çelik Grisi)",
            en: "Flame Retardant & Antistatic Reflective Welder Suit (Steel Gray)",
            de: "Flammhemmender und antistatischer Schweißeranzug mit Reflektoren (Stahlgrau)",
            ru: "Огнестойкий и антистатический костюм сварщика с отражателями (стальной серый)",
            nl: "Vlamvertragend & Antistatisch Lasserspak met Reflectie (Staalrijs)",
            fr: "Combinaison de Soudeur Ignifuge et Antistatique avec Bandes Réfléchissantes (Gris Acier)",
            it: "Completo da Saldatore Ignifugo e Antistatico con Bande Riflettenti (Grigio Acciaio)"
        },
        description: {
            tr: "Yoğun kaynak operasyonlarında kıvılcım, alev ve ısı transferine karşı tam güvenlik sağlayan, reflektörlü şeritli dayanıklı alev almaz ve antistatik çelik grisi kaynakçı iş takımı.",
            en: "Durable flame-retardant and antistatic welder workwear with reflective strips in steel gray, providing complete safety against sparks, flames, and heat transfer.",
            de: "Langlebiger flammhemmender und antistatischer Schweißeranzug mit Reflexstreifen in Stahlgrau für maximale Sicherheit gegen Funken, Flammen und Hitzeübertragung.",
            ru: "Прочный огнестойкий и антистатический костюм сварщика стального серого цвета со светоотражающими полосами для защиты от искр, пламени и высокой температуры.",
            nl: "Duurzaam vlamvertragend en antistatisch lasserspak met reflecterende strips in staalgrijs voor veiligheid tegen vonken, vlammen en warmteoverdracht.",
            fr: "Combinaison de travail de soudeur ignifuge et antistatique durable en gris acier avec bandes réfléchissantes pour une sécurité complète contre les étincelles et la chaleur.",
            it: "Abbigliamento da lavoro da saldatore ignifugo e antistatico grigio acciaio con strisce riflettenti per la massima protezione contro scintille e calore."
        },
        price: 250.00,
        imageUrl: "img/Gri-Mavi Reflektif İş Elbisesi.png",
        subImages: '["img/Gri-Mavi Reflektif İş Elbisesi.png", "img/Gri Mavi Reflektif İş Tulumu.png", "img/Gri Reflektörlü İş Üniforması Arkadan Görünüm.png", "img/Reflektörlü Gri-Mavi İş Montu.png", "img/Gri Reflektörlü İş Montu Arkadan Görünüm.png", "img/Çelik Grisi Reflektörlü İş Ceketi.png", "img/Reflektör Şeritli İş Pantolonu.png", "img/Arkadan Görünümlü Reflektörlü İş Pantolonu.png", "img/Yan Profilli Reflektif İş Pantolonu-2.png"]',
        colors: ["Gri"],
        articleCode: "910402",
        certificateCode: "OZO 1117-CPT003/26",
        standards: ["EN 11611", "EN 11612", "EN 1149-5", "EN 17353"],
        features: {
            tr: [
                "Alev Almaz Güçlendirilmiş Kumaş Yapısı",
                "Kıvılcım ve Çapak Geçirmeyen Özel Dokuma",
                "Hassas İşler İçin Rahat ve Esnek Kesim",
                "Reflektif Şeritlerle Artırılmış Güvenlik"
            ],
            en: [
                "Flame Retardant Reinforced Fabric Structure",
                "Spark & Melted Metal Proof Specialized Weave",
                "Comfortable & Flexible Cut for Precision Work",
                "Enhanced Safety with Reflective Strips"
            ],
            de: [
                "Flammhemmende verstärkte Gewebestruktur",
                "Funken- und schlackensicheres Spezialgewebe",
                "Bequemer und flexibler Schnitt für Präzisionsarbeiten",
                "Erhöhte Sicherheit durch Reflexstreifen"
            ],
            ru: [
                "Огнестойкая усиленная структура ткани",
                "Специальное переплетение, устойчивое к искрам и брызгам",
                "Удобный и гибкий крой для точной работы",
                "Повышенная безопасность со светоотражающими полосами"
            ],
            nl: [
                "Vlamvertragende versterkte weefselstructuur",
                "Vonk- en metaalspatbestendig speciaal weefsel",
                "Comfortabele & flexibele pasvorm voor precisiewerk",
                "Verbeterde veiligheid met reflecterende strips"
            ],
            fr: [
                "Structure de tissu renforcé ignifuge",
                "Tissage spécial résistant aux étincelles et aux projections",
                "Coupe confortable et flexible pour les travaux de précision",
                "Sécurité renforcée par des bandes réfléchissantes"
            ],
            it: [
                "Struttura del tessuto rinforzato ignifugo",
                "Tessitura speciale a prova di scintille e metallo fuso",
                "Taglio comodo e flessibile per lavori di precisione",
                "Maggiore sicurezza con strisce riflettenti"
            ]
        }
    },
    {
        id: 5,
        name: {
            tr: "Alev Almaz Antistatik Kaynakçı Takımı (Mat Mavi)",
            en: "Flame Retardant Antistatic Welder Suit (Matte Blue)",
            de: "Flammhemmender antistatischer Schweißeranzug (Mattblau)",
            ru: "Огнестойкий антистатический костюм сварщика (матовый синий)",
            nl: "Vlamvertragend Antistatisch Lasserspak (Matblauw)",
            fr: "Combinaison de Soudeur Ignifuge et Antistatique (Bleu Mat)",
            it: "Completo da Saldatore Ignifugo e Antistatico (Blu Opaco)"
        },
        subtitle: {
            tr: "Alev Almaz & Antistatik Kaynakçı Takımı (Reflektörsüz)",
            en: "Flame Retardant & Antistatic Welder Suit (Non-reflective)",
            de: "Flammhemmender & antistatischer Schweißeranzug (Ohne Reflektoren)",
            ru: "Огнестойкий и антистатический костюм сварщика (без светоотражателей)",
            nl: "Vlamvertragend & Antistatisch Lasserspak (Niet-reflecterend)",
            fr: "Combinaison Ignifuge et Antistatique (Sans bandes réfléchissantes)",
            it: "Completo Ignifugo e Antistatico (Non riflettente)"
        },
        description: {
            tr: "Ağır sanayi, kaynak ve metal işleme atölyelerinde açık alev, yüksek ısı ve statik elektrik risklerine karşı maksimum koruma sağlayan, reflektörsüz alev almaz iş takımı.",
            en: "Flame-retardant non-reflective workwear providing maximum safety against open flames, high heat, and static electricity in heavy industry and metal workshops.",
            de: "Flammhemmende Schutzkleidung ohne Reflektoren, die maximalen Schutz gegen offene Flammen, Hitze und statische Elektrizität in der Schwerindustrie bietet.",
            ru: "Огнестойкая спецодежда без отражателей, обеспечивающая защиту от открытого пламени, тепла и статического электричества в металлообрабатывающих цехах.",
            nl: "Vlamvertragende werkkleding zonder reflectie voor maximale bescherming tegen open vuur, hitte en statische elektriciteit in de zware industrie.",
            fr: "Vêtement de travail ignifuge sans bandes réfléchissantes offrant une protection maximale contre les flammes, la chaleur et l'électricité statique.",
            it: "Abbigliamento ignifugo senza strisce riflettenti per la massima protezione contro fiamme, calore ed elettricità statica nelle officine metallurgiche."
        },
        price: 240.00,
        imageUrl: "img/Mavi Reflektif İş Üniforması.png",
        subImages: '["img/Mavi Reflektif İş Üniforması.png", "img/Mavi Reflektif İş Üniforması Seti.png", "img/Mavi Reflektörlü İş Üniforması-2.png", "img/Mavi Reflektörlü İş Güvenliği Montu.png", "img/Mavi Reflektörlü İş Güvenliği Ceketi.png", "img/Mavi Reflektif İş Ceketi.png", "img/Donanımlı Lacivert İş Pantolonu.png", "img/Reflektör Bantlı Mavi İş Pantolonu.png", "img/Yan Profilli Reflektif İş Pantolonu.png"]',
        colors: ["Mavi"],
        articleCode: "910405",
        certificateCode: "OZO 1117-CPT003/26-A1/26",
        standards: ["EN 11611", "EN 11612", "EN 1149-5"],
        features: {
            tr: [
                "Alev Geciktirici & Antistatik Kalın Kumaş",
                "Kaynak ve Metal Çapaklarına Dayanıklı Yapı",
                "Kimyasallara ve Mekanik Aşınmaya Yüksek Mukavemet",
                "Reflektörsüz, Sade İş Sahası Tasarımı"
            ],
            en: [
                "Flame Retardant & Antistatic Heavy Fabric",
                "Structure Resistant to Welding & Metal Splashes",
                "High Resistance to Chemicals and Mechanical Wear",
                "Simple Non-Reflective Workplace Design"
            ],
            de: [
                "Flammhemmender und antistatischer schwerer Stoff",
                "Struktur beständig gegen Schweiß- und Metallspritzer",
                "Hohe Beständigkeit gegen Chemikalien und mechanischen Verschleiß",
                "Einfaches, nicht reflektierendes Arbeitsplatzdesign"
            ],
            ru: [
                "Огнестойкая и антистатическая плотная ткань",
                "Структура, устойчивая к сварке и брызгам металла",
                "Высокая стойкость к химическим веществам и механическому износу",
                "Простой неотражающий дизайн"
            ],
            nl: [
                "Vlamvertragende & antistatische zware stof",
                "Structuur bestand tegen las- en metaalspatten",
                "Hoge weerstand tegen chemicaliën en mechanische slijtage",
                "Eenvoudig, niet-reflecterend werkplaatsontwerp"
            ],
            fr: [
                "Tissu lourd ignifuge et antistatique",
                "Structure résistante au soudage et aux projections de métal",
                "Haute résistance aux produits chimiques et à l'usure mécanique",
                "Design simple sans bandes réfléchissantes"
            ],
            it: [
                "Tessuto pesante ignifugo e antistatico",
                "Struttura resistente a saldatura e schizzi di metallo",
                "Elevata resistenza agli agenti chimici e all'usura meccanica",
                "Design semplice non riflettente"
            ]
        }
    },
    {
        id: 6,
        name: {
            tr: "Alev Almaz Antistatik Kaynakçı Takımı (Lacivert)",
            en: "Flame Retardant Antistatic Welder Suit (Navy Blue)",
            de: "Flammhemmender antistatischer Schweißeranzug (Marineblau)",
            ru: "Огнестойкий антистатический костюм сварщика (Темно-синий)",
            nl: "Vlamvertragend Antistatisch Lasserspak (Marineblauw)",
            fr: "Combinaison de Soudeur Ignifuge et Antistatique (Bleu Marine)",
            it: "Completo da Saldatore Ignifugo e Antistatico (Blu Navy)"
        },
        subtitle: {
            tr: "Alev Almaz & Antistatik Kaynakçı Takımı",
            en: "Flame Retardant & Antistatic Welder Suit",
            de: "Flammhemmender & antistatischer Schweißeranzug",
            ru: "Огнестойкий и антистатический костюм сварщика",
            nl: "Vlamvertragend & Antistatisch Lasserspak",
            fr: "Combinaison Ignifuge et Antistatique",
            it: "Completo Ignifugo e Antistatico"
        },
        description: {
            tr: "Kaynak ve metal işleme atölyelerinde açık alev, yüksek ısı ve statik elektrik risklerine karşı maksimum koruma sağlayan alev almaz lacivert iş takımı.",
            en: "Flame-retardant navy workwear providing maximum safety against open flames, high heat, and static electricity in welding and metal workshops.",
            de: "Flammhemmende Schutzkleidung in Marineblau, die maximalen Schutz gegen offene Flammen, Hitze und statische Elektrizität in Schweiß- und Metallwerkstätten bietet.",
            ru: "Огнестойкая темно-синяя спецодежда, обеспечивающая защиту от открытого пламени, тепла и статического электричества в цехах.",
            nl: "Vlamvertragende werkkleding in marineblauw voor maximale bescherming tegen open vuur, hitte en statische elektriciteit in werkplaatsen.",
            fr: "Vêtement de travail ignifuge bleu marine offrant une protection maximale contre les flammes, la chaleur et l'électricité statique.",
            it: "Abbigliamento ignifugo blu navy per la massima protezione contro fiamme, calore ed elettricità statica."
        },
        price: 240.00,
        imageUrl: "img/Lacivert 1.png",
        subImages: '["img/Lacivert 1.png", "img/Lacivert 2.png", "img/Lacivert 3.png", "img/Lacivert 4.png", "img/Lacivert 5.png", "img/Lacivert 6.png", "img/Lacivert 7.png", "img/Lacivert 8.png", "img/Lacivert 9.png"]',
        articleCode: "910407",
        certificateCode: "OZO 1117-CPT001/26-A1/26",
        standards: ["EN 11611", "EN 11612", "EN 1149-5"],
        colors: ["Lacivert"],
        features: {
            tr: [
                "Alev Geciktirici & Antistatik Kalın Kumaş",
                "Kaynak ve Metal Çapaklarına Dayanıklı Yapı",
                "Kimyasallara ve Mekanik Aşınmaya Yüksek Mukavemet",
                "Konforlu, Sade İş Sahası Tasarımı"
            ],
            en: [
                "Flame Retardant & Antistatic Heavy Fabric",
                "Structure Resistant to Welding & Metal Splashes",
                "High Resistance to Chemicals and Mechanical Wear",
                "Comfortable Workplace Design"
            ],
            de: [
                "Flammhemmender und antistatischer schwerer Stoff",
                "Struktur beständig gegen Schweiß- und Metallspritzer",
                "Hohe Beständigkeit gegen Chemikalien und mechanischen Verschleiß",
                "Komfortables Arbeitsplatzdesign"
            ],
            ru: [
                "Огнестойкая и антистатическая плотная ткань",
                "Структура, устойчивая к сварке и брызгам металла",
                "Высокая стойкость к химическим веществам и механическому износу",
                "Комфортный дизайн спецодежды"
            ],
            nl: [
                "Vlamvertragende & antistatische zware stof",
                "Structuur bestand tegen las- en metaalspatten",
                "Hoge weerstand tegen chemicaliën en mechanische slijtage",
                "Comfortabel werkplaatsontwerp"
            ],
            fr: [
                "Tissu lourd ignifuge et antistatique",
                "Structure résistante au soudage et aux projections de métal",
                "Haute résistance aux produits chimiques et à l'usure mécanique",
                "Design de travail confortable"
            ],
            it: [
                "Tessuto pesante ignifugo e antistatico",
                "Struttura resistente a saldatura e schizzi di metallo",
                "Elevata resistenza agli agenti chimici e all'usura meccanica",
                "Design confortevole per il lavoro"
            ]
        }
    }
];

// Helper Functions
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

// Global scope expose for all scripts
window.MOCK_PRODUCTS = MOCK_PRODUCTS;
window.getProductTranslation = getProductTranslation;
window.getProductFeatures = getProductFeatures;
