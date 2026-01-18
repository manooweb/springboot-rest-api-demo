import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogRef,
  MatDialog,
  MatDialogModule,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateProjectRequest } from '../../services/projects';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'project-dialog',
  templateUrl: 'project-dialog.html',
  styleUrl: 'project-dialog.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
})
export class ProjectDialog {
  readonly dialogRef = inject(MatDialogRef<ProjectDialog>);

  name = '';
  description = '';

  isValid(): boolean {
    return this.name.trim().length > 0;
  }

  clickOnOk(): void {
    if (!this.name.trim()) return;
    this.dialogRef.close({ name: this.name, description: this.description });
  }

  clickOnCancel(): void {
    this.dialogRef.close();
  }
}

