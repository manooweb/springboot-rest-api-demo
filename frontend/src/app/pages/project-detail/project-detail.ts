import { Component, inject } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Task, TasksService, TaskStatus } from '../../services/tasks';
import { DatePipe } from '@angular/common';
import { TaskDialog } from './task-dialog';
import { TaskDialogData, TaskDialogResult } from './task-dialog.types';
import { ConfirmDialog } from '../../shared/dialogs/confirm-dialog';
import { ConfirmDialogData } from '../../shared/dialogs/confirm-dialog.types';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { UiTextService } from '../../shared/i18n/ui-text.service';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    DatePipe,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslatePipe,
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(UiTextService);
  readonly dialog = inject(MatDialog);

  id: string | null = this.route.snapshot.paramMap.get('id');
  private snackBar = inject(MatSnackBar);

  project: Project | null = null;
  tasks: Task[] = [];
  loadingProject = true;
  loadingTasks = true;
  errorProject: string | null = null;
  errorTasks: string | null = null;
  updatingTaskId: string | null = null;

  private notify(message: string) {
    this.snackBar.open(message, this.translate.t('shared.action.close'), { duration: 3000 });
  }

  openAddNewTaskDialog() {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '600px',
      maxWidth: '80vw',
      panelClass: 'app-dialog',
      data: { mode: 'create' } satisfies TaskDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: TaskDialogResult) => {
      if (!result || !this.id) return; // cancel
      if (result.mode !== 'create') return; // Only create expected here

      this.loadingTasks = true;
      this.errorTasks = null;
      this.tasksService.create(this.id, result.payload).subscribe({
        next: () => {
          // refresh list
          this.loadingTasks = true;
          this.loadTasks();
          this.notify(this.translate.t('tasks.message.created'));
        },
        error: () => {
          this.errorTasks = this.translate.t('tasks.message.createFailed');
          this.notify(this.errorTasks);
        },
      });
    });
  }

  openEditTaskDialog(task: Task) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '600px',
      maxWidth: '80vw',
      panelClass: 'app-dialog',
      data: { mode: 'edit', task } satisfies TaskDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: TaskDialogResult) => {
      if (!result || !this.id) return; // cancel
      if (result.mode !== 'edit' || !result.taskId) return; // Only edit expected here

      this.loadingTasks = true;
      this.errorTasks = null;
      this.tasksService.update(result.taskId, result.payload).subscribe({
        next: () => {
          // refresh list
          this.loadingTasks = true;
          this.loadTasks();
          this.notify(this.translate.t('tasks.message.updated'));
        },
        error: () => {
          this.errorTasks = this.translate.t('tasks.message.updateFailed');
          this.notify(this.errorTasks);
        },
      });
    });
  }

  openDeleteTaskConfirmDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      maxWidth: '80vw',
      panelClass: 'app-dialog',
      data: {
        titleKey: 'tasks.confirmDelete.title',
        titleParams: { taskTitle: task.title },
        messageKey: 'tasks.confirmDelete.message',
        messageParams: { taskTitle: task.title },
        confirmButtonLabel: 'shared.action.delete',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: boolean) => {
      if (result !== true) return; // Cancelled

      this.loadingTasks = true;
      this.errorTasks = null;
      this.tasksService.delete(task.id).subscribe({
        next: () => {
          // refresh list
          this.loadingTasks = true;
          this.loadTasks();
          this.notify(this.translate.t('tasks.message.deleted'));
        },
        error: () => {
          this.errorTasks = this.translate.t('tasks.message.deleteFailed');
          this.notify(this.errorTasks);
        },
      });
    });
  }

  loadProject() {
    if (!this.id) return;

    this.loadingProject = true;
    this.errorProject = null;

    this.projectsService.getById(this.id).subscribe({
      next: (project) => {
        this.project = project;
        this.loadingProject = false;
      },
      error: () => {
        this.errorProject = this.translate.t('tasks.message.loadProjectFailed');
        this.loadingProject = false;
        this.notify(this.errorProject);
      },
    });
  }

  loadTasks() {
    if (!this.id) return;

    this.loadingTasks = true;
    this.errorTasks = null;

    this.tasksService.getAll(this.id).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loadingTasks = false;
      },
      error: () => {
        this.errorTasks = this.translate.t('tasks.message.loadTasksFailed');
        this.loadingTasks = false;
        this.notify(this.errorTasks);
      },
    });
  }

  ngOnInit() {
    this.loadProject();
    this.loadTasks();
  }

  onStatusClick(task: Task) {
    const previous = task.status;
    const next = this.nextStatus(previous);

    // UI optimiste
    task.status = next;
    this.updatingTaskId = task.id;

    this.tasksService.updateStatus(task.id, next).subscribe({
      next: () => {
        this.updatingTaskId = null;
        this.notify(this.translate.t('tasks.message.statusUpdated'));
      },
      error: () => {
        // rollback
        task.status = previous;
        this.updatingTaskId = null;
        this.notify(this.translate.t('tasks.message.statusUpdateFailed'));
      },
    });
  }

  nextStatus(current: TaskStatus): TaskStatus {
    switch (current) {
      case 'TODO':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'DONE';
      case 'DONE':
        return 'TODO';
    }
  }

  statusLabel(status: TaskStatus): string {
    switch (status) {
      case 'TODO':
        return 'tasks.status.todo';
      case 'IN_PROGRESS':
        return 'tasks.status.inProgress';
      case 'DONE':
        return 'tasks.status.done';
    }
  }

  statusEmoji(status: TaskStatus): string {
    switch (status) {
      case 'TODO':
        return '📝';
      case 'IN_PROGRESS':
        return '⏳';
      case 'DONE':
        return '✅';
    }
  }
}
