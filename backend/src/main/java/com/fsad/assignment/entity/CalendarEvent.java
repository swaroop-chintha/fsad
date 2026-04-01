package com.fsad.assignment.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "calendar_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDate eventDate;

    // Optional time component
    private LocalTime eventTime;

    // Email of the user who created this event
    @Column(nullable = false)
    private String createdBy;

    // Role of the creator: ADMIN (teacher) or STUDENT
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // For STUDENT events, stores the student's user ID to make it private.
    // NULL for ADMIN/teacher events (global visibility).
    private Long studentId;
}
