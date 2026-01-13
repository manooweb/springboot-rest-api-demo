import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { Login } from './login';
import { Auth, LoginResponse } from '../../services/auth';
import { Router } from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  let authSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const fakeResponse: LoginResponse = {
      tokenType: 'Bearer',
      accessToken: 'fake-jwt-token',
      expiresInSeconds: 3600,
     };

    authSpy = jasmine.createSpyObj<Auth>('Auth', ['login']);
    authSpy.login.and.returnValue(of(fakeResponse));

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call Auth.login with username and password when clicking Login', () => {
    const host = fixture.nativeElement as HTMLElement;

    const usernameInput = host.querySelector('[data-testid="username"]') as HTMLInputElement;
    const passwordInput = host.querySelector('[data-testid="password"]') as HTMLInputElement;
    const submitButton = host.querySelector('[data-testid="login-submit"]') as HTMLButtonElement;

    usernameInput.value = 'test';
    usernameInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'test';
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    submitButton.click();

    expect(authSpy.login).toHaveBeenCalledWith('test', 'test');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/projects');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
