import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresInSeconds: number;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly http = inject(HttpClient);

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>('/api/v1/auth/login', {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
