import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

export interface CurrentUser {
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private authenticated = false;
  private sessionCheck$?: Observable<boolean>;
  private readonly http = inject(HttpClient);

  login(username: string, password: string) {
    return this.http
      .post<void>('/api/v1/auth/login', {
        username,
        password,
      })
      .pipe(
        tap(() => {
          this.authenticated = true;
          this.sessionCheck$ = undefined;
        }),
      );
  }

  logout() {
    return this.http.post<void>('/api/v1/auth/logout', {}).pipe(
      tap(() => {
        this.clearSession();
      }),
    );
  }

  clearSession() {
    this.authenticated = false;
    this.sessionCheck$ = undefined;
  }

  isLoggedIn(): boolean {
    return this.authenticated;
  }

  ensureAuthenticated(): Observable<boolean> {
    if (this.authenticated) {
      return of(true);
    }

    this.sessionCheck$ ??= this.http.get<CurrentUser>('/api/v1/me').pipe(
      map(() => {
        this.authenticated = true;
        return true;
      }),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.sessionCheck$;
  }
}
