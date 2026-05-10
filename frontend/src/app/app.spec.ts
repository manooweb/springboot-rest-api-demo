import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { App } from './app';
import { MatomoService } from './services/matomo';
import { Auth } from './services/auth';
import { Title } from '@angular/platform-browser';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('App', () => {
  let matomoSpy: jasmine.SpyObj<MatomoService>;
  let authSpy: jasmine.SpyObj<Auth>;
  let router: Router;
  let title: Title;

  beforeEach(async () => {
    matomoSpy = jasmine.createSpyObj<MatomoService>('MatomoService', ['trackPageView']);
    authSpy = jasmine.createSpyObj<Auth>('Auth', ['isLoggedIn', 'logout', 'clearSession']);
    authSpy.isLoggedIn.and.returnValue(false);
    authSpy.logout.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: 'login', component: DummyComponent, data: { pageTitleKey: 'auth.login.title' } },
          {
            path: 'projects',
            component: DummyComponent,
            data: { pageTitleKey: 'projects.title.list' },
          },
          {
            path: 'projects/:id',
            component: DummyComponent,
            data: { pageTitleKey: 'projects.title.detail' },
          },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: MatomoService, useValue: matomoSpy },
        { provide: Auth, useValue: authSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    title = TestBed.inject(Title);
    spyOn(router, 'navigateByUrl').and.callThrough();
    spyOn(title, 'setTitle');
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

    fixture.detectChanges();
    await router.navigateByUrl('/projects');
    fixture.detectChanges();

    expect(matomoSpy.trackPageView).toHaveBeenCalledWith(
      `${globalThis.location.origin}/projects`,
      'Projects',
    );
    expect(title.setTitle).toHaveBeenCalledWith('Projects | Project Management App');
  });

  it('should resolve page title from child route metadata', async () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();
    await router.navigateByUrl('/projects/123');
    fixture.detectChanges();

    expect(matomoSpy.trackPageView).toHaveBeenCalledWith(
      `${globalThis.location.origin}/projects/123`,
      'Project detail',
    );
    expect(title.setTitle).toHaveBeenCalledWith('Project detail | Project Management App');
  });

  it('should call backend logout and navigate to login when authenticated', () => {
    authSpy.isLoggedIn.and.returnValue(true);
    authSpy.logout.and.returnValue(of(undefined));
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.onAuthAction();

    expect(authSpy.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should clear session and navigate to login when logout fails', () => {
    authSpy.isLoggedIn.and.returnValue(true);
    authSpy.logout.and.returnValue(throwError(() => new Error('Logout failed')));
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.onAuthAction();

    expect(authSpy.clearSession).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
