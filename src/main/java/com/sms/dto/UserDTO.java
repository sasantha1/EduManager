package com.sms.dto;

import com.sms.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private User.Role role;
    private User.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
