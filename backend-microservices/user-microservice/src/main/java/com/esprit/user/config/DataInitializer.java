package com.esprit.user.config;

import com.esprit.user.entities.Role;
import com.esprit.user.entities.User;
import com.esprit.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User(
                        "Admin",
                        "Dakar",
                        "admin@dakar.sn",
                        passwordEncoder.encode("password123"),
                        Role.ADMIN));

                userRepository.save(new User(
                        "Agent",
                        "Dakar",
                        "agent@dakar.sn",
                        passwordEncoder.encode("password123"),
                        Role.AGENT));

                userRepository.save(new User(
                        "Citoyen",
                        "Dakar",
                        "citoyen@dakar.sn",
                        passwordEncoder.encode("password123"),
                        Role.CITOYEN));

                System.out.println("Test users initialized: admin@dakar.sn, agent@dakar.sn, citoyen@dakar.sn");
            }
        };
    }
}
