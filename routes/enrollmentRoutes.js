const express = require("express");
const router = express.Router();

const {
    createEnrollment,
    getAllEnrollments,
    getEnrollmentById,
    updateEnrollment,
    deleteEnrollment
} = require("../controllers/enrollmentController");

// CREATE ENROLLMENT
router.post("/", createEnrollment);

// GET ALL ENROLLMENTS
router.get("/", getAllEnrollments);

// GET ENROLLMENT BY ID
router.get("/:id", getEnrollmentById);

// UPDATE ENROLLMENT
router.put("/:id", updateEnrollment);

// DELETE ENROLLMENT
router.delete("/:id", deleteEnrollment);

module.exports = router;