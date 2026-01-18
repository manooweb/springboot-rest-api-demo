import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectDialog } from './project-dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ProjectDialogData } from './project-dialog.types';

describe('ProjectDialog', () => {
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ProjectDialog>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ProjectDialog>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ProjectDialog,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule
      ],
      providers: [
        provideNativeDateAdapter(),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' } satisfies ProjectDialogData },
      ],
    }).compileComponents();
  });

  it('should close with expected payload in create mode', () => {
    const { component } = createComponent({
      mode: 'create',
    } satisfies ProjectDialogData);

    component.name = 'My project';
    component.description = 'Desc';

    component.clickOnOk();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      mode: 'create',
      payload: {
        name: 'My project',
        description: 'Desc',
      }
    });
  });

  it('should close with expected payload and taskId in edit mode', () => {
    const { component } = createComponent({
      mode: 'edit',
      project: { id: 'p1', name: 'Old', description: 'Old desc' },
    } satisfies ProjectDialogData);

    component.name = ' Updated name ';
    component.description = '   '; // should become undefined

    component.clickOnOk();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      mode: 'edit',
      id: 'p1',
      payload: {
        name: 'Updated name', // trimmed
        description: undefined, // trimmed -> empty -> undefined
      },
    });
  });

  it('should prefill fields in edit mode', () => {
    const { component } = createComponent({
      mode: 'edit',
      project: {
        id: 'p1',
        name: 'Old name',
        description: 'Old desc',
      },
    } satisfies ProjectDialogData);

    expect(component.name).toBe('Old name');
    expect(component.description).toBe('Old desc');
  });

  it('should not close when name is blank', () => {
    const { component } = createComponent({mode: 'create'} satisfies ProjectDialogData);

    component.clickOnOk();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should expose correct title and primary label in create mode', () => {
    const { component } = createComponent({ mode: 'create' });
    expect(component.dialogTitle).toBe('Add new project');
    expect(component.primaryButtonLabel).toBe('Create');
  });

  it('should expose correct title and primary label in edit mode', () => {
    const { component } = createComponent({
      mode: 'edit',
      project: { id: 't1', name: 'p1', description: 'desc' },
    });
    expect(component.dialogTitle).toBe('Edit project');
    expect(component.primaryButtonLabel).toBe('Save');
  });

  function createComponent(data?: ProjectDialogData) {
    if (data) {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    }
    const fixture = TestBed.createComponent(ProjectDialog);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }
});
