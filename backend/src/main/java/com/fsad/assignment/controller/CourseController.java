package com.fsad.assignment.controller;

import com.fsad.assignment.entity.Course;
import com.fsad.assignment.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course, Authentication authentication) {
        return ResponseEntity.ok(courseService.createCourse(course, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> getMyCourses(Authentication authentication) {
        // Since we don't have enrollment yet, we'll return all for student,
        // or just created ones for teacher.
        // Let's assume this returns courses created by the teacher.
        return ResponseEntity.ok(courseService.getCoursesByInstructor(authentication.getName()));
    }
}
