import { TestBed } from '@angular/core/testing';

import { ProjectDetail } from './project-detail';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Task, TasksService } from '../../services/tasks';
import { Project, ProjectsService } from '../../services/projects';

describe('ProjectDetail', () => {
  let projectsServiceSpy: jasmine.SpyObj<ProjectsService>;
  let tasksServiceSpy: jasmine.SpyObj<TasksService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  let project: Project = { id: 'p1', name: 'Project 1', description: 'Description 1' };
  let task: Task = {
    projectId: 'p1',
    id: 't1',
    title: 'Task 1',
    description: 'Description 1',
    dueDate: '2026-01-19',
    status: 'TODO',
  };

  beforeEach(async () => {
    projectsServiceSpy = jasmine.createSpyObj<ProjectsService>('ProjectsService', [
      'getById',
    ]);

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
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'p1' }) } }
        }
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

  it('should not delete task when confirm dialog is cancelled', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(false),
    } as any);

    const { component } = createComponent();

    component.openDeleteTaskConfirmDialog(task);

    expect(tasksServiceSpy.delete).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should delete task, call delete task service and open snackbar when confirm dialog is confirmed', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as any);
    tasksServiceSpy.delete.and.returnValue(of(void 0));

    const { component } = createComponent();

    spyOn(component, 'loadTasks');
    component.openDeleteTaskConfirmDialog(task);

    expect(tasksServiceSpy.delete).toHaveBeenCalledWith(task.id);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Task deleted',
      'Close',
      jasmine.anything()
    );
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it('should open snackbar with error when confirm dialog is confirmed and task deletion fails', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as any);
    tasksServiceSpy.delete.and.returnValue(
      throwError(() => new Error('crash'))
    );
    const { component } = createComponent();

    spyOn(component, 'loadTasks');
    component.openDeleteTaskConfirmDialog(task);

    expect(component.errorTasks).toBe('Failed to delete task');
    expect(tasksServiceSpy.delete).toHaveBeenCalledWith(task.id);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Failed to delete task',
      'Close',
      jasmine.anything()
    );
    expect(component.loadTasks).not.toHaveBeenCalled();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(ProjectDetail);
    fixture.detectChanges(); // triggers ngOnInit -> loadProject and loadTasks
    return { fixture, component: fixture.componentInstance };
  }
});
