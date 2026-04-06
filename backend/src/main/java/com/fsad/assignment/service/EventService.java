package com.fsad.assignment.service;

import com.fsad.assignment.entity.Course;
import com.fsad.assignment.entity.Event;
import com.fsad.assignment.repository.CourseRepository;
import com.fsad.assignment.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@SuppressWarnings("null")
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CourseRepository courseRepository;

    public Event createEvent(Long courseId, String title, String description, LocalDateTime eventDate,
            String eventType) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setEventDate(eventDate);
        event.setEventType(eventType);
        event.setCourse(course);

        return eventRepository.save(event);
    }

    public List<Event> getEventsForCourse(Long courseId) {
        return eventRepository.findByCourseId(courseId);
    }

    public List<Event> getEventsForCourses(List<Long> courseIds) {
        return eventRepository.findByCourseIdInOrderByEventDateAsc(courseIds);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}
