package com.fsad.assignment.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace();
        Map<String, String> response = new HashMap<>();
        String message = ex.getMessage();
        response.put("message", message);

        HttpStatus status;
        if ("Email already exists".equals(message)) {
            status = HttpStatus.CONFLICT; // 409
        } else if ("Invalid credentials".equals(message)) {
            status = HttpStatus.UNAUTHORIZED; // 401
        } else {
            status = HttpStatus.BAD_REQUEST; // 400
        }

        return new ResponseEntity<>(response, status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        ex.printStackTrace();
        Map<String, String> response = new HashMap<>();
        response.put("message", "An unexpected error occurred");
        response.put("details", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

