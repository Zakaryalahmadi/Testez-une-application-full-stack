package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void testShouldReturnUserDetailsWhenUserExists() {
        // Arrange
        String email = "test@test.com";
        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password123");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        UserDetails result = userDetailsService.loadUserByUsername(email);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(UserDetailsImpl.class);
        UserDetailsImpl userDetails = (UserDetailsImpl) result;
        assertThat(userDetails.getId()).isEqualTo(user.getId());
        assertThat(userDetails.getUsername()).isEqualTo(user.getEmail());
        assertThat(userDetails.getFirstName()).isEqualTo(user.getFirstName());
        assertThat(userDetails.getLastName()).isEqualTo(user.getLastName());
        assertThat(userDetails.getPassword()).isEqualTo(user.getPassword());

        verify(userRepository).findByEmail(email);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void testShouldThrowExceptionWhenUserNotFound() {
        // Arrange
        String email = "nonexistent@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email)
        );

        assertThat(exception.getMessage()).isEqualTo("User Not Found with email: " + email);
        verify(userRepository).findByEmail(email);
        verifyNoMoreInteractions(userRepository);
    }
}