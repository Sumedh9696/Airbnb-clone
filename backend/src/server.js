const dotenv = require('dotenv');
const app = require('./app');
const { connectDB, sequelize } = require('./config/db');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync database models (alter: true updates schemas gracefully in dev)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('[Database] All models synchronized successfully.');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Airbnb Clone API running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
