import { DataTypes } from "sequelize";
import db from "../utils/database.js";

const Participant = db.define('Participants', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ConversationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'Participants', 
    timestamps: true,
    createdAt: true,
    updatedAt:false 
});

export {Participant};