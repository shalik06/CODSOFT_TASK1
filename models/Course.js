const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Course = sequelize.define(
    "Course",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        courseName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Course name is required"
                }
            }
        },

        courseCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: {
                msg: "Course code already exists"
            },
            validate: {
                notEmpty: {
                    msg: "Course code is required"
                }
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        duration: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Course duration is required"
                }
            }
        }
    },
    {
        tableName: "courses",
        timestamps: true
    }
);

module.exports = Course;