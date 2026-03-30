import type { UiDictionary } from '../';

export const PROJECTS_EN: UiDictionary = {
  // Titles
  'projects.title.list': 'Projects',

  // States
  'projects.state.loading': 'Loading projects…',

  // Actions / Buttons
  'projects.action.add': 'Add new project',
  'projects.action.editAria': 'Edit project',
  'projects.action.openAria': 'Open project',
  'projects.action.deleteAria': 'Delete project',

  // Dialog fields
  'projects.dialog.field.name': 'Project name',
  'projects.dialog.field.description': 'Project description',

  // Validation
  'projects.validation.nameRequired': 'Name is required.',

  // Dialog titles
  'projects.dialog.title.create': 'Add new project',
  'projects.dialog.title.edit': 'Edit project',

  // Dialog actions (prefer shared)
  // Save/Create/Cancel are shared.action.*

  // Snackbar messages
  'projects.message.created': 'Project created',
  'projects.message.createFailed': 'Failed to create project',
  'projects.message.updated': 'Project updated',
  'projects.message.updateFailed': 'Failed to update project',
  'projects.message.deleted': 'Project deleted',
  'projects.message.deleteFailed': 'Failed to delete project',
  'projects.message.loadFailed': 'Failed to load projects',

  // Confirm delete dialog (with interpolation)
  'projects.confirmDelete.title': 'Delete project "{projectName}"',
  'projects.confirmDelete.message':
    'Are you sure you want to delete the project "{projectName}"? This action cannot be undone.',
};
