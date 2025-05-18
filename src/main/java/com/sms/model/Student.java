package com.sms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
public class Student extends User {
    
    @Column(name = "student_id", nullable = false, unique = true)
    private String studentId;
    
    @Column(nullable = false)
    private String program;
    
    @Column(nullable = false)
    private String year;
    
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "student_courses",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id", 
            foreignKey = @ForeignKey(
                name = "FK_student_course",
                foreignKeyDefinition = "FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE"
            )
        )
    )
    private Set<Course> enrolledCourses = new HashSet<>();
}
