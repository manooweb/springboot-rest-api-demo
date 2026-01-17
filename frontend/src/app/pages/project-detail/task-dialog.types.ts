import { CreateTaskRequest, Task } from '../../services/tasks';

export type TaskDialogMode = 'create' | 'edit';

export interface TaskDialogData {
  mode: TaskDialogMode;
  task?: Task; // required if edit
}

export interface TaskDialogResult {
  mode: TaskDialogMode;
  payload: CreateTaskRequest; // same shape works for update too
  taskId?: string; // present if edit
}
