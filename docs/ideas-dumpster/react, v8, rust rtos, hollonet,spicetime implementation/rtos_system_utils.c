// Barebones RTOS code (Pseudo C)
#include "rtos_system.h"

void processCommand(char* command) {
  if (strcmp(command, "START_SYNC") == 0) {
    startHolonetSync();
  }
}

void feedbackEvent(char* eventType) {
  if (strcmp(eventType, "SYNC_COMPLETE") == 0) {
    notifyJavascript("SYNC_COMPLETE");
  }
}