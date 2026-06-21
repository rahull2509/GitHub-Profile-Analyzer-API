require('dotenv').config();
const app = require('./app');
const { connectDB, sequelize } = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Sync models (creates table if not exists)
    // Note: use { alter: true } for dev to update schema safely, but standard sync() is safer for general usage
    await sequelize.sync(); 
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
