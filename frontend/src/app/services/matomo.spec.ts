import { TestBed } from '@angular/core/testing';

import { MatomoService } from './matomo';

describe('MatomoService', () => {
  let service: MatomoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatomoService);
    globalThis._paq = [];
  });

  afterEach(() => {
    delete globalThis._paq;
  });

  it('should push a page view with title when provided', () => {
    service.trackPageView('https://example.test/projects', 'Projects – list');

    expect(globalThis._paq).toEqual([
      ['setCustomUrl', 'https://example.test/projects'],
      ['setDocumentTitle', 'Projects – list'],
      ['trackPageView'],
    ]);
  });

  it('should push a page view without document title when title is omitted', () => {
    service.trackPageView('https://example.test/projects');

    expect(globalThis._paq).toEqual([
      ['setCustomUrl', 'https://example.test/projects'],
      ['trackPageView'],
    ]);
  });
});
