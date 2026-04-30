import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';

import { authGuard } from './auth-guard';
import { Auth } from './auth';

describe('authGuard', () => {
  const executeGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  let authSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<Auth>('Auth', ['ensureAuthenticated']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as ReturnType<Router['createUrlTree']>);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow access when user is authenticated', async () => {
    authSpy.ensureAuthenticated.and.returnValue(of(true));

    const result = await firstValueFrom(executeGuard() as Observable<boolean | UrlTree>);

    expect(result).toBeTrue();
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to /login when user is not authenticated', async () => {
    const loginUrlTree = {} as ReturnType<Router['createUrlTree']>;
    authSpy.ensureAuthenticated.and.returnValue(of(false));
    routerSpy.createUrlTree.and.returnValue(loginUrlTree);

    const result = await firstValueFrom(executeGuard() as Observable<boolean | UrlTree>);

    expect(result).toBe(loginUrlTree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
