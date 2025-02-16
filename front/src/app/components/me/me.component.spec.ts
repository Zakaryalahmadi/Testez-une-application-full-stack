import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import { User } from 'src/app/interfaces/user.interface';
import { delay, of } from 'rxjs';
import { expect } from '@jest/globals';
import { By } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

const HTTP_REQUEST_DELAY = 1;

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  
  const mockUser: User = {
    id: 1,
    email: 'john@test.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'password',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  };

  const mockSessionService = {
    sessionInformation: {
      admin: false,
      id: 1
    },
    logOut: jest.fn()
  };

  const getUserByIdMock = () => 
    of(mockUser).pipe(delay(HTTP_REQUEST_DELAY));

  const mockUserService = {
    getById: getUserByIdMock,
    delete: jest.fn().mockReturnValue(of({}))
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  
  beforeEach(async () => {
    
    mockUserService.getById = getUserByIdMock;
    mockSessionService.logOut.mockClear();
    mockRouter.navigate.mockClear();
    mockMatSnackBar.open.mockClear();

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [{ provide: UserService, useValue: mockUserService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter }],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN I am on the profile page', () => {
    describe('WHEN the component initializes', () => {
      it('THEN it should be created', () => {
        expect(component).toBeTruthy();
      });
      it('THEN should load user data on init', waitForAsync(async () => {
        component.ngOnInit();
        await fixture.whenStable();
        expect(component.user).toEqual(mockUser);
      }));
    });

    describe('GIVEN I am a non-admin user', () => {
      beforeEach(() => {
        component.user = { ...mockUser, admin: false };
        fixture.detectChanges();
      });

      it('THEN I should see the delete account button', () => {
        const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
        expect(deleteButton).toBeTruthy();
      });

      describe('WHEN I click on the delete account button', () => {
        it('THEN my account should be deleted and I should be logged out', waitForAsync(async () => {
          await component.delete();
          expect(mockUserService.delete).toHaveBeenCalledWith('1');
        }));
      });
    });

    describe('GIVEN I am an administrator', () => {
      beforeEach(() => {
        component.user = { ...mockUser, admin: true };
        fixture.detectChanges();
      });

      it('THEN I should not see the delete account button', () => {
       const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
       expect(deleteButton).toBeFalsy();
      });

      it('THEN I should see the admin message', () => {
        const adminMessage = fixture.debugElement.query(By.css('.my2'));
        expect(adminMessage?.nativeElement.textContent).toContain('You are admin');
      });
    });

    describe('GIVEN user information is displayed', () => {
      beforeEach(() => {
        component.user = mockUser;
        fixture.detectChanges();
      });

      it('THEN I should see the correctly formatted full name', () => {
        const nameElement = fixture.debugElement.query(By.css('p')).nativeElement;
        expect(nameElement.textContent).toContain('Name: John DOE');
      });

      it('THEN I should see the email', () => {
        const emailElement = fixture.debugElement.queryAll(By.css('p'))[1].nativeElement;
        expect(emailElement.textContent).toContain('Email: john@test.com');
      });

      it('THEN I should see creation and update dates', () => {
        const dateElements = fixture.debugElement.queryAll(By.css('.w100 p'));
        expect(dateElements[0].nativeElement.textContent).toContain('Create at:');
        expect(dateElements[1].nativeElement.textContent).toContain('Last update:');
      });
    });
  });


});
