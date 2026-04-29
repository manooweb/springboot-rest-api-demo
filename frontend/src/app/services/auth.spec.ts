import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideAnimations(), Auth],
    });
    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should mark user as authenticated on login success', () => {
    const username = 'demo';
    const password = 'demo';

    service.login(username, password).subscribe(() => {
      expect(service.isLoggedIn()).toBeTrue();
    });

    const req = httpMock.expectOne(
      (r) => r.method === 'POST' && r.url.includes('/api/v1/auth/login'),
    );
    expect(req.request.body).toEqual({ username, password });

    req.flush(null);
  });

  it('should call logout endpoint and clear authenticated state on logout success', () => {
    service.login('demo', 'demo').subscribe();
    const loginReq = httpMock.expectOne(
      (r) => r.method === 'POST' && r.url.includes('/api/v1/auth/login'),
    );
    loginReq.flush(null);
    expect(service.isLoggedIn()).toBeTrue();

    service.logout().subscribe(() => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    const logoutReq = httpMock.expectOne(
      (r) => r.method === 'POST' && r.url.includes('/api/v1/auth/logout'),
    );
    expect(logoutReq.request.body).toEqual({});
    logoutReq.flush(null);
  });

  it('should clear authenticated state without calling backend', () => {
    service.login('demo', 'demo').subscribe();
    const loginReq = httpMock.expectOne(
      (r) => r.method === 'POST' && r.url.includes('/api/v1/auth/login'),
    );
    loginReq.flush(null);
    expect(service.isLoggedIn()).toBeTrue();

    service.clearSession();

    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
