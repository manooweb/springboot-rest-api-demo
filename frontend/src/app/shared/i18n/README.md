# 🌍 UI Text / i18n-ready strategy

This project uses a lightweight, dependency-free UI text system to prepare the Angular UI for future internationalization.

No external i18n library is used yet.

---

## 📌 Where UI texts live

All UI strings are centralized under:

frontend/src/app/shared/i18n/

English is the current default language:

frontend/src/app/shared/i18n/en/

Texts are split by feature:

- app.ts
- auth.ts
- projects.ts
- tasks.ts
- shared.ts

Each file exports a dictionary:

- APP_EN
- AUTH_EN
- PROJECTS_EN
- TASKS_EN
- SHARED_EN

They are merged into a single dictionary:

- EN_DICTIONARY

---

## 🔑 Key naming conventions

Keys use dot notation:

feature.category.name

Allowed feature prefixes:

- app.*
- auth.*
- projects.*
- tasks.*
- shared.*

Examples:

- auth.login.validation.emailRequired
- projects.message.created
- tasks.confirmDelete.title
- shared.action.cancel

Generic actions must be reused from shared:

- shared.action.cancel
- shared.action.save
- shared.action.delete
- shared.action.ok

---

## 🧩 Interpolation (dynamic texts)

Named placeholders are supported:

Delete project "{projectName}"

Usage:

translate.t('projects.confirmDelete.title', {
  projectName: project.name,
});

Missing params keep the placeholder visible.

---

## 🛠️ How to use in templates

Use the standalone pipe:

{{ 'shared.action.cancel' | translate }}

---

## 🛠️ How to use in TypeScript

Inject the service:

private readonly translate = inject(UiTextService);

Then call:

this.translate.t('projects.message.created');

---

## ➕ Adding a new key

1. Add the key/value to the correct feature file in en/
2. Reuse shared keys whenever possible
3. Run tests to ensure:
   - no duplicate keys
   - valid key format
   - non-empty values

---

## ➕ Adding a new language (example: French)

1. Create folder:

frontend/src/app/shared/i18n/fr/

2. Add feature files:

app.ts, auth.ts, projects.ts, tasks.ts, shared.ts

3. Create fr/index.ts exporting FR_DICTIONARY

4. Register it in:

frontend/src/app/shared/i18n/index.ts

Then UI_DICTIONARIES becomes:

{
  en: EN_DICTIONARY,
  fr: FR_DICTIONARY
}

No lazy-loading is implemented yet (languages are bundled at build time).
