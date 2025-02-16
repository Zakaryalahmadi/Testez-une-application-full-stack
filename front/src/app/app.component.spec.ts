import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { expect } from '@jest/globals';
import { NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const isLoggedMock$ = () => of(false);

  const mockSessionService = {
    logOut: jest.fn(),
    $isLogged: isLoggedMock$
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {

    mockSessionService.$isLogged = isLoggedMock$;
    mockRouter.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent, 
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('GIVEN I am on the app', () => {
    it('THEN should display the app title', () => {
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('[data-testid="app-title"]'));
      expect(titleElement.nativeElement.textContent).toContain('Yoga app');
    });

    describe('WHEN user is not logged in', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('THEN should display login and register links', () => {
        const loginLink = fixture.debugElement.query(By.css('[data-testid="login-link"]'));
        const registerLink = fixture.debugElement.query(By.css('[data-testid="register-link"]'));
        
        expect(loginLink.nativeElement.textContent).toContain('Login');
        expect(registerLink.nativeElement.textContent).toContain('Register');
      });

      it('THEN should not display logged-in user links', () => {
        const sessionsLink = fixture.debugElement.query(By.css('[data-testid="sessions-link"]'));
        const accountLink = fixture.debugElement.query(By.css('[data-testid="account-link"]'));
        const logoutLink = fixture.debugElement.query(By.css('[data-testid="logout-link"]'));
        
        expect(sessionsLink).toBeFalsy();
        expect(accountLink).toBeFalsy();
        expect(logoutLink).toBeFalsy();
      });
    });

    describe('WHEN user is logged in', () => {
      beforeEach(() => {
        mockSessionService.$isLogged = () => of(true)
        fixture.detectChanges();
      });

      it('THEN should display sessions, account and logout links', () => {
        const sessionsLink = fixture.debugElement.query(By.css('[data-testid="sessions-link"]'));
        const accountLink = fixture.debugElement.query(By.css('[data-testid="account-link"]'));
        const logoutLink = fixture.debugElement.query(By.css('[data-testid="logout-link"]'));
        
        expect(sessionsLink.nativeElement.textContent).toContain('Sessions');
        expect(accountLink.nativeElement.textContent).toContain('Account');
        expect(logoutLink.nativeElement.textContent).toContain('Logout');
      });

      it('THEN should not display login and register links', () => {
        const loginLink = fixture.debugElement.query(By.css('[data-testid="login-link"]'));
        const registerLink = fixture.debugElement.query(By.css('[data-testid="register-link"]'));
        
        expect(loginLink).toBeFalsy();
        expect(registerLink).toBeFalsy();
      });

      describe('AND WHEN clicking logout', () => {
        it('THEN should call logout and navigate to home', () => {
          const logoutLink = fixture.debugElement.query(By.css('[data-testid="logout-link"]'));
          
          logoutLink.triggerEventHandler('click', null);
          
          expect(mockSessionService.logOut).toHaveBeenCalled();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
        });
      });
    });
  });
});