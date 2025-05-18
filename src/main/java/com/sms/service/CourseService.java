package com.sms.service;

import com.sms.dto.CourseDTO;
import com.sms.dto.ScheduleDTO;
import com.sms.dto.request.CourseRequest;
import com.sms.dto.request.ScheduleRequest;
import com.sms.model.Course;
import com.sms.model.Schedule;
import com.sms.model.Teacher;
import com.sms.repository.CourseRepository;
import com.sms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Transactional
    public CourseDTO createCourse(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Course code is already taken");
        }
        
        Teacher teacher = teacherRepository.findByTeacherId(request.getTeacherId())
            .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + request.getTeacherId()));
        
        Course course = new Course();
        course.setName(request.getName());
        course.setCode(request.getCode());
        course.setDescription(request.getDescription());
        course.setTeacher(teacher);
        course.setStudents(new HashSet<>());
        
        // Save the course first to get an ID
        course = courseRepository.save(course);
        
        // Add schedules if provided
        if (request.getSchedules() != null && !request.getSchedules().isEmpty()) {
            Set<Schedule> schedules = new HashSet<>();
            for (ScheduleRequest scheduleRequest : request.getSchedules()) {
                Schedule schedule = new Schedule();
                schedule.setCourse(course);
                schedule.setDay(scheduleRequest.getDay());
                schedule.setStartTime(scheduleRequest.getStartTime());
                schedule.setEndTime(scheduleRequest.getEndTime());
                schedule.setRoom(scheduleRequest.getRoom());
                schedules.add(schedule);
            }
            course.setSchedules(schedules);
        }
        
        return convertToDTO(courseRepository.save(course));
    }
    
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public Optional<CourseDTO> getCourseById(Long id) {
        return courseRepository.findById(id)
            .map(this::convertToDTO);
    }
    
    public Optional<CourseDTO> getCourseByCode(String code) {
        return courseRepository.findByCode(code)
            .map(this::convertToDTO);
    }
    
    public List<CourseDTO> getCoursesByTeacher(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teacherId));
        
        return courseRepository.findByTeacher(teacher).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public CourseDTO updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        if (!course.getCode().equals(request.getCode()) && 
            courseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Course code is already taken");
        }
        
        Teacher teacher = teacherRepository.findByTeacherId(request.getTeacherId())
            .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + request.getTeacherId()));
        
        course.setName(request.getName());
        course.setCode(request.getCode());
        course.setDescription(request.getDescription());
        course.setTeacher(teacher);
        
        // Update schedules if provided
        if (request.getSchedules() != null) {
            // Clear existing schedules and add new ones
            System.out.println(course.getSchedules());
            course.getSchedules().clear();
            for (ScheduleRequest scheduleRequest : request.getSchedules()) {
                Schedule schedule = new Schedule();
                schedule.setCourse(course);
                schedule.setDay(scheduleRequest.getDay());
                schedule.setStartTime(scheduleRequest.getStartTime());
                schedule.setEndTime(scheduleRequest.getEndTime());
                schedule.setRoom(scheduleRequest.getRoom());
                course.getSchedules().add(schedule);
            }
        }
        
        return convertToDTO(courseRepository.save(course));
    }
    
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Remove the course from all enrolled students
        course.getStudents().forEach(student -> {
            student.getEnrolledCourses().remove(course);
        });
        course.getStudents().clear();
        
        // Clear schedules and assignments (will be deleted due to orphanRemoval=true)
        course.getSchedules().clear();
        course.getAssignments().clear();
        
        courseRepository.delete(course);
    }

    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setName(course.getName());
        dto.setCode(course.getCode());
        dto.setTeacherId(course.getTeacher().getTeacherId());
        dto.setDescription(course.getDescription());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());

        // Convert schedules
        if (course.getSchedules() != null) {
            Set<ScheduleDTO> scheduleDTOs = course.getSchedules().stream()
                .map(schedule -> {
                    ScheduleDTO scheduleDTO = new ScheduleDTO();
                    scheduleDTO.setId(schedule.getId());
                    scheduleDTO.setDay(schedule.getDay());
                    scheduleDTO.setStartTime(schedule.getStartTime());
                    scheduleDTO.setEndTime(schedule.getEndTime());
                    scheduleDTO.setRoom(schedule.getRoom());
                    return scheduleDTO;
                })
                .collect(Collectors.toSet());
            dto.setSchedules(scheduleDTOs);
        }

        return dto;
    }
}
