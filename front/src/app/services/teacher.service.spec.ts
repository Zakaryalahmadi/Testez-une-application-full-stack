import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';
import { expect } from '@jest/globals';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;
  const API_PATH = 'api/teacher';

  // Mock d'un enseignant pour les tests
  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should return all teachers', () => {
      // GIVEN
      const mockTeachers: Teacher[] = [mockTeacher];

      // WHEN
      service.all().subscribe(teachers => {
        // THEN
        expect(teachers).toEqual(mockTeachers);
        expect(teachers.length).toBe(1);
      });

      // THEN
      const req = httpMock.expectOne(API_PATH);
      expect(req.request.method).toBe('GET');
      req.flush(mockTeachers);
    });

    it('should handle empty response', () => {
      // WHEN
      service.all().subscribe(teachers => {
        // THEN
        expect(teachers).toEqual([]);
        expect(teachers.length).toBe(0);
      });

      // THEN
      const req = httpMock.expectOne(API_PATH);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle error response', () => {
      // WHEN
      service.all().subscribe({
        error: (error) => {
          // THEN
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      // THEN
      const req = httpMock.expectOne(API_PATH);
      req.flush('Error fetching teachers', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('detail', () => {
    it('should return a specific teacher', () => {
      // GIVEN
      const teacherId = '1';

      // WHEN
      service.detail(teacherId).subscribe(teacher => {
        // THEN
        expect(teacher).toEqual(mockTeacher);
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${teacherId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTeacher);
    });

    it('should handle teacher not found', () => {
      // GIVEN
      const invalidId = 'invalid-id';

      // WHEN
      service.detail(invalidId).subscribe({
        error: (error) => {
          // THEN
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Teacher not found');
        }
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${invalidId}`);
      req.flush('Teacher not found', {
        status: 404,
        statusText: 'Teacher not found'
      });
    });

    it('should handle server error', () => {
      // GIVEN
      const teacherId = '1';

      // WHEN
      service.detail(teacherId).subscribe({
        error: (error) => {
          // THEN
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${teacherId}`);
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('URL formation', () => {
    it('should form correct URL for all teachers', () => {
      // WHEN
      service.all().subscribe();

      // THEN
      const req = httpMock.expectOne(API_PATH);
      expect(req.request.url).toBe(API_PATH);
      req.flush([]);
    });

    it('should form correct URL for teacher detail', () => {
      // GIVEN
      const teacherId = '1';

      // WHEN
      service.detail(teacherId).subscribe();

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${teacherId}`);
      expect(req.request.url).toBe(`${API_PATH}/${teacherId}`);
      req.flush(mockTeacher);
    });
  });
});