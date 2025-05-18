package com.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private AssignmentDTO assignment;
    private StudentDTO student;
    private LocalDateTime submissionDate;
    private String filePath;
    private Integer grade;
    private String feedback;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
