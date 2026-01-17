import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskDialog } from './task-dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

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
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ],
    }).compileComponents();
  });

  it('should close with expected payload when OK is clicked', () => {
    const fixture = TestBed.createComponent(TaskDialog);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.title = 'My task';
    component.description = 'Desc';
    component.dueDate = '2026-01-15';
    component.status = 'IN_PROGRESS';

    component.clickOnOk();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      title: 'My task',
      description: 'Desc',
      dueDate: '2026-01-15',
      status: 'IN_PROGRESS',
    });
  });

  it('should not close when title is blank', () => {
    const fixture = TestBed.createComponent(TaskDialog);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.title = '   ';
    component.clickOnOk();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
