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
        imageUrl: "img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png",
        subImages: '["img/Beyaz Zeminde Yüksek Görünürlüklü İş Parkası.png", "img/Neon Sarı Reflektif İş Parkası.png", "img/Neon Sarı Reflektif Güvenlik Parkası.png", "img/Neon Sarı Kapüşonlu Güvenlik Montu.png", "img/Profilde Neon Sarı Reflektörlü İş Parkası.png"]',
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
        id: 2,
        name: {
            tr: "Supervisor Alev Almaz Yönetici Takımı",
            en: "Supervisor Flame Retardant Manager Suit",
            de: "Supervisor Flammhemmender Manageranzug",
            ru: "Огнестойкий костюм супервайзера",
            nl: "Supervisor Vlamvertragend Manager Pak",
            fr: "Costume de Superviseur Ignifuge",
            it: "Completo Supervisor Ignifugo"
        },
        subtitle: {
            tr: "Çoklu Risk Korumalı Alev Almaz Yönetici Takımı",
            en: "Multi-Risk Protection Flame Retardant Manager Suit",
            de: "Multi-Risk Flammhemmender Schutzanzug",
            ru: "Огнестойкий защитный костюм для руководителей",
            nl: "Multi-Risico Vlamvertragend Beschermingspak",
            fr: "Costume de Superviseur Multi-Risques Ignifuge",
            it: "Completo Supervisor Multi-Rischio Ignifugo"
        },
        description: {
            tr: "Rafineriler, kimya tesisleri ve enerji santralleri gibi yüksek riskli endüstriyel tesislerdeki mühendis ve yöneticiler için alev almaz, antistatik ve reflektörlü koruyucu iş takımı.",
            en: "Protective workwear with flame retardant, antistatic, and reflective properties for engineers and managers in high-risk industrial facilities such as refineries and chemical plants.",
            de: "Flammhemmende, antistatische und reflektierende Schutzkleidung für Ingenieure und Manager in Industrieanlagen wie Raffinerien und Chemiewerken.",
            ru: "Огнестойкая, антистатическая спецодежда со светоотражающими элементами для инженеров и руководителей на промышленных объектах.",
            nl: "Vlamvertragende, antistatische werkkleding met reflecterende details voor ingenieurs en managers in industriële omgevingen.",
            fr: "Vêtement de protection ignifuge, antistatique et réfléchissant pour ingénieurs et cadres dans les installations industrielles à risque.",
            it: "Abbigliamento protettivo ignifugo, antistatico e riflettente per ingegneri e responsabili in impianti industriali."
        },
        price: 280.00,
        imageUrl: "img/Lacivert Reflektif İş Tulumu.png",
        subImages: '["img/Lacivert Reflektif İş Tulumu.png", "img/Yüksek Görünürlüklü Mavi-Sarı İş Montu.png", "img/Kobalt Mavi ve Neon Sarı İş Montu.png", "img/Mavi Sarı Reflektörlü İş Montu.png", "img/Kék és neon munkavédelmi dzseki hátulról.png", "img/Yüksek Görünürlüklü İş Pantolonu.png", "img/Arkadan Görünüm Yüksek Görünürlüklü İş Pantolonu.png", "img/Yan Profilli Yüksek Görünürlüklü İş Pantolonu.png", "img/Mavi-Sarı Reflektif İş Pantolonu.png"]',
        articleCode: "910403",
        certificateCode: "OZO 1117-CPT002/26",
        standards: ["EN 11611", "EN 11612", "EN 1149-5", "EN 20471"],
        features: {
            tr: [
                "Alev Almaz & Antistatik Güçlendirilmiş Kumaş",
                "Ergonomik Kesim ve Hareket Kolaylığı",
                "Yüksek Nefes Alabilir Dikiş Yapısı",
                "Profesyonel Tasarım ve Çoklu Cep Sistemi"
            ],
            en: [
                "Flame Retardant & Antistatic Reinforced Fabric",
                "Ergonomic Cut & Ease of Movement",
                "Highly Breathable Seam Structure",
                "Professional Design & Multi-Pocket System"
            ],
            de: [
                "Flammhemmendes und antistatisches verstärktes Gewebe",
                "Ergonomischer Schnitt und Bewegungsfreiheit",
                "Hoch atmungsaktive Nahtstruktur",
                "Professionelles Design und Multi-Pocket-System"
            ],
            ru: [
                "Огнестойкая и антистатическая усиленная ткань",
                "Эргономичный крой и легкость движений",
                "Высокодышащая структура швов",
                "Профессиональный дизайн и система со множеством карманов"
            ],
            nl: [
                "Vlamvertragende & antistatische versterkte stof",
                "Ergonomische pasvorm & bewegingsvrijheid",
                "Hoog ademend naadontwerp",
                "Professioneel ontwerp & multi-zakken systeem"
            ],
            fr: [
                "Tissu renforcé ignifuge et antistatique",
                "Coupe ergonomique et aisance de mouvement",
                "Structure de couture hautement respirante",
                "Design professionnel et système multi-poches"
            ],
            it: [
                "Tessuto rinforzato ignifugo e antistatico",
                "Taglio ergonomico e libertà di movimento",
                "Struttura delle cuciture ad alta traspirabilità",
                "Design professionale e sistema multitasche"
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
        subImages: '["img/Reflektörlü Mavi-Lime İş Elbisesi.png", "img/Arka Görünüm Reflektif İş Elbisesi.png", "img/Mavi ve Neon Sarı Reflektif İş Tulumu.png", "img/Kobalt Mavi ve Neon Sarı İş Montu.png", "img/Mavi Sarı Reflektörlü İş Montu.png", "img/Mavi ve Neon Reflektif İş Pantolonu.png", "img/Mavi-Sarı Reflektif İş Pantolonu.png", "img/Yüksek Görünürlüklü İş Pantolonu.png"]',
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
            tr: "Alev Almaz Profesyonel Kaynakçı Takımı",
            en: "Flame Retardant Professional Welder Suit",
            de: "Flammhemmender professioneller Schweißeranzug",
            ru: "Профессиональный огнестойкий костюм сварщика",
            nl: "Vlamvertragend Professioneel Lasserspak",
            fr: "Combinaison Professionnelle de Soudeur Ignifuge",
            it: "Completo Professionale da Saldatore Ignifugo"
        },
        subtitle: {
            tr: "Alev Almaz & Antistatik Reflektörlü Kaynakçı Takımı",
            en: "Flame Retardant & Antistatic Reflective Welder Suit",
            de: "Flammhemmender und antistatischer Schweißeranzug mit Reflektoren",
            ru: "Огнестойкий и антистатический костюм сварщика с отражателями",
            nl: "Vlamvertragend & Antistatisch Lasserspak met Reflectie",
            fr: "Combinaison de Soudeur Ignifuge et Antistatique avec Bandes Réfléchissantes",
            it: "Completo da Saldatore Ignifugo e Antistatico con Bande Riflettenti"
        },
        description: {
            tr: "Yoğun kaynak operasyonlarında kıvılcım, alev ve ısı transferine karşı tam güvenlik sağlayan, reflektörlü şeritli dayanıklı alev almaz ve antistatik kaynakçı iş takımı.",
            en: "Durable flame-retardant and antistatic welder workwear with reflective strips, providing complete safety against sparks, flames, and heat transfer.",
            de: "Langlebiger flammhemmender und antistatischer Schweißeranzug mit Reflexstreifen für maximale Sicherheit gegen Funken, Flammen und Hitzeübertragung.",
            ru: "Прочный огнестойкий и антистатический костюм сварщика со светоотражающими полосами для защиты от искр, пламени и высокой температуры.",
            nl: "Duurzaam vlamvertragend en antistatisch lasserspak met reflecterende strips voor veiligheid tegen vonken, vlammen en warmteoverdracht.",
            fr: "Combinaison de travail de soudeur ignifuge et antistatique durable avec bandes réfléchissantes pour une sécurité complète contre les étincelles et la chaleur.",
            it: "Abbigliamento da lavoro da saldatore ignifugo e antistatico con strisce riflettenti per la massima protezione contro scintille e calore."
        },
        price: 250.00,
        imageUrl: "img/Mavi Reflektörlü İş Üniforması.png",
        subImages: '["img/Mavi Reflektörlü İş Üniforması.png", "img/Mavi Reflektif İş Üniforması Seti.png", "img/Mavi Reflektif İş Ceketi.png", "img/Reflektörlü Mavi İş Montu.png", "img/Mavi Reflektörlü İş Güvenliği Montu.png", "img/Mavi Reflektörlü İş Güvenliği Ceketi.png", "img/Reflektör Bantlı Mavi İş Pantolonu.png", "img/Arkadan Görünümlü Reflektif İş Pantolonu.png", "img/Reflektör Şeritli İş Pantolonu.png", "img/Yan Profilli Reflektif İş Pantolonu.png"]',
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
        imageUrl: "img/Mavi Reflektörlü İş Üniforması.png",
        subImages: '["img/Mavi Reflektörlü İş Üniforması.png", "img/Mavi Reflektörlü İş Üniforması-2.png", "img/Mavi Reflektif İş Üniforması.png", "img/Arkadan Görünümlü Reflektörlü İş Pantolonu.png", "img/Yan Profilli Reflektif İş Pantolonu-2.png"]',
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
            tr: "Supervisor Alev Almaz Mühendis Takımı",
            en: "Supervisor Flame Retardant Engineer Suit",
            de: "Supervisor Flammhemmender Ingenieursanzug",
            ru: "Огнестойкий костюм инженера",
            nl: "Supervisor Vlamvertragend Ingenieur Pak",
            fr: "Costume d'Ingénieur Ignifuge",
            it: "Completo per Ingegneri Ignifugo"
        },
        subtitle: {
            tr: "Alev Almaz & Antistatik Mühendis Takımı (Reflektörsüz)",
            en: "Flame Retardant & Antistatic Engineer Suit (Non-reflective)",
            de: "Flammhemmender & antistatischer Ingenieursanzug (Ohne Reflektoren)",
            ru: "Огнестойкий и антистатический костюм инженера (без светоотражателей)",
            nl: "Vlamvertragend & Antistatisch Ingenieurspak (Niet-reflecterend)",
            fr: "Costume d'Ingénieur Ignifuge et Antistatique (Sans bandes réfléchissantes)",
            it: "Completo Ignifugo e Antistatico per Ingegneri (Non riflettente)"
        },
        description: {
            tr: "Endüstriyel tesislerdeki mühendis ve saha yöneticileri için çoklu risk koruması, alev almazlık ve antistatik özellik sunan, konforlu kesime sahip reflektörsüz yönetici iş takımı.",
            en: "Comfortable non-reflective workwear offering multi-risk protection, flame retardancy, and antistatic safety for engineers and site managers in industrial plants.",
            de: "Bequeme Schutzkleidung ohne Reflektoren, die Multi-Risk-Schutz, Flammhemmung und antistatische Sicherheit für Ingenieure und Betriebsleiter bietet.",
            ru: "Удобная спецодежда без светоотражателей с защитой от многих рисков, огнестойкостью и антистатическими свойствами для инженеров.",
            nl: "Comfortabele werkkleding zonder reflectie met multi-risico bescherming, vlamvertragendheid en antistatische veiligheid voor ingenieurs.",
            fr: "Vêtement de travail confortable sans bandes réfléchissantes offrant une protection multi-risques, ignifuge et antistatique pour les ingénieurs et chefs de site.",
            it: "Abbigliamento da lavoro confortevole senza bande riflettenti con protezione multi-rischio, ignifuga e antistatica per ingegneri e responsabili di cantiere."
        },
        price: 270.00,
        imageUrl: "img/Çelik Grisi Reflektörlü İş Ceketi.png",
        subImages: '["img/Çelik Grisi Reflektörlü İş Ceketi.png", "img/Gri-Mavi Reflektif İş Elbisesi.png", "img/Reflektörlü Gri-Mavi İş Montu.png", "img/Gri Reflektörlü İş Montu Arkadan Görünüm.png", "img/Gri Reflektörlü İş Üniforması Arkadan Görünüm.png", "img/Gri Mavi Reflektif İş Tulumu.png"]',
        articleCode: "910406",
        certificateCode: "OZO 1117-CPT002/26-A1/26",
        standards: ["EN 11611", "EN 11612", "EN 1149-5"],
        features: {
            tr: [
                "Alev Almazlık ve Statik Elektrik Dağıtıcı Yapı",
                "Konforlu Ergonomik Kesim ve Hareket Kolaylığı",
                "Çoklu Ekipman Cebi ve Fonksiyonel Tasarım",
                "Endüstriyel Yıkamalara Karşı Yüksek Dayanıklılık"
            ],
            en: [
                "Flame Retardancy & Static Dissipative Structure",
                "Comfortable Ergonomic Cut & Ease of Movement",
                "Multiple Equipment Pockets & Functional Design",
                "High Durability Against Industrial Washings"
            ],
            de: [
                "Flammhemmung und statisch ableitende Struktur",
                "Bequemer ergonomischer Schnitt und Bewegungsfreiheit",
                "Mehrere Gerätetaschen und funktionales Design",
                "Hohe Haltbarkeit gegenüber industriellen Wäschen"
            ],
            ru: [
                "Огнестойкость и статическая диссипативная структура",
                "Удобный эргономичный крой и легкость движений",
                "Несколько карманов для инструментов и функциональный дизайн",
                "Высокая прочность к промышленным стиркам"
            ],
            nl: [
                "Vlamvertragendheid & statisch dissipatieve structuur",
                "Comfortabele ergonomische pasvorm & bewegingsvrijheid",
                "Meerdere gereedschapszakken & functioneel ontwerp",
                "Hoge duurzaamheid tegen industrieel wassen"
            ],
            fr: [
                "Ignifugation et structure dissipative statique",
                "Coupe ergonomique confortable et liberté de mouvement",
                "Plusieurs poches d'équipement et design fonctionnel",
                "Haute durabilité face aux lavages industriels"
            ],
            it: [
                "Struttura ignifuga e dissipativa statica",
                "Taglio ergonomico confortevole e libertà di movimento",
                "Tasche multiple per attrezzature e design funzionale",
                "Alta resistenza ai lavaggi industriali"
            ]
        }
    },
    {
        id: 7,
        name: {
            tr: "Ağır Sanayi Alev Almaz Kaynakçı Takımı",
            en: "Heavy Industry Flame Retardant Welder Suit",
            de: "Schwerindustrie Flammhemmender Schweißeranzug",
            ru: "Костюм сварщика для тяжелой промышленности",
            nl: "Zware Industrie Vlamvertragend Lasserspak",
            fr: "Combinaison de Soudeur Industrie Lourde Ignifuge",
            it: "Completo da Saldatore per Industria Pesante Ignifugo"
        },
        subtitle: {
            tr: "Alev Almaz & Antistatik Kaynakçı Takımı (Reflektörsüz)",
            en: "Flame Retardant & Antistatic Welder Suit (Non-reflective)",
            de: "Flammhemmender & antistatischer Schweißeranzug (Ohne Reflektoren)",
            ru: "Огнестойкий и антистатический костюм сварщика (без светоотражателей)",
            nl: "Vlamvertragend & Antistatisch Lasserspak (Niet-reflecterend)",
            fr: "Combinaison Ignifuge et Antistatique pour Soudeur (Sans bandes réfléchissantes)",
            it: "Completo Ignifugo e Antistatico da Saldatore (Non riflettente)"
        },
        description: {
            tr: "Ağır kaynak, döküm ve metal eritme süreçlerinde yüksek sıcaklık, açık alev ve erimiş metal sıçramalarına karşı dayanıklı, alev almaz ve antistatik reflektörsüz kaynakçı iş takımı.",
            en: "Flame-retardant and antistatic non-reflective welder suit, highly resistant to high temperatures, open flames, and molten metal splashes during heavy welding and foundry operations.",
            de: "Flammhemmender und antistatischer Schweißeranzug ohne Reflektoren, widerstandsfähig gegen hohe Temperaturen, offene Flammen und geschmolzene Metallspritzer.",
            ru: "Огнестойкий и антистатический костюм сварщика без светоотражателей для защиты от высоких температур, открытого пламени и брызг расплавленного металла.",
            nl: "Vlamvertragend en antistatisch lasserspak zonder reflectie, bestand tegen hoge temperaturen, open vuur en lasspatten bij zware laswerkzaamheden.",
            fr: "Combinaison de soudeur ignifuge et antistatique sans bandes réfléchissantes, résistante aux températures élevées, aux flammes et aux projections de métal en fusion.",
            it: "Completo da saldatore ignifugo e antistatico non riflettente, resistente alle alte temperature, fiamme libere e schizzi di metallo fuso nelle operazioni pesanti."
        },
        price: 260.00,
        imageUrl: "img/Lacivert Reflektörlü İş Montu.png",
        subImages: '["img/Lacivert Reflektörlü İş Montu.png", "img/Lacivert Reflektif İş Montu.png", "img/Navy Blue Reflective Utility Jacket.png", "img/Lacivert Reflektörlü İş Üniforması.png", "img/Lacivert Reflektif İş Üniforması.png", "img/Arka Görünüm Reflektif İş Elbisesi.png", "img/Donanımlı Lacivert İş Pantolonu.png", "img/Lacivert Reflektörlü İş Pantolonu.png", "img/Lacivert Reflektörlü İş Pantolonu-2.png", "img/Granatowe spodnie robocze z odblaskami.png", "img/Lacivert Reflektif İş Tulumu.png"]',
        articleCode: "910407",
        certificateCode: "OZO 1117-CPT001/26-A1/26",
        standards: ["EN 11611", "EN 11612", "EN 1149-5"],
        features: {
            tr: [
                "Kaynak Sıçramalarına Dayanıklı Özel Dokuma",
                "Isı Geçişini Sınırlayan Alev Almaz Yapı",
                "Kıvılcım Önleyici Antistatik Koruma",
                "Reflektörsüz, Sade İş Sahası Tasarımı"
            ],
            en: [
                "Welding Splash Resistant Specialized Weave",
                "Heat & Flame Retardant Structure",
                "Spark-Preventive Antistatic Protection",
                "Simple Non-Reflective Workplace Design"
            ],
            de: [
                "Schweißspritzerbeständiges Spezialgewebe",
                "Hitze- und flammhemmende Struktur",
                "Funkenschutz durch antistatischen Schutz",
                "Einfaches, nicht reflektiertes Arbeitsplatzdesign"
            ],
            ru: [
                "Специальное переплетение, устойчивое к брызгам сварки",
                "Термо- и огнестойкая структура",
                "Искробезопасная антистатическая защита",
                "Простой неотражающий дизайн"
            ],
            nl: [
                "Met lasspatten bestendige speciale weving",
                "Hitte- & vlamvertragende structuur",
                "Vonkpreventieve antistatische bescherming",
                "Eenvoudig, niet-reflecterend werkplaatsontwerp"
            ],
            fr: [
                "Tissage spécial résistant aux projections de soudure",
                "Structure résistante à la chaleur et aux flames",
                "Protection antistatique anti-étincelles",
                "Design simple, sans bandes réfléchissantes, adapté aux zones de travail"
            ],
            it: [
                "Tessitura speciale resistente agli schizzi di saldatura",
                "Struttura resistente al calore e alla fiamma",
                "Protezione antistatica antiscintilla",
                "Design da lavoro semplice e non riflettente"
            ]
        }
    }
];

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
        const lang = localStorage.getItem('metemorali_lang') || 'tr';
        let products = MOCK_PRODUCTS;
        
        if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
            try {
                const { data, error } = await supabaseClient.from('Products').select('*').order('Id');
                if (data && data.length > 0) {
                    products = data.map(p => ({
                        id: p.Id || p.id,
                        name: p.Name || p.name,
                        subtitle: p.Subtitle || p.subtitle,
                        description: p.Description || p.description,
                        price: Number(p.Price || p.price),
                        imageUrl: p.ImageUrl || p.image_url || p.imageUrl,
                        subImages: p.SubImages || p.sub_images || p.subImages,
                        articleCode: p.ArticleCode || p.article_code || p.articleCode,
                        certificateCode: p.CertificateCode || p.certificate_code || p.certificateCode,
                        standards: p.Standards || p.standards,
                        colors: p.Colors || p.colors,
                        features: p.Features || p.features
                    }));
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
            const rawName = getProductTranslation(p, 'name', lang) || '';
            const rawSubtitle = getProductTranslation(p, 'subtitle', lang) || '';
            const rawDesc = getProductTranslation(p, 'description', lang) || '';
            const examineBtnText = escapeHtml(EXAMINE_TRANSLATIONS[lang] || EXAMINE_TRANSLATIONS['tr']);

            // Determine category dynamically based on product ID
            let category = "welder";
            if (p.id === 1) category = "parka";
            else if (p.id === 2 || p.id === 6) category = "supervisor";

            const safeName = escapeHtml(rawName);
            const safeDesc = escapeHtml(rawSubtitle || rawDesc);
            const safeCategory = escapeHtml(category);
            const safeImg = encodeURI(p.imageUrl || '');
            const safeId = encodeURIComponent(p.id || '');

            // "Katalog" kartı tasarımı
            const cardHTML = `
            <div class="product-card" data-category="${safeCategory}">
                <!-- Sparks Animasyonu -->
                <div class="sparks-container">
                    <div class="spark"></div><div class="spark"></div><div class="spark"></div><div class="spark"></div><div class="spark"></div>
                </div>
                
                <div class="card-image-wrapper">
                    <img src="${safeImg}" alt="${safeName}">
                </div>
                
                <div class="card-content">
                    <h3 class="card-title">${safeName}</h3>
                    <p class="card-desc">${safeDesc}</p>
                    <div class="card-actions" style="display: flex; justify-content: center; align-items: center; margin-top: 15px;">
                        <a href="urun-detay.html?id=${safeId}" class="btn btn-outline" style="width: 100%; text-align: center;">${examineBtnText}</a>
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
