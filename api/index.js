try {
  const app = require('../src/app');
  const { connectDB, sequelize } = require('../src/config/db');

  let isConnected = false;

  module.exports = async (req, res) => {
    if (!isConnected) {
      try {
        await connectDB();
        await sequelize.sync(); 
        isConnected = true;
        console.log('Database connected in Vercel environment');
      } catch (error) {
        console.error('Failed to connect to DB in Vercel:', error.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal Server Error: Database Connection Failed',
          error: error.message
        });
      }
    }

    // Forward the request to Express
    return app(req, res);
  };
} catch (err) {
  console.error('Initialization Error:', err);
  module.exports = (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Initialization Error',
      error: err.message,
      stack: err.stack
    });
  };
}
