package com.openclassrooms.starterjwt.controllers;


import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    private User testUser;

    private UserDto testUserDto;

    private final String BASE_URL = "/api/user";

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .admin(false)
                .build();

        testUserDto = new UserDto();
        testUserDto.setId(1L);
        testUserDto.setEmail("test@test.com");
        testUserDto.setFirstName("John");
        testUserDto.setLastName("Doe");
        testUserDto.setAdmin(false);
    }

    @Test
    @WithMockUser
    void testShouldGetUserById() throws Exception {
        // Given
        when(userService.findById(1L)).thenReturn(testUser);
        when(userMapper.toDto(testUser)).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(get(BASE_URL + "/{id}", 1L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("test@test.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));

        verify(userService).findById(1L);
        verify(userMapper).toDto(testUser);
    }

    @Test
    void testShouldReturnNotFoundWhenUserDoesNotExist() throws Exception {
        // Given
        when(userService.findById(999L)).thenThrow(new NotFoundException());

        // When & Then
        mockMvc.perform(get(BASE_URL + "/{id}", 999L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(userService).findById(999L);
        verifyNoMoreInteractions(userService);
    }

    @Test
    void testShouldReturnBadRequestWhenInvalidId() throws Exception {
        mockMvc.perform(get(BASE_URL + "/{id}", "invalid")
                    .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(userService);
    }

    @Test
    @WithMockUser
    void testShouldReturnNotFoundWhenDeletingNonExistentUser() throws Exception {
        // Given
        when(userService.findById(999L)).thenReturn(null);

        // When & Then
        mockMvc.perform(delete(BASE_URL + "/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(userService).findById(999L);
        verifyNoMoreInteractions(userService);
    }

    @Test
    @WithMockUser(username = "wrongUser")
    void testShouldReturnUnauthorizedWhenDeletingOtherUserAccount() throws Exception {
        when(userService.findById(1L)).thenReturn(testUser);

        // When & Then
        mockMvc.perform(delete(BASE_URL + "/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

        verify(userService).findById(1L);
        verifyNoMoreInteractions(userService);
    }
}