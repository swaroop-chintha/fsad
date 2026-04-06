package com.fsad.assignment.service;

import com.fsad.assignment.entity.Assignment;
import com.fsad.assignment.entity.Submission;
import com.fsad.assignment.entity.User;
import com.fsad.assignment.repository.AssignmentRepository;
import com.fsad.assignment.repository.SubmissionRepository;
import com.fsad.assignment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@SuppressWarnings("null")
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public Submission submitAssignment(Long assignmentId, String studentEmail, MultipartFile file, String comment)
            throws IOException {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId()).isPresent()) {
            // Check if updates are allowed or throw
            throw new RuntimeException("Already submitted");
        }

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setSubmissionDate(LocalDateTime.now());
        submission.setTextComment(comment);

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            submission.setFileUrl(fileName);
        }

        // Check for late submission
        if (submission.getSubmissionDate().isAfter(assignment.getDueDate())) {
            submission.setStatus("LATE");
        } else {
            submission.setStatus("SUBMITTED");
        }

        Submission saved = submissionRepository.save(submission);
        messagingTemplate.convertAndSend("/topic/submissions", "update");
        return saved;
    }

    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<Submission> getMySubmissions(String email) {
        User student = userRepository.findByEmail(email).orElseThrow();
        return submissionRepository.findByStudentId(student.getId());
    }

    public Submission gradeSubmission(Long submissionId, Integer marks, String feedback) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setMarks(marks);
        submission.setFeedback(feedback);
        submission.setStatus("GRADED");
        Submission saved = submissionRepository.save(submission);

        messagingTemplate.convertAndSend("/topic/submissions", "grade");
        return saved;
    }
}
