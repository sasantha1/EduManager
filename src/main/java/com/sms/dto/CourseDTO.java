package com.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String teacherId;
    private Set<ScheduleDTO> schedules;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
