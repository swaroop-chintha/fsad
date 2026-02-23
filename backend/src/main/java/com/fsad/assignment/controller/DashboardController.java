package com.fsad.assignment.controller;

import com.fsad.assignment.dto.DashboardDTO;
import com.fsad.assignment.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/teacher-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardDTO> getTeacherStats(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getTeacherStats(authentication.getName()));
    }
}
