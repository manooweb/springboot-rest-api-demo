import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { UiTextService } from '../../shared/i18n/ui-text.service';

export type LegalDoc = 'legalNotice' | 'privacyPolicy';

export const legalHtmlResolver = (doc: LegalDoc): ResolveFn<string> => {
  return () => {
    const http = inject(HttpClient);
    const translate = inject(UiTextService);

    const filename = translate.t(`legal.${doc}.filename`);
    const lang = translate.getLanguage();

    return http.get(`/legal/${lang}/${filename}`, { responseType: 'text' }).pipe(
      map((html) => {
        const content = (html ?? '').trim();

        if (!content || content.startsWith('<!doctype html')) {
          return `<p>${translate.t('legal.content.unavailable')}</p>`;
        }

        return content;
      }),
    );
  };
};
