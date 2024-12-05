const { startGateway } = require('./gateway');

startGateway().catch(error => {
  console.error('Failed to start gateway:', error);
  process.exit(1);
});