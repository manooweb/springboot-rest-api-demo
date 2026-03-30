import { Component, ElementRef, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateTaskRequest, Task, TaskStatus } from '../../services/tasks';
import { TaskDialogData, TaskDialogResult } from './task-dialog.types';
import { toIsoLocalDateString } from '../../shared/functions/date';
import { UiTextService } from '../../shared/i18n/ui-text.service';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { shouldShowError, focusFirstInvalidControl } from '../../shared/forms/form-helpers';

@Component({
  selector: 'task-dialog',
  templateUrl: 'task-dialog.html',
  styleUrl: 'task-dialog.scss',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDatepickerModule,
    MatSelectModule,
    TranslatePipe,
  ],
})
export class TaskDialog implements OnInit {
  @ViewChild('formEl', { static: true }) private formEl?: ElementRef<HTMLFormElement>;
  private readonly dialogRef = inject(MatDialogRef<TaskDialog>);
  private readonly data = inject<TaskDialogData>(MAT_DIALOG_DATA);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translate = inject(UiTextService);
  readonly shouldShowError = shouldShowError;

  submitAttempted = false;

  form = this.formBuilder.group({
    title: this.formBuilder.control('', { validators: [Validators.required], nonNullable: true }),
    description: this.formBuilder.control('', { nonNullable: true }),
    dueDate: this.formBuilder.control<Date>(new Date(), { nonNullable: true }),
    status: this.formBuilder.control<TaskStatus>('TODO', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  get titleCtrl() {
    return this.form.controls.title;
  }

  get isEdit(): boolean {
    return this.data.mode === 'edit';
  }

  get dialogTitle(): string {
    return this.isEdit ? 'tasks.dialog.title.edit' : 'tasks.dialog.title.create';
  }

  get primaryButtonLabel(): string {
    return this.isEdit ? 'shared.action.save' : 'shared.action.create';
  }

  ngOnInit() {
    if (this.isEdit && this.data.task) {
      this.prefillFromTask(this.data.task);
    }
  }

  clickOnOk(): void {
    this.submitAttempted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      focusFirstInvalidControl(this.form, this.formEl?.nativeElement);
      return;
    }

    const formValues = this.form.getRawValue();

    const payload: CreateTaskRequest = {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      dueDate: toIsoLocalDateString(formValues.dueDate),
      status: formValues.status,
    };

    const result: TaskDialogResult = this.isEdit
      ? { mode: 'edit', taskId: this.data.task!.id, payload }
      : { mode: 'create', payload };

    this.dialogRef.close(result);
  }

  private prefillFromTask(task: Task) {
    this.form.patchValue({
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      dueDate: task.dueDate ?? new Date(),
    });
  }
}
