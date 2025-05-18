INSERT INTO users (id,created_at, email, name, password, role, status, updated_at) VALUES
(1,NOW(), 'admin@example.com', 'Admin User', '$2a$12$wsG0ATVkni/tjZgn8z4UlO1Cvf7U3Aabv/aZCzE1Yz/D6p9W4WTMi', 'ADMIN', 'ACTIVE', NOW()),
(2,NOW(), 'teacher1@example.com', 'Teacher One', '$2a$12$wsG0ATVkni/tjZgn8z4UlO1Cvf7U3Aabv/aZCzE1Yz/D6p9W4WTMi', 'TEACHER', 'ACTIVE', NOW()),
(3,NOW(), 'teacher2@example.com', 'Teacher Two', '$2a$12$wsG0ATVkni/tjZgn8z4UlO1Cvf7U3Aabv/aZCzE1Yz/D6p9W4WTMi', 'TEACHER', 'ACTIVE', NOW()),
(4,NOW(), 'student1@example.com', 'Student One', '$2a$12$wsG0ATVkni/tjZgn8z4UlO1Cvf7U3Aabv/aZCzE1Yz/D6p9W4WTMi', 'STUDENT', 'ACTIVE', NOW()),
(5,NOW(), 'student2@example.com', 'Student Two', '$2a$12$wsG0ATVkni/tjZgn8z4UlO1Cvf7U3Aabv/aZCzE1Yz/D6p9W4WTMi', 'STUDENT', 'ACTIVE', NOW()),
(6,NOW(), 'student3@example.com', 'Student Three', '$2a$12$wsG0ATVkni/tjZgn8z4UlO1Cvf7U3Aabv/aZCzE1Yz/D6p9W4WTMi', 'STUDENT', 'ACTIVE', NOW());

INSERT INTO teachers (department, teacher_id, id) VALUES
('Mathematics', 'T0001', 2),
('Science', 'T0002', 3);

INSERT INTO students (program, student_id, year, id) VALUES
('Computer Science', 'S0001', '2023', 4),
('Mathematics', 'S0002', '2023', 5),
('Physics', 'S0003', '2023', 6);

INSERT INTO courses (code, created_at, description, name, updated_at, teacher_id,id) VALUES
('CS101', NOW(), 'Introduction to Computer Science', 'Intro to CS', NOW(), 2,1),
('MATH101', NOW(), 'Basic Mathematics', 'Math 101', NOW(), 2,2),
('PHY101', NOW(), 'Introduction to Physics', 'Physics 101', NOW(), 3,3);

INSERT INTO assignments (created_at, description, due_date, title, total_points, updated_at, course_id) VALUES
(NOW(), 'First assignment for CS101', '2025-06-01 23:59:59', 'Assignment 1', 100, NOW(), 1),
(NOW(), 'Second assignment for CS101', '2025-06-15 23:59:59', 'Assignment 2', 100, NOW(), 1),
(NOW(), 'First assignment for MATH101', '2025-06-05 23:59:59', 'Math Assignment 1', 100, NOW(), 2);

INSERT INTO schedules (day, end_time, room, start_time, course_id) VALUES
('MONDAY', '10:00:00', 'Room 101', '09:00:00', 1),
('WEDNESDAY', '12:00:00', 'Room 102', '11:00:00', 1),
('TUESDAY', '14:00:00', 'Room 201', '13:00:00', 2),
('THURSDAY', '16:00:00', 'Room 202', '15:00:00', 3);

INSERT INTO student_courses (student_id, course_id) VALUES
(4, 1),
(5, 1),
(6, 3);

INSERT INTO submissions (created_at, feedback, file_path, grade, submission_date, updated_at, assignment_id, student_id) VALUES
(NOW(), NULL, '/path/to/file1', NULL, '2025-05-20 10:00:00', NOW(), 1, 4),
(NOW(), NULL, '/path/to/file2', NULL, '2025-05-21 11:00:00', NOW(), 1, 5),
(NOW(), NULL, '/path/to/file3', NULL, '2025-05-22 12:00:00', NOW(), 2, 4),
(NOW(), NULL, '/path/to/file4', NULL, '2025-05-23 13:00:00', NOW(), 3, 4),
(NOW(), NULL, '/path/to/file5', NULL, '2025-05-24 14:00:00', NOW(), 3, 6);