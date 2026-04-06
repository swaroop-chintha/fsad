package com.fsad.assignment.service;

import com.fsad.assignment.entity.Assignment;
import com.fsad.assignment.entity.Course;
import com.fsad.assignment.repository.AssignmentRepository;
import com.fsad.assignment.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@SuppressWarnings("null")
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public Assignment createAssignment(Long courseId, Assignment assignment, MultipartFile file) throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        assignment.setCourse(course);

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            assignment.setFileUrl(fileName);
        }

        Assignment saved = assignmentRepository.save(assignment);
        // Broadcast to specific course topic or general updates
        messagingTemplate.convertAndSend("/topic/assignments", "update");
        return saved;
    }

    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    public Assignment getAssignment(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }

    public void deleteAssignment(Long id) {
        Assignment assignment = getAssignment(id);
        assignmentRepository.delete(assignment);
        messagingTemplate.convertAndSend("/topic/assignments", "delete");
    }
}
