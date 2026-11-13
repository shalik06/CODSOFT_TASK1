const Student = require("./Student");
const Course = require("./Course");
const Enrollment = require("./Enrollment");

// Define Student and Enrollment Relationship
Student.hasMany(Enrollment, {
    foreignKey: "studentId",
    as: "enrollments",
    onDelete: "CASCADE"
});

Enrollment.belongsTo(Student, {
    foreignKey: "studentId",
    as: "student"
});

// Define Course and Enrollment Relationship
Course.hasMany(Enrollment, {
    foreignKey: "courseId",
    as: "enrollments",
    onDelete: "CASCADE"
});

Enrollment.belongsTo(Course, {
    foreignKey: "courseId",
    as: "course"
});

console.log("All Models and Relationships Loaded Successfully!");

module.exports = {
    Student,
    Course,
    Enrollment
};