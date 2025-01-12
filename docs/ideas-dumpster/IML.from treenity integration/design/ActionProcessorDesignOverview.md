# Action Processor Design

## Overview

The Action Processor in IML is designed to interpret and execute the logic of `$action` tags embedded in IML documents.
These actions allow authors to define interactive and programmatically controlled behaviors to enhance dynamic workflows
and user experience.

---

## Key Responsibilities

1. **Action Parsing**: Extract and validate actionable commands, parameters, and contexts from `$action` tags.
2. **Task Triggering**: Initiate processes such as notifications, background jobs, or API calls.
3. **Side-Effect Management**: Safely handle any downstream effects triggered by an action without disrupting the
   document state.

---

## Workflow

### Step 1: Extract and Validate Actions

- The Action Processor identifies all `$action` tags during the parsing stage.
- Actions are extracted along with their parameters (e.g., `$action: Notify --to=admin`).

**Example Input:**

```plaintext
$action: Notify
--to=admin
--msg="Critical system update required"
```

**Output After Validation:**

```json
{
  "type": "Notify",
  "target": "admin",
  "message": "Critical system update required"
}
```

---

### Step 2: Process and Queue Actions

- Valid actions are pushed into an execution queue.

**Queued Actions Example:**

```json
[
  {
    "type": "Notify",
    "target": "admin",
    "message": "System update required"
  },
  {
    "type": "Email",
    "target": "team",
    "subject": "Newsletter Update"
  }
]
```

The queue ensures:

- Sequential or parallel execution, depending on action type.
- Error isolation to ensure one failed action doesn't impact others.

---

### Step 3: Execute and Trigger Side Effects

Each action in the queue is processed by the defined handlers:

- **Example Action Handlers:**
    - **Notify**: Displays in-app notifications.
    - **Email**: Sends email notifications using API integrations.
    - **TaskCreate**: Schedules tasks within the system's task manager.

```javascript
const actionHandlers = {
    Notify: ({target, message}) => {
        triggerNotification(target, message);
    },
    Email: ({target, subject}) => {
        emailService.send(target, subject);
    },
};
```

---

## Action Tag Syntax

### General Syntax

```plaintext
$action: <ActionType>
--<parameter>=<value>
```

### Built-in Actions

1. **Notify**
    - Parameters: `--to`, `--msg`.
    - Example:
      ```plaintext
      $action: Notify
      --to=admin
      --msg="Critical system update required"
      ```

2. **ScheduleTask**
    - Parameters: `--name`, `--time`.
    - Example:
      ```plaintext
      $action: ScheduleTask
      --name="System Backup"
      --time="2023-12-01T10:00:00Z"
      ```

3. **Email**
    - Parameters: `--to`, `--subject`.
    - Example:
      ```plaintext
      $action: Email
      --to=team
      --subject="Quarterly Report"
      ```

---

## Error Handling in Actions

### Types of Errors

1. **Validation Errors**: Occur when an action tag is malformed or has missing parameters.
    - **Example Error:**
      ```plaintext
      Error: Missing required parameter '--to' in `$action: Notify`.
      ```

2. **Execution Errors**: Occur during the execution of an action (e.g., failed API call).
    - Handled using error logging and retries.

### Resilience Mechanisms

- **Fallback Actions**: Define alternative actions for failures.
  ```plaintext
  $action: Notify
  --to=admin
  fallback: SendEmail --to=support
  ```

- **Retry Logic**: For temporary issues like API timeouts.

---

## Extensibility

Developers can extend the Action Processor to support custom actions:

1. Register a new action type:
   ```javascript
   actionHandlers.CustomAction = ({ param1, param2 }) => {
     customService.execute(param1, param2);
   };
   ```
2. Define syntax rules and validation logic for the new action.

---

## Benefits

1. **Dynamic Interactivity**: Enables task automation and triggers directly from documents.
2. **Seamless Integration**: Works with external systems like APIs and task managers.
3. **Resilient Execution**: Error handling and retry mechanisms ensure reliable processing of actions.
4. **Customizable**: Easily extended with new actions for specialized workflows.