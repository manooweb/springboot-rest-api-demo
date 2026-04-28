import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<Project[]>('/api/v1/projects');
  }

  getById(id: string) {
    return this.http.get<Project>(`/api/v1/projects/${id}`);
  }

  create(payload: CreateProjectRequest) {
    return this.http.post<Project>('/api/v1/projects', payload);
  }

  update(id: string, payload: CreateProjectRequest) {
    return this.http.put<Project>(`/api/v1/projects/${id}`, payload);
  }
  delete(id: string) {
    return this.http.delete<void>(`/api/v1/projects/${id}`);
  }
}
