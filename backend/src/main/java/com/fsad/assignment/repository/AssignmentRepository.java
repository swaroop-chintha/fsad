package com.fsad.assignment.repository;

import com.fsad.assignment.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(Long courseId);

    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.course.instructor.email = :email")
    long countByInstructorEmail(@Param("email") String email);

    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.course.instructor.email = :email AND a.dueDate > CURRENT_TIMESTAMP")
    long countUpcomingDeadlines(@Param("email") String email);
}
