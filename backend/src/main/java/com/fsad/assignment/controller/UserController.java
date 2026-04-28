package com.fsad.assignment.controller;

import com.fsad.assignment.entity.Role;
import com.fsad.assignment.entity.User;
import com.fsad.assignment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getAllStudents() {
        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<Map<String, Object>> result = students.stream().map(s -> Map.<String, Object>of(
                "id", s.getId(),
                "name", s.getName(),
                "email", s.getEmail()
        )).toList();
        return ResponseEntity.ok(result);
    }
}
