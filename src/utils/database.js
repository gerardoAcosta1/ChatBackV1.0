import { Sequelize } from "sequelize"
import "dotenv/config.js";

const db = new Sequelize( 
  { host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
  });

async function initializeDatabase() {
  try {
    await db.authenticate();
    await db.sync();
    
    console.log('Connected to the database and synchronized models.');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}
export {
  initializeDatabase,
  db
}

/*

const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

export default db

const db = new Sequelize( 
  { host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
  });
  
export default db
*/