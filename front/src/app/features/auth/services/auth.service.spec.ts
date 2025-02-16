import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const API_PATH = 'api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should send POST request to register endpoint', () => {
      // GIVEN
      const mockRegisterRequest: RegisterRequest = {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      // WHEN
      service.register(mockRegisterRequest).subscribe();

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRegisterRequest);

      req.flush(null);
    });
  });

  describe('login', () => {
    it('should send POST request to login endpoint and return session information', () => {
      // GIVEN
      const mockLoginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'password123',
      };

      const mockSessionInformation: SessionInformation = {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
      };

      // WHEN
      service.login(mockLoginRequest).subscribe((response) => {
        expect(response).toEqual(mockSessionInformation);
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);

      req.flush(mockSessionInformation); // Simule la réponse avec les données de session
    });
  });

  describe('error handling', () => {
    it('should handle register error', () => {
      // GIVEN
      const mockRegisterRequest: RegisterRequest = {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };
      const errorMessage = 'Registration failed';

      // WHEN
      service.register(mockRegisterRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/register`);
      req.flush(errorMessage, { status: 400, statusText: errorMessage });
    });

    it('should handle login error', () => {
      // GIVEN
      const mockLoginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'wrong-password',
      };
      const errorMessage = 'Invalid credentials';

      // WHEN
      service.login(mockLoginRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      // THEN
      const req = httpMock.expectOne(`${API_PATH}/login`);
      req.flush(errorMessage, { status: 401, statusText: errorMessage });
    });
  });
});
