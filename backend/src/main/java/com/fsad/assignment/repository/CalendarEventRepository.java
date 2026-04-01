package com.fsad.assignment.repository;

import com.fsad.assignment.entity.CalendarEvent;
import com.fsad.assignment.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    // Find all teacher (global) events
    List<CalendarEvent> findByRoleOrderByEventDateAsc(Role role);

    // Find all private events for a specific student
    List<CalendarEvent> findByStudentIdOrderByEventDateAsc(Long studentId);

    // Find all events created by a specific user (by email)
    List<CalendarEvent> findByCreatedByOrderByEventDateAsc(String createdBy);

    // Find by id and createdBy for safe deletion (only own events)
    Optional<CalendarEvent> findByIdAndCreatedBy(Long id, String createdBy);
}
