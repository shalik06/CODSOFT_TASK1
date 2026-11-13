const { Course } = require("../models");
const { Op } = require("sequelize");

// ================= CREATE COURSE =================
const createCourse = async (req, res) => {
    try {
        const { courseName, courseCode, description, duration } = req.body;

        const course = await Course.create({
            courseName,
            courseCode,
            description,
            duration
        });

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        });

    } catch (error) {
        if (
            error.name === "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError"
        ) {
            return res.status(400).json({
                success: false,
                message: error.errors.map(err => err.message)
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message
        });
    }
};

// ================= GET ALL COURSES =================
const getAllCourses = async (req, res) => {
    try {
        const {
            search,
            courseCode,
            duration,
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
            "courseName",
            "courseCode",
            "duration",
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

        if (search && search.trim() !== "") {
            where[Op.or] = [
                {
                    courseName: {
                        [Op.like]: `%${search.trim()}%`
                    }
                },
                {
                    courseCode: {
                        [Op.like]: `%${search.trim()}%`
                    }
                }
            ];
        }

        if (courseCode) {
            where.courseCode = {
                [Op.like]: `%${courseCode}%`
            };
        }

        if (duration) {
            where.duration = {
                [Op.like]: `%${duration}%`
            };
        }

        // Pagination
        const offset = (currentPage - 1) * pageSize;

        const { count, rows } = await Course.findAndCountAll({
            where,
            order: [[sortBy, safeOrder]],
            limit: pageSize,
            offset
        });

        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",

            pagination: {
                totalRecords: count,
                currentPage,
                totalPages: Math.ceil(count / pageSize),
                pageSize
            },

            filters: {
                search: search || null,
                courseCode: courseCode || null,
                duration: duration || null,
                sortBy,
                order: safeOrder
            },

            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message
        });
    }
};

// ================= GET COURSE BY ID =================
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course",
            error: error.message
        });
    }
};

// ================= UPDATE COURSE =================
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const allowedFields = [
            "courseName",
            "courseCode",
            "description",
            "duration"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        await course.update(updates);

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course
        });

    } catch (error) {
        if (
            error.name === "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError"
        ) {
            return res.status(400).json({
                success: false,
                message: error.errors.map(err => err.message)
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update course",
            error: error.message
        });
    }
};

// ================= DELETE COURSE =================
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        await course.destroy();

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};