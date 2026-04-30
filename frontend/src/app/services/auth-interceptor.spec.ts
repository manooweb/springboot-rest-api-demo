import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Auth } from './auth';
import { Router } from '@angular/router';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<Auth>('Auth', ['expireSession']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not add Authorization header', () => {
    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('should expire session and redirect to login on non-login 401 response', () => {
    http.get('/api/test').subscribe({ error: () => undefined });

    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authSpy.expireSession).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledOnceWith('/login');
  });

  it('should not redirect on me endpoint 401 response', () => {
    http.get('/api/v1/me').subscribe({ error: () => undefined });

    const req = httpMock.expectOne('/api/v1/me');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authSpy.expireSession).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
