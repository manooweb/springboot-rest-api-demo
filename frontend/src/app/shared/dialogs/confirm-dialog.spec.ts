import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConfirmDialog } from './confirm-dialog';
import { ConfirmDialogData } from './confirm-dialog.types';

describe('ConfirmDialog', () => {
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialog>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ConfirmDialog>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [
        provideNativeDateAdapter(),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            titleKey: 'Dialog title',
            messageKey: 'Dialog message',
          } satisfies ConfirmDialogData,
        },
      ],
    }).compileComponents();
  });

  it('should default button labels display when they are not provided', () => {
    const { component } = createComponent({
      titleKey: 'Dialog title',
      messageKey: 'Dialog message',
    } satisfies ConfirmDialogData);

    expect(component.cancelButtonLabel).toBe('shared.action.cancel');
    expect(component.confirmButtonLabel).toBe('shared.action.ok');
  });

  it('should title and message empty when they are not provided', () => {
    const { component } = createComponent({} as unknown as ConfirmDialogData);

    expect(component.titleKey).toBe('');
    expect(component.messageKey).toBe('');
  });

  it('should click on confirm button return true', () => {
    const { component } = createComponent({
      titleKey: 'Dialog title',
      messageKey: 'Dialog message',
    } satisfies ConfirmDialogData);

    component.clickOnConfirm();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should click on cancel button return empty string', () => {
    const { fixture } = createComponent({
      titleKey: 'Dialog title',
      messageKey: 'Dialog message',
    } satisfies ConfirmDialogData);

    const cancelButton = fixture.nativeElement.querySelector(
      'mat-dialog-actions button[mat-dialog-close]',
    ) as HTMLButtonElement | null;

    cancelButton?.click();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledWith('');
  });

  function createComponent(data?: ConfirmDialogData) {
    if (data) {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    }
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }
});
