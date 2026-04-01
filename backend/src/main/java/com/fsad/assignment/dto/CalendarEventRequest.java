package com.fsad.assignment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEventRequest {
    private String title;
    private String description;
    private String eventDate;   // ISO format: yyyy-MM-dd
    private String eventTime;   // Optional, ISO format: HH:mm
}
