package com.fsad.assignment.dto;

import com.fsad.assignment.entity.CalendarEvent;
import com.fsad.assignment.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEventResponse {
    private Long id;
    private String title;
    private String description;
    private String eventDate;
    private String eventTime;
    private String createdBy;
    private String role;
    private boolean isGlobal;  // true for teacher events, false for student-private events

    public static CalendarEventResponse fromEntity(CalendarEvent event) {
        return CalendarEventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate().toString())
                .eventTime(event.getEventTime() != null ? event.getEventTime().toString() : null)
                .createdBy(event.getCreatedBy())
                .role(event.getRole().name())
                .isGlobal(event.getRole() == Role.ADMIN)
                .build();
    }
}
