import { CreateProjectRequest, Project } from '../../services/projects';

export type ProjectDialogMode = 'create' | 'edit';

export interface ProjectDialogData {
  mode: ProjectDialogMode;
  project?: Project; // required if edit
}

export interface ProjectDialogResult {
  mode: ProjectDialogMode;
  payload: CreateProjectRequest; // same shape works for update too
  id?: string; // present if edit
}
