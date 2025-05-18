package com.sms.controller;

import com.sms.dto.CourseDTO;
import com.sms.dto.request.CourseRequest;
import com.sms.dto.response.ApiResponse;
import com.sms.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequest request) {
        try {
            CourseDTO createdCourse = courseService.createCourse(request);
            return ResponseEntity.ok(ApiResponse.success("Course created successfully", createdCourse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getAllCourses() {
        System.out.println("Fetching all courses");
        List<CourseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
            .map(course -> ResponseEntity.ok(ApiResponse.success("Course retrieved successfully", course)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getCourseByCode(@PathVariable String code) {
        return courseService.getCourseByCode(code)
            .map(course -> ResponseEntity.ok(ApiResponse.success("Course retrieved successfully", course)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getCoursesByTeacher(@PathVariable Long teacherId) {
        try {
            List<CourseDTO> courses = courseService.getCoursesByTeacher(teacherId);
            return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        try {
            System.out.println("Updating course with ID: " + request);
            CourseDTO updatedCourse = courseService.updateCourse(id, request);
            return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updatedCourse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
