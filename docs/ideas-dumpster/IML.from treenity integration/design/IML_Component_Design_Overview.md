# IML Component Design

## Overview

IML divides its functionality into modular, reusable components to ensure flexibility and maintainability. Each
component handles a specific concern, allowing the system to work seamlessly as a whole. Below is a breakdown of the
core components and their responsibilities.

---

## Core Components

### 1. **IML Parser**

The parser is the primary entry point for interpreting raw IML documents and converting them into structured objects.

**Responsibilities:**

- Tokenize raw input into meaningful units (e.g., `$title`, `$add`, `$action`).
- Validate syntax and enforce basic IML rules.
- Generate a hierarchical document tree, serving as the foundation for further rendering and processing.

---

### 2. **Attribute Propagation Engine**

The propagation engine ensures that document-wide attributes (like `$add`) cascade into appropriate sections.

**Responsibilities:**

- Apply inheritance and scoping rules.
- Resolve conflicts caused by overlapping tag definitions.
- Structure content so that minimal tagging is required during authoring.

---

### 3. **JSX Renderer**

Powered by React, the renderer translates IML's hierarchical structure into dynamic, reusable JSX components.

**Responsibilities:**

- Generate live previews of user input.
- Map IML sections to React elements, handling styles and layouts dynamically.
- Enable seamless integration into frontend frameworks.

---

### 4. **Action Processor**

This component processes `$action` tags embedded in IML documents. Actions are transformed into actionable side-effects
or user-interface elements.

**Responsibilities:**

- Queue tasks for manual or automated processing.
- Attach handlers for actions like notifications, emails, or API calls.
- Render proposed tasks into task boards or dashboards.

---

### 5. **Side-Effect Manager**

The side-effect manager processes triggers resulting from `$action` or similar directives.

**Responsibilities:**

- Execute real-time updates (e.g., sending notifications).
- Log and track execution of specific triggers for accountability.

---

## Interaction Between Components

1. **IML Parser** generates a document tree →  
   feeds into **Attribute Propagation Engine.**

2. The propagated document passes through the **JSX Renderer** →  
   producing a live preview.

3. Embedded `$action` tags route to **Action Processor** and/or **Side-Effect Manager**.

---

## Benefits of Componentization

1. **Reusability**: Each component can be improved independently.
2. **Scalability**: New directives or features can plug into the system easily.
3. **Performance**: Focused components ensure optimal handling of each stage.