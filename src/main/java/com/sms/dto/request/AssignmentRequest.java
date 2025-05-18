package com.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;
    
    @NotNull(message = "Total points is required")
    @Positive(message = "Total points must be positive")
    private Integer totalPoints;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
}
