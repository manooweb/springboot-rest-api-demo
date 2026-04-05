import { ChangeDetectorRef, inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { UiTextService, UiTextParams } from './ui-text.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private readonly translate = inject(UiTextService);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly sub?: Subscription;

  constructor() {
    this.sub = this.translate.lang$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: UiTextParams): string {
    return this.translate.t(key, params);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
