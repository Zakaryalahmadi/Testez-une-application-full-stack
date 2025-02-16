import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import {
  ADMIN_SESSION_INFO_FIXTURE,
  EMPTY_STRING,
  INVALID_FORM_VALUES,
  VALID_FORM_VALUES,
  VALID_LOGIN_REQUEST_FIXTURE,
} from './login.fixture';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: {
    login: () => Observable<SessionInformation>;
  };

  let mockRouter: {
    navigate: () => Promise<Boolean>;
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn(() => of(ADMIN_SESSION_INFO_FIXTURE)),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form fields', () => {
      expect(component.form.controls.email.value).toBe(EMPTY_STRING);
      expect(component.form.controls.password.value).toBe(EMPTY_STRING);
    });

    it('should start with hidden password', () => {
      expect(component.hide).toBe(true);
    });
  });

  describe('Form: email and password validation', () => {
    describe('Email field', () => {
      it('should be invalid and required when empty', () => {
        const emailControl: FormControl<string | null> =
          component.form.controls.email;
        emailControl.setValue(EMPTY_STRING);

        expect(emailControl.valid).toBe(false);
        expect(emailControl.errors).toEqual({ required: true });
      });

      it('should be invalid if incorrect format', () => {
        const emailControl: FormControl<string | null> =
          component.form.controls.email;
        emailControl.setValue(INVALID_FORM_VALUES.EMAIL);

        expect(emailControl.valid).toBe(false);
      });

      it('should be valid if correct format', () => {
        const emailControl: FormControl<string | null> =
          component.form.controls.email;
        emailControl.setValue(VALID_FORM_VALUES.email);

        expect(emailControl.valid).toBe(true);
      });
    });

    describe('Password field', () => {
      it('should be invalid and required when empty', () => {
        const passwordControl = component.form.controls.password;

        passwordControl.setValue(EMPTY_STRING);

        expect(passwordControl.valid).toBe(false);
        expect(passwordControl.errors).toEqual({ required: true });
      });

      it('should be invalid with min length error if min length less than 3 caracters', () => {
        const passwordControl = component.form.controls.password;
        passwordControl.setValue(INVALID_FORM_VALUES.PASSWORD);

        const invalidPasswordLength = INVALID_FORM_VALUES.PASSWORD.length;

        expect(passwordControl.valid).toBe(false);
        expect(passwordControl.errors).toEqual({
          minlength: { requiredLength: 3, actualLength: invalidPasswordLength },
        });
      });

      it('should be valid if password length more than 3 caracters', () => {
        const passwordControl = component.form.controls.password;
        passwordControl.setValue(VALID_FORM_VALUES.password);

        expect(passwordControl.valid).toBe(true);
      });
    });

    describe('Submit button', () => {
      let submitButton: DebugElement;

      beforeEach(() => {
        submitButton = fixture.debugElement.query(
          By.css('button[type="submit"]')
        );
      });

      it('should be disabled if form is invalid', () => {
        const loginForm = component.form;
        loginForm.setErrors({
          error: true,
        });
        fixture.detectChanges();

        expect(loginForm.valid).toBe(false);
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if form is valid', () => {
        const loginForm = component.form;
        loginForm.setValue({...VALID_FORM_VALUES});

        fixture.detectChanges();

        expect(loginForm.valid).toBe(true);
        expect(submitButton.nativeElement.disabled).toBe(false);
      });
    });
  });

  describe('Form submission', () => {
    it('should call login function of authService on successful login', () => {
      component.form.setValue({...VALID_FORM_VALUES});

      const loginRequest: LoginRequest = VALID_LOGIN_REQUEST_FIXTURE;

      component.submit();

      expect(authService.login).toHaveBeenCalledWith(loginRequest);
    });
  });

  describe('error handling', () => {
    it('should display an error occured when server returns an error', () => {
      authService.login = jest.fn(() =>
        throwError(() => new Error('Server error'))
      );

      component.form.setValue({...VALID_FORM_VALUES});

      component.submit();

      fixture.detectChanges();

      const msgErrorOccured = fixture.debugElement.query(By.css('.error'));

      expect(msgErrorOccured).not.toBeNull();
    });
  });
});
