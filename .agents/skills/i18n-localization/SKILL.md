---
name: i18n-localization
description: Comprehensive internationalization (i18n) and localization (L10n) skill. Guides separating translation dictionaries from code into JSON locale files, detecting hardcoded strings, key parity auditing, pluralization, and multi-language workflow automation.
---

# i18n & Localization (Internationalization & Localization Skill)

> Standardized agentic workflow for decoupling translations from source code, automating locale files, and managing multi-language applications without cluttering logic.

---

## 1. Core Principles: Keep Code Clean (Zero Translation Clutter)

1. **Decouple Data from Code:**
   - Never embed massive multi-language dictionaries (`{ tr: '...', en: '...', de: '...', ru: '...' }`) directly in application JavaScript or components.
   - Store translations in dedicated locale files (`locales/{lang}/...json` or `data/locales/{lang}.json`).
   - Code should only contain lightweight keys (e.g. `product.1.name`, `nav.home`) or reference external translation catalogs.

2. **Single Source of Truth for Locales:**
   - Each language has its own isolated namespace or file (e.g. `locales/tr.json`, `locales/en.json`, `locales/de.json`, `locales/ru.json`).
   - Base locale (usually `tr` or `en`) defines all canonical keys. All other locales must maintain 1:1 key parity.

3. **Runtime or Build-time Ingestion:**
   - For static/vanilla sites: fetch active language JSON asynchronously on load (`fetch('/locales/' + lang + '.json')`) or load via slim synchronous locale script.
   - For frameworks (React, Next, Vue): use standard providers (`react-i18next`, `next-intl`, `vue-i18n`) reading from JSON bundles.

---

## 2. Directory Architecture

```text
project-root/
├── locales/
│   ├── tr/
│   │   ├── common.json
│   │   └── products.json
│   ├── en/
│   │   ├── common.json
│   │   └── products.json
│   ├── de/
│   │   ├── common.json
│   │   └── products.json
│   └── ru/
│       ├── common.json
│       └── products.json
```

Or for lightweight single-file setups:
```text
project-root/
└── data/
    └── locales/
        ├── tr.json
        ├── en.json
        ├── de.json
        ├── ru.json
        ├── nl.json
        ├── fr.json
        └── it.json
```

---

## 3. Auditing & Linting Rules

1. **Hardcoded String Detection:**
   - Scan UI templates and scripts for raw strings rendered to the user.
   - Replace with localized lookup functions: `t('key')` or `getProductTranslation(product, 'name', currentLang)`.

2. **Key Parity Enforcement:**
   - Run audit scripts to verify that every key present in the default language file also exists in all target translation files.
   - Flag missing keys as blockers before deployment.

3. **Preserve Dynamic Placeholders:**
   - Always preserve variables like `{name}`, `{count}`, `%s` without altering variable names during translation.

4. **Formatting Standards:**
   - Use `Intl.NumberFormat` for currency and numbers.
   - Use `Intl.DateTimeFormat` for dates.
