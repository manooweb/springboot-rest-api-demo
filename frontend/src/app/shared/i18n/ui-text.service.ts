import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { UI_DICTIONARIES, type UiLang } from './index';

@Injectable({ providedIn: 'root' })
export class UiTextService {
  private readonly defaultLang: UiLang = 'en';
  private readonly langSubject = new BehaviorSubject<UiLang>(this.defaultLang);

  readonly lang$ = this.langSubject.asObservable();

  getLanguage(): UiLang {
    return this.langSubject.value;
  }

  setLanguage(lang: UiLang): void {
    // No lazy-load for now, just guard
    if (!UI_DICTIONARIES[lang]) {
      this.langSubject.next(this.defaultLang);
      return;
    }
    this.langSubject.next(lang);
  }

  t(key: string, params?: Record<string, unknown>): string {
    const lang = this.langSubject.value;
    const dict = UI_DICTIONARIES[lang] ?? UI_DICTIONARIES[this.defaultLang];

    const template = dict[key];
    if (!template) {
      // Returning the key makes missing translations visible during dev
      return key;
    }

    return this.interpolate(template, params);
  }

  private interpolate(template: string, params?: Record<string, unknown>): string {
    if (!params) return template;

    return template.replace(/\{(\w+)\}/g, (match, name: string) => {
      if (!(name in params)) return match;
      const value = params[name];
      return value === null || value === undefined ? '' : String(value);
    });
  }
}
