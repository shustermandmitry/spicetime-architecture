# Template Handler Design

## Overview

The Template Handler in IML is responsible for managing reusable templates that simplify complex document structures. By
using custom templates, users can define, extend, and override content structures, promoting modularity and consistency
across documents.

---

## Key Responsibilities

1. **Template Definition**: Parse and store reusable templates defined by users or the system.
2. **Template Insertion**: Insert templates into target sections of the document tree.
3. **Attribute Overrides**: Allow template attributes and content to be extended or overridden.

---

## Template Workflow

### Step 1: Define Templates

Templates are defined within the document, enabling structured content to be reused.

**Example Template Definition:**

```plaintext
$template: ChecklistItem
--text="Undefined text"
```

---

### Step 2: Store Templates

Templates are stored in a global registry for retrieval and reuse. Each template is associated with a unique name.

**Registry Example:**

```json
{
  "templates": {
    "ChecklistItem": {
      "type": "template",
      "attributes": {
        "text": "Undefined text"
      }
    }
  }
}
```

---

### Step 3: Insert Templates

Templates are inserted into the document using the `$use` directive.

**Example Insertion:**

```plaintext
$use: ChecklistItem
--text="Define system architecture"
```

**Resolved Output:**

```json
{
  "type": "ChecklistItem",
  "attributes": {
    "text": "Define system architecture"
  }
}
```

---

### Step 4: Attribute Overrides

When a template is reused, its attributes can be overridden by specifying new values in the `$use` tag.

**Example Override:**

```plaintext
$use: ChecklistItem
--text="Implement fault tolerance strategies"
```

Final Output:

```json
{
  "type": "ChecklistItem",
  "attributes": {
    "text": "Implement fault tolerance strategies"
  }
}
```

---

## Syntax

### Define Template

```plaintext
$template: <TemplateName>
--<attribute>=<defaultValue>
```

### Use Template

```plaintext
$use: <TemplateName>
--<attribute>=<value>
```

---

## Key Features

### 1. **Inheritance**

Templates can inherit from other templates, enabling multilevel reusability.

**Example Template Inheritance:**

```plaintext
$template: Task
--title="Unnamed Task"

$template: SubTask
--parent="Task"
--title="Unnamed SubTask"
```

---

### 2. **Dynamic Attributes**

Attributes within templates can be computed dynamically or depend on external data provided during usage.

**Example Dynamic Attribute:**

```plaintext
$template: UserGreeting
--name="User"

$use: UserGreeting
--name="John Doe"
```

---

### 3. **Error Handling**

- **Missing Templates**: Throws an error if a non-existent template is invoked.
  ```plaintext
  Error: Template "NonExistentTemplate" not found.
  ```

- **Circular References**: Detects circular dependencies between templates.
  ```plaintext
  Error: Circular reference detected in template "TemplateA".
  ```

---

## Workflow Benefits

1. **Modularity**: Encourages reusable document structures for consistent formatting.
2. **Flexibility**: Enables customizable and extensible attributes during template usage.
3. **Maintainability**: Reduces repetition and ensures centralized updates for templates.

---

## Example Use Case

### Defining and Using Templates

```plaintext
$template: TaskItem
--title="Undefined Task"
--priority="Medium"

$use: TaskItem
--title="Complete architectural design"
--priority="High"
```

**Output:**

```json
{
  "type": "TaskItem",
  "attributes": {
    "title": "Complete architectural design",
    "priority": "High"
  }
}
```

---

## Extensibility

### Register Custom Templates from Code

Developers can define additional templates programmatically:

```javascript
templateHandler.register("CustomTemplate", {
  type: "Custom",
  attributes: { key: "value" },
});
```

### Dynamic Data Sources

Templates can fetch attributes dynamically from external sources, such as APIs or databases.

---

Let me know if you need further assistance or if you'd like to continue to another file! 😊