import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { expect } from '@jest/globals';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;
  const API_PATH = 'api/session';

  // Mock d'une session pour les tests
  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    description: 'Beginner friendly yoga session',
    date: new Date('2024-02-01'),
    teacher_id: 123,
    users: [1,2],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService]
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should return all sessions', () => {
      // GIVEN
      const mockSessions: Session[] = [mockSession];

      // WHEN
      service.all().subscribe(sessions => {
        expect(sessions).toEqual(mockSessions);
      });

      // THEN
      const req = httpMock.expectOne(API_PATH);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });
  });

  describe('detail', () => {
    it('should return a specific session', () => {
      // GIVEN
      const sessionId = '1';

      // WHEN
      service.detail(sessionId).subscribe(session => {
        expect(session).toEqual(mockSession);
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${sessionId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSession);
    });
  });

  describe('delete', () => {
    it('should delete a session', () => {
      // GIVEN
      const sessionId = '1';

      // WHEN
      service.delete(sessionId).subscribe();

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${sessionId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should create a new session', () => {
      // GIVEN
      const newSession: Session = { ...mockSession };
      delete newSession.id; // Simuler une nouvelle session sans ID

      // WHEN
      service.create(newSession).subscribe(session => {
        expect(session).toEqual(mockSession);
      });

      // THEN
      const req = httpMock.expectOne(API_PATH);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newSession);
      req.flush(mockSession);
    });
  });

  describe('update', () => {
    it('should update an existing session', () => {
      // GIVEN
      const sessionId = '1';
      const updatedSession: Session = {
        ...mockSession,
        name: 'Updated Yoga Session'
      };

      // WHEN
      service.update(sessionId, updatedSession).subscribe(session => {
        expect(session).toEqual(updatedSession);
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${sessionId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedSession);
      req.flush(updatedSession);
    });
  });

  describe('participate', () => {
    it('should add user participation to session', () => {
      // GIVEN
      const sessionId = '1';
      const userId = 'user3';

      // WHEN
      service.participate(sessionId, userId).subscribe();

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${sessionId}/participate/${userId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(null);
    });
  });

  describe('unParticipate', () => {
    it('should remove user participation from session', () => {
      // GIVEN
      const sessionId = '1';
      const userId = 'user2';

      // WHEN
      service.unParticipate(sessionId, userId).subscribe();

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${sessionId}/participate/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('error handling', () => {
    it('should handle error when fetching sessions', () => {
      // WHEN
      service.all().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      // THEN
      const req = httpMock.expectOne(API_PATH);
      req.flush('Error fetching sessions', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });

    it('should handle error when session not found', () => {
      // GIVEN
      const invalidId = 'invalid-id';

      // WHEN
      service.detail(invalidId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Session not found');
        }
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${invalidId}`);
      req.flush('Session not found', {
        status: 404,
        statusText: 'Session not found'
      });
    });
  });
});