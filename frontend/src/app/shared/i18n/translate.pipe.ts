import { ChangeDetectorRef, inject, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { UiTextService } from './ui-text.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnInit, OnDestroy {
  private readonly translate = inject(UiTextService);
  private readonly cdr = inject(ChangeDetectorRef);

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.translate.lang$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: Record<string, unknown>): string {
    return this.translate.t(key, params);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
