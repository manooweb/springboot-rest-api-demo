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

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('App', () => {
  let matomoSpy: jasmine.SpyObj<MatomoService>;
  let authSpy: jasmine.SpyObj<Auth>;
  let router: Router;

  beforeEach(async () => {
    matomoSpy = jasmine.createSpyObj<MatomoService>('MatomoService', ['trackPageView']);
    authSpy = jasmine.createSpyObj<Auth>('Auth', ['isLoggedIn', 'logout', 'clearSession']);
    authSpy.isLoggedIn.and.returnValue(false);
    authSpy.logout.and.returnValue(of(undefined));

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
        { provide: Auth, useValue: authSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.callThrough();
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
      'Projects – list',
    );
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
