import { AbstractControl, FormGroup } from '@angular/forms';

export function shouldShowError(
  control: AbstractControl | null | undefined,
  submitAttempted: boolean,
): boolean {
  return !!control && control.invalid && (control.touched || submitAttempted);
}

export function focusFirstInvalidControl(
  form: FormGroup,
  root: HTMLElement | null | undefined,
): void {
  if (!root) return;

  const invalidControlName = Object.keys(form.controls).find(
    (name) => form.controls[name as keyof typeof form.controls].invalid,
  );

  if (!invalidControlName) return;

  const el = root.querySelector<HTMLElement>(`[formControlName="${invalidControlName}"]`);

  el?.focus();
}
