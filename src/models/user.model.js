import { DataTypes } from "sequelize";
import { db } from "../utils/database.js";
import bcrypt from 'bcrypt'
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
    updatedAt: false,
    hooks: {
        beforeCreate: async (user, options) => {
            const hashed = await bcrypt.hash(user.password, 10);
            user.password = hashed;
        }
    }
});


export { User };