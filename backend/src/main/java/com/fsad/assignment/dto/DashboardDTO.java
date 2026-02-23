package com.fsad.assignment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private long totalAssignments;
    private long totalSubmissions;
    private long pendingReviews;
    private long gradedSubmissions;
    private long upcomingDeadlines;
}
