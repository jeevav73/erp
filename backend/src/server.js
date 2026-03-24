require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║   Digital Agency ERP Backend              ║
  ║   Server running on port ${PORT}           ║
  ║   Environment: ${process.env.NODE_ENV}                ║
  ╚═══════════════════════════════════════════╝
  `);
});

// Error handling
server.on('error', (error) => {
  console.error('❌ Server Error:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});
