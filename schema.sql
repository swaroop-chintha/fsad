-- Drop existing tables if they exist (Order matters due to foreign keys)
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('ADMIN', 'STUDENT'))
);

-- Create Courses Table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    instructor_id BIGINT NOT NULL,
    CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id) REFERENCES users(id)
);

-- Create Assignments Table
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    due_date TIMESTAMP(6) NOT NULL,
    max_marks INTEGER,
    file_url VARCHAR(255),
    course_id BIGINT NOT NULL,
    CONSTRAINT fk_assignment_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create Submissions Table
CREATE TABLE submissions (
    id BIGSERIAL PRIMARY KEY,
    submission_date TIMESTAMP(6) NOT NULL,
    file_url VARCHAR(255),
    text_comment VARCHAR(255),
    marks INTEGER,
    feedback VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    student_id BIGINT NOT NULL,
    assignment_id BIGINT NOT NULL,
    CONSTRAINT fk_submission_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_submission_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);

-- Optional: Insert a test Admin User (Password: password)
-- NOTE: Passwords in the app are BCrypt hashed. This raw insert might not work for login unless you hash the password.
-- INSERT INTO users (name, email, password, role) VALUES ('Admin Teacher', 'admin@test.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN');
