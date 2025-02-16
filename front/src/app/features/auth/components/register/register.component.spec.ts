import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  EMPTY_STRING,
  FIRST_NAME_TOO_LONG,
  INVALID_REGISTER_EMAIL,
  LAST_NAME_TOO_LONG,
  LAST_NAME_TOO_SHORT,
  PASSWORD_TOO_LONG,
  PASSWORD_TOO_SHORT,
  VALID_REGISTER_FORM_VALUES,
} from './register.fixture';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const authServiceMock = {
    register: () => of(void 0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('RegisterComponent', () => {
    describe('Form Initialization', () => {
      it('should initialize with empty form fields', () => {
        expect(component.form.controls.email.value).toBe(EMPTY_STRING);
        expect(component.form.controls.firstName.value).toBe(EMPTY_STRING);
        expect(component.form.controls.lastName.value).toBe(EMPTY_STRING);
        expect(component.form.controls.password.value).toBe(EMPTY_STRING);
      });
      it('should initialize with invalid form state', () => {
        expect(component.form.valid).toBe(false);
      });
    });

    describe('Form Validation', () => {
      describe('Email field', () => {
        it('should be invalid when empty', () => {
          const emailFormControl = component.form.controls.email;

          emailFormControl.setValue(EMPTY_STRING);

          expect(emailFormControl.valid).toBe(false);
        });
        it('should be invalid with incorrect email format', () => {
          const emailFormControl = component.form.controls.email;

          emailFormControl.setValue(INVALID_REGISTER_EMAIL);

          expect(emailFormControl.valid).toBe(false);
        });
        it('should be valid with correct email format', () => {
          const emailFormControl = component.form.controls.email;

          emailFormControl.setValue(VALID_REGISTER_FORM_VALUES.email);

          expect(emailFormControl.valid).toBe(true);
        });
      });

      describe('First Name field', () => {
        it('should be invalid when empty', () => {
          const firstNameFormControl = component.form.controls.firstName;

          firstNameFormControl.setValue(EMPTY_STRING);

          expect(firstNameFormControl.valid).toBe(false);
        });
        it('should be invalid when less than 3 characters', () => {
          const firstNameFormControl = component.form.controls.firstName;

          firstNameFormControl.setValue(FIRST_NAME_TOO_LONG);

          expect(firstNameFormControl.valid).toBe(false);
        });
        it('should be invalid when more than 20 characters', () => {
          const firstNameFormControl = component.form.controls.firstName;

          firstNameFormControl.setValue(FIRST_NAME_TOO_LONG);

          expect(firstNameFormControl.valid).toBe(false);
        });
        it('should be valid with correct length', () => {
          const firstNameFormControl = component.form.controls.firstName;

          firstNameFormControl.setValue(VALID_REGISTER_FORM_VALUES.firstName);

          expect(firstNameFormControl.valid).toBe(true);
        });
      });

      describe('Last Name field', () => {
        it('should be invalid when empty', () => {
          const lastNameFormControl = component.form.controls.lastName;

          lastNameFormControl.setValue(EMPTY_STRING);

          expect(lastNameFormControl.valid).toBe(false);
        });
        it('should be invalid when less than 3 characters', () => {
          const lastNameFormControl = component.form.controls.lastName;

          lastNameFormControl.setValue(LAST_NAME_TOO_SHORT);

          expect(lastNameFormControl.valid).toBe(false);
        });
        it('should be invalid when more than 20 characters', () => {
          const lastNameFormControl = component.form.controls.lastName;

          lastNameFormControl.setValue(LAST_NAME_TOO_LONG);

          expect(lastNameFormControl.valid).toBe(false);
        });
        it('should be valid with correct length', () => {
          const lastNameFormControl = component.form.controls.lastName;

          lastNameFormControl.setValue(VALID_REGISTER_FORM_VALUES.lastName);

          expect(lastNameFormControl.valid).toBe(true);
        });
      });

      describe('Password field', () => {
        it('should be invalid when empty', () => {
          const passwordFormControl = component.form.controls.password;

          passwordFormControl.setValue(EMPTY_STRING);

          expect(passwordFormControl.valid).toBe(false);
        });
        it('should be invalid when less than 3 characters', () => {
          const passwordFormControl = component.form.controls.password;

          passwordFormControl.setValue(PASSWORD_TOO_SHORT);

          expect(passwordFormControl.valid).toBe(false);
        });
        it('should be invalid when more than 40 characters', () => {
          const passwordFormControl = component.form.controls.password;

          passwordFormControl.setValue(PASSWORD_TOO_LONG);

          expect(passwordFormControl.valid).toBe(false);
        });
        it('should be valid with correct length', () => {
          const passwordFormControl = component.form.controls.password;

          passwordFormControl.setValue(VALID_REGISTER_FORM_VALUES.password);

          expect(passwordFormControl.valid).toBe(true);
        });
      });

      describe('Submit button', () => {
        let submitButton: DebugElement;

        beforeEach(() => {
          submitButton = fixture.debugElement.query(
            By.css('button[type="submit"]')
          );
        });

        it('should be disabled when form is invalid', () => {
          const registerForm = component.form;

          registerForm.setErrors({
            error: true,
          });

          expect(submitButton.nativeElement.disabled).toBe(true);
          expect(registerForm.valid).toBe(false);
        });
        it('should be enabled when form is valid', () => {
          const registerForm = component.form;

          registerForm.setValue({ ...VALID_REGISTER_FORM_VALUES });
          fixture.detectChanges();

          expect(submitButton.nativeElement.disabled).toBe(false);
          expect(registerForm.valid).toBe(true);
        });
      });
    });

    describe('Error Handling', () => {
      it('should not display error message initially', () => {
        const messageError = fixture.debugElement.query(By.css('.error'));
        expect(messageError).toBeNull();
      });
      it('should display error message when server returns an error', fakeAsync(() => {
        authServiceMock.register = () =>
          throwError(() => new Error('Registration failed'));

        component.form.setValue({ ...VALID_REGISTER_FORM_VALUES });

        component.submit();
        tick();
        fixture.detectChanges();

        const messageError = fixture.debugElement.query(By.css('.error'));
        expect(messageError).not.toBeNull();
      }));
    });
  });
});
