import { DataTypes } from 'sequelize';
import { db } from '../utils/database.js';

const Message = db.define('Messages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ConversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SenderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Messages',
  timestamps: true,
  createdAt: true,
  updatedAt: false
});


export { Message };