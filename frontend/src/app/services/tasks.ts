import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../app.config';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  constructor(private http: HttpClient) { }

  getAll(projectId: string) {
    return this.http.get<Task[]>(`${API_BASE_URL}/api/v1/projects/${projectId}/tasks`);
  }

  create(projectId: string, payload: CreateTaskRequest) {
    return this.http.post<Task>(`${API_BASE_URL}/api/v1/projects/${projectId}/tasks`, payload);
  }

  update(taskId: string, payload: CreateTaskRequest) {
    return this.http.put<Task>(`${API_BASE_URL}/api/v1/tasks/${taskId}`, payload);
  }

  delete(taskId: string) {
    return this.http.delete<void>(`${API_BASE_URL}/api/v1/tasks/${taskId}`);
  }

  updateStatus(taskId: string, status: TaskStatus) {
    return this.http.patch<Task>(`${API_BASE_URL}/api/v1/tasks/${taskId}/status`, { status });
  }
}
