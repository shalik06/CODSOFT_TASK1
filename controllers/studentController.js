const { Student } = require("../models");
const { Op } = require("sequelize");

// ================= CREATE STUDENT =================
const createStudent = async (req, res) => {
    try {
        const { name, email, phone, age, address } = req.body;

        const student = await Student.create({
            name,
            email,
            phone,
            age,
            address
        });

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ================= GET ALL STUDENTS =================
// Search + Filter + Sort + Pagination
const getAllStudents = async (req, res) => {
    try {
        const {
            search,
            age,
            minAge,
            maxAge,
            sortBy = "id",
            order = "ASC",
            page = 1,
            limit = 10
        } = req.query;

        // Pagination validation
        const currentPage = Math.max(parseInt(page, 10) || 1, 1);
        const pageSize = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            100
        );

        const offset = (currentPage - 1) * pageSize;

        // Allowed sorting fields
        const allowedSortFields = [
            "id",
            "name",
            "email",
            "age",
            "createdAt"
        ];

        const safeSortBy = allowedSortFields.includes(sortBy)
            ? sortBy
            : "id";

        const safeOrder = order.toUpperCase() === "DESC"
            ? "DESC"
            : "ASC";

        // Search and filter conditions
        const where = {};

        // Search by name or email
        if (search && search.trim() !== "") {
            where[Op.or] = [
                { name: { [Op.like]: `%${search.trim()}%` } },
                { email: { [Op.like]: `%${search.trim()}%` } }
            ];
        }

        // Exact age filter
        if (age !== undefined) {
            const parsedAge = Number(age);

            if (!Number.isInteger(parsedAge)) {
                return res.status(400).json({
                    success: false,
                    message: "Age must be a valid integer"
                });
            }

            where.age = parsedAge;
        }

        // Minimum age filter
        if (minAge !== undefined) {
            const parsedMinAge = Number(minAge);

            if (!Number.isInteger(parsedMinAge)) {
                return res.status(400).json({
                    success: false,
                    message: "minAge must be a valid integer"
                });
            }

            where.age = {
                ...(where.age && typeof where.age === "object"
                    ? where.age
                    : {}),
                [Op.gte]: parsedMinAge
            };
        }

        // Maximum age filter
        if (maxAge !== undefined) {
            const parsedMaxAge = Number(maxAge);

            if (!Number.isInteger(parsedMaxAge)) {
                return res.status(400).json({
                    success: false,
                    message: "maxAge must be a valid integer"
                });
            }

            where.age = {
                ...(where.age && typeof where.age === "object"
                    ? where.age
                    : {}),
                [Op.lte]: parsedMaxAge
            };
        }

        if (
            minAge !== undefined &&
            maxAge !== undefined &&
            Number(minAge) > Number(maxAge)
        ) {
            return res.status(400).json({
                success: false,
                message: "minAge cannot be greater than maxAge"
            });
        }

        // Fetch students
        const { count, rows } = await Student.findAndCountAll({
            where,
            order: [[safeSortBy, safeOrder]],
            limit: pageSize,
            offset
        });

        return res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            pagination: {
                totalRecords: count,
                currentPage,
                totalPages: Math.ceil(count / pageSize),
                pageSize
            },
            filters: {
                search: search || null,
                age: age || null,
                minAge: minAge || null,
                maxAge: maxAge || null,
                sortBy: safeSortBy,
                order: safeOrder
            },
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= GET STUDENT BY ID =================
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= UPDATE STUDENT =================
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const allowedFields = [
            "name",
            "email",
            "phone",
            "age",
            "address"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        await student.update(updates);

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ================= DELETE STUDENT =================
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await student.destroy();

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= EXPORT CONTROLLERS =================
module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};