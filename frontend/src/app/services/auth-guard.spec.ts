import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth-guard';
import { Auth } from './auth';

describe('authGuard', () => {
  const executeGuard = () => TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

  let authSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<Auth>('Auth', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow access when user is logged in', () => {
    authSpy.isLoggedIn.and.returnValue(true);

    const result = executeGuard();

    expect(result).toBeTrue();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to /login and deny access when user is not logged in', () => {
    authSpy.isLoggedIn.and.returnValue(false);

    const result = executeGuard();

    expect(result).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
