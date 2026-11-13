const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Student = sequelize.define(
    "Student",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Student name is required"
                },
                len: {
                    args: [3, 100],
                    msg: "Name must contain 3 to 100 characters"
                }
            }
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: {
                msg: "Email already exists"
            },
            validate: {
                isEmail: {
                    msg: "Please enter a valid email address"
                },
                notEmpty: {
                    msg: "Email is required"
                }
            }
        },

        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Phone number is required"
                }
            }
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Age must be an integer"
                },
                min: {
                    args: [16],
                    msg: "Age must be at least 16"
                },
                max: {
                    args: [100],
                    msg: "Age cannot exceed 100"
                }
            }
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "students",
        timestamps: true
    }
);

module.exports = Student;