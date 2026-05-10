import { TestBed } from '@angular/core/testing';

import { ProjectDetail } from './project-detail';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Task, TasksService } from '../../services/tasks';
import { Project, ProjectsService } from '../../services/projects';

describe('ProjectDetail', () => {
  let projectsServiceSpy: jasmine.SpyObj<ProjectsService>;
  let tasksServiceSpy: jasmine.SpyObj<TasksService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  const project: Project = { id: 'p1', name: 'Project 1', description: 'Description 1' };
  const task: Task = {
    projectId: 'p1',
    id: 't1',
    title: 'Task 1',
    description: 'Description 1',
    dueDate: new Date('2026-01-19'),
    status: 'TODO',
  };

  beforeEach(async () => {
    projectsServiceSpy = jasmine.createSpyObj<ProjectsService>('ProjectsService', ['getById']);

    tasksServiceSpy = jasmine.createSpyObj<TasksService>('TasksService', [
      'getAll',
      'create',
      'update',
      'delete',
    ]);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    // Important : ngOnInit() calls :
    // loadProject() -> getById()
    projectsServiceSpy.getById.and.returnValue(of(project));
    // loadTasks() -> getAll()
    tasksServiceSpy.getAll.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [ProjectDetail],
      providers: [
        provideAnimations(),
        { provide: TasksService, useValue: tasksServiceSpy },
        { provide: ProjectsService, useValue: projectsServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'p1' }) } },
        },
      ],
    });

    TestBed.overrideProvider(MatDialog, { useValue: dialogSpy });
    TestBed.overrideProvider(MatSnackBar, { useValue: snackBarSpy });

    await TestBed.compileComponents();
  });

  it('should create', () => {
    const { component } = createComponent();

    expect(component).toBeTruthy();
  });

  it('should render multiline project and task descriptions without flattening line breaks', () => {
    projectsServiceSpy.getById.and.returnValue(
      of({ ...project, description: 'Project line 1\nProject line 2' }),
    );
    tasksServiceSpy.getAll.and.returnValue(
      of([{ ...task, description: 'Task line 1\nTask line 2' }]),
    );

    const { fixture } = createComponent();
    const descriptions = Array.from(
      fixture.nativeElement.querySelectorAll('.multiline-description'),
    ) as HTMLElement[];

    expect(descriptions[0].textContent).toContain('Project line 1\nProject line 2');
    expect(descriptions[1].textContent).toContain('Task line 1\nTask line 2');
  });

  it('should not create task when create dialog is closed without result', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, undefined>> = {
      afterClosed: () => of(undefined),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, undefined>);

    const { component } = createComponent();

    component.openAddNewTaskDialog();

    expect(tasksServiceSpy.create).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should not create task when project id is missing', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () =>
        of({
          mode: 'create',
          payload: { title: 'Task 2', description: 'Description 2' },
        }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);

    const { component } = createComponent();
    component.id = null;

    component.openAddNewTaskDialog();

    expect(tasksServiceSpy.create).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should not create task when dialog result is not create mode', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () =>
        of({
          mode: 'edit',
          taskId: task.id,
          payload: { title: 'Task 2', description: 'Description 2' },
        }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);

    const { component } = createComponent();

    component.openAddNewTaskDialog();

    expect(tasksServiceSpy.create).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should create task, refresh tasks and open snackbar when create dialog returns create result', () => {
    const payload = { title: 'Task 2', description: 'Description 2' };
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () => of({ mode: 'create', payload }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);
    tasksServiceSpy.create.and.returnValue(of({ ...task, ...payload, id: 't2' }));

    const { component } = createComponent();
    spyOn(component, 'loadTasks');

    component.openAddNewTaskDialog();

    expect(tasksServiceSpy.create).toHaveBeenCalledWith('p1', payload);
    expect(component.loadTasks).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Task created', 'Close', jasmine.anything());
  });

  it('should reset loading and show error when task creation fails', () => {
    const payload = { title: 'Task 2', description: 'Description 2' };
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () => of({ mode: 'create', payload }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);
    tasksServiceSpy.create.and.returnValue(throwError(() => new Error('crash')));

    const { component } = createComponent();
    spyOn(component, 'loadTasks');

    component.openAddNewTaskDialog();

    expect(component.loadingTasks).toBeFalse();
    expect(component.errorTasks).toBe('Failed to create task');
    expect(tasksServiceSpy.create).toHaveBeenCalledWith('p1', payload);
    expect(component.loadTasks).not.toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Failed to create task',
      'Close',
      jasmine.anything(),
    );
  });

  it('should not update task when edit dialog is closed without result', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, undefined>> = {
      afterClosed: () => of(undefined),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, undefined>);

    const { component } = createComponent();

    component.openEditTaskDialog(task);

    expect(tasksServiceSpy.update).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should not update task when project id is missing', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () =>
        of({
          mode: 'edit',
          taskId: task.id,
          payload: { title: 'Task updated', description: 'Description updated' },
        }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);

    const { component } = createComponent();
    component.id = null;

    component.openEditTaskDialog(task);

    expect(tasksServiceSpy.update).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should not update task when dialog result is not edit mode', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () =>
        of({
          mode: 'create',
          payload: { title: 'Task updated', description: 'Description updated' },
        }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);

    const { component } = createComponent();

    component.openEditTaskDialog(task);

    expect(tasksServiceSpy.update).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should not update task when edit dialog result has no task id', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () =>
        of({
          mode: 'edit',
          payload: { title: 'Task updated', description: 'Description updated' },
        }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);

    const { component } = createComponent();

    component.openEditTaskDialog(task);

    expect(tasksServiceSpy.update).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should update task, refresh tasks and open snackbar when edit dialog returns edit result', () => {
    const payload = { title: 'Task updated', description: 'Description updated' };
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () => of({ mode: 'edit', taskId: task.id, payload }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);
    tasksServiceSpy.update.and.returnValue(of({ ...task, ...payload }));

    const { component } = createComponent();
    spyOn(component, 'loadTasks');

    component.openEditTaskDialog(task);

    expect(tasksServiceSpy.update).toHaveBeenCalledWith(task.id, payload);
    expect(component.loadTasks).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Task updated', 'Close', jasmine.anything());
  });

  it('should reset loading and show error when task update fails', () => {
    const payload = { title: 'Task updated', description: 'Description updated' };
    const dialogRefSpy: Partial<MatDialogRef<unknown, unknown>> = {
      afterClosed: () => of({ mode: 'edit', taskId: task.id, payload }),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, unknown>);
    tasksServiceSpy.update.and.returnValue(throwError(() => new Error('crash')));

    const { component } = createComponent();
    spyOn(component, 'loadTasks');

    component.openEditTaskDialog(task);

    expect(component.loadingTasks).toBeFalse();
    expect(component.errorTasks).toBe('Failed to update task');
    expect(tasksServiceSpy.update).toHaveBeenCalledWith(task.id, payload);
    expect(component.loadTasks).not.toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Failed to update task',
      'Close',
      jasmine.anything(),
    );
  });

  it('should not delete task when confirm dialog is cancelled', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, boolean>> = {
      afterClosed: () => of(false),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, boolean>);

    const { component } = createComponent();

    component.openDeleteTaskConfirmDialog(task);

    expect(tasksServiceSpy.delete).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should delete task, call delete task service and open snackbar when confirm dialog is confirmed', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, boolean>> = {
      afterClosed: () => of(true),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, boolean>);
    tasksServiceSpy.delete.and.returnValue(of(void 0));

    const { component } = createComponent();
    spyOn(component, 'loadTasks');

    component.openDeleteTaskConfirmDialog(task);

    expect(tasksServiceSpy.delete).toHaveBeenCalledWith(task.id);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Task deleted', 'Close', jasmine.anything());
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it('should open snackbar with error when confirm dialog is confirmed and task deletion fails', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, boolean>> = {
      afterClosed: () => of(true),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, boolean>);
    tasksServiceSpy.delete.and.returnValue(throwError(() => new Error('crash')));
    const { component } = createComponent();
    spyOn(component, 'loadTasks');

    component.openDeleteTaskConfirmDialog(task);

    expect(component.errorTasks).toBe('Failed to delete task');
    expect(tasksServiceSpy.delete).toHaveBeenCalledWith(task.id);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Failed to delete task',
      'Close',
      jasmine.anything(),
    );
    expect(component.loadTasks).not.toHaveBeenCalled();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(ProjectDetail);
    fixture.detectChanges(); // triggers ngOnInit -> loadProject and loadTasks
    return { fixture, component: fixture.componentInstance };
  }
});
