package com.fsad.assignment.config;

import com.fsad.assignment.entity.User;
import com.fsad.assignment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEmailNormalizationRunner implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting automated email normalization migration...");
        List<User> users = userRepository.findAll();
        int updatedCount = 0;
        
        for (User user : users) {
            String currentEmail = user.getEmail();
            if (currentEmail != null && !currentEmail.equals(currentEmail.trim().toLowerCase())) {
                user.setEmail(currentEmail.trim().toLowerCase());
                userRepository.save(user);
                updatedCount++;
            }
        }
        
        if (updatedCount > 0) {
            log.info("Successfully normalized mixed-case emails for {} existing users in the database.", updatedCount);
        } else {
            log.info("No emails required normalization. Database is clean.");
        }
    }
}
