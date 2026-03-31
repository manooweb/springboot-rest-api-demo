import { Injectable } from '@angular/core';

type MatomoCommand = [string, ...unknown[]];

declare global {
  interface Window {
    _paq?: MatomoCommand[];
  }
}

@Injectable({ providedIn: 'root' })
export class MatomoService {
  trackPageView(url: string, title?: string): void {
    const _paq = window._paq;
    if (!_paq) return;

    _paq.push(['setCustomUrl', url]);
    if (title) {
      _paq.push(['setDocumentTitle', title]);
    }
    _paq.push(['trackPageView']);
  }
}
