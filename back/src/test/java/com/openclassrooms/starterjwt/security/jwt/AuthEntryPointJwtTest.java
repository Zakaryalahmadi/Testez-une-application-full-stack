package com.openclassrooms.starterjwt.security.jwt;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthEntryPointJwtTest {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private AuthenticationException authException;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        authException = mock(AuthenticationException.class);
    }

    @Test
    void testShouldSetProperResponseAttributes() throws IOException, ServletException {
        // Arrange
        String expectedPath = "/api/test";
        String expectedMessage = "Unauthorized access";
        request.setServletPath(expectedPath);
        when(authException.getMessage()).thenReturn(expectedMessage);

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert
        assertThat(response.getContentType()).isEqualTo(MediaType.APPLICATION_JSON_VALUE);
        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);

        // Verify response body
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseBody = mapper.readValue(
                response.getContentAsString(),
                new TypeReference<Map<String, Object>>() {}
        );

        assertThat(responseBody)
                .containsEntry("status", HttpServletResponse.SC_UNAUTHORIZED)
                .containsEntry("error", "Unauthorized")
                .containsEntry("message", expectedMessage)
                .containsEntry("path", expectedPath);
    }

    @Test
    void testShouldHandleNullMessage() throws IOException, ServletException {
        // Arrange
        when(authException.getMessage()).thenReturn(null);

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseBody = mapper.readValue(
                response.getContentAsString(),
                new TypeReference<Map<String, Object>>() {}
        );

        assertThat(responseBody.get("message")).isNull();
    }

    @Test
    void commence_ShouldHandleEmptyPath() throws IOException, ServletException {
        // Arrange
        when(authException.getMessage()).thenReturn("Unauthorized access");

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseBody = mapper.readValue(
                response.getContentAsString(),
                new TypeReference<Map<String, Object>>() {}
        );

        assertThat(responseBody.get("path")).isEqualTo("");
    }
}