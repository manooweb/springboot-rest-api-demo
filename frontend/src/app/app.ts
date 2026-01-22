import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from './services/auth';
import { environment } from '../environments/environment';

if (!environment.production) {
  console.info('[DEV] API base URL:', environment.apiBaseUrl);
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Project Management App');
  router = inject(Router);
  public auth = inject(Auth);

  onAuthAction() {
    if (this.auth.isLoggedIn()) {
      this.auth.logout();
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}
