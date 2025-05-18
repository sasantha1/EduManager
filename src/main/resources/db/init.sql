-- Create database if not exists
CREATE DATABASE IF NOT EXISTS student_management_system;
USE student_management_system;

-- Create admin user for initial login
INSERT INTO users (name, email, password, role, status, created_at, updated_at)
VALUES ('Admin User', 'admin@example.com', '$2a$10$yfIHMg3xrCZYqAL4pCdOYOQgpJ.N9xPLe8MbQBqWNBp/GKFXx.bAe', 'ADMIN', 'ACTIVE', NOW(), NOW());
-- Note: The password is 'admin123' encrypted with BCrypt

-- Create sample teacher
INSERT INTO users (name, email, password, role, status, created_at, updated_at)
VALUES ('John Smith', 'teacher@example.com', '$2a$10$yfIHMg3xrCZYqAL4pCdOYOQgpJ.N9xPLe8MbQBqWNBp/GKFXx.bAe', 'TEACHER', 'ACTIVE', NOW(), NOW());

INSERT INTO teachers (id, teacher_id, department)
VALUES (2, 'T1001', 'Computer Science');

-- Create sample student
INSERT INTO users (name, email, password, role, status, created_at, updated_at)
VALUES ('Jane Doe', 'student@example.com', '$2a$10$yfIHMg3xrCZYqAL4pCdOYOQgpJ.N9xPLe8MbQBqWNBp/GKFXx.bAe', 'STUDENT', 'ACTIVE', NOW(), NOW());

INSERT INTO students (id, student_id, program, year)
VALUES (3, 'S1001', 'Computer Science', '2nd Year');

-- Create sample course
INSERT INTO courses (name, code, description, teacher_id, created_at, updated_at)
VALUES ('Introduction to Programming', 'CS101', 'A beginner-friendly introduction to programming concepts using Java.', 2, NOW(), NOW());

-- Create sample schedule
INSERT INTO schedules (course_id, day, start_time, end_time, room)
VALUES (1, 'MONDAY', '10:00:00', '12:00:00', 'Room A101');

-- Enroll student in course
INSERT INTO student_courses (student_id, course_id)
VALUES (3, 1);
