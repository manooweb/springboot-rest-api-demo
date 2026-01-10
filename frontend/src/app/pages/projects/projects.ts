import { Component, inject } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
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
  selector: 'app-projects',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private projectsService = inject(ProjectsService);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  projects: Project[] = [];
  loading = true;
  error: string | null = null;

  openAddNewProjectDialog() {
    console.log('Open dialog to add new project');
    const dialogRef = this.dialog.open(AddNewProjectDialog, {
      width: '600px',
      maxWidth: '80vw',
      data: { name: '', description: '' },
    });

    dialogRef.afterClosed().subscribe((result?: CreateProjectRequest) => {
      if (!result) return; // cancel

      this.projectsService.create(result).subscribe({
        next: () => {
          // refresh list
          this.loading = true;
          this.loadProjects();
        },
        error: () => {
          this.error = 'Failed to create project';
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
        this.notify('Project created');
      },
      error: () => {
        this.error = 'Failed to load projects';
        this.loading = false;
        this.notify(this.error);
      },
    });
  }

  private notify(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  ngOnInit() {
    this.loadProjects();
  }
}

@Component({
  selector: 'add-new-project-dialog',
  templateUrl: 'add-new-project.html',
  styleUrl: 'add-new-project.scss',
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
export class AddNewProjectDialog {
  readonly dialogRef = inject(MatDialogRef<AddNewProjectDialog>);
  readonly data = inject<CreateProjectRequest>(MAT_DIALOG_DATA);

  name = this.data.name ?? '';
  description = this.data.description ?? '';

  isValid(): boolean {
    return this.name.trim().length > 0;
  }

  clickOnOk(): void {
    if (!this.name.trim()) return;
    this.dialogRef.close({ name: this.name, description: this.description });
    console.log('Dialog closed with data:', { name: this.name, description: this.description });
  }

  clickOnCancel(): void {
    this.dialogRef.close();
  }
}

