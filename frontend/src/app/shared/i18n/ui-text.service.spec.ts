import { TestBed } from '@angular/core/testing';

import { UiTextService } from './ui-text.service';
import { type UiLang } from './index';

describe('UiTextService (smoke)', () => {
  let service: UiTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiTextService);
  });

  it('should return the expected value for a known key', () => {
    expect(service.t('shared.action.cancel')).toBe('Cancel');
  });

  it('should return the key itself when missing', () => {
    expect(service.t('missing.key')).toBe('missing.key');
  });

  it('should interpolate named placeholders', () => {
    // Pick a key that exists in your dictionaries
    // If you used: projects.confirmDelete.title = Delete project "{projectName}"
    const result = service.t('projects.confirmDelete.title', { projectName: 'Demo' });
    expect(result).toContain('Demo');
    expect(result).not.toContain('{projectName}');
  });

  it('should keep unknown placeholders untouched', () => {
    const result = service.t('projects.confirmDelete.title'); // no params
    expect(result).toContain('{projectName}');
  });

  it('should fall back to default language when setting an unsupported language', () => {
    // If UiLang is only 'en' right now, cast is fine for this smoke test
    service.setLanguage('en' as UiLang);
    expect(service.getLanguage()).toBe('en');

    service.setLanguage('xx' as UiLang);
    expect(service.getLanguage()).toBe('en');
  });
});
