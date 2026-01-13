import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { Auth } from './auth';

const TOKEN_STORAGE_KEY = 'auth_token';

describe('Auth', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        Auth,
      ],
    });
    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should store token on login success', () => {
    const username = 'demo';
    const password = 'demo';
    const fakeToken = 'fake-jwt-token';

    service.login(username, password).subscribe(() => {
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(fakeToken);
    });

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url.includes('/api/v1/auth/login'));
    expect(req.request.body).toEqual({ username, password });

    req.flush({ accessToken: fakeToken });
  });

  it('should clear token on logout', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'abc');
    service.logout();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
