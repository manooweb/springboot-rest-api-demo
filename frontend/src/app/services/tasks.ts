import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private readonly http = inject(HttpClient);

  getAll(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/v1/projects/${projectId}/tasks`);
  }

  create(projectId: string, payload: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`/api/v1/projects/${projectId}/tasks`, payload);
  }

  update(taskId: string, payload: CreateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`/api/v1/tasks/${taskId}`, payload);
  }

  delete(taskId: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/tasks/${taskId}`);
  }

  updateStatus(taskId: string, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`/api/v1/tasks/${taskId}/status`, { status });
  }
}
