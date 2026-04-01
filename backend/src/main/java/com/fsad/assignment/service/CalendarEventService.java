package com.fsad.assignment.service;

import com.fsad.assignment.dto.CalendarEventRequest;
import com.fsad.assignment.dto.CalendarEventResponse;
import com.fsad.assignment.entity.CalendarEvent;
import com.fsad.assignment.entity.Role;
import com.fsad.assignment.entity.User;
import com.fsad.assignment.repository.CalendarEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;

    /**
     * Create a calendar event.
     * - ADMIN (teacher): creates a global event (studentId = null).
     * - STUDENT: creates a private event (studentId = user.id).
     */
    public CalendarEventResponse createEvent(CalendarEventRequest request, User user) {
        CalendarEvent event = CalendarEvent.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(LocalDate.parse(request.getEventDate()))
                .eventTime(request.getEventTime() != null && !request.getEventTime().isEmpty()
                        ? LocalTime.parse(request.getEventTime())
                        : null)
                .createdBy(user.getEmail())
                .role(user.getRole())
                .studentId(user.getRole() == Role.STUDENT ? user.getId() : null)
                .build();

        CalendarEvent saved = calendarEventRepository.save(event);
        return CalendarEventResponse.fromEntity(saved);
    }

    /**
     * Get events for a student:
     *   - Their own private events (by studentId)
     *   - All teacher (ADMIN) global events
     */
    public List<CalendarEventResponse> getEventsForStudent(User user) {
        List<CalendarEvent> studentEvents = calendarEventRepository.findByStudentIdOrderByEventDateAsc(user.getId());
        List<CalendarEvent> teacherEvents = calendarEventRepository.findByRoleOrderByEventDateAsc(Role.ADMIN);

        List<CalendarEvent> combined = new ArrayList<>();
        combined.addAll(studentEvents);
        combined.addAll(teacherEvents);
        combined.sort(Comparator.comparing(CalendarEvent::getEventDate));

        return combined.stream()
                .map(CalendarEventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get events for a teacher: only events they created.
     */
    public List<CalendarEventResponse> getEventsForTeacher(User user) {
        return calendarEventRepository.findByCreatedByOrderByEventDateAsc(user.getEmail())
                .stream()
                .map(CalendarEventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Delete an event — only the creator can delete their own events.
     */
    public boolean deleteEvent(Long id, User user) {
        return calendarEventRepository.findByIdAndCreatedBy(id, user.getEmail())
                .map(event -> {
                    calendarEventRepository.delete(event);
                    return true;
                })
                .orElse(false);
    }
}
