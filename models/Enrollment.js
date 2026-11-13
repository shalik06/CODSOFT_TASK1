const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Enrollment = sequelize.define(
    "Enrollment",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        enrollmentDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        status: {
            type: DataTypes.ENUM("active", "completed", "cancelled"),
            allowNull: false,
            defaultValue: "active"
        }
    },
    {
        tableName: "enrollments",
        timestamps: true
    }
);

module.exports = Enrollment;