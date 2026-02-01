import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskDialog } from './task-dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TaskDialogData } from './task-dialog.types';

describe('TaskDialog', () => {
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TaskDialog>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskDialog>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        TaskDialog,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule
      ],
      providers: [
        provideNativeDateAdapter(),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' } satisfies TaskDialogData },
      ],
    }).compileComponents();
  });

  it('should close with expected payload in create mode', () => {
    const { component } = createComponent({
      mode: 'create',
    } satisfies TaskDialogData);

    component.form.setValue({
      title: 'My task',
      description: 'Desc',
      dueDate: new Date('2026-01-15'),
      status: 'IN_PROGRESS',
    });

    component.clickOnOk();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      mode: 'create',
      payload: {
        title: 'My task',
        description: 'Desc',
        dueDate: '2026-01-15',
        status: 'IN_PROGRESS',
      }
    });
  });

  it('should close with expected payload and taskId in edit mode', () => {
    const { component } = createComponent({
      mode: 'edit',
      task: { id: 't1', projectId: 'p1', title: 'Old', status: 'TODO' },
    } satisfies TaskDialogData);

    component.form.setValue({
      title: ' Updated title ',
      description: '   ', // should become undefined
      dueDate: new Date('2026-01-15'),
      status: 'IN_PROGRESS',
    });

    component.clickOnOk();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      mode: 'edit',
      taskId: 't1',
      payload: {
        title: 'Updated title', // trimmed
        description: '', // defined as nonNullable control
        dueDate: '2026-01-15',
        status: 'IN_PROGRESS',
      },
    });
  });

  it('should prefill fields in edit mode', () => {
    const { component } = createComponent({
      mode: 'edit',
      task: {
        id: 't1',
        projectId: 'p1',
        title: 'Old title',
        description: 'Old desc',
        status: 'DONE',
        dueDate: new Date('2026-02-01'),
      },
    } satisfies TaskDialogData);

    const formValues = component.form.getRawValue();

    expect(formValues.title).toBe('Old title');
    expect(formValues.description).toBe('Old desc');
    expect(formValues.status).toBe('DONE');
    expect(formValues.dueDate).toEqual(new Date('2026-02-01'));
  });

  it('should not close when title is blank', () => {
    const { component } = createComponent({mode: 'create'} satisfies TaskDialogData);

    component.clickOnOk();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should expose correct title and primary label in create mode', () => {
    const { component } = createComponent({ mode: 'create' });
    expect(component.dialogTitle).toBe('tasks.dialog.title.create');
    expect(component.primaryButtonLabel).toBe('shared.action.create');
  });

  it('should expose correct title and primary label in edit mode', () => {
    const { component } = createComponent({
      mode: 'edit',
      task: { id: 't1', projectId: 'p1', title: 'x', status: 'TODO' },
    });
    expect(component.dialogTitle).toBe('tasks.dialog.title.edit');
    expect(component.primaryButtonLabel).toBe('shared.action.save');
  });

  function createComponent(data?: TaskDialogData) {
    if (data) {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    }
    const fixture = TestBed.createComponent(TaskDialog);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }
});
