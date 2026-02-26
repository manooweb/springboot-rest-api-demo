import type { UiDictionary } from '../';

export const TASKS_EN: UiDictionary = {
  // Titles / Sections
  'tasks.title.section': 'Tasks',
  'tasks.title.projectDetail': 'project detail',

  // States
  'tasks.state.loadingProject': 'Loading project…',
  'tasks.state.loadingTasks': 'Loading tasks…',

  // Labels / UI
  'tasks.label.due': 'Due:',

  // Actions (feature-specific)
  'tasks.action.add': 'Add new task',
  'tasks.action.changeStatusAria': 'Change task status',
  'tasks.action.editAria': 'Edit task',
  'tasks.action.deleteAria': 'Delete task',

  // Dialog fields
  'tasks.dialog.field.title': 'Title',
  'tasks.dialog.field.description': 'Description',
  'tasks.dialog.field.dueDate': 'Due Date',
  'tasks.dialog.field.status': 'Status',
  'tasks.dialog.placeholder.dueDate': 'MM/DD/YYYY',

  // Validation
  'tasks.validation.titleRequired': 'Title is required.',

  // Dialog titles
  'tasks.dialog.title.create': 'Add new task',
  'tasks.dialog.title.edit': 'Edit task',

  // Status display labels
  'tasks.status.todo': 'To do',
  'tasks.status.inProgress': 'In progress',
  'tasks.status.done': 'Done',

  // Snackbar messages
  'tasks.message.created': 'Task created',
  'tasks.message.createFailed': 'Failed to create task',
  'tasks.message.updated': 'Task updated',
  'tasks.message.updateFailed': 'Failed to update task',
  'tasks.message.deleted': 'Task deleted',
  'tasks.message.deleteFailed': 'Failed to delete task',
  'tasks.message.loadProjectFailed': 'Failed to load project',
  'tasks.message.loadTasksFailed': 'Failed to load tasks for this project',
  'tasks.message.statusUpdated': 'Status updated',
  'tasks.message.statusUpdateFailed': 'Failed to update status',

  // Confirm delete dialog (with interpolation)
  'tasks.confirmDelete.title': 'Delete Task "{taskTitle}"',
  'tasks.confirmDelete.message': 'Are you sure you want to delete the task "{taskTitle}"? This action cannot be undone.',
};
