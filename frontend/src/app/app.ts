import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from './services/auth';
import { TranslatePipe } from './shared/i18n/translate.pipe';
import { MatomoService } from './services/matomo';
import { filter } from 'rxjs';
import { UiTextService } from './shared/i18n/ui-text.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatToolbarModule,
    TranslatePipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly router = inject(Router);
  readonly auth = inject(Auth);
  readonly matomo = inject(MatomoService);
  readonly translate = inject(UiTextService);
  private readonly title = inject(Title);

  protected readonly copyrightStartYear = 2025;
  protected readonly copyrightEndYear = new Date().getFullYear();
  protected readonly lang = this.translate.getLanguage();

  get authActionLabel() {
    return this.auth.isLoggedIn() ? 'app.nav.logout' : 'app.nav.login';
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const path = event.urlAfterRedirects; // ex: /projects/123
        const fullUrl = globalThis.location.origin + path;

        const pageTitle = this.getCurrentPageTitle();
        const appTitle = this.translate.t('app.title');

        this.title.setTitle(`${pageTitle} | ${appTitle}`);
        this.matomo.trackPageView(fullUrl, pageTitle);
      });
  }

  onAuthAction() {
    if (this.auth.isLoggedIn()) {
      this.auth.logout().subscribe({
        next: () => this.router.navigateByUrl('/login'),
        error: () => {
          this.auth.clearSession();
          this.router.navigateByUrl('/login');
        },
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  private getCurrentPageTitle(): string {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const pageTitleKey = route.data['pageTitleKey'] as string | undefined;
    return pageTitleKey ? this.translate.t(pageTitleKey) : this.translate.t('app.title');
  }
}
