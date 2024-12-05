const { startAuthService } = require('./service');

startAuthService().catch(error => {
  console.error('Failed to start auth service:', error);
  process.exit(1);
});