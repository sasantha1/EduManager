package com.sms.service;

import com.sms.dto.TeacherDTO;
import com.sms.dto.request.TeacherRegistrationRequest;
import com.sms.model.Teacher;
import com.sms.model.User;
import com.sms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeacherService {
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public TeacherDTO registerTeacher(TeacherRegistrationRequest request) {
        if (teacherRepository.existsByTeacherId(request.getTeacherId())) {
            throw new RuntimeException("Teacher ID is already taken");
        }
        
        Teacher teacher = new Teacher();
        teacher.setName(request.getFirstName() + " " + request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPassword(passwordEncoder.encode(request.getPassword()));
        teacher.setRole(User.Role.TEACHER);
        teacher.setStatus(User.Status.ACTIVE);
        teacher.setTeacherId(request.getTeacherId());
        teacher.setDepartment(request.getDepartment());
        teacher.setAssignedCourses(new HashSet<>());
        
        return convertToDTO(teacherRepository.save(teacher));
    }
    
    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public Optional<TeacherDTO> getTeacherById(Long id) {
        return teacherRepository.findById(id)
            .map(this::convertToDTO);
    }
    
    public Optional<TeacherDTO> getTeacherByTeacherId(String teacherId) {
        return teacherRepository.findByTeacherId(teacherId)
            .map(this::convertToDTO);
    }
    
    public boolean existsByTeacherId(String teacherId) {
        return teacherRepository.existsByTeacherId(teacherId);
    }
    
    public TeacherDTO updateTeacher(Long id, TeacherRegistrationRequest request) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
        
        if (!teacher.getTeacherId().equals(request.getTeacherId()) && 
            teacherRepository.existsByTeacherId(request.getTeacherId())) {
            throw new RuntimeException("Teacher ID is already taken");
        }
        
        teacher.setName(request.getFirstName() + " " + request.getLastName());
        teacher.setTeacherId(request.getTeacherId());
        teacher.setDepartment(request.getDepartment());
        
        return convertToDTO(teacherRepository.save(teacher));
    }
    
    private TeacherDTO convertToDTO(Teacher teacher) {
        TeacherDTO dto = new TeacherDTO();
        dto.setId(teacher.getId());
        dto.setName(teacher.getName());
        dto.setEmail(teacher.getEmail());
        dto.setRole(teacher.getRole());
        dto.setStatus(teacher.getStatus());
        dto.setCreatedAt(teacher.getCreatedAt());
        dto.setUpdatedAt(teacher.getUpdatedAt());
        dto.setTeacherId(teacher.getTeacherId());
        dto.setDepartment(teacher.getDepartment());
        // We don't set assignedCourses here to avoid circular references
        // This would be handled by a separate DTO mapper in a real application
        return dto;
    }
}
