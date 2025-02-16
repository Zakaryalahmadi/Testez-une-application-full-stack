package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();
    }

    @Test
    void testWithValidTokenShouldSetAuthentication() throws ServletException, IOException {
        // Arrange
        String token = "valid.jwt.token";
        String username = "test@test.com";
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .username(username)
                .build();

        request.addHeader("Authorization", "Bearer " + token);

        when(jwtUtils.validateJwtToken(token)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .isEqualTo(userDetails);
        verify(filterChain).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
    }

    @Test
    void testWithInvalidTokenShouldNotSetAuthentication() throws ServletException, IOException {
        // Arrange
        String token = "invalid.jwt.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtUtils.validateJwtToken(token)).thenReturn(false);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void testWithNoTokenShouldNotSetAuthentication() throws ServletException, IOException {
        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
        verify(jwtUtils, never()).validateJwtToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void testWithMalformedAuthorizationHeaderShouldNotSetAuthentication() throws ServletException, IOException {
        // Arrange
        request.addHeader("Authorization", "malformed_header");

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
        verify(jwtUtils, never()).validateJwtToken(anyString());
    }

    @Test
    void testWhenExceptionOccursShouldContinueChain() throws ServletException, IOException {
        // Arrange
        String token = "valid.jwt.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtUtils.validateJwtToken(token)).thenThrow(new RuntimeException("Token validation failed"));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
    }
}