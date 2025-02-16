package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void toDto_WithNullUser_ShouldReturnNull() {
        // Act
        UserDto result = userMapper.toDto((User) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toEntity_WithNullDto_ShouldReturnNull() {
        // Act
        User result = userMapper.toEntity((UserDto) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toDtoList_WithNullList_ShouldReturnNull() {
        // Act
        List<UserDto> result = userMapper.toDto((List<User>) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toEntityList_WithNullList_ShouldReturnNull() {
        // Act
        List<User> result = userMapper.toEntity((List<UserDto>) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toDtoList_WithEmptyList_ShouldReturnEmptyList() {
        // Arrange
        List<User> emptyList = new ArrayList<>();

        // Act
        List<UserDto> result = userMapper.toDto(emptyList);

        // Assert
        assertThat(result)
                .isNotNull()
                .isEmpty();
    }

    @Test
    void toEntityList_WithEmptyList_ShouldReturnEmptyList() {
        // Arrange
        List<UserDto> emptyList = new ArrayList<>();

        // Act
        List<User> result = userMapper.toEntity(emptyList);

        // Assert
        assertThat(result)
                .isNotNull()
                .isEmpty();
    }

    @Test
    void shouldMapUserToDto() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .id(1L)
                .email("test@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .admin(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        // Act
        UserDto dto = userMapper.toDto(user);

        // Assert
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getEmail()).isEqualTo("test@test.com");
        assertThat(dto.getFirstName()).isEqualTo("John");
        assertThat(dto.getLastName()).isEqualTo("Doe");
        assertThat(dto.isAdmin()).isTrue();
        assertThat(dto.getPassword()).isEqualTo("password");
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void shouldMapDtoToUser() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        UserDto dto = new UserDto(1L, "test@test.com", "Doe", "John", true, "password", now, now);

        // Act
        User user = userMapper.toEntity(dto);

        // Assert
        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getEmail()).isEqualTo("test@test.com");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.isAdmin()).isTrue();
        assertThat(user.getPassword()).isEqualTo("password");
        assertThat(user.getCreatedAt()).isEqualTo(now);
        assertThat(user.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void shouldMapUserListToDtoList() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        List<User> users = Arrays.asList(
                User.builder()
                        .id(1L)
                        .email("test1@test.com")
                        .firstName("John")
                        .lastName("Doe")
                        .password("password1")
                        .admin(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),
                User.builder()
                        .id(2L)
                        .email("test2@test.com")
                        .firstName("Jane")
                        .lastName("Smith")
                        .password("password2")
                        .admin(false)
                        .createdAt(now)
                        .updatedAt(now)
                        .build()
        );

        // Act
        List<UserDto> dtos = userMapper.toDto(users);

        // Assert
        assertThat(dtos).hasSize(2);
        assertThat(dtos.get(0).getEmail()).isEqualTo("test1@test.com");
        assertThat(dtos.get(1).getEmail()).isEqualTo("test2@test.com");
        assertThat(dtos.get(0).isAdmin()).isTrue();
        assertThat(dtos.get(1).isAdmin()).isFalse();
    }

    @Test
    void shouldMapDtoListToUserList() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        List<UserDto> dtos = Arrays.asList(
                new UserDto(1L, "test1@test.com", "Doe", "John", true, "password1", now, now),
                new UserDto(2L, "test2@test.com", "Smith", "Jane", false, "password2", now, now)
        );

        // Act
        List<User> users = userMapper.toEntity(dtos);

        // Assert
        assertThat(users).hasSize(2);
        assertThat(users.get(0).getEmail()).isEqualTo("test1@test.com");
        assertThat(users.get(1).getEmail()).isEqualTo("test2@test.com");
        assertThat(users.get(0).isAdmin()).isTrue();
        assertThat(users.get(1).isAdmin()).isFalse();
    }
}