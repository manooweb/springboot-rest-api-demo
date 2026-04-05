import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';

import { App } from './app';
import { MatomoService } from './services/matomo';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('App', () => {
  let matomoSpy: jasmine.SpyObj<MatomoService>;

  beforeEach(async () => {
    matomoSpy = jasmine.createSpyObj<MatomoService>('MatomoService', ['trackPageView']);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: 'login', component: DummyComponent },
          { path: 'projects', component: DummyComponent },
          { path: 'projects/:id', component: DummyComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: MatomoService, useValue: matomoSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Project Management App');
  });

  it('should track page views on navigation end', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    fixture.detectChanges();
    await router.navigateByUrl('/projects');
    fixture.detectChanges();

    expect(matomoSpy.trackPageView).toHaveBeenCalledWith(
      `${globalThis.location.origin}/projects`,
      'Projects – list',
    );
  });
});
