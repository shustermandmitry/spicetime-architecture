import React, { useState } from 'react';
import { sendCommandToRTOS, onRTOSFeedback } from './rtosInterface';

const HolonetSync = () => {
  const [syncStatus, setSyncStatus] = useState('Idle'); // React-managed state

  const handleSync = () => {
    setSyncStatus('Syncing...');
    sendCommandToRTOS('START_SYNC'); // Send command via a JS interface
  };

  // Subscribe to feedback from RTOS (e.g., sync complete or error)
  onRTOSFeedback((event) => {
    if (event.type === 'SYNC_COMPLETE') {
      setSyncStatus('Synced!');
    } else if (event.type === 'SYNC_ERROR') {
      setSyncStatus('Error!');
    }
  });

  return (
    <div>
      <h1>Holonet Sync Manager</h1>
      <p>Status: {syncStatus}</p>
      <button onClick={handleSync}>Start Sync</button>
    </div>
  );
};

export default HolonetSync;