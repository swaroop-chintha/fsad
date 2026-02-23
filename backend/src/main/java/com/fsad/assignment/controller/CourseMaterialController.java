package com.fsad.assignment.controller;

import com.fsad.assignment.entity.CourseMaterial;
import com.fsad.assignment.service.CourseMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class CourseMaterialController {

    private final CourseMaterialService courseMaterialService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseMaterial> uploadMaterial(
            @RequestParam Long courseId,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(courseMaterialService.uploadMaterial(courseId, title, description, file));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseMaterial>> getMaterialsForCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseMaterialService.getMaterialsForCourse(courseId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        courseMaterialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }
}
