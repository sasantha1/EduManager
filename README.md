# EduManager: Student Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue.svg)

A comprehensive web-based student management system designed to streamline educational administration, enhance student engagement, and improve academic oversight for educational institutions.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development Team](#development-team)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

EduManager is a modern, feature-rich student management system built using Java Spring Boot backend and React TypeScript frontend. It provides a comprehensive solution for educational institutions to manage students, courses, schedules, and academic performance through an intuitive, responsive interface.

The system addresses common challenges in educational administration by centralizing data management, improving accessibility to information, and streamlining communication between students, teachers, and administrators.

## 🔑 Key Features

### For Students
- **Personalized Dashboard**: Track enrolled courses, upcoming assignments, and recent grades
- **Course Management**: View course details, materials, and announcements
- **Assignment Tracking**: Submit assignments and view feedback
- **Calendar Integration**: Access comprehensive academic calendar with personal events
- **Performance Analytics**: Monitor academic progress and grades

### For Teachers
- **Course Administration**: Create and manage courses, schedules, and materials
- **Student Oversight**: Track student performance and participation
- **Assignment Management**: Create, collect, and grade assignments
- **Calendar Management**: Schedule classes and office hours
- **Communication Tools**: Announce course updates and communicate with students

### For Administrators
- **User Management**: Oversee student and teacher accounts and permissions
- **Course Catalog**: Manage institutional course offerings
- **System Configuration**: Configure system parameters and security settings
- **Reporting Tools**: Generate institutional reports and analytics

## 🏗️ System Architecture

EduManager implements a three-tier architecture:

1. **Presentation Layer**: React with TypeScript, providing a responsive and type-safe user interface
2. **Application Layer**: Spring Boot REST API implementing business logic and authentication
3. **Data Layer**: JPA/Hibernate with MySQL database for persistence

The system follows the Model-View-Controller (MVC) pattern with clear separation of concerns:

```
┌───────────────┐    ┌──────────────┐    ┌───────────────┐
│ React Frontend│───>│ REST API     │───>│ Service Layer │
│ (TypeScript)  │<───│ (Controllers)│<───│ (Business     │
└───────────────┘    └──────────────┘    │  Logic)       │
                                         └───────┬───────┘
                                                 │
                                         ┌───────▼───────┐
                                         │ Data Access   │
                                         │ (Repositories)│
                                         └───────┬───────┘
                                                 │
                                         ┌───────▼───────┐
                                         │ MySQL Database│
                                         └───────────────┘
```

## 🛠️ Technologies Used

### Frontend
- **React 18**: Component-based UI library
- **TypeScript 4.9**: Type-safe JavaScript superset
- **NextUI**: Modern UI component library
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API requests
- **React Query**: Data fetching and caching
- **Context API**: State management
- **Jest & React Testing Library**: Testing framework

### Backend
- **Java 17**: Programming language
- **Spring Boot 3.0**: Application framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Data access framework
- **Hibernate**: ORM for database operations
- **MySQL 8**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **JUnit & Mockito**: Testing frameworks

### DevOps & Tools
- **Maven**: Build automation
- **npm**: Package management
- **Git & GitHub**: Version control
- **GitHub Actions**: CI/CD pipeline
- **Docker**: Containerization
- **JaCoCo**: Code coverage
- **SonarQube**: Code quality

## 📸 Screenshots

_Include screenshots of key pages like student dashboard, course view, calendar, admin panel, etc._

## 🚀 Installation

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.8 or higher

### Database Setup

in your mysql workbench
First run the Manage Setup.sql
Then run Manage Insert.sql

### Backend Setup
1. Clone the repository:
```bash
git clone https://github.com/ashiduDissanayake/Student-management-system.git
cd Student-management-system/backend
```

2. Configure the database:
```
# src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/edumanager
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Build and run the application:
```bash
mvn clean install
mvn spring-boot:run
```
  Or you can use intellij or visual code to run the main java file

The backend will start on `http://localhost:8080`

### Frontend Setup
1. Install dependencies:
```bash
npm i --legacy-peer-deps
```

3. Configure the API URL:
```
# lib/api.ts
API_BASE_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm run dev
```
or
```
npm start
```

The frontend will start on `http://localhost:3000`

## 🖥️ Usage

### Default Accounts

The system comes with pre-configured accounts for testing:

1. **Student Account**
   - Email: student1@example.com
   - Password: 123456

2. **Teacher Account**
   - Email: teacher1@example.com
   - Password: 123456

3. **Admin Account**
   - Email: admin@example.com
   - Password: 123456

### Basic Workflow

1. **Student Journey**:
   - Log in with student credentials
   - View enrolled courses on the dashboard
   - Check upcoming assignments and class schedule
   - Submit assignments and track grades

2. **Teacher Journey**:
   - Log in with teacher credentials
   - Manage courses and class schedules
   - Create assignments and grade submissions
   - Track student performance

3. **Admin Journey**:
   - Log in with admin credentials
   - Manage user accounts and permissions
   - Configure system settings
   - Generate reports and analytics

## 📚 API Documentation

The REST API is documented using OpenAPI/Swagger and can be accessed at `http://localhost:8080/swagger-ui.html` when the backend is running.

Key API endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Students**: `/api/students`, `/api/students/{id}`
- **Teachers**: `/api/teachers`, `/api/teachers/{id}`
- **Courses**: `/api/courses`, `/api/courses/{id}`
- **Assignments**: `/api/assignments`, `/api/assignments/{id}`
- **Grades**: `/api/grades`, `/api/students/{id}/grades`

## 📂 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/edumanager/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Custom exceptions
│   │   │   ├── model/           # Entity classes
│   │   │   ├── repository/      # Data access interfaces
│   │   │   ├── security/        # Authentication and authorization
│   │   │   ├── service/         # Business logic
│   │   │   └── EduManagerApplication.java
│   │   └── resources/
│   │       ├── application.properties  # Application configuration
│   │       └── db/                     # Database migrations
│   └── test/                           # Test classes
└── pom.xml                             # Maven configuration
```

### Frontend Structure
```
frontend/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API clients
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin-specific pages
│   │   ├── student/      # Student-specific pages
│   │   └── teacher/      # Teacher-specific pages
│   ├── styles/           # CSS and style definitions
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Entry point
└── package.json          # npm configuration
```

## 👨‍💻 Development Team

This project was developed as part of the "Development of Enterprise Applications" course at the Faculty of Computing.

## 🤝 Contributing

We welcome contributions to EduManager! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 EduManager. All Rights Reserved.
