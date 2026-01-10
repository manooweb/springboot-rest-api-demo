import { Injectable } from '@angular/core';
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
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Project[]>('/api/v1/projects');
  }

  create(payload: CreateProjectRequest) {
    return this.http.post<Project>('/api/v1/projects', payload);
  }
}
