package com.fsad.assignment.config;

import com.fsad.assignment.entity.User;
import com.fsad.assignment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserEmailNormalizationRunner implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        List<User> users = userRepository.findAll();
        boolean updated = false;
        
        for (User user : users) {
            String currentEmail = user.getEmail();
            if (currentEmail != null && !currentEmail.equals(currentEmail.trim().toLowerCase())) {
                user.setEmail(currentEmail.trim().toLowerCase());
                userRepository.save(user);
                updated = true;
            }
        }
        
        if (updated) {
            System.out.println("Normalized mixed-case emails for existing users in the database.");
        }
    }
}
