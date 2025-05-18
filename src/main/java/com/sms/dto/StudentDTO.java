package com.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO extends UserDTO {
    private String studentId;
    private String program;
    private String year;
    private Set<CourseDTO> enrolledCourses;
}
