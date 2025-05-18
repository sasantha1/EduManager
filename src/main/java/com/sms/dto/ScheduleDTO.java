package com.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {
    private Long id;
    private DayOfWeek day;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
}
