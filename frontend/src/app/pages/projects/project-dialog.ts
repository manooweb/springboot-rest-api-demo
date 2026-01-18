import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateProjectRequest, Project } from '../../services/projects';
import { FormsModule } from '@angular/forms';
import { ProjectDialogData, ProjectDialogResult } from './project-dialog.types';
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
  readonly data = inject<ProjectDialogData>(MAT_DIALOG_DATA);

  name = '';
  description = '';

  get isEdit(): boolean {
    return this.data.mode === 'edit';
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Edit project' : 'Add new project';
  }

  get primaryButtonLabel(): string {
    return this.isEdit ? 'Save' : 'Create';
  }

  get isValid(): boolean {
    return this.name.trim().length > 0;
  }

  ngOnInit() {
    if (this.isEdit && this.data.project) {
      this.prefillFromProject(this.data.project);
    }
  }

  clickOnOk(): void {
    if (!this.isValid) return;

    const payload: CreateProjectRequest = {
      name: this.name.trim(),
      description: this.description?.trim() || undefined,
    };

    const result: ProjectDialogResult = this.isEdit
      ? { mode: 'edit', id: this.data.project!.id, payload }
      : { mode: 'create', payload };

    this.dialogRef.close(result);
  }

  clickOnCancel(): void {
    this.dialogRef.close();
  }

  private prefillFromProject(project: Project) {
    this.name = project.name;
    this.description = project.description ?? '';
  }
}

