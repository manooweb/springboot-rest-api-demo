import { UI_DICTIONARIES, type UiLang } from './index';

type Dict = Record<string, string>;

describe('i18n dictionaries', () => {
  it('should include default language en', () => {
    expect(UI_DICTIONARIES.en).toBeTruthy();
  });

  it('should expose at least one key for en', () => {
    expect(Object.keys(UI_DICTIONARIES.en).length).toBeGreaterThan(0);
  });

  it('should contain only non-empty string values for each language', () => {
    (Object.keys(UI_DICTIONARIES) as UiLang[]).forEach((lang) => {
      assertAllStringsNonEmpty(UI_DICTIONARIES[lang], lang);
    });
  });

  it('should have valid key format for each language', () => {
    (Object.keys(UI_DICTIONARIES) as UiLang[]).forEach((lang) => {
      assertValidKeys(UI_DICTIONARIES[lang], lang);
    });
  });
});

function assertAllStringsNonEmpty(dict: Dict, lang: string): void {
  for (const [key, value] of Object.entries(dict)) {
    if (typeof value !== 'string') {
      fail(`[${lang}] Value for "${key}" is not a string`);
    }
    if (value.trim().length === 0) {
      fail(`[${lang}] Value for "${key}" is empty`);
    }
  }
}

function assertValidKeys(dict: Dict, lang: string): void {
  const allowedPrefixes = ['app', 'auth', 'legal', 'projects', 'tasks', 'shared'];

  for (const key of Object.keys(dict)) {
    if (key.trim() !== key) {
      fail(`[${lang}] Key has leading/trailing spaces: "${key}"`);
    }
    if (key.includes(' ')) {
      fail(`[${lang}] Key must not contain spaces: "${key}"`);
    }
    if (key.includes('..')) {
      fail(`[${lang}] Key must not contain "..": "${key}"`);
    }
    if (key.endsWith('.')) {
      fail(`[${lang}] Key must not end with ".": "${key}"`);
    }

    // Must be prefix.something
    const firstDot = key.indexOf('.');
    if (firstDot <= 0) {
      fail(`[${lang}] Key must start with a prefix followed by ".": "${key}"`);
    }

    const prefix = key.slice(0, firstDot);
    const rest = key.slice(firstDot + 1);

    if (!allowedPrefixes.includes(prefix)) {
      fail(
        `[${lang}] Invalid prefix "${prefix}" for key "${key}". Allowed: ${allowedPrefixes.join(', ')}`,
      );
    }

    if (rest.length === 0) {
      fail(`[${lang}] Key must include a non-empty suffix after prefix: "${key}"`);
    }

    // Allow dot-separated camelCase segments:
    // auth.login.validation.emailRequired
    const segments = rest.split('.');
    for (const segment of segments) {
      if (segment.length === 0) {
        fail(`[${lang}] Key contains an empty segment: "${key}"`);
      }

      if (!/^[a-z][a-zA-Z0-9_]*$/.test(segment)) {
        fail(
          `[${lang}] Invalid segment "${segment}" in key "${key}". Segments must start with a lowercase letter and may contain letters, digits, or underscores.`,
        );
      }
    }
  }
}
