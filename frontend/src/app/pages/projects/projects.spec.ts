import { TestBed } from '@angular/core/testing';

import { Projects } from './projects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Project, ProjectsService } from '../../services/projects';
import { of, throwError } from 'rxjs';

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
        provideAnimations(),
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

  it('should not delete project when confirm dialog is cancelled', () => {
    const dialogRefSpy : Partial<MatDialogRef<unknown, boolean>> = {
      afterClosed: () => of(false),
    };
    dialogSpy.open.and.returnValue(dialogRefSpy as MatDialogRef<unknown, boolean>);

    const { component } = createComponent();

    component.openDeleteProjectConfirmDialog(project);

    expect(projectsServiceSpy.delete).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should delete project, call delete project service and open snackbar when confirm dialog is confirmed', () => {
    const dialogRefSpy : Partial<MatDialogRef<unknown, boolean>> = {
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
    const dialogRefSpy : Partial<MatDialogRef<unknown, boolean>> = {
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

  function createComponent() {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges(); // triggers ngOnInit -> loadProjects
    return { fixture, component: fixture.componentInstance };
  }
});
