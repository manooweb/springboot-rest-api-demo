import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Task, TaskStatus } from "../../services/tasks";
import { TaskDialogData } from './task-dialog.types';

@Component({
  selector: 'task-dialog',
  templateUrl: 'task-dialog.html',
  styleUrl: 'task-dialog.scss',
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
    MatDatepickerModule,
    MatSelectModule,
  ],
})
export class TaskDialog {
  readonly dialogRef = inject(MatDialogRef<TaskDialog>);
  readonly data = inject<TaskDialogData>(MAT_DIALOG_DATA);

  title = '';
  description = '';
  dueDate: string = new Date().toISOString().split('T')[0];
  status: TaskStatus = 'TODO';

  get isEdit(): boolean {
    return this.data.mode === 'edit';
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Edit task' : 'Add new task';
  }

  get primaryButtonLabel(): string {
    return this.isEdit ? 'Save' : 'Create';
  }

  get isValid(): boolean {
    return this.title.trim().length > 0;
  }

  ngOnInit() {
    if (this.isEdit && this.data.task) {
      this.prefillFromTask(this.data.task);
    }
  }

  clickOnOk(): void {
    if (!this.title.trim()) return;
    this.dialogRef.close({ title: this.title, description: this.description, dueDate: this.dueDate, status: this.status });
  }

  clickOnCancel(): void {
    this.dialogRef.close();
  }

  private prefillFromTask(task: Task) {
    this.title = task.title ?? '';
    this.description = task.description ?? '';
    this.status = task.status ?? 'TODO';
    this.dueDate = task.dueDate ?? this.dueDate;
  }
}
