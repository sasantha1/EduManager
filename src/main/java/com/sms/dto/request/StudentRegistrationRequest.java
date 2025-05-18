package com.sms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegistrationRequest {
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Student ID is required")
    @Pattern(regexp = "^S\\d{4,}$", message = "Student ID must start with 'S' followed by at least 4 digits")
    private String studentId;
    
    @NotBlank(message = "Program is required")
    private String program;
    
    @NotBlank(message = "Year is required")
    private String year;
}
