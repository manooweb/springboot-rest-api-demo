import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { UiTextService } from '../../shared/i18n/ui-text.service';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { shouldShowError, focusFirstInvalidControl } from '../../shared/forms/form-helpers';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslatePipe,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  @ViewChild('formEl', { static: true }) private readonly formEl?: ElementRef<HTMLFormElement>;
  error: string | null = null;
  loading = false;
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translate = inject(UiTextService);
  readonly shouldShowError = shouldShowError;

  submitAttempted = false;

  form = this.formBuilder.group({
    email: this.formBuilder.control('demo@example.com', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('demo', {
      validators: [Validators.required],
      nonNullable: true,
    }),
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
      focusFirstInvalidControl(this.form, this.formEl?.nativeElement);
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
        this.error = this.translate.t('auth.login.error.invalidCredentials');
      },
    });
  }
}
