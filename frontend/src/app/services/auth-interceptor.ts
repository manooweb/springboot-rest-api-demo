import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const isLoginCall = req.url.includes('/api/v1/auth/login');
  const isSessionCheckCall = req.url.includes('/api/v1/me');

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && !isLoginCall && !isSessionCheckCall) {
        auth.clearSession();
        router.navigateByUrl('/login');
      }
      return throwError(() => err);
    }),
  );
};
