const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

// CREATE COURSE
router.post("/", createCourse);

// GET ALL COURSES
router.get("/", getAllCourses);

// GET COURSE BY ID
router.get("/:id", getCourseById);

// UPDATE COURSE
router.put("/:id", updateCourse);

// DELETE COURSE
router.delete("/:id", deleteCourse);

module.exports = router;