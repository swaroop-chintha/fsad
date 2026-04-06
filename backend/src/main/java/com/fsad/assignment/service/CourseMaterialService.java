package com.fsad.assignment.service;

import com.fsad.assignment.entity.Course;
import com.fsad.assignment.entity.CourseMaterial;
import com.fsad.assignment.repository.CourseMaterialRepository;
import com.fsad.assignment.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@SuppressWarnings("null")
@RequiredArgsConstructor
public class CourseMaterialService {

    private final CourseMaterialRepository courseMaterialRepository;
    private final CourseRepository courseRepository;
    private final String uploadDir = "uploads/";

    public CourseMaterial uploadMaterial(Long courseId, String title, String description, MultipartFile file)
            throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseMaterial material = new CourseMaterial();
        material.setTitle(title);
        material.setDescription(description);
        material.setCourse(course);

        if (file != null && !file.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName).toAbsolutePath();
            file.transferTo(filePath.toFile());

            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();
            material.setFileUrl(fileUrl);
        } else {
            throw new RuntimeException("File is required for course material.");
        }

        return courseMaterialRepository.save(material);
    }

    public List<CourseMaterial> getMaterialsForCourse(Long courseId) {
        return courseMaterialRepository.findByCourseIdOrderByUploadedAtDesc(courseId);
    }

    public void deleteMaterial(Long id) {
        courseMaterialRepository.deleteById(id);
    }
}
