import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectDialog } from './project-dialog';
import { ProjectDialogData, ProjectDialogResult } from './project-dialog.types';
import { ConfirmDialog } from '../../shared/dialogs/confirm-dialog';
import { ConfirmDialogData } from '../../shared/dialogs/confirm-dialog.types';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatListModule, MatDividerModule, MatButtonModule, MatCardModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  router = inject(Router);
  private projectsService = inject(ProjectsService);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  projects: Project[] = [];
  loading = false;
  error: string | null = null;

  openAddNewProjectDialog() {
    const dialogRef = this.dialog.open(ProjectDialog, {
      width: '600px',
      maxWidth: '80vw',
      data: { mode: 'create' } satisfies ProjectDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: ProjectDialogResult) => {
      if (!result || result.mode !== 'create') return; // cancel or not create

      this.projectsService.create(result.payload).subscribe({
        next: () => {
          // refresh list
          this.loadProjects();
          this.notify('Project created');
        },
        error: () => {
          this.error = 'Failed to create project';
          this.notify(this.error);
        },
      });
    });
  }

  openEditProjectDialog(project: Project) {
    const dialogRef = this.dialog.open(ProjectDialog, {
      width: '600px',
      maxWidth: '80vw',
      data: { mode: 'edit', project } satisfies ProjectDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: ProjectDialogResult) => {
      if (!result || result.mode !== 'edit' || !result.id) return; // Only edit expected here

      this.projectsService.update(result.id, result.payload).subscribe({
        next: () => {
          // refresh list
          this.loadProjects();
          this.notify('Project updated');
        },
        error: () => {
          this.error = 'Failed to update project';
          this.notify(this.error);
        },
      });
    });
  }

  openDeleteProjectConfirmDialog(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      maxWidth: '80vw',
      data: {
        title: `Delete project "${project.name}"`,
        message: `Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`,
        confirmButtonLabel: 'Delete',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: boolean) => {
      if (result !== true) return; // Cancelled

      this.projectsService.delete(project.id).subscribe({
        next: () => {
          // refresh list
          this.loadProjects();
          this.notify('Project deleted');
        },
        error: () => {
          this.error = 'Failed to delete project';
          this.notify(this.error);
        },
      });
    });
  }

  loadProjects() {
    this.loading = true;
    this.error = null;

    this.projectsService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load projects';
        this.loading = false;
        this.notify(this.error);
      },
    });
  }

  showProjectDetail(projectId: string) {
    // navigate to project detail page
    this.router.navigateByUrl(`/projects/${projectId}`);
  }

  private notify(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  ngOnInit() {
    this.loadProjects();
  }
}

