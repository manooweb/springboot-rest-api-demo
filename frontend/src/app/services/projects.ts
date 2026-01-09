import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Project {
  id: string;
  name: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Project[]>('/api/v1/projects');
  }
}
