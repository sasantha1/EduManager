package com.sms.service;

import com.sms.dto.CourseDTO;
import com.sms.dto.ScheduleDTO;
import com.sms.dto.StudentDTO;
import com.sms.dto.TeacherDTO;
import com.sms.dto.request.StudentRegistrationRequest;
import com.sms.model.Course;
import com.sms.model.Schedule;
import com.sms.model.Student;
import com.sms.model.User;
import com.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public StudentDTO registerStudent(StudentRegistrationRequest request) {
        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new RuntimeException("Student ID is already taken");
        }

        Student student = new Student();
        student.setName(request.getFirstName() + " " + request.getLastName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRole(User.Role.STUDENT);
        student.setStatus(User.Status.ACTIVE);
        student.setStudentId(request.getStudentId());
        student.setProgram(request.getProgram());
        student.setYear(request.getYear());
        student.setEnrolledCourses(new HashSet<>());

        return convertToDTO(studentRepository.save(student));
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<StudentDTO> getStudentById(Long id) {
        return studentRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<StudentDTO> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Optional<StudentDTO> getStudentByIdWithCourses(Long id) {
        System.out.println("Fetching student with courses, ID: " + id);
        return studentRepository.findStudentWithCoursesById(id)
                .map(student -> {
                    // No need for manual initialization as the query properly loads everything
                    if (student.getEnrolledCourses() != null) {
                        // Just logging for debugging
                        student.getEnrolledCourses().forEach(course -> {
                            System.out.println("Course " + course.getId() + " - " + course.getName());
                            System.out.println("Schedule count: " +
                                    (course.getSchedules() != null ? course.getSchedules().size() : "0"));

                            if (course.getSchedules() != null) {
                                course.getSchedules().forEach(schedule -> {
                                    System.out.println("  Schedule ID: " + schedule.getId() +
                                            ", Day: " + schedule.getDay() +
                                            ", Room: " + schedule.getRoom());
                                });
                            }
                        });
                    }
                    return convertToDTO(student);
                });
    }

    public boolean existsByStudentId(String studentId) {
        return studentRepository.existsByStudentId(studentId);
    }

    public StudentDTO updateStudent(Long id, StudentRegistrationRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        if (!student.getStudentId().equals(request.getStudentId()) &&
                studentRepository.existsByStudentId(request.getStudentId())) {
            throw new RuntimeException("Student ID is already taken");
        }

        student.setName(request.getFirstName() + " " + request.getLastName());
        student.setStudentId(request.getStudentId());
        student.setProgram(request.getProgram());
        student.setYear(request.getYear());

        return convertToDTO(studentRepository.save(student));
    }

    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setRole(student.getRole());
        dto.setStatus(student.getStatus());
        dto.setCreatedAt(student.getCreatedAt());
        dto.setUpdatedAt(student.getUpdatedAt());
        dto.setStudentId(student.getStudentId());
        dto.setProgram(student.getProgram());
        dto.setYear(student.getYear());

        // Debug logging
        System.out.println("Student courses before conversion: " +
                (student.getEnrolledCourses() != null ?
                        student.getEnrolledCourses().size() : "null"));

        Set<CourseDTO> courseDTOs = new HashSet<>();

        if (student.getEnrolledCourses() != null) {
            for (Course course : student.getEnrolledCourses()) {
                CourseDTO courseDTO = new CourseDTO();
                courseDTO.setId(course.getId());
                courseDTO.setCode(course.getCode());
                courseDTO.setName(course.getName());
                courseDTO.setDescription(course.getDescription());
                courseDTO.setCreatedAt(course.getCreatedAt());
                courseDTO.setUpdatedAt(course.getUpdatedAt());

                // Handle teacher
                if (course.getTeacher() != null) {
                    TeacherDTO teacherDTO = new TeacherDTO();
                    teacherDTO.setId(course.getTeacher().getId());
                    teacherDTO.setName(course.getTeacher().getName());
                    teacherDTO.setTeacherId(course.getTeacher().getTeacherId());
                    teacherDTO.setDepartment(course.getTeacher().getDepartment());
                    courseDTO.setTeacherId(course.getTeacher().getTeacherId());
                }

                // Handle schedules - THE CRUCIAL PART
                Set<ScheduleDTO> scheduleDTOs = new HashSet<>();
                if (course.getSchedules() != null) {
                    System.out.println("Converting schedules for course " + course.getId() +
                            " - found " + course.getSchedules().size() + " schedules");

                    for (Schedule schedule : course.getSchedules()) {
                        System.out.println("Processing schedule: " + schedule.getId() +
                                ", Day: " + schedule.getDay() +
                                ", Room: " + schedule.getRoom());

                        ScheduleDTO scheduleDTO = new ScheduleDTO();
                        scheduleDTO.setId(schedule.getId());
                        scheduleDTO.setDay(schedule.getDay());
                        scheduleDTO.setStartTime(schedule.getStartTime());
                        scheduleDTO.setEndTime(schedule.getEndTime());
                        scheduleDTO.setRoom(schedule.getRoom());
                        scheduleDTOs.add(scheduleDTO);
                    }
                }
                courseDTO.setSchedules(scheduleDTOs);
                courseDTOs.add(courseDTO);
            }
        }

        dto.setEnrolledCourses(courseDTOs);
        return dto;
    }
}