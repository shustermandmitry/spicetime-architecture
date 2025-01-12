# JSX Template + IML Builder Design

## Overview

This document describes the design and implementation of a JSX-based template system integrated with the IML builder.
The purpose of this architecture is to create reusable, dynamic document structures that are authored using IML syntax,
rendered as React JSX components, and visualized as HTML for the end user.

---

## Key Concepts

### 1. **Templates as JSX Strings**

Templates are defined as reusable JSX string components, allowing for flexible composition. These templates form the
basis of the document structure, rendering dynamic content based on provided attributes.

**Template Example:**

```typescript
const ChecklistItemTemplate = (props: { text: string }) => `
  <div className="checklist-item">
    <input type="checkbox" />
    <span>${props.text}</span>
  </div>
`;
```

---

### 2. **IML Builder**

The IML Builder parses `$use` and `$template` tags in IML syntax and constructs the document hierarchy using the defined
templates.

**IML Example:**

```plaintext
$template: ChecklistItem
--text="Undefined task"

$use: ChecklistItem
--text="Define the architecture"
```

The IML Builder maps the templates and renders the specified content dynamically.

---

### 3. **React for Rendering**

React is used to render the JSX templates as DOM elements. This allows for interactive, user-friendly content managed
entirely through React's declarative component system.

---

## Architectural Workflow

### Step 1: Define Templates

Templates are defined as JSX string functions or React components. They establish the visual structure and dynamic
behavior for reusable document elements.

**Template Example:**

```tsx
const ChecklistItemTemplate = (props: { text: string }) => `
  <div className="checklist-item">
    <input type="checkbox" />
    <span>${props.text}</span>
  </div>
`;
```

---

### Step 2: Parse and Execute IML

IML syntax is parsed to map `$use` tags to the corresponding templates. Attributes specified within `$use` tags are
provided as props to the templates, enabling dynamic content generation.

**IML Input Example:**

```plaintext
$template: ChecklistItem
--text="Task Name"

$use: ChecklistItem
--text="Finalize the design"
```

**Parsed Output:**

```json
{
  "type": "ChecklistItem",
  "attributes": {
    "text": "Finalize the design"
  }
}
```

---

### Step 3: Build the Document

The IML Builder composes templates with their attributes into a cohesive document structure. This is achieved by
resolving `$use` tags and applying any overrides during the composition process.

**Composition Example:**

```typescript
class IMLBuilder {
  static buildTemplate(type: string, props: Record<string, string>) {
    switch (type) {
      case "ChecklistItem":
        return ChecklistItemTemplate(props);
      default:
        throw new Error(`Unknown template type: ${type}`);
    }
  }

  static composeDocument(items: { type: string; props: Record<string, string> }[]) {
    return `
      <div className="document">
        ${items.map((item) => this.buildTemplate(item.type, item.props)).join("")}
      </div>
    `;
  }
}
```

---

### Step 4: Render with React

Finally, the IML Builder composes the JSX components, which are then rendered as dynamic, interactive HTML via React.

**Rendering Example:**

```tsx
import React from "react";

const ChecklistItem: React.FC<{ text: string }> = ({text}) => (
    <div className="checklist-item">
        <input type="checkbox"/>
        <span>{text}</span>
    </div>
);

const Document: React.FC<{ items: string[] }> = ({items}) => (
    <div className="document">
        <h1>To-Do List</h1>
        {items.map((item, index) => (
            <ChecklistItem key={index} text={item}/>
        ))}
    </div>
);

export default function ToDoApp() {
    const items = ["Define the architecture", "Implement fault tolerance"];
    return <Document items={items}/>;
}
```

---

## Examples

### Example 1: Rendering a Document

Generate a document with reusable templates dynamically.

**IML Input:**

```plaintext
$template: ChecklistItem
--text="Unknown Task"

$use: ChecklistItem
--text="Create a project roadmap"

$use: ChecklistItem
--text="Validate the system design"
```

**Rendered Output (HTML):**

```html

<div class="document">
    <div class="checklist-item">
        <input type="checkbox"/>
        <span>Create a project roadmap</span>
    </div>
    <div class="checklist-item">
        <input type="checkbox"/>
        <span>Validate the system design</span>
    </div>
</div>
```

---

## Benefits

1. **Reusability**: Templates can be reused across different parts of the document, improving maintainability.
2. **Flexibility**: Attributes allow for dynamic customization of template content.
3. **Interactivity**: React enables end users to interact seamlessly with the generated document.
4. **Extensible Architecture**: New templates and builder enhancements can be easily added to accommodate more complex
   workflows.

---

## Extending Functionality

### Custom Templates

Developers can define additional templates using JSX or React:

```tsx
const CustomTemplate = (props: { title: string; description: string }) => `
  <div className="custom-template">
    <h1>${props.title}</h1>
    <p>${props.description}</p>
  </div>
`;
```

### Dynamic Data Integration

Templates can fetch data dynamically (e.g., API calls):

```tsx
const DynamicChecklistItem: React