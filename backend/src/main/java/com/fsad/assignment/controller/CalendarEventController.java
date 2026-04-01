package com.fsad.assignment.controller;

import com.fsad.assignment.dto.CalendarEventRequest;
import com.fsad.assignment.dto.CalendarEventResponse;
import com.fsad.assignment.entity.Role;
import com.fsad.assignment.entity.User;
import com.fsad.assignment.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar-events")
@RequiredArgsConstructor
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    /**
     * Create a new calendar event.
     * Role is auto-detected from the authenticated user.
     */
    @PostMapping
    public ResponseEntity<CalendarEventResponse> createEvent(
            @RequestBody CalendarEventRequest request,
            @AuthenticationPrincipal User user) {
        CalendarEventResponse response = calendarEventService.createEvent(request, user);
        return ResponseEntity.ok(response);
    }

    /**
     * Get calendar events for the current user.
     * - Students: own private events + all teacher global events
     * - Teachers: only their own created events
     */
    @GetMapping
    public ResponseEntity<List<CalendarEventResponse>> getEvents(
            @AuthenticationPrincipal User user) {
        List<CalendarEventResponse> events;
        if (user.getRole() == Role.STUDENT) {
            events = calendarEventService.getEventsForStudent(user);
        } else {
            events = calendarEventService.getEventsForTeacher(user);
        }
        return ResponseEntity.ok(events);
    }

    /**
     * Delete a calendar event (only the creator can delete).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        boolean deleted = calendarEventService.deleteEvent(id, user);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).body("Cannot delete: event not found or not owned by you");
    }
}
