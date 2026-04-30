import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService
    .ensureAuthenticated()
    .pipe(map((authenticated) => authenticated || router.createUrlTree(['/login'])));
};
