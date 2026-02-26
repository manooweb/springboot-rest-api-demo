import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { UiTextService } from '../../shared/i18n/ui-text.service';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page.html',
  styleUrl: './page.scss',
  encapsulation: ViewEncapsulation.None,

})

export class LegalPageComponent {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private title = inject(Title);
  private i18n = inject(UiTextService);

  // Router resolvers expose data synchronously once route is activated.
  private html = computed(() => this.route.snapshot.data['html'] as string);

  safeHtml = computed<SafeHtml>(() => {
    // Since HTML comes from your own assets (trusted), bypass is acceptable.
    // If it ever becomes user-controlled, STOP and sanitize differently.
    return this.sanitizer.bypassSecurityTrustHtml(this.html());
  });
}
