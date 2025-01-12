# IML Parser Design

## Overview

The IML Parser is responsible for interpreting raw document inputs written in the Incremental Markup Language. It
converts these inputs into a hierarchical structured representation, forming the foundation for further processing and
rendering.

---

## Key Responsibilities

1. **Tokenization**: Break down raw input into identifiable tokens (e.g., `$title`, `$add`, `$action`).
2. **Syntax Validation**: Ensure the input respects IML's grammar and rules.
3. **Structure Generation**: Create a lightweight, hierarchical document tree for subsequent stages to process.

---

## Parsing Workflow

The parsing process is broken into distinct stages:

### Step 1: Tokenization

- Identify and isolate special IML directives prefixed by `$`.
- Support multi-line and nested syntax as well as inline commands.

**Example Input:**

```plaintext
$title: Distributed Systems
Distributed systems are key to modern apps.
$add: Scalability strategies
--to=Principles
```

**Tokenized Output:**

```plaintext
Token 1: { type: 'title', value: 'Distributed Systems' }
Token 2: { type: 'text', value: 'Distributed systems are key to modern apps.' }
Token 3: { type: 'add', value: 'Scalability strategies', options: { to: 'Principles' } }
```

---

### Step 2: Syntax Validation

- Check if all `$`-prefixed commands follow IML grammar.
- Ensure referenced sections (e.g., `--to` tags) exist in the document.

**Invalid Input Examples:**

1. Missing `--` in options:

```plaintext
$add: Scalability strategies
to=Principles  <!-- INVALID SYNTAX -->
```

2. Referencing a non-existent section:

```plaintext
$add: Strategies
--to=NonExistentSection  <!-- INVALID REFERENCE -->
```

---

### Step 3: Structure Generation

- Organize tokens into a hierarchical tree based on their type and content.
- Attributes cascade as part of the structure generation process.

**Example Tree Output:**

```json
{
  "root": {
    "title": "Distributed Systems",
    "content": [
      {
        "type": "text",
        "value": "Distributed systems are key to modern apps."
      },
      {
        "type": "add",
        "value": "Scalability strategies",
        "options": {
          "to": "Principles"
        }
      }
    ]
  }
}
```

---

## Error Handling

### Common Errors Handled by the Parser

- **Syntax Errors**: Invalid syntax prompts user feedback with a readable error message.
- **Duplicate Sections**: Ensures no duplicate identifiers exist in the document.
- **Attribute Conflicts**: Detects and warns about conflicting attributes.

**Example Error Message:**

```plaintext
Error: Invalid reference in `$add: Scalability strategies` -- `Principles` not found.
```

---

## Extensibility

IML Parser is designed with extensibility in mind:

- **Custom Tags**: Easily add new directives with their validation and tokenization logic.
- **Plugin API**: Allow third-party developers to integrate custom parsing logic.

---

## Benefits of the Parser

1. **Accuracy**: Ensures structured, meaningful input for downstream components.
2. **Flexibility**: Easily handles advanced recursive and hierarchical content.
3. **Performance**: Optimized tokenization and tree generation for large documents.