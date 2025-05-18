package com.sms.controller;

import com.sms.dto.TeacherDTO;
import com.sms.dto.request.TeacherRegistrationRequest;
import com.sms.dto.response.ApiResponse;
import com.sms.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TeacherController {
    
    @Autowired
    private TeacherService teacherService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TeacherDTO>>> getAllTeachers() {
        List<TeacherDTO> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(ApiResponse.success("Teachers retrieved successfully", teachers));
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTeacher(@Valid @RequestBody TeacherRegistrationRequest request) {
        TeacherDTO createdTeacher = teacherService.registerTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Teacher created successfully", createdTeacher));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEACHER') or hasRole('STUDENT') and #id == authentication.principal.id)")
    public ResponseEntity<?> getTeacherById(@PathVariable Long id) {
        return teacherService.getTeacherById(id)
            .map(teacher -> ResponseEntity.ok(ApiResponse.success("Teacher retrieved successfully", teacher)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/teacherId/{teacherId}")
    public ResponseEntity<?> getTeacherByTeacherId(@PathVariable String teacherId) {
        System.out.println("Fetching teacher with teacherId: " + teacherId);
        return teacherService.getTeacherByTeacherId(teacherId)
            .map(teacher -> ResponseEntity.ok(ApiResponse.success("Teacher retrieved successfully", teacher)))
            .orElse(ResponseEntity.notFound().build());
    }
    

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEACHER') and #id == authentication.principal.id)")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @Valid @RequestBody TeacherRegistrationRequest request) {
        try {
            TeacherDTO updatedTeacher = teacherService.updateTeacher(id, request);
            return ResponseEntity.ok(ApiResponse.success("Teacher updated successfully", updatedTeacher));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
