import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';

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
    return this.http.get<Project[]>(`${API_BASE_URL}/api/v1/projects`);
  }

  getById(id: string) {
    return this.http.get<Project>(`${API_BASE_URL}/api/v1/projects/${id}`);
  }

  create(payload: CreateProjectRequest) {
    return this.http.post<Project>(`${API_BASE_URL}/api/v1/projects`, payload);
  }

  update(id: string, payload: CreateProjectRequest) {
    return this.http.put<Project>(`${API_BASE_URL}/api/v1/projects/${id}`, payload);
  }
  delete(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/api/v1/projects/${id}`);
  }
}
