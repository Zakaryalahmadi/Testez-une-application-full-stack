import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { delay, lastValueFrom, Observable, of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from './list.component';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

const HTTP_REQUEST_DELAY = 1;

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Yoga Session',
      description: 'Description 1',
      date: new Date('2025-01-15'),
      teacher_id: 1,
      users: [1, 2],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      name: 'Meditation Session',
      description: 'Description 2',
      date: new Date('2025-01-16'),
      teacher_id: 2,
      users: [3],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  const sessionInformationMock: SessionInformation | undefined = {
    token: 'token',
    id: 1,
    admin: false,
    username: 'bouraz',
    type: 'Bearer',
    firstName: 'John',
    lastName: 'Doe',
  };

  const getAllSessionMock = () =>
    of(mockSessions).pipe(delay(HTTP_REQUEST_DELAY));

  const mockSessionApiService = {
    all: getAllSessionMock,
  };

  const mockSessionService: {
    $isLogged: Observable<boolean>;
    sessionInformation: SessionInformation | undefined;
  } = {
    $isLogged: of(true),
    sessionInformation: sessionInformationMock,
  };

  beforeEach(async () => {
    mockSessionApiService.all = getAllSessionMock;
    mockSessionService.sessionInformation = sessionInformationMock;

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  });

  beforeEach(() =>{
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Session List Display', () => {
    it('should load and display sessions', () => {
      component.sessions$.subscribe((sessions: Session[]) => {
        expect(sessions).toEqual(mockSessions);
        expect(sessions.length).toBe(2);
      });
    });

    it('should handle empty session list', waitForAsync( async () => {
      mockSessionApiService.all = () => of([]).pipe(delay(HTTP_REQUEST_DELAY));

      component.sessions$ = mockSessionApiService.all();
      fixture.detectChanges();

      const sessionsValue = await lastValueFrom(component.sessions$);

      expect(sessionsValue).toEqual([]);
      expect(sessionsValue.length).toBe(0);
    }));
  });

  describe('User Information', () => {
    it('should return correct user information', () => {
      expect(component.user).toEqual(mockSessionService.sessionInformation);
    });

    it('should handle undefined user information', () => {
      mockSessionService.sessionInformation = undefined;
      expect(component.user).toBeUndefined();
    });
  });


  describe('template rendering', () =>{

    beforeEach(waitForAsync(async () => { 
      await fixture.whenStable();  
      fixture.detectChanges();
    }));
    
    it("should render the exact amount of card sessions", () => {
      const sessionCards = fixture.debugElement.queryAll(By.css('.item'));
      expect(sessionCards.length).toBe(mockSessions.length);
    })

    it("should display session details correctly", () => {
      const firstSession = fixture.debugElement.query(By.css('.item'));
      expect(firstSession).toBeTruthy();
      const firstSessionTitle = firstSession.query(By.css('[data-test="session-name"]'));

      expect(firstSessionTitle.nativeElement.textContent).toContain('Yoga Session');
    });
  })
});
