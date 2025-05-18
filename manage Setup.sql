CREATE DATABASE IF NOT EXISTS student_management_;
USE student_management_;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id bigint NOT NULL AUTO_INCREMENT,
  created_at datetime(6) DEFAULT NULL,
  email varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role enum('ADMIN','STUDENT','TEACHER') NOT NULL,
  status enum('ACTIVE','INACTIVE') NOT NULL,
  updated_at datetime(6) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_6dotkott2kjsp8vw4d0m25fb7 (email)
) ENGINE=InnoDB AUTO_INCREMENT=16;

DROP TABLE IF EXISTS students;
CREATE TABLE students (
  program varchar(255) NOT NULL,
  student_id varchar(255) NOT NULL,
  year varchar(255) NOT NULL,
  id bigint NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_5mbus2m1tm2acucrp6t627jmx (student_id),
  CONSTRAINT FK7xqmtv7r2eb5axni3jm0a80su FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS teachers;
CREATE TABLE teachers (
  department varchar(255) NOT NULL,
  teacher_id varchar(255) NOT NULL,
  id bigint NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_7knr046ecq8hwte27psac5dxe (teacher_id),
  CONSTRAINT FKpavufmal5lbtc60csriy8sx3 FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  id bigint NOT NULL AUTO_INCREMENT,
  code varchar(255) NOT NULL,
  created_at datetime(6) DEFAULT NULL,
  description varchar(1000) NOT NULL,
  name varchar(255) NOT NULL,
  updated_at datetime(6) DEFAULT NULL,
  teacher_id bigint DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_61og8rbqdd2y28rx2et5fdnxd (code),
  KEY FK468oyt88pgk2a0cxrvxygadqg (teacher_id),
  CONSTRAINT FK468oyt88pgk2a0cxrvxygadqg FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13;

DROP TABLE IF EXISTS assignments;
CREATE TABLE assignments (
  id bigint NOT NULL AUTO_INCREMENT,
  created_at datetime(6) DEFAULT NULL,
  description varchar(1000) NOT NULL,
  due_date datetime(6) NOT NULL,
  title varchar(255) NOT NULL,
  total_points int NOT NULL,
  updated_at datetime(6) DEFAULT NULL,
  course_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FK6p1m72jobsvmrrn4bpj4168mg (course_id),
  CONSTRAINT FK6p1m72jobsvmrrn4bpj4168mg FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS schedules;
CREATE TABLE schedules (
  id bigint NOT NULL AUTO_INCREMENT,
  day enum('FRIDAY','MONDAY','SATURDAY','SUNDAY','THURSDAY','TUESDAY','WEDNESDAY') NOT NULL,
  end_time time(6) NOT NULL,
  room varchar(255) NOT NULL,
  start_time time(6) NOT NULL,
  course_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FK8lk7tc6810l6pgy077cavr8uq (course_id),
  CONSTRAINT FK8lk7tc6810l6pgy077cavr8uq FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22;

DROP TABLE IF EXISTS student_courses;
CREATE TABLE student_courses (
  student_id bigint NOT NULL,
  course_id bigint NOT NULL,
  PRIMARY KEY (student_id,course_id),
  KEY FK_student_course (course_id),
  CONSTRAINT FK_student_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  CONSTRAINT FKwj1l0mta35u161acdl2tupoo FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS submissions;
CREATE TABLE submissions (
  id bigint NOT NULL AUTO_INCREMENT,
  created_at datetime(6) DEFAULT NULL,
  feedback varchar(1000) DEFAULT NULL,
  file_path varchar(255) DEFAULT NULL,
  grade int DEFAULT NULL,
  submission_date datetime(6) NOT NULL,
  updated_at datetime(6) DEFAULT NULL,
  assignment_id bigint NOT NULL,
  student_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FKrirbb44savy2g7nws0hoxs949 (assignment_id),
  KEY FKhwebuw14r6lb2ja85w9mwa8vf (student_id),
  CONSTRAINT FKhwebuw14r6lb2ja85w9mwa8vf FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT FKrirbb44savy2g7nws0hoxs949 FOREIGN KEY (assignment_id) REFERENCES assignments (id) ON DELETE CASCADE
) ENGINE=InnoDB;