import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { Login } from './login';
import { Auth, LoginResponse } from '../../services/auth';
import { Router } from '@angular/router';

fdescribe('Login', () => {
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
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call Auth.login and navigate when form is valid and submit is called', () => {
    component.form.setValue({
      email: 'test@example.com',
      password: 'test'
    });

    component.submit();

    expect(authSpy.login).toHaveBeenCalledOnceWith('test@example.com', 'test');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledOnceWith('/projects');
  });

  it('should not call Auth.login when form is invalid', () => {
    component.form.setValue({
      email: '',        // invalid: required + email
      password: 'test',
    });

    component.submit();

    expect(authSpy.login).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should mark submitAttempted when submitting an invalid form', () => {
    component.form.setValue({
      email: '',
      password: '',
    });

    component.submit();

    expect(component.submitAttempted).toBeTrue();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
