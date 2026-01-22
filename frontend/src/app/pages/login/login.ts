import { Component, inject } from '@angular/core';
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
  error: string | null = null;
  loading = false;
  router = inject(Router);
  auth = inject(Auth);
  fb = inject(FormBuilder);

  submitAttempted = false;

  form = this.fb.group({
    email: ['demo@example.com', [Validators.required, Validators.email]],
    password: ['demo', [Validators.required]],
  });

  get emailCtrl() {
    return this.form.controls.email;
  }

  get passwordCtrl() {
    return this.form.controls.password;
  }

  shouldShowError(control: { invalid: boolean }) {
    // Show errors only after the first submit attempt
    return this.submitAttempted && control.invalid;
  }

  submit() {
    this.error = null;
    this.submitAttempted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const email = this.form.controls.email.value ?? '';
    const password = this.form.controls.password.value ?? '';

    this.auth.login(email, password).subscribe({
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
}
