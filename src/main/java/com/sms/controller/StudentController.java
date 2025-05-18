package com.sms.controller;

import com.sms.dto.StudentDTO;
import com.sms.dto.request.StudentRegistrationRequest;
import com.sms.dto.response.ApiResponse;
import com.sms.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<StudentDTO>>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or (hasRole('STUDENT') and #id == authentication.principal.id)")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
            .map(student -> ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/courses")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or (hasRole('STUDENT') and #id == authentication.principal.id)")
    public ResponseEntity<?> getStudentWithCourses(@PathVariable Long id) {
        System.out.println("Fetching student with ID: " + id);
        return studentService.getStudentByIdWithCourses(id)
            .map(student -> ResponseEntity.ok(ApiResponse.success("Student with courses retrieved successfully", student)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/studentId/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<?> getStudentByStudentId(@PathVariable String studentId) {
        return studentService.getStudentByStudentId(studentId)
            .map(student -> ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('STUDENT') and #id.toString() == authentication.principal.id.toString())")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRegistrationRequest request) {
        try {
            StudentDTO updatedStudent = studentService.updateStudent(id, request);
            return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updatedStudent));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        try {
            StudentDTO newStudent = studentService.registerStudent(request);
            return ResponseEntity.status(201).body(ApiResponse.success("Student created successfully", newStudent));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
