import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { TeacherService } from 'src/app/services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let mockSessionApiService: jest.Mocked<any>;
  let mockTeacherService: jest.Mocked<any>;
  let mockMatSnackBar: jest.Mocked<any>;
  let mockRouter: jest.Mocked<any>;

  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    description: 'Description test',
    date: new Date('2025-01-15'),
    teacher_id: 1,
    users: [1, 2],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of({})),
      participate: jest.fn().mockReturnValue(of({})),
      unParticipate: jest.fn().mockReturnValue(of({})),
    };

    mockTeacherService = {
      detail: jest.fn().mockReturnValue(of(mockTeacher)),
    };

    mockMatSnackBar = {
      open: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
      ],
      declarations: [DetailComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: SessionService,
          useValue: {
            sessionInformation: {
              id: 1,
              admin: true,
            },
          },
        },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();
    service = TestBed.inject(SessionService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should fetch session details on init', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
      expect(component.session).toEqual(mockSession);
      expect(mockTeacherService.detail).toHaveBeenCalledWith('1');
      expect(component.teacher).toEqual(mockTeacher);
    }));
  });

  describe('User Actions', () => {
    it('should handle participate action', fakeAsync(() => {
      component.participate();
      tick();

      expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
      expect(mockSessionApiService.detail).toHaveBeenCalled();
    }));

    it('should handle unParticipate action', fakeAsync(() => {
      component.unParticipate();
      tick();

      expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(
        '1',
        '1'
      );
      expect(mockSessionApiService.detail).toHaveBeenCalled();
    }));
  });

  describe('Template Rendering', () => {
    it('should display session details correctly', () => {
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(
        By.css('h1')
      ).nativeElement;
      expect(titleElement.textContent).toContain('Yoga Session');
    });

    it('should show delete button for admin users', () => {
      component.isAdmin = true;
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('button[color="warn"]')
      );
      expect(deleteButton).toBeTruthy();
    });

    it('should show participate button for non-admin users when not participating', () => {
      component.isAdmin = false;
      component.isParticipate = false;
      fixture.detectChanges();

      const participateButton = fixture.debugElement.query(
        By.css('button[color="primary"]')
      );
      expect(participateButton).toBeTruthy();
    });
  });
});
