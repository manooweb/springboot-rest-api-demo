import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from './services/auth';
import { environment } from '../environments/environment';
import { TranslatePipe } from './shared/i18n/translate.pipe';
import { MatomoService } from './services/matomo';
import { filter } from 'rxjs';

if (!environment.production) {
  console.info('[DEV] API base URL:', environment.apiBaseUrl);
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  readonly router = inject(Router);
  readonly auth = inject(Auth);
  readonly matomo = inject(MatomoService);
  protected readonly copyrightStartYear = 2025;
  protected readonly copyrightEndYear = new Date().getFullYear();

  get authActionLabel() {
    return this.auth.isLoggedIn()
      ? 'app.nav.logout'
      : 'app.nav.login';
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(
        (event) => {
          const path = event.urlAfterRedirects; // ex: /projects/123
          const fullUrl = window.location.origin + path;

          const title = this.getPageTitle(path);
          this.matomo.trackPageView(fullUrl, title);
        });
  }

  onAuthAction() {
    if (this.auth.isLoggedIn()) {
      this.auth.logout();
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  private getPageTitle(path: string): string {
    if (path === '/login') return 'Login';
    if (path === '/projects') return 'Projects – list';
    if (path.startsWith('/projects/')) return 'Project – detail';
    return 'App';
  }
}
