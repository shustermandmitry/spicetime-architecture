# Overview of IML

## Introduction

IML (Incremental Markup Language) is a real-time document structuring and automation system, tightly integrated with
React to provide dynamic updates, hot-reloading, and actionable task workflows. It helps developers manage complex
hierarchies of documentation, automate repetitive tasks, and structure documents incrementally as they write.

## What Makes IML Unique?

IML addresses real-world challenges of managing evolving documentation systems, offering:

- **Live Updates:** Embedded in a living React app, IML tags modify the JSX structure incrementally with real-time
  hot-reloading.
- **Side Effects Layer:** Through `$action` tags, developers can define actionable layers (e.g., send emails, create
  tasks) linked directly to specific document sections.
- **Hierarchical Inheritance:** Attributes (e.g., title, `--to`, `--on`) cascade through the document structure,
  reducing manual overhead.
- **Lifecycle Management:** Documents evolve iteratively as IML restructures raw, unorganized content into logical
  sections automatically.

## High-Level Workflow

IML’s workflow enables a seamless writing and automation experience:

1. **RawDoc**: The messy initial document, where developers freely input plain text, ideas, and textual IML tags.
2. **IML DOM**: Tags are parsed into an actionable tree-like structure, propagating attributes naturally through
   hierarchical rules.
3. **StructuredDoc**: A clean, auto-generated hierarchy rendered via JSX or Markdown, ready for editing or review.
4. **Side Effects**: Embedded tasks and actions from `$action` tags (e.g., email notifications, task assignments) appear
   as proposed or pending actions.
5. **Hot Reloading**: Changes in tags or structure trigger React’s incremental updates live.

## Core Elements of IML

Here are the essential units and flows of IML:

### Tags

These tags reshape raw text into structured, interactive documents:

- **`$title`**: Defines sections and subsections, forming the backbone of the document’s structure.
- **`$add`**: Adds content patches dynamically that are tied back to parent sections via inheritance rules.
- **`$note`**: Places freeform notes anywhere within a specific hierarchy for detailed explanations.
- **`$action`**: Adds actionable operations (e.g., sending emails or creating tasks) tied to document sections.

### The Two DOMs:

IML operates on **two connected DOMs** during the document transformation process:

1. **IML DOM**: Represents the virtual structure derived from IML tags in the rawDoc after parsing. Attributes are
   cascaded using hierarchies and defaults.
2. **React DOM**: Mirrors the IML DOM by dynamically assembling rendered JSX React components, updated incrementally.

### Side Effect Manager

IML introduces a **Side Effect Manager**, a specialized module for managing and executing `$action` tags.

- Proposed actions (e.g., emails, tasks) are staged and displayed for developers to review in the Action Panel.
- Developers can interact with these actions, finalizing or discarding them.

## App Interactivity

IML’s app is a fully interactive system comprising:

1. **RawDoc Editor Panel:** A developer-friendly space to write the rawDoc, add IML tags, and see live updates.
2. **Preview Panel:** A dynamically rendered version of the structuredDoc using Markdown or JSX.
3. **Action/Timeline Panel:** Displays real-time updates:
    - **Proposed Actions:** `$action` tags and their inherited attributes like `--on` or `--to`.
    - **Changelog:** Records every modification, such as `$add` patches.

---

## Real-Time System Features

### Live Reload

IML leverages React’s **hot reloading** to update specific components in real time:

- When `$title`, `$add`, or `$action` tags are added, the JSX structure is only partially refreshed.
- Hot reload avoids re-rendering the entire app, ensuring uninterrupted performance.

### Incremental Workflow

Devs start with unstructured content, gradually layering:

1. Structure (`$title`)
2. Expansions (`$add`)
3. Notes and tasks (`$note` & `$action`)
   This incremental flow minimizes disruptions and allows for iterative improvements.

---

## Use Case Examples

# Examples of IML in Action

## Example 1: Organizing Unstructured Content

### Raw Document Input:

    $title: Distributed Systems  
    Distributed systems are everywhere. Let’s explore their principles.

    $add: Horizontal scaling enables performance in the cloud.
    --to=Distributed Systems

### StructuredDoc Output (Live Preview):

    # Distributed Systems  
    Distributed systems are everywhere. Let’s explore their principles.

    ### Added Content:  
    Horizontal scaling enables performance in the cloud.

---

## Example 2: Adding Actions

### Raw Document Input:

    $action: Notify team  
    --on=email  
    --to=Distributed Systems Team  

### Action Panel (Proposed Task):

    [ ] Email: Notify team about Distributed Systems
    → Subject: Distributed Systems  
    → Recipient: Distributed Systems Team
