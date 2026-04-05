import { TestBed } from '@angular/core/testing';

import { Projects } from './projects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Project, ProjectsService } from '../../services/projects';
import { of, throwError } from 'rxjs';
import { ProjectDialogResult } from './project-dialog.types';

describe('Projects', () => {
  let projectsServiceSpy: jasmine.SpyObj<ProjectsService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  const project: Project = { id: 'p1', name: 'Project 1', description: 'Description 1' };

  beforeEach(async () => {
    projectsServiceSpy = jasmine.createSpyObj<ProjectsService>('ProjectsService', [
      'getAll',
      'create',
      'update',
      'delete',
    ]);

    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    // Important : ngOnInit() calls loadProjects() -> getAll()
    projectsServiceSpy.getAll.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [Projects],
      providers: [
        { provide: ProjectsService, useValue: projectsServiceSpy },
        { provide: Router, useValue: routerSpy },
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

  it('should not create project when create dialog is closed without create result', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, ProjectDialogResult | undefined>> = {
      afterClosed: () => of(undefined),
    };
    dialogSpy.open.and.returnValue(
      dialogRefSpy as MatDialogRef<unknown, ProjectDialogResult | undefined>,
    );

    const { component } = createComponent();

    component.openAddNewProjectDialog();

    expect(projectsServiceSpy.create).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should create project and refresh list when create dialog returns create result', () => {
    const dialogResult: ProjectDialogResult = {
      mode: 'create',
      payload: { name: 'Project 2', description: 'Description 2' },
    };
    const dialogRefSpy: Partial<MatDialogRef<unknown, ProjectDialogResult>> = {
      afterClosed: () => of(dialogResult),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, ProjectDialogResult>);
    projectsServiceSpy.create.and.returnValue(of(project));

    const { component } = createComponent();

    spyOn(component, 'loadProjects');
    component.openAddNewProjectDialog();

    expect(projectsServiceSpy.create).toHaveBeenCalledWith(dialogResult.payload);
    expect(component.loadProjects).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Project created', 'Close', jasmine.anything());
  });

  it('should not update project when edit dialog is closed without valid edit result', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, ProjectDialogResult | undefined>> = {
      afterClosed: () => of(undefined),
    };
    dialogSpy.open.and.returnValue(
      dialogRefSpy as MatDialogRef<unknown, ProjectDialogResult | undefined>,
    );

    const { component } = createComponent();

    component.openEditProjectDialog(project);

    expect(projectsServiceSpy.update).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should update project and refresh list when edit dialog returns edit result', () => {
    const dialogResult: ProjectDialogResult = {
      mode: 'edit',
      id: project.id,
      payload: { name: 'Project 1 updated', description: 'Description updated' },
    };
    const dialogRefSpy: Partial<MatDialogRef<unknown, ProjectDialogResult>> = {
      afterClosed: () => of(dialogResult),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, ProjectDialogResult>);
    projectsServiceSpy.update.and.returnValue(of(project));

    const { component } = createComponent();

    spyOn(component, 'loadProjects');
    component.openEditProjectDialog(project);

    expect(projectsServiceSpy.update).toHaveBeenCalledWith(dialogResult.id!, dialogResult.payload);
    expect(component.loadProjects).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Project updated', 'Close', jasmine.anything());
  });

  it('should not delete project when confirm dialog is cancelled', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, boolean>> = {
      afterClosed: () => of(false),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, boolean>);

    const { component } = createComponent();

    component.openDeleteProjectConfirmDialog(project);

    expect(projectsServiceSpy.delete).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should delete project, call delete project service and open snackbar when confirm dialog is confirmed', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, boolean>> = {
      afterClosed: () => of(true),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, boolean>);
    projectsServiceSpy.delete.and.returnValue(of(void 0));

    const { component } = createComponent();

    spyOn(component, 'loadProjects');
    component.openDeleteProjectConfirmDialog(project);

    expect(projectsServiceSpy.delete).toHaveBeenCalledWith(project.id);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Project deleted', 'Close', jasmine.anything());
    expect(component.loadProjects).toHaveBeenCalled();
  });

  it('should open snackbar with error when confirm dialog is confirmed and project deletion fails', () => {
    const dialogRefSpy: Partial<MatDialogRef<unknown, boolean>> = {
      afterClosed: () => of(true),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, boolean>);
    projectsServiceSpy.delete.and.returnValue(throwError(() => new Error('crash')));
    const { component } = createComponent();

    spyOn(component, 'loadProjects');
    component.openDeleteProjectConfirmDialog(project);

    expect(component.error).toBe('Failed to delete project');
    expect(projectsServiceSpy.delete).toHaveBeenCalledWith(project.id);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Failed to delete project',
      'Close',
      jasmine.anything(),
    );
    expect(component.loadProjects).not.toHaveBeenCalled();
  });
});

function createComponent() {
  const fixture = TestBed.createComponent(Projects);
  fixture.detectChanges(); // triggers ngOnInit -> loadProjects
  return { fixture, component: fixture.componentInstance };
}
