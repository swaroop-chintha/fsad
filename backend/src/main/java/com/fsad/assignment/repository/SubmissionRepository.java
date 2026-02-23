package com.fsad.assignment.repository;

import com.fsad.assignment.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignmentId(Long assignmentId);

    List<Submission> findByStudentId(Long studentId);

    Optional<Submission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignment.course.instructor.email = :email")
    long countByInstructorEmail(@Param("email") String email);

    // Assuming status is stored as a string match 'PENDING' or 'GRADED'
    // Adjust if it's an enum or different string in your entity
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignment.course.instructor.email = :email AND s.status = 'PENDING'")
    long countPendingReviews(@Param("email") String email);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignment.course.instructor.email = :email AND s.status = 'GRADED'")
    long countGradedSubmissions(@Param("email") String email);
}
