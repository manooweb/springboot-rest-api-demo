import {
  AfterViewInit,
  Component,
  computed,
  inject,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UiTextService } from '../../shared/i18n/ui-text.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page.html',
  styleUrl: './page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LegalPageComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private translate = inject(UiTextService);

  private sub?: Subscription;

  private lang = this.translate.getLanguage();

  // Router resolvers expose data synchronously once route is activated.
  private html = computed(() => this.route.snapshot.data['html'] as string);

  safeHtml = computed<SafeHtml>(() => {
    // Since HTML comes from your own assets (trusted), bypass is acceptable.
    // If it ever becomes user-controlled, STOP and sanitize differently.
    return this.sanitizer.bypassSecurityTrustHtml(this.html());
  });
  ngAfterViewInit(): void {
    this.initMatomoOptOutIfPresent();

    // When navigating between /privacy-policy and another page
    this.sub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        // Wait for the new innerHTML to be rendered
        setTimeout(() => this.initMatomoOptOutIfPresent(), 0);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private initMatomoOptOutIfPresent(): void {
    const target = document.getElementById('matomo-opt-out');
    if (!target) return;

    // Nettoie le conteneur
    target.innerHTML = '';

    const src = `https://stats.manooweb.fr/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=${this.lang}&backgroundColor=FFFFFF&fontColor=000000&fontSize=12px&fontFamily=Arial&showIntro=1`;

    // IMPORTANT: in SPA, script must be run again
    // So we remove any existing script with the same src before adding a new one
    document.querySelectorAll(`script[src="${src}"]`).forEach((el) => el.remove());

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }
}
