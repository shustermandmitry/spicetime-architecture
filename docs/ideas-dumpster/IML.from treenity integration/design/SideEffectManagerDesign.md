# Side-Effect Manager Design

## Overview

The Side-Effect Manager in IML handles the execution of external triggers and changes resulting from `$action` or
similar directives. It ensures that IML can safely and consistently manage side-effects such as notifications, API
calls, and system updates.

---

## Key Responsibilities

1. **Trigger Execution**: Executes real-time side-effects based on `$action` or external directives.
2. **Event Logging**: Tracks side-effects for auditing, debugging, and re-execution purposes.
3. **Error Isolation**: Handles partial failures while maintaining the overall system's stability.

---

## Core Architecture

The Side-Effect Manager operates via the following layers:

### 1. **Trigger Layer**

Responsible for executing the actual side-effects.

Types of Triggers:

- **Notification Trigger**: Sends in-app notifications or alerts.
- **API Trigger**: Performs external REST or GraphQL API calls.
- **Task Trigger**: Queues background jobs such as data synchronization.

---

### 2. **Logging Layer**

Tracks all side-effects, ensuring they are auditable and can be re-triggered if necessary.

**Logged Attributes:**

- Timestamp of execution.
- Trigger metadata (e.g., type, parameters).
- Execution status (e.g., success, error).

**Example Log Entry:**

```json
{
  "timestamp": "2023-11-15T15:03:25Z",
  "trigger": "Email",
  "parameters": {
    "to": "team@company.com",
    "subject": "Weekly Status Report"
  },
  "status": "Success"
}
```

---

### 3. **Error Handling Layer**

Manages errors resulting from failed side-effects:

- **Retry Mechanism**: Ensures temporary issues such as network outages are retried.
- **Fallback Actions**: Executes predefined alternatives for critical failures.

**Example Fallback:**

```plaintext
$action: Notify
--to=admin
fallback: LogError --msg="Notification Failure"
```

---

## Workflow

### Step 1: Receive Action

- Actions are received by the Side-Effect Manager from the Action Processor.

**Example Input Action:**

```json
{
  "type": "Notify",
  "parameters": { "to": "admin", "msg": "System update required." }
}
```

---

### Step 2: Execute Trigger

- The Manager determines the corresponding trigger type and executes it.

**Example Trigger Execution:**

```javascript
if (action.type === "Notify") {
    notificationService.send(action.parameters.to, action.parameters.msg);
} else if (action.type === "API") {
    apiService.post(action.parameters.endpoint, action.parameters.data);
}
```

---

### Step 3: Log Execution

- Each trigger's execution details are logged for future reference.

**Success Log:**

```json
{
  "trigger": "Notify",
  "timestamp": "2023-11-15T15:03:25Z",
  "status": "Success"
}
```

**Error Log:**

```json
{
  "trigger": "Notify",
  "timestamp": "2023-11-15T15:05:12Z",
  "status": "Error",
  "errorMessage": "User not found"
}
```

---

### Step 4: Handle Errors

- If the trigger fails:
    - Retry logic or fallback actions are executed.
    - Errors are logged for troubleshooting.

**Retry Mechanism Example:**

```javascript
retry(action, 3, (error) => {
    logError(error);
    fallback(action.fallback);
});
```

---

## Built-In Triggers

1. **Notify Trigger**
    - Sends in-app notifications.
    - Parameters: `to`, `msg`.

2. **Email Trigger**
    - Sends an email notification via SMTP or API integration.
    - Parameters: `to`, `subject`, `body`.

3. **API Trigger**
    - Executes an external API call.
    - Parameters: `endpoint`, `method`, `data`.

4. **Log Trigger**
    - Logs an error or message to a central system.
    - Parameters: `msg`.

---

## Extensibility

The Side-Effect Manager is designed to support custom triggers:

1. Register a new trigger:
   ```javascript
   sideEffectManager.registerTrigger("CustomTrigger", (params) => {
     customService.executeTask(params);
   });
   ```
2. Define fallback logic and retry policies for the new trigger.

---

## Benefits

1. **Reliability**: Handles side-effects without compromising the document state.
2. **Auditing**: Comprehensive logging ensures side-effects are traceable.
3. **Resilience**: Error handling and fallback mechanisms provide fault tolerance.
4. **Extensibility**: Easily add support for new triggers or external services.