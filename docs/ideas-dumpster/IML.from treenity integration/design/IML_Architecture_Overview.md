# IML Architecture Overview

## Introduction

IML (Incremental Markup Language) is designed to transform unstructured, free-form documentation into a dynamic,
structured system. Its architecture is split into the following layers, ensuring seamless scalability and flexibility.

---

## Core Layers

### 1. **Raw Document Parser**

Handles the initial parsing of IML tags and raw text input.  
It converts free-form input into **structured document objects** for downstream processing.

Key Responsibilities:

- Identify and process `$title`, `$add`, `$action`, and related IML semantics.
- Generate a lightweight, hierarchical intermediate representation (IR).

---

### 2. **Attribute Propagation Layer**

Enforces **inheritance rules** and **scoping of attributes** (e.g., cascading `$add` tags).  
This layer minimizes redundant definitions by propagating attributes down the document tree.

Key Responsibilities:

- Resolve scope of attributes across nested sections.
- Support attribute override logic.

---

### 3. **Live DOM Rendering**

This layer integrates React to enable live previews:

- Translates the structured IR into a rendered HTML/DOM structure dynamically.
- Continuously updates sections based on live edits via **hot reloading**.

Key Features:

- Seamless DOM updates for incremental changes.
- Eliminates the need for rebuilding documents on every edit.

---

### 4. **Action Manager**

Handles dynamically embedded `$action` tags.

Key Responsibilities:

- Convert `$action` into actionable tasks (e.g., notifications, scheduling, etc.).
- Trigger appropriate side effects in the integrated task management system.

---

## Additional Components

### a. **Side-Effect Manager**

Manages side effects triggered by `$action` and similar user-defined tags.

### b. **IML to JSX Transformer**

Converts IML objects into JSX-compatible components for rendering in the React ecosystem.

---

## Advantages of IML Architecture

1. **Modular**: Each layer is independent yet interoperable for easier maintenance.
2. **Scalable**: Suitable for small documentation projects or enterprise-grade systems.
3. **Dynamic Updates**: Fully reactive system ensures fast, smooth changes to content.