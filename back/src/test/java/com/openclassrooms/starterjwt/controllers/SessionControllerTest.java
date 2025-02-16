package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    private final String BASE_URL = "/api/session";

    @Test
    void testShouldGetSessionById() throws Exception {
        // Given
        Session mockSession = createMockSession();
        SessionDto mockSessionDto = createMockSessionDto();

        when(sessionService.getById(1L)).thenReturn(mockSession);
        when(sessionMapper.toDto(mockSession)).thenReturn(mockSessionDto);

        // When & Then
        mockMvc.perform(get(BASE_URL + "/{id}", 1L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Yoga Session"))
                .andExpect(jsonPath("$.description").value("Beginner yoga class"));

        verify(sessionService).getById(1L);
        verify(sessionMapper).toDto(mockSession);
    }

    @Test
    void testShouldReturnNotFoundWhenSessionDoesNotExist() throws Exception {
        // Given
        when(sessionService.getById(999L)).thenReturn(null);

        // When & Then
        mockMvc.perform(get(BASE_URL + "/{id}", 999L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testShouldGetAllSessions() throws Exception {
        // Given
        List<Session> mockSessions = Arrays.asList(createMockSession(), createMockSession());
        List<SessionDto> mockSessionDtos = Arrays.asList(createMockSessionDto(), createMockSessionDto());

        when(sessionService.findAll()).thenReturn(mockSessions);
        when(sessionMapper.toDto(mockSessions)).thenReturn(mockSessionDtos);

        // When & Then
        mockMvc.perform(get(BASE_URL)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void testShouldCreateSession() throws Exception {
        // Given
        SessionDto inputDto = createMockSessionDto();
        Session mockSession = createMockSession();

        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(mockSession);
        when(sessionService.create(any(Session.class))).thenReturn(mockSession);
        when(sessionMapper.toDto(mockSession)).thenReturn(inputDto);

        // When & Then
        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Session"));
    }

    @Test
    void testShouldUpdateSession() throws Exception {
        // Given
        SessionDto inputDto = createMockSessionDto();
        Session mockSession = createMockSession();

        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(mockSession);
        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(mockSession);
        when(sessionMapper.toDto(mockSession)).thenReturn(inputDto);

        // When & Then
        mockMvc.perform(put(BASE_URL + "/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(inputDto)))
                .andExpect(status().isOk());
    }

    @Test
    void testShouldDeleteSession() throws Exception {
        // Given
        Session mockSession = createMockSession();
        when(sessionService.getById(1L)).thenReturn(mockSession);

        // When & Then
        mockMvc.perform(delete(BASE_URL + "/{id}", 1L))
                .andExpect(status().isOk());

        verify(sessionService).delete(1L);
    }

    @Test
    void testShouldParticipateInSession() throws Exception {
        // When & Then
        mockMvc.perform(post(BASE_URL + "/{id}/participate/{userId}", 1L, 1L))
                .andExpect(status().isOk());

        verify(sessionService).participate(1L, 1L);
    }

    @Test
    void testShouldNoLongerParticipateInSession() throws Exception {
        // When & Then
        mockMvc.perform(delete(BASE_URL + "/{id}/participate/{userId}", 1L, 1L))
                .andExpect(status().isOk());

        verify(sessionService).noLongerParticipate(1L, 1L);
    }

    private Session createMockSession() {
        return Session.builder()
                .id(1L)
                .name("Yoga Session")
                .description("Beginner yoga class")
                .date(new Date())
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
    }

    private SessionDto createMockSessionDto() {
        return new SessionDto(
                1L,
                "Yoga Session",
                new Date(),
                1L,
                "Beginner yoga class",
                new ArrayList<>(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    private String asJsonString(final Object obj) {
        try {
            return new ObjectMapper()
                    .registerModule(new JavaTimeModule())
                    .writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
