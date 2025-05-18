package com.sms.repository;

import com.sms.model.Course;
import com.sms.model.Teacher;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);
    List<Course> findByTeacher(Teacher teacher);

    @EntityGraph(attributePaths = {"schedules"})
    @Query("SELECT c FROM Course c WHERE c.id IN :courseIds")
    List<Course> findCoursesWithSchedulesByIds(@Param("courseIds") List<Long> courseIds);

    @EntityGraph(attributePaths = {"assignments"})
    @Query("SELECT c FROM Course c WHERE c.id IN :courseIds")
    List<Course> findCoursesWithAssignmentsByIds(@Param("courseIds") List<Long> courseIds);
}
