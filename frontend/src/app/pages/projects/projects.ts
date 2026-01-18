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

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  router = inject(Router);
  private projectsService = inject(ProjectsService);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  projects: Project[] = [];
  loading = true;
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
          this.loading = true;
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
      if (!result || result.mode !== 'edit'  || !result.id) return; // Only edit expected here

      this.loading = true;
      this.error = null;
      this.projectsService.update(result.id, result.payload).subscribe({
        next: () => {
          // refresh list
          this.loading = true;
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

