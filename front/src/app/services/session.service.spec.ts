import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('SessionService', () => {
  let service: SessionService;

  // Mock des données de session
  const mockSessionInfo: SessionInformation = {
    token: 'fake-jwt-token',
    type: 'Bearer',
    id: 1,
    username: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with user logged out', () => {
      // THEN
      expect(service.isLogged).toBeFalsy();
      expect(service.sessionInformation).toBeUndefined();
    });

    it('should emit initial logged out state', (done) => {
      // WHEN
      service.$isLogged().subscribe(isLogged => {
        // THEN
        expect(isLogged).toBeFalsy();
        done();
      });
    });
  });

  describe('logIn', () => {
    it('should update session information and logged state', () => {
      // WHEN
      service.logIn(mockSessionInfo);

      // THEN
      expect(service.isLogged).toBeTruthy();
      expect(service.sessionInformation).toEqual(mockSessionInfo);
    });

    it('should emit logged in state', (done) => {
      // WHEN
      service.logIn(mockSessionInfo);

      // THEN
      service.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBeTruthy();
        done();
      });
    });
  });

  describe('logOut', () => {
    beforeEach(() => {
      // Set initial logged in state
      service.logIn(mockSessionInfo);
    });

    it('should clear session information and update logged state', () => {
      // WHEN
      service.logOut();

      // THEN
      expect(service.isLogged).toBeFalsy();
      expect(service.sessionInformation).toBeUndefined();
    });

    it('should emit logged out state', (done) => {
      // WHEN
      service.logOut();

      // THEN
      service.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBeFalsy();
        done();
      });
    });
  });

  describe('$isLogged Observable', () => {
    it('should emit new value when logging in', (done) => {
      // GIVEN
      let emissionCount = 0;
      const expectedStates = [false, true]; // Initial state, then logged in state

      service.$isLogged().subscribe(isLogged => {
        // THEN
        expect(isLogged).toBe(expectedStates[emissionCount]);
        emissionCount++;
        
        if (emissionCount === expectedStates.length) {
          done();
        }
      });

      // WHEN
      service.logIn(mockSessionInfo);
    });

    it('should emit new value when logging out', (done) => {
      // GIVEN
      service.logIn(mockSessionInfo);
      let emissionCount = 0;
      const expectedStates = [true, false]; // Initial logged in state, then logged out state

      service.$isLogged().subscribe(isLogged => {
        // THEN
        expect(isLogged).toBe(expectedStates[emissionCount]);
        emissionCount++;
        
        if (emissionCount === expectedStates.length) {
          done();
        }
      });

      // WHEN
      service.logOut();
    });
  });

  describe('State consistency', () => {
    it('should maintain consistent state through multiple login/logout cycles', () => {
      // First cycle
      service.logIn(mockSessionInfo);
      expect(service.isLogged).toBeTruthy();
      expect(service.sessionInformation).toEqual(mockSessionInfo);

      service.logOut();
      expect(service.isLogged).toBeFalsy();
      expect(service.sessionInformation).toBeUndefined();

      // Second cycle
      service.logIn(mockSessionInfo);
      expect(service.isLogged).toBeTruthy();
      expect(service.sessionInformation).toEqual(mockSessionInfo);

      service.logOut();
      expect(service.isLogged).toBeFalsy();
      expect(service.sessionInformation).toBeUndefined();
    });
  });
});