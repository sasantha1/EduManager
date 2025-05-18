package com.sms.repository;

import com.sms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    @Query("SELECT DISTINCT s FROM Student s " +
            "LEFT JOIN FETCH s.enrolledCourses c " +
            "LEFT JOIN FETCH c.schedules " +
            "LEFT JOIN FETCH c.assignments " +
            "LEFT JOIN FETCH c.teacher " +
            "WHERE s.id = :id")
    Optional<Student> findStudentWithCoursesById(@Param("id") Long id);
    boolean existsByStudentId(String studentId);
}
