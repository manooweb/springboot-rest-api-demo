import { Injectable } from '@angular/core';

type MatomoCommand = [string, ...unknown[]];

declare global {
  var _paq: MatomoCommand[] | undefined;
}

@Injectable({ providedIn: 'root' })
export class MatomoService {
  trackPageView(url: string, title?: string): void {
    const _paq = globalThis._paq;
    if (!_paq) return;

    _paq.push(['setCustomUrl', url]);
    if (title) {
      _paq.push(['setDocumentTitle', title]);
    }
    _paq.push(['trackPageView']);
  }
}
