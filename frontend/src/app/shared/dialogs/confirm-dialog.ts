import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ConfirmDialogData } from "./confirm-dialog.types";

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  styleUrl: 'confirm-dialog.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
})
export class ConfirmDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);


  get title(): string { return this.data.title ?? '';}

  get message(): string { return this.data.message ?? ''; }

  get cancelButtonLabel(): string { return this.data.cancelButtonLabel || 'Cancel'; }

  get confirmButtonLabel(): string { return this.data.confirmButtonLabel || 'OK'; }

  clickOnConfirm(): void {
    this.dialogRef.close(true);
  }

  clickOnCancel(): void {
    this.dialogRef.close();
  }
}
