const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database Configuration
const { connectDB, sequelize } = require("./config/database");

// Import Models
const { Student, Course, Enrollment } = require("./models");

// Import Routes
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Student Record Management API",
        status: "Server is running successfully"
    });
});

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        database: "Connected"
    });
});

// ================= STUDENT ROUTES =================
app.use("/api/students", studentRoutes);

// ================= COURSE ROUTES =================
app.use("/api/courses", courseRoutes);

// ================= ENROLLMENT ROUTES =================
app.use("/api/enrollments", enrollmentRoutes);

// ================= 404 ROUTE =================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        await sequelize.sync();

        console.log("Database Tables Created Successfully!");
        console.log("Student Model:", Student.name);
        console.log("Course Model:", Course.name);
        console.log("Enrollment Model:", Enrollment.name);

        app.listen(PORT, () => {
            console.log("-----------------------------------");
            console.log(`Server running at http://localhost:${PORT}`);
            console.log("Student API: /api/students");
            console.log("Course API: /api/courses");
            console.log("Enrollment API: /api/enrollments");
            console.log("Student Record Management API Ready!");
            console.log("-----------------------------------");
        });

    } catch (error) {
        console.error("Server Startup Failed:", error.message);
        process.exit(1);
    }
};

startServer();