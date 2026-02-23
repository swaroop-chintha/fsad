package com.fsad.assignment.service;

import com.fsad.assignment.dto.DashboardDTO;
import com.fsad.assignment.repository.AssignmentRepository;
import com.fsad.assignment.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;

    public DashboardDTO getTeacherStats(String email) {
        return DashboardDTO.builder()
                .totalAssignments(assignmentRepository.countByInstructorEmail(email))
                .totalSubmissions(submissionRepository.countByInstructorEmail(email))
                .pendingReviews(submissionRepository.countPendingReviews(email))
                .gradedSubmissions(submissionRepository.countGradedSubmissions(email))
                .upcomingDeadlines(assignmentRepository.countUpcomingDeadlines(email))
                .build();
    }
}
