package com.fsad.assignment.controller;

import com.fsad.assignment.entity.Submission;
import com.fsad.assignment.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fsad.assignment.service.FileStorageService;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final FileStorageService fileStorageService;

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Submission> submitAssignment(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam(value = "comment", required = false) String comment,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication) throws IOException {
        return ResponseEntity
                .ok(submissionService.submitAssignment(assignmentId, authentication.getName(), file, comment));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<List<Submission>> getMySubmissions(Authentication authentication) {
        return ResponseEntity.ok(submissionService.getMySubmissions(authentication.getName()));
    }

    @PostMapping("/{id}/grade")
    public ResponseEntity<Submission> gradeSubmission(
            @PathVariable Long id,
            @RequestParam Integer marks,
            @RequestParam(value = "feedback", required = false) String feedback) {
        return ResponseEntity.ok(submissionService.gradeSubmission(id, marks, feedback));
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Path filePath = fileStorageService.loadFile(fileName);
        Resource resource;
        try {
            resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }
}
