package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
class SessionMapperTest {

    @Autowired
    private SessionMapper sessionMapper;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private UserService userService;

    @Test
    void toDto_WithNullSession_ShouldReturnNull() {
        // Act
        SessionDto result = sessionMapper.toDto((Session) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toDto_WithNullFields_ShouldMapCorrectly() {
        // Arrange
        Session session = Session.builder()
                .id(1L)
                .name("Test Session")
                .teacher(null)
                .users(null)
                .build();

        // Act
        SessionDto dto = sessionMapper.toDto(session);

        // Assert
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Test Session");
        assertThat(dto.getTeacher_id()).isNull();
        assertThat(dto.getUsers()).isEmpty();
    }

    @Test
    void toDto_WithEmptyUsers_ShouldMapCorrectly() {
        // Arrange
        Session session = Session.builder()
                .id(1L)
                .name("Test Session")
                .users(Collections.emptyList())
                .build();

        // Act
        SessionDto dto = sessionMapper.toDto(session);

        // Assert
        assertThat(dto.getUsers()).isEmpty();
    }

    @Test
    void toEntity_WithNullDto_ShouldReturnNull() {
        // Act
        Session result = sessionMapper.toEntity((SessionDto) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toEntity_WithNullTeacherId_ShouldMapCorrectly() {
        // Arrange
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Test Session");
        dto.setTeacher_id(null);

        // Act
        Session session = sessionMapper.toEntity(dto);

        // Assert
        assertThat(session.getId()).isEqualTo(1L);
        assertThat(session.getName()).isEqualTo("Test Session");
        assertThat(session.getTeacher()).isNull();
    }

    @Test
    void toEntity_WithNonExistentTeacher_ShouldMapWithoutTeacher() {
        // Arrange
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setTeacher_id(999L);
        when(teacherService.findById(999L)).thenReturn(null);

        // Act
        Session session = sessionMapper.toEntity(dto);

        // Assert
        assertThat(session.getTeacher()).isNull();
    }

    @Test
    void toEntity_WithNonExistentUsers_ShouldMapNullUsers() {
        // Arrange
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setUsers(Arrays.asList(999L));
        when(userService.findById(999L)).thenReturn(null);

        // Act
        Session session = sessionMapper.toEntity(dto);

        // Assert
        assertThat(session.getUsers()).hasSize(1).containsExactly((User) null);
    }

    @Test
    void toEntity_WithMixedExistingAndNonExistingUsers_ShouldMapAllUsers() {
        // Arrange
        User existingUser = User.builder()
                .id(1L)
                .email("john@ecole.fr")
                .firstName("John")
                .lastName("Doe")
                .password("password123")
                .admin(false)
                .build();

        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setUsers(Arrays.asList(1L, 999L));

        when(userService.findById(1L)).thenReturn(existingUser);
        when(userService.findById(999L)).thenReturn(null);

        // Act
        Session session = sessionMapper.toEntity(dto);

        // Assert
        assertThat(session.getUsers())
                .isNotNull()
                .hasSize(2)
                .containsExactly(existingUser, null);
    }

    @Test
    void shouldMapDtoToSession() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        Date sessionDate = new Date();

        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .build();

        User user1 = User.builder()
                .id(1L)
                .email("user1@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .admin(false)
                .build();

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(1L)).thenReturn(user1);

        SessionDto dto = new SessionDto(
                1L, "Test Session", sessionDate, 1L,
                "Description", Arrays.asList(1L),
                now, now
        );

        // Act
        Session session = sessionMapper.toEntity(dto);

        // Assert
        assertThat(session.getId()).isEqualTo(1L);
        assertThat(session.getName()).isEqualTo("Test Session");
        assertThat(session.getDate()).isEqualTo(sessionDate);
        assertThat(session.getDescription()).isEqualTo("Description");
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).hasSize(1);
        assertThat(session.getUsers().get(0)).isEqualTo(user1);
    }

    @Test
    void shouldMapSessionToDto() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        Date sessionDate = new Date();

        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .build();

        User user1 = User.builder()
                .id(1L)
                .email("user1@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .admin(false)
                .build();

        User user2 = User.builder()
                .id(2L)
                .email("user2@test.com")
                .firstName("Jane")
                .lastName("Smith")
                .password("password")
                .admin(false)
                .build();

        Session session = Session.builder()
                .id(1L)
                .name("Test Session")
                .date(sessionDate)
                .description("Description")
                .teacher(teacher)
                .users(Arrays.asList(user1, user2))
                .createdAt(now)
                .updatedAt(now)
                .build();

        // Act
        SessionDto dto = sessionMapper.toDto(session);

        // Assert
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Test Session");
        assertThat(dto.getDate()).isEqualTo(sessionDate);
        assertThat(dto.getDescription()).isEqualTo("Description");
        assertThat(dto.getTeacher_id()).isEqualTo(1L);
        assertThat(dto.getUsers()).containsExactly(1L, 2L);
    }
}