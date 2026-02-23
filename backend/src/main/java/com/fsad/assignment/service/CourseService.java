package com.fsad.assignment.service;

import com.fsad.assignment.entity.Course;
import com.fsad.assignment.entity.User;
import com.fsad.assignment.repository.CourseRepository;
import com.fsad.assignment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public Course createCourse(Course course, String instructorEmail) {
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        course.setInstructor(instructor);
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // For students to enroll (skipped for MVP, they see all or specific)
    // For now, let's just return all for students, and maybe filter for teachers

    public List<Course> getCoursesByInstructor(String instructorEmail) {
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        return courseRepository.findByInstructorId(instructor.getId());
    }
}
