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
public class TeacherDTO extends UserDTO {
    private String teacherId;
    private String department;
    private Set<CourseDTO> assignedCourses;
}
