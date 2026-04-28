import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Auth {
  private authenticated = false;
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
        }),
      );
  }

  logout() {
    this.authenticated = false;
  }

  isLoggedIn(): boolean {
    return this.authenticated;
  }
}
