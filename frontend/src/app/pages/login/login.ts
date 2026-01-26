import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  @ViewChild('formEl', { static: true }) private formEl?: ElementRef<HTMLFormElement>;
  error: string | null = null;
  loading = false;
  router = inject(Router);
  auth = inject(Auth);
  formBuilder = inject(FormBuilder);

  submitAttempted = false;

  form = this.formBuilder.group({
    email: this.formBuilder.control('demo@example.com', { validators: [Validators.required, Validators.email], nonNullable: true }),
    password: this.formBuilder.control('demo', { validators: [Validators.required], nonNullable: true }),
  });

  get emailCtrl() {
    return this.form.controls.email;
  }

  get passwordCtrl() {
    return this.form.controls.password;
  }

  submit() {
    this.error = null;
    this.submitAttempted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.focusFirstInvalidControl();
      return;
    }

    this.loading = true;

    const { email, password } = this.form.getRawValue();

    this.auth.login(email.trim(), password.trim()).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/projects');
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid credentials';
      },
    });
  }

  private focusFirstInvalidControl(): void {
    const invalidControlName = Object.keys(this.form.controls)
      .find((name) => this.form.controls[name as keyof typeof this.form.controls].invalid);

    if (!invalidControlName) return;

    const el = this.formEl?.nativeElement.querySelector<HTMLElement>(`[formControlName="${invalidControlName}"]`);
    el?.focus();
  }
}
