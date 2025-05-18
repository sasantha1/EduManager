package com.sms.controller;

import com.sms.dto.request.LoginRequest;
import com.sms.dto.request.StudentRegistrationRequest;
import com.sms.dto.request.TeacherRegistrationRequest;
import com.sms.dto.response.ApiResponse;
import com.sms.dto.response.JwtResponse;
import com.sms.service.StudentService;
import com.sms.service.TeacherService;
import com.sms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private TeacherService teacherService;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = userService.authenticateUser(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid credentials"));
        }
    }
    
    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is already in use"));
        }
        
        if (studentService.existsByStudentId(request.getStudentId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Student ID is already taken"));
        }
        
        try {
            return ResponseEntity.ok(ApiResponse.success(
                "Student registered successfully",
                studentService.registerStudent(request)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/register/teacher")
    public ResponseEntity<?> registerTeacher(@Valid @RequestBody TeacherRegistrationRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is already in use"));
        }
        
        if (teacherService.existsByTeacherId(request.getTeacherId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Teacher ID is already taken"));
        }
        
        try {
            return ResponseEntity.ok(ApiResponse.success(
                "Teacher registered successfully",
                teacherService.registerTeacher(request)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
