import { Component, inject } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CreateTaskRequest, Task, TasksService, TaskStatus } from '../../services/tasks';
import { DatePipe } from '@angular/common';
import { TaskDialog } from './task-dialog';
import { TaskDialogData, TaskDialogResult } from './task-dialog.types';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  private projectsService = inject(ProjectsService);
  private tasksService = inject(TasksService);
  private route = inject(ActivatedRoute);
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
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  openAddNewTaskDialog() {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '600px',
      maxWidth: '80vw',
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
          this.notify('Task created');
        },
        error: () => {
          this.errorTasks = 'Failed to create task';
          this.notify(this.errorTasks);
        },
      });
    });
  }

  openEditTaskDialog(task: Task) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '600px',
      maxWidth: '80vw',
      data: { mode: 'edit', task } satisfies TaskDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: TaskDialogResult) => {
      if (!result || !this.id) return; // cancel
      if (result.mode !== 'edit'  || !result.taskId) return; // Only edit expected here

      this.loadingTasks = true;
      this.errorTasks = null;
      this.tasksService.update(result.taskId, result.payload).subscribe({
        next: () => {
          // refresh list
          this.loadingTasks = true;
          this.loadTasks();
          this.notify('Task updated');
        },
        error: () => {
          this.errorTasks = 'Failed to update task';
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
        this.errorProject = 'Failed to load project';
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
        this.errorTasks = 'Failed to load tasks for this project';
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
        this.notify('Status updated');
      },
      error: () => {
        // rollback
        task.status = previous;
        this.updatingTaskId = null;
        this.notify('Failed to update status');
      }
    });
  }

  nextStatus(current: TaskStatus): TaskStatus {
    switch (current) {
      case 'TODO': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'DONE';
      case 'DONE': return 'TODO';
    }
  }

  statusLabel(status: TaskStatus): string {
    switch (status) {
      case 'TODO': return 'To do';
      case 'IN_PROGRESS': return 'In progress';
      case 'DONE': return 'Done';
    }
  }

  statusEmoji(status: TaskStatus): string {
    switch (status) {
      case 'TODO': return '📝';
      case 'IN_PROGRESS': return '⏳';
      case 'DONE': return '✅';
    }
  }
}
