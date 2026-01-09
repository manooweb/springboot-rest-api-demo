import { Component, inject } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgFor],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private projectsService = inject(ProjectsService);

  projects: Project[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.projectsService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load projects';
        this.loading = false;
      },
    });
  }
}
