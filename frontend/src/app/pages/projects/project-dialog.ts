import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectDialogData, ProjectDialogResult } from './project-dialog.types';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'project-dialog',
  templateUrl: 'project-dialog.html',
  styleUrl: 'project-dialog.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    TranslatePipe,
  ],
})
export class ProjectDialog implements OnInit {
  @ViewChild('formEl', { static: true }) private formEl?: ElementRef<HTMLFormElement>;
  private readonly dialogRef = inject(MatDialogRef<ProjectDialog>);
  private readonly data = inject<ProjectDialogData>(MAT_DIALOG_DATA);
  private readonly formBuilder = inject(FormBuilder);

  submitAttempted = false;

  readonly form = this.formBuilder.group({
    name: this.formBuilder.control('', { validators: [Validators.required], nonNullable: true }),
    description: this.formBuilder.control('', { nonNullable: true }),
  });

  get nameCtrl() {
    return this.form.controls.name;
  }

  get isEdit(): boolean {
    return this.data.mode === 'edit';
  }

  get dialogTitle(): string {
    return this.isEdit ? 'projects.dialog.title.edit' : 'projects.dialog.title.create';
  }

  get primaryButtonLabel(): string {
    return this.isEdit ? 'shared.action.save' : 'shared.action.create';
  }

  ngOnInit() {
    if (this.isEdit && this.data.project) {
      this.prefillFromProject(this.data.project);
    }
  }

  clickOnOk(): void {
    this.submitAttempted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.focusFirstInvalidControl();
      return;
    }

    const formValues = this.form.getRawValue();

    const payload: CreateProjectRequest = {
      name: formValues.name.trim(),
      description: formValues.description.trim(),
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
    this.form.patchValue({
      name: project.name,
      description: project.description ?? '',
    });
  }

  private focusFirstInvalidControl(): void {
    const invalidControlName = Object.keys(this.form.controls)
      .find((name) => this.form.controls[name as keyof typeof this.form.controls].invalid);

    if (!invalidControlName) return;

    const el = this.formEl?.nativeElement.querySelector<HTMLElement>(`[formControlName="${invalidControlName}"]`);
    el?.focus();
  }
}

