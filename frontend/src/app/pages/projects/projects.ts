import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectDialog } from './project-dialog';
import { ProjectDialogData, ProjectDialogResult } from './project-dialog.types';
import { ConfirmDialog } from '../../shared/dialogs/confirm-dialog';
import { ConfirmDialogData } from '../../shared/dialogs/confirm-dialog.types';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { UiTextService } from '../../shared/i18n/ui-text.service';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslatePipe,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {
  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  private readonly projectsService = inject(ProjectsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(UiTextService);

  projects: Project[] = [];
  loading = false;
  error: string | null = null;

  openAddNewProjectDialog() {
    const dialogRef = this.dialog.open(ProjectDialog, {
      width: '600px',
      maxWidth: '80vw',
      panelClass: 'app-dialog',
      data: { mode: 'create' } satisfies ProjectDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: ProjectDialogResult) => {
      if (!result || result.mode !== 'create') return; // cancel or not create

      this.projectsService.create(result.payload).subscribe({
        next: () => {
          // refresh list
          this.loadProjects();
          this.notify(this.translate.t('projects.message.created'));
        },
        error: () => {
          this.error = this.translate.t('projects.message.createFailed');
          this.notify(this.error);
        },
      });
    });
  }

  openEditProjectDialog(project: Project) {
    const dialogRef = this.dialog.open(ProjectDialog, {
      width: '600px',
      maxWidth: '80vw',
      panelClass: 'app-dialog',
      data: { mode: 'edit', project } satisfies ProjectDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: ProjectDialogResult) => {
      if (!result || result.mode !== 'edit' || !result.id) return; // Only edit expected here

      this.projectsService.update(result.id, result.payload).subscribe({
        next: () => {
          // refresh list
          this.loadProjects();
          this.notify(this.translate.t('projects.message.updated'));
        },
        error: () => {
          this.error = this.translate.t('projects.message.updateFailed');
          this.notify(this.error);
        },
      });
    });
  }

  openDeleteProjectConfirmDialog(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      maxWidth: '80vw',
      panelClass: 'app-dialog',
      data: {
        titleKey: 'projects.confirmDelete.title',
        titleParams: { projectName: project.name },
        messageKey: 'projects.confirmDelete.message',
        messageParams: { projectName: project.name },
        confirmButtonLabel: 'shared.action.delete',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result?: boolean) => {
      if (result !== true) return; // Cancelled

      this.projectsService.delete(project.id).subscribe({
        next: () => {
          // refresh list
          this.loadProjects();
          this.notify(this.translate.t('projects.message.deleted'));
        },
        error: () => {
          this.error = this.translate.t('projects.message.deleteFailed');
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
        this.error = this.translate.t('projects.message.loadFailed');
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
    this.snackBar.open(message, this.translate.t('shared.action.close'), { duration: 3000 });
  }

  ngOnInit() {
    this.loadProjects();
  }
}
