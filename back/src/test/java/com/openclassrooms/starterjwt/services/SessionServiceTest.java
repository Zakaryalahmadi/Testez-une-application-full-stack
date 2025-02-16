package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @Test
    void shouldCreateSession() {
        // Arrange
        Session session = new Session();
        session.setName("Test Session");
        when(sessionRepository.save(session)).thenReturn(session);

        // Act
        Session result = sessionService.create(session);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Session");
        verify(sessionRepository).save(session);
    }

    @Test
    void shouldDeleteSession() {
        // Arrange
        Long sessionId = 1L;

        // Act
        sessionService.delete(sessionId);

        // Assert
        verify(sessionRepository).deleteById(sessionId);
    }

    @Test
    void shouldFindAllSessions() {
        // Arrange
        Session session1 = new Session();
        session1.setId(1L);
        Session session2 = new Session();
        session2.setId(2L);
        List<Session> sessions = Arrays.asList(session1, session2);
        when(sessionRepository.findAll()).thenReturn(sessions);

        // Act
        List<Session> result = sessionService.findAll();

        // Assert
        assertThat(result).hasSize(2);
        verify(sessionRepository).findAll();
    }

    @Test
    void shouldGetSessionById() {
        // Arrange
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // Act
        Session result = sessionService.getById(sessionId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(sessionId);
        verify(sessionRepository).findById(sessionId);
    }

    @Test
    void shouldUpdateSession() {
        // Arrange
        Long sessionId = 1L;
        Session session = new Session();
        session.setName("Updated Session");
        when(sessionRepository.save(session)).thenReturn(session);

        // Act
        Session result = sessionService.update(sessionId, session);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Updated Session");
        assertThat(result.getId()).isEqualTo(sessionId);
        verify(sessionRepository).save(session);
    }

    @Test
    void shouldParticipateInSession() {
        // Arrange
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>());
        User user = new User();
        user.setId(userId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(sessionRepository.save(session)).thenReturn(session);

        // Act
        sessionService.participate(sessionId, userId);

        // Assert
        assertThat(session.getUsers()).contains(user);
        verify(sessionRepository).findById(sessionId);
        verify(userRepository).findById(userId);
        verify(sessionRepository).save(session);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenSessionNotFoundForParticipation() {
        // Arrange
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> sessionService.participate(1L, 1L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void shouldThrowBadRequestExceptionWhenAlreadyParticipating() {
        // Arrange
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        User user = new User();
        user.setId(userId);
        session.setUsers(new ArrayList<>(Arrays.asList(user)));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void shouldNoLongerParticipateInSession() {
        // Arrange
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        User user = new User();
        user.setId(userId);
        session.setUsers(new ArrayList<>(Arrays.asList(user)));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(sessionRepository.save(session)).thenReturn(session);

        // Act
        sessionService.noLongerParticipate(sessionId, userId);

        // Assert
        assertThat(session.getUsers()).isEmpty();
        verify(sessionRepository).findById(sessionId);
        verify(sessionRepository).save(session);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenSessionNotFoundForNoLongerParticipate() {
        // Arrange
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 1L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void shouldThrowBadRequestExceptionWhenNotParticipating() {
        // Arrange
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // Act & Assert
        assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
    }
}