package com.openclassrooms.starterjwt;

import lombok.Generated;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Generated
@SpringBootApplication
@EnableJpaAuditing
public class SpringBootSecurityJwtApplication {
	public static void main(String[] args) {
    SpringApplication.run(SpringBootSecurityJwtApplication.class, args);
	}
}
