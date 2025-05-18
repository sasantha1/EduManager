package com.sms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id") // Matches DB column name
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('FRIDAY','MONDAY','SATURDAY','SUNDAY','THURSDAY','TUESDAY','WEDNESDAY')")
    private DayOfWeek day;

    @Column(name = "start_time", nullable = false, columnDefinition = "time(6)")
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false, columnDefinition = "time(6)")
    private LocalTime endTime;

    @Column(nullable = false)
    private String room;
}