// This JS layer bridges React components and the RTOS

// Send a command to the RTOS system
export const sendCommandToRTOS = (command) => {
  // Simulate RTOS interaction: Queue the command
  console.log(`[RTOS]: Command sent -> ${command}`);
  rtos.sendToQueue(command); // Hypothetical RTOS API call
};

// Register for RTOS feedback events
export const onRTOSFeedback = (callback) => {
  // Mock listener for RTOS events
  rtos.on('feedback', callback); // Register for RTOS feedback events
};