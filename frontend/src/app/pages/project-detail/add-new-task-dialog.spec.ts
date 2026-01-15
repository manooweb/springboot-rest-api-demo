import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { AddNewTaskDialog } from './project-detail';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('AddNewTaskDialog', () => {
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddNewTaskDialog>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<AddNewTaskDialog>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        AddNewTaskDialog,
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
    const fixture = TestBed.createComponent(AddNewTaskDialog);
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
    const fixture = TestBed.createComponent(AddNewTaskDialog);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.title = '   ';
    component.clickOnOk();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
