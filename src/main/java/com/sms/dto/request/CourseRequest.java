package com.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
    
    @NotBlank(message = "Course name is required")
    private String name;
    
    @NotBlank(message = "Course code is required")
    @Pattern(regexp = "^[A-Z]{2,4}\\d{3,4}$", message = "Course code should be in format like 'CS101' or 'MATH2001'")
    private String code;
    
    @NotBlank(message = "Course description is required")
    private String description;
    
    @NotNull(message = "Teacher ID is required")
    private String teacherId;
    
    private List<ScheduleRequest> schedules;
}
