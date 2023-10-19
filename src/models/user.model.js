import { DataTypes } from "sequelize";
import db from "../utils/database.js";

const User = db.define('Users', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'Users', 
    timestamps: true,
    createdAt: true,
    updatedAt:false 
});


export {User};