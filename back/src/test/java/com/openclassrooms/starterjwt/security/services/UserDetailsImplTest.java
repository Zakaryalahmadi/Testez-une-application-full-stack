package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.assertj.core.api.Assertions.assertThat;

class UserDetailsImplTest {

    @Test
    void builder_ShouldCreateUserDetailsImpl_WithAllProperties() {
        // Arrange & Act
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password123")
                .admin(false)
                .build();

        // Assert
        assertThat(userDetails.getId()).isEqualTo(1L);
        assertThat(userDetails.getUsername()).isEqualTo("test@test.com");
        assertThat(userDetails.getFirstName()).isEqualTo("John");
        assertThat(userDetails.getLastName()).isEqualTo("Doe");
        assertThat(userDetails.getPassword()).isEqualTo("password123");
        assertThat(userDetails.getAdmin()).isFalse();
    }

    @Test
    void getAuthorities_ShouldReturnEmptySet() {
        // Arrange
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // Act
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // Assert
        assertThat(authorities).isEmpty();
    }

    @Test
    void accountStatus_ShouldAlwaysReturnTrue() {
        // Arrange
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // Assert
        assertThat(userDetails.isAccountNonExpired()).isTrue();
        assertThat(userDetails.isAccountNonLocked()).isTrue();
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
        assertThat(userDetails.isEnabled()).isTrue();
    }

    @Test
    void equals_ShouldReturnFalse_WhenDifferentId() {
        // Arrange
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(2L).build();

        // Act & Assert
        assertThat(user1).isNotEqualTo(user2);
    }

    @Test
    void equals_ShouldReturnFalse_WhenComparedWithNull() {
        // Arrange
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        // Act & Assert
        assertThat(user).isNotEqualTo(null);
    }

    @Test
    void equals_ShouldReturnFalse_WhenComparedWithDifferentClass() {
        // Arrange
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();
        Object differentObject = new Object();

        // Act & Assert
        assertThat(user).isNotEqualTo(differentObject);
    }
}