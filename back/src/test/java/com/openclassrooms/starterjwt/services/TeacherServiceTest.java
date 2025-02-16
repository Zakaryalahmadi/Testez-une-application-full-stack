package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    void shouldFindAllTeachers() {
        // Arrange
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("John");

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Jane");

        List<Teacher> expectedTeachers = Arrays.asList(teacher1, teacher2);
        when(teacherRepository.findAll()).thenReturn(expectedTeachers);

        // Act
        List<Teacher> result = teacherService.findAll();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).containsExactlyElementsOf(expectedTeachers);
        verify(teacherRepository).findAll();
        verifyNoMoreInteractions(teacherRepository);
    }

    @Test
    void shouldFindTeacherById() {
        // Arrange
        Long teacherId = 1L;
        Teacher expectedTeacher = new Teacher();
        expectedTeacher.setId(teacherId);
        expectedTeacher.setFirstName("John");
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(expectedTeacher));

        // Act
        Teacher result = teacherService.findById(teacherId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(teacherId);
        assertThat(result.getFirstName()).isEqualTo("John");
        verify(teacherRepository).findById(teacherId);
        verifyNoMoreInteractions(teacherRepository);
    }

    @Test
    void shouldReturnNullWhenTeacherNotFound() {
        // Arrange
        Long teacherId = 1L;
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        // Act
        Teacher result = teacherService.findById(teacherId);

        // Assert
        assertThat(result).isNull();
        verify(teacherRepository).findById(teacherId);
        verifyNoMoreInteractions(teacherRepository);
    }

    @Test
    void shouldReturnEmptyListWhenNoTeachers() {
        // Arrange
        when(teacherRepository.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<Teacher> result = teacherService.findAll();

        // Assert
        assertThat(result).isEmpty();
        verify(teacherRepository).findAll();
        verifyNoMoreInteractions(teacherRepository);
    }
}