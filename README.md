# CODSOFT_TASK1
Developed a Student Record Management REST API using Node.js, Express.js, MySQL, and Sequelize ORM. Implemented CRUD operations for students, courses, and enrollments, along with data validation, search, filtering, sorting, and pagination. Tested all API endpoints using Postman to ensure reliable data management and proper HTTP responses.


# Student Record Management API

A RESTful backend API for managing students, courses, and enrollments. Built using Node.js, Express.js, MySQL, and Sequelize ORM.

## Features

- Student Management — Create, retrieve, update, and delete student records.
- Course Management — Manage course information with complete CRUD operations.
- Enrollment Management — Connect students with courses and manage enrollment status.
- Data Validation — Validate incoming data and handle errors.
- Search and Filtering — Find records using query parameters.
- Sorting — Sort records in ascending or descending order.
- Pagination — Retrieve records in manageable pages.
- Database Relationships — Manage relationships between students, courses, and enrollments.

## Technology Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JavaScript
- Postman
- dotenv
- Git and GitHub

## Project Structure

```text
CODSOFT_TASK1/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── studentController.js
│   ├── courseController.js
│   └── enrollmentController.js
│
├── middleware/
│
├── models/
│   ├── Student.js
│   ├── Course.js
│   ├── Enrollment.js
│   └── index.js
│
├── routes/
│   ├── studentRoutes.js
│   ├── courseRoutes.js
│   └── enrollmentRoutes.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project directory

```bash
cd CODSOFT_TASK1
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=codsoft_student_db
DB_DIALECT=mysql
```

Replace the database password with your own local MySQL password.

Create the MySQL database named `codsoft_student_db` before starting the application.

### 5. Start the server

Development mode:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

The API will run at:

```text
http://localhost:5000
```

## API Endpoints

### Student APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students` | Create a student |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### Course APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/courses` | Create a course |
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course by ID |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### Enrollment APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/enrollments` | Create an enrollment |
| GET | `/api/enrollments` | Get all enrollments |
| GET | `/api/enrollments/:id` | Get enrollment by ID |
| PUT | `/api/enrollments/:id` | Update enrollment |
| DELETE | `/api/enrollments/:id` | Delete enrollment |

## Search, Filtering, Sorting and Pagination

Examples:

**Search students:**

```text
GET /api/students?search=Rahul
```

**Filter courses:**

```text
GET /api/courses?duration=6 Months
```

**Filter enrollments:**

```text
GET /api/enrollments?status=active
```

**Sort courses:**

```text
GET /api/courses?sortBy=courseName&order=DESC
```

**Paginate students:**

```text
GET /api/students?page=1&limit=5
```

## Testing

The API endpoints were tested using Postman.

Tested functionality includes:

- Create, Read, Update, and Delete operations.
- Search and filtering.
- Sorting and pagination.
- Input validation.
- HTTP response status codes.
- Database relationships.

## Author

**Md Shalik**

GitHub: https://github.com/shalik06

## Internship Project

Developed as part of the CodeSoft Internship — Task 1.

**Project:** Student Record Management API
