import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { Session } from '../../interfaces/session.interface';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { delay, of, throwError } from 'rxjs';

const HTTP_REQUEST_DELAY = 1;

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    description: 'Relaxing yoga session',
    date: new Date('2025-01-15'),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTeachers = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Smith' }
  ];

  const mockRouter = {
    url: '/sessions/create',
    navigate: jest.fn()
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn()
      }
    }
  };

  const getSessionDetailsMock$ = () => of(mockSession).pipe(delay(HTTP_REQUEST_DELAY));

  const createSessionDetailsMock$ = () => of(mockSession).pipe(delay(HTTP_REQUEST_DELAY));

  const updateSessionDetailsMock$ = () => of(mockSession).pipe(delay(HTTP_REQUEST_DELAY));


  const getAllTechers$ = () => of(mockTeachers).pipe(delay(HTTP_REQUEST_DELAY));

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    create: jest.fn().mockReturnValue(of(mockSession)),
    update: jest.fn().mockReturnValue(of(mockSession))
  };

  const mockTeacherService = {
    all: getAllTechers$
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  describe('GIVEN I am on the session form page', () => {
    describe('WHEN I am not an admin', () => {
      beforeEach(() => {
        mockSessionService.sessionInformation.admin = false;
        fixture.detectChanges();
      });

      it('THEN I should be redirected to sessions page', () => {
        component.ngOnInit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
      });
    });

    describe('WHEN I am creating a new session', () => {
      beforeEach(() => {
        mockRouter.url = '/sessions/create';
        fixture.detectChanges();
      });

      it('THEN the form should be initialized empty', () => {
        component.ngOnInit();
        expect(component.sessionForm?.get('name')?.value).toBe('');
        expect(component.sessionForm?.get('description')?.value).toBe('');
      });

      it('THEN I should see the create session title', () => {
        const title = fixture.debugElement.query(By.css('h1'));
        expect(title.nativeElement.textContent).toContain('Create session');
      });

      describe('AND WHEN I submit the form with valid data', () => {
        it('THEN the session should be created', waitForAsync(async () => {
          component.ngOnInit();
          fixture.detectChanges();

          component.sessionForm?.patchValue({
            name: 'New Session',
            date: '2025-01-15',
            teacher_id: 1,
            description: 'New description'
          });
          fixture.detectChanges();

          await component.submit();
          
          await fixture.whenStable();

          expect(mockSessionApiService.create).toHaveBeenCalled();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
        }));
       });
    });

    describe('WHEN I am updating a session', () => {
      beforeEach(() => {
        mockRouter.url = '/sessions/update/1';
        mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
        fixture.detectChanges();
      });

      it('THEN the form should be initialized with session data', waitForAsync(async () => {
        component.ngOnInit();
        fixture.detectChanges();

        await fixture.whenStable();
        
        expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
        expect(component.sessionForm?.get('name')?.value).toBe(mockSession.name);
        expect(component.sessionForm?.get('description')?.value).toBe(mockSession.description);
      }));

      it('THEN should handle update submission', waitForAsync(async () => {
        component.ngOnInit();
        fixture.detectChanges();

        await fixture.whenStable();

        component.sessionForm?.patchValue({
          name: 'Updated Session',
          date: '2025-01-16',
          teacher_id: 2,
          description: 'Updated description'
        });
        fixture.detectChanges();

        await component.submit();

        fixture.whenStable().then(() => {
          expect(mockSessionApiService.update).toHaveBeenCalledWith('1', {
            name: 'Updated Session',
            date: '2025-01-16',
            teacher_id: 2,
            description: 'Updated description'
          });
          expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
          expect(mockMatSnackBar.open).toHaveBeenCalledWith(
            'Session updated !',
            'Close',
            { duration: 3000 }
          );
        });
      }));
    });
  });
});
