package com.openclassrooms.starterjwt.controllers;


import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private TeacherMapper teacherMapper;

    private final String BASE_URL = "/api/teacher";

    @Test
    void testShouldGetTeacherById() throws Exception {
        // Given
        Teacher mockTeacher = Teacher.builder()
                .id(1L)
                .lastName("Doe")
                .firstName("John")
                .build();

        TeacherDto mockTeacherDto = new TeacherDto();
        mockTeacherDto.setId(1L);
        mockTeacherDto.setLastName("Doe");
        mockTeacherDto.setFirstName("John");

        when(teacherService.findById(1L)).thenReturn(mockTeacher);
        when(teacherMapper.toDto(mockTeacher)).thenReturn(mockTeacherDto);

        // When & Then
        mockMvc.perform(get(BASE_URL + "/{id}", 1L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.firstName").value("John"));

        verify(teacherService).findById(1L);
        verify(teacherMapper).toDto(mockTeacher);
        verifyNoMoreInteractions(teacherService, teacherMapper);
    }

    @Test
    void testShouldReturnNotFoundWhenTeacherDoesNotExist() throws Exception {
        // Given
        when(teacherService.findById(999L)).thenReturn(null);

        // When & Then
        mockMvc.perform(get(BASE_URL + "/{id}", 999L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(teacherService).findById(999L);
        verifyNoMoreInteractions(teacherService);
    }

    @Test
    void testShouldReturnBadRequestWhenInvalidId() throws Exception {
        // When & Then
        mockMvc.perform(get(BASE_URL + "/{id}", "invalid")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(teacherService);
    }

    @Test
    void testShouldGetAllTeachers() throws Exception {
        // Given
        List<Teacher> mockTeachers = Arrays.asList(
                Teacher.builder().id(1L).lastName("Doe").firstName("John").build(),
                Teacher.builder().id(2L).lastName("Smith").firstName("Jane").build()
        );

        List<TeacherDto> mockTeacherDtos = Arrays.asList(
                new TeacherDto(1L, "Doe", "John", null, null),
                new TeacherDto(2L, "Smith", "Jane", null, null)
        );

        when(teacherService.findAll()).thenReturn(mockTeachers);
        when(teacherMapper.toDto(mockTeachers)).thenReturn(mockTeacherDtos);

        // When & Then
        mockMvc.perform(get(BASE_URL)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].lastName").value("Doe"))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].lastName").value("Smith"))
                .andExpect(jsonPath("$[1].firstName").value("Jane"));

        verify(teacherService).findAll();
        verify(teacherMapper).toDto(mockTeachers);
        verifyNoMoreInteractions(teacherService, teacherMapper);
    }
}