const app = require('../src/app');
const { connectDB, sequelize } = require('../src/config/db');

// Connect to the database on serverless function startup
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      await sequelize.sync();
      isConnected = true;
      console.log('Database connected and synced in Vercel environment');
    } catch (error) {
      console.error('Failed to connect to DB in Vercel environment:', error);
    }
  }
  next();
});

// Export the Express app for Vercel
module.exports = app;
