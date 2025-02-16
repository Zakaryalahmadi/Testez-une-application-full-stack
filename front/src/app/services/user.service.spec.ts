import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';
import { expect } from '@jest/globals';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const API_PATH = 'api/user';

  // Mock d'un utilisateur pour les tests
  const mockUser: User = {
    id: 1,
    email: 'john.doe@example.com',
    lastName: 'Doe',
    firstName: 'John',
    password: 'hashedPassword',
    admin: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {
    it('should return a user by id', () => {
      // GIVEN
      const userId = '1';

      // WHEN
      service.getById(userId).subscribe(user => {
        // THEN
        expect(user).toEqual(mockUser);
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle user not found', () => {
      // GIVEN
      const invalidId = 'invalid-id';

      // WHEN
      service.getById(invalidId).subscribe({
        error: (error) => {
          // THEN
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('User not found');
        }
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${invalidId}`);
      req.flush('User not found', {
        status: 404,
        statusText: 'User not found'
      });
    });

    it('should handle server error', () => {
      // GIVEN
      const userId = '1';

      // WHEN
      service.getById(userId).subscribe({
        error: (error) => {
          // THEN
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${userId}`);
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('delete', () => {
    it('should delete a user', () => {
      // GIVEN
      const userId = '1';

      // WHEN
      service.delete(userId).subscribe(response => {
        // THEN
        expect(response).toBeNull();
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle deletion of non-existent user', () => {
      // GIVEN
      const invalidId = 'invalid-id';

      // WHEN
      service.delete(invalidId).subscribe({
        error: (error) => {
          // THEN
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('User not found');
        }
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${invalidId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('User not found', {
        status: 404,
        statusText: 'User not found'
      });
    });

    it('should handle server error during deletion', () => {
      // GIVEN
      const userId = '1';

      // WHEN
      service.delete(userId).subscribe({
        error: (error) => {
          // THEN
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('URL formation', () => {
    it('should form correct URL for getting user by id', () => {
      // GIVEN
      const userId = '1';

      // WHEN
      service.getById(userId).subscribe();

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${userId}`);
      expect(req.request.url).toBe(`${API_PATH}/${userId}`);
      req.flush(mockUser);
    });

    it('should form correct URL for deleting user', () => {
      // GIVEN
      const userId = '1';

      // WHEN
      service.delete(userId).subscribe();

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/${userId}`);
      expect(req.request.url).toBe(`${API_PATH}/${userId}`);
      req.flush(null);
    });
  });
});