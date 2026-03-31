import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogData } from './confirm-dialog.types';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  styleUrl: 'confirm-dialog.scss',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    TranslatePipe,
  ],
})
export class ConfirmDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  get titleKey(): string {
    return this.data.titleKey ?? '';
  }

  get titleParams(): Record<string, unknown> | undefined {
    return this.data.titleParams;
  }

  get messageKey(): string {
    return this.data.messageKey ?? '';
  }

  get messageParams(): Record<string, unknown> | undefined {
    return this.data.messageParams;
  }

  get cancelButtonLabel(): string {
    return this.data.cancelButtonLabel || 'shared.action.cancel';
  }

  get confirmButtonLabel(): string {
    return this.data.confirmButtonLabel || 'shared.action.ok';
  }

  clickOnConfirm(): void {
    this.dialogRef.close(true);
  }
}
