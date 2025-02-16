package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;

@Profile("test")
@RestController
@RequestMapping("/api/test")
public class TestController {

    private final UserRepository userRepository;

    private final JdbcTemplate jdbcTemplate;

    private  final PasswordEncoder passwordEncoder;

    public TestController(UserRepository userRepository, JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/reset-db")
    @Transactional
    public ResponseEntity<String> resetDatabase() {
        try {
            jdbcTemplate.execute("DELETE FROM PARTICIPATE");

            jdbcTemplate.execute("DELETE FROM USERS");

            String sql = "INSERT INTO USERS (email, password, first_name, last_name, admin, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)";

            jdbcTemplate.update(sql,
                    "yoga@studio.com",
                    passwordEncoder.encode("123456"),
                    "John",
                    "Doe",
                    false,
                    new Timestamp(System.currentTimeMillis()),
                    new Timestamp(System.currentTimeMillis())
            );

            return ResponseEntity.ok("Database reset successful");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during database reset: " + e.getMessage());
        }
    }
}