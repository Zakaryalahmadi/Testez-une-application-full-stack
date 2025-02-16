package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TeacherMapperTest {

    @Autowired
    private TeacherMapper teacherMapper;

    @Test
    void toDto_WithNullTeacher_ShouldReturnNull() {
        // Act
        TeacherDto result = teacherMapper.toDto((Teacher) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toEntity_WithNullDto_ShouldReturnNull() {
        // Act
        Teacher result = teacherMapper.toEntity((TeacherDto) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toDtoList_WithNullList_ShouldReturnNull() {
        // Act
        List<TeacherDto> result = teacherMapper.toDto((List<Teacher>) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toEntityList_WithNullList_ShouldReturnNull() {
        // Act
        List<Teacher> result = teacherMapper.toEntity((List<TeacherDto>) null);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void toDtoList_WithEmptyList_ShouldReturnEmptyList() {
        // Arrange
        List<Teacher> emptyList = new ArrayList<>();

        // Act
        List<TeacherDto> result = teacherMapper.toDto(emptyList);

        // Assert
        assertThat(result)
                .isNotNull()
                .isEmpty();
    }

    @Test
    void toEntityList_WithEmptyList_ShouldReturnEmptyList() {
        // Arrange
        List<TeacherDto> emptyList = new ArrayList<>();

        // Act
        List<Teacher> result = teacherMapper.toEntity(emptyList);

        // Assert
        assertThat(result)
                .isNotNull()
                .isEmpty();
    }

    @Test
    void shouldMapTeacherToDto() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .createdAt(now)
                .updatedAt(now)
                .build();

        // Act
        TeacherDto dto = teacherMapper.toDto(teacher);

        // Assert
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getFirstName()).isEqualTo("John");
        assertThat(dto.getLastName()).isEqualTo("Doe");
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void shouldMapDtoToTeacher() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        TeacherDto dto = new TeacherDto(1L, "Doe", "John", now, now);

        // Act
        Teacher teacher = teacherMapper.toEntity(dto);

        // Assert
        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getFirstName()).isEqualTo("John");
        assertThat(teacher.getLastName()).isEqualTo("Doe");
        assertThat(teacher.getCreatedAt()).isEqualTo(now);
        assertThat(teacher.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void shouldMapTeacherListToDtoList() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        List<Teacher> teachers = Arrays.asList(
                Teacher.builder().id(1L).firstName("John").lastName("Doe").createdAt(now).build(),
                Teacher.builder().id(2L).firstName("Jane").lastName("Smith").createdAt(now).build()
        );

        // Act
        List<TeacherDto> dtos = teacherMapper.toDto(teachers);

        // Assert
        assertThat(dtos).hasSize(2);
        assertThat(dtos.get(0).getFirstName()).isEqualTo("John");
        assertThat(dtos.get(1).getFirstName()).isEqualTo("Jane");
    }

    @Test
    void shouldMapDtoListToTeacherList() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        List<TeacherDto> dtos = Arrays.asList(
                new TeacherDto(1L, "Doe", "John", now, now),
                new TeacherDto(2L, "Smith", "Jane", now, now)
        );

        // Act
        List<Teacher> teachers = teacherMapper.toEntity(dtos);

        // Assert
        assertThat(teachers).hasSize(2);
        assertThat(teachers.get(0).getFirstName()).isEqualTo("John");
        assertThat(teachers.get(1).getFirstName()).isEqualTo("Jane");
    }
}