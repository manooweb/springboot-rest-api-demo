import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from './services/auth';
import { environment } from '../environments/environment';
import { TranslatePipe } from './shared/i18n/translate.pipe';

if (!environment.production) {
  console.info('[DEV] API base URL:', environment.apiBaseUrl);
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly router = inject(Router);
  readonly auth = inject(Auth);

  get authActionLabel() {
    return this.auth.isLoggedIn()
      ? 'app.nav.logout'
      : 'app.nav.login';
  }

  onAuthAction() {
    if (this.auth.isLoggedIn()) {
      this.auth.logout();
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}
