import { DataTypes } from 'sequelize';
import db from '../utils/database.js';

const Conversation = db.define('Conversations', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'Conversations', 
  timestamps: true,
  createdAt: true,
  updatedAt:false 
});


export { Conversation };