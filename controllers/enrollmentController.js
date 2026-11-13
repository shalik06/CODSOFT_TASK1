const { Enrollment, Student, Course } = require("../models");

// ================= CREATE ENROLLMENT =================
const createEnrollment = async (req, res) => {
    try {
        const { studentId, courseId, enrollmentDate, status } = req.body;

        if (!studentId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Student ID and Course ID are required"
            });
        }

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const enrollment = await Enrollment.create({
            studentId,
            courseId,
            enrollmentDate,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Enrollment created successfully",
            data: enrollment
        });

    } catch (error) {
        if (
            error.name === "SequelizeValidationError" ||
            error.name === "SequelizeForeignKeyConstraintError"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= GET ALL ENROLLMENTS =================
const getAllEnrollments = async (req, res) => {
    try {
        const {
            studentId,
            courseId,
            status,
            enrollmentDate,
            sortBy = "id",
            order = "ASC",
            page = "1",
            limit = "10"
        } = req.query;

        // Validate pagination
        const currentPage = Number(page);
        const pageSize = Number(limit);

        if (
            !Number.isInteger(currentPage) ||
            currentPage < 1 ||
            !Number.isInteger(pageSize) ||
            pageSize < 1 ||
            pageSize > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive integer and limit must be between 1 and 100"
            });
        }

        // Validate sorting
        const allowedSortFields = [
            "id",
            "studentId",
            "courseId",
            "enrollmentDate",
            "status",
            "createdAt"
        ];

        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sortBy field"
            });
        }

        const safeOrder = String(order).toUpperCase();

        if (!["ASC", "DESC"].includes(safeOrder)) {
            return res.status(400).json({
                success: false,
                message: "Order must be ASC or DESC"
            });
        }

        // Build filters
        const where = {};

        if (studentId !== undefined) {
            const parsedStudentId = Number(studentId);

            if (!Number.isInteger(parsedStudentId) || parsedStudentId < 1) {
                return res.status(400).json({
                    success: false,
                    message: "studentId must be a positive integer"
                });
            }

            where.studentId = parsedStudentId;
        }

        if (courseId !== undefined) {
            const parsedCourseId = Number(courseId);

            if (!Number.isInteger(parsedCourseId) || parsedCourseId < 1) {
                return res.status(400).json({
                    success: false,
                    message: "courseId must be a positive integer"
                });
            }

            where.courseId = parsedCourseId;
        }

        if (status !== undefined) {
            const allowedStatuses = [
                "active",
                "completed",
                "cancelled"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Status must be active, completed, or cancelled"
                });
            }

            where.status = status;
        }

        if (enrollmentDate !== undefined) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(enrollmentDate) ||
                Number.isNaN(Date.parse(enrollmentDate))) {
                return res.status(400).json({
                    success: false,
                    message: "enrollmentDate must be in YYYY-MM-DD format"
                });
            }

            where.enrollmentDate = enrollmentDate;
        }

        // Pagination
        const offset = (currentPage - 1) * pageSize;

        const { count, rows } = await Enrollment.findAndCountAll({
            where,
            include: [
                { model: Student, as: "student" },
                { model: Course, as: "course" }
            ],
            order: [[sortBy, safeOrder]],
            limit: pageSize,
            offset
        });

        return res.status(200).json({
            success: true,
            message: "Enrollments retrieved successfully",

            pagination: {
                totalRecords: count,
                currentPage,
                totalPages: Math.ceil(count / pageSize),
                pageSize
            },

            filters: {
                studentId: studentId || null,
                courseId: courseId || null,
                status: status || null,
                enrollmentDate: enrollmentDate || null,
                sortBy,
                order: safeOrder
            },

            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrollments",
            error: error.message
        });
    }
};

// ================= GET ENROLLMENT BY ID =================
const getEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id, {
            include: [
                { model: Student, as: "student" },
                { model: Course, as: "course" }
            ]
        });

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: enrollment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= UPDATE ENROLLMENT =================
const updateEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        const allowedFields = [
            "studentId",
            "courseId",
            "enrollmentDate",
            "status"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (updates.studentId !== undefined) {
            const student = await Student.findByPk(updates.studentId);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found"
                });
            }
        }

        if (updates.courseId !== undefined) {
            const course = await Course.findByPk(updates.courseId);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }
        }

        await enrollment.update(updates);

        return res.status(200).json({
            success: true,
            message: "Enrollment updated successfully",
            data: enrollment
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ================= DELETE ENROLLMENT =================
const deleteEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        await enrollment.destroy();

        return res.status(200).json({
            success: true,
            message: "Enrollment deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createEnrollment,
    getAllEnrollments,
    getEnrollmentById,
    updateEnrollment,
    deleteEnrollment
};