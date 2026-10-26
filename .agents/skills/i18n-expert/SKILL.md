---
name: i18n-expert
description: Specialized skill for UI and e-commerce codebase internationalization. Auditing and decoupling massive in-code translation dictionaries into lightweight JSON locales, managing translation parity across 7+ languages (TR, EN, DE, RU, NL, FR, IT), and ensuring lightning-fast load times.
---

# i18n Expert (UI & Catalog Localization Specialist)

> Designed for decoupling translations from code, eliminating bloat, and automating multi-language catalogs.

---

## 1. When to Use

- When JavaScript files (`products.js`, `i18n.js`) become bloated with hundreds of lines of translations.
- When adding new languages or updating product catalogs across multiple languages.
- When auditing missing translations or verifying 100% key parity across all locales.
- When optimizing page load speed by lazy-loading or decoupling language dictionaries from core application logic.

---

## 2. Core Workflows

### A. Decoupling Translations From Products
Instead of:
```javascript
// AVOID: 500+ lines of raw dictionaries inside code
const product = {
  name: { tr: "...", en: "...", de: "...", ru: "...", nl: "...", fr: "...", it: "..." },
  description: { tr: "...", en: "...", de: "...", ru: "...", nl: "...", fr: "...", it: "..." },
  features: { tr: [...], en: [...], de: [...], ru: [...], nl: [...], fr: [...], it: [...] }
};
```

Apply decoupled architecture:
```javascript
// RECOMMENDED: Lightweight canonical product definition
const product = {
  id: 1,
  articleCode: "910404",
  price: 290.00,
  imageUrl: "img/parka.png",
  standards: ["EN 11611", "EN 11612"]
  // Translations resolved dynamically from locales/{lang}/products.json
};
```

### B. Supported Languages for MeteMorali
1. `tr` - Turkish (Canonical Source)
2. `en` - English
3. `de` - German
4. `ru` - Russian
5. `nl` - Dutch
6. `fr` - French
7. `it` - Italian

### C. Language Audit Pass
1. Compare keys between `tr` and all other languages.
2. Flag untranslated fallback keys.
3. Automatically generate missing entries via translation pipelines without touching application logic.
