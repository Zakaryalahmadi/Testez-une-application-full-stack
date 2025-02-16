package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    private static final String SECRET = "bezKoderSecretKey";
    private static final int EXPIRATION = 86400000;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", EXPIRATION);
    }

    @Test
    void generateJwtToken_ShouldGenerateValidToken() {
        // Arrange
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .username("test@test.com")
                .build();
        when(authentication.getPrincipal()).thenReturn(userDetails);

        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertThat(token).isNotNull();
        assertThat(jwtUtils.validateJwtToken(token)).isTrue();
        assertThat(jwtUtils.getUserNameFromJwtToken(token)).isEqualTo("test@test.com");
    }

    @Test
    void validateJwtToken_WithValidToken_ShouldReturnTrue() {
        // Arrange
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .username("test@test.com")
                .build();
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        // Act & Assert
        assertThat(jwtUtils.validateJwtToken(token)).isTrue();
    }

    @Test
    void validateJwtToken_WithInvalidSignature_ShouldReturnFalse() {
        // Arrange
        String invalidToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjE5NTU2NjU3LCJleHAiOjE2MTk2NDMwNTd9.invalid_signature";

        // Act & Assert
        assertThat(jwtUtils.validateJwtToken(invalidToken)).isFalse();
    }

    @Test
    void validateJwtToken_WithMalformedToken_ShouldReturnFalse() {
        // Arrange
        String malformedToken = "malformed.token.here";

        // Act & Assert
        assertThat(jwtUtils.validateJwtToken(malformedToken)).isFalse();
    }

    @Test
    void validateJwtToken_WithExpiredToken_ShouldReturnFalse() {
        // Arrange
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -86400000); // Set negative expiration
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .username("test@test.com")
                .build();
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String expiredToken = jwtUtils.generateJwtToken(authentication);

        // Act & Assert
        assertThat(jwtUtils.validateJwtToken(expiredToken)).isFalse();
    }

    @Test
    void validateJwtToken_WithUnsupportedToken_ShouldReturnFalse() {
        // Arrange
        String unsupportedToken = "unsupported.token.format";

        // Act & Assert
        assertThat(jwtUtils.validateJwtToken(unsupportedToken)).isFalse();
    }

    @Test
    void validateJwtToken_WithEmptyToken_ShouldReturnFalse() {
        // Act & Assert
        assertThat(jwtUtils.validateJwtToken("")).isFalse();
    }

    @Test
    void getUserNameFromJwtToken_WithValidToken_ShouldReturnUsername() {
        // Arrange
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .username("test@test.com")
                .build();
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // Assert
        assertThat(username).isEqualTo("test@test.com");
    }
}