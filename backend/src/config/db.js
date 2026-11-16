const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Production or PostgreSQL connection string
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  });
} else {
  // Default to zero-config SQLite for seamless local development
  const storagePath = process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[Database] Connected successfully (${sequelize.getDialect().toUpperCase()})`);
  } catch (error) {
    console.error('[Database] Connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
