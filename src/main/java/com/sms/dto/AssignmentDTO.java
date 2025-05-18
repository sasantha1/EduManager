package com.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Integer totalPoints;
    private CourseDTO course;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
