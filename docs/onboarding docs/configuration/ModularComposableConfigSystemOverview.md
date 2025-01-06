# Modular Composable Configuration System

This document outlines the **modular composable configuration system**, where raw files, templates, and JSX-defined domain profiles are used to create structured and reusable configurations for tools. The system is designed to be cohesive, flexible, and ready for Prompto conversion.

---

## Concept Overview

The configuration system is **modular and composable**, structured to define various profiles and compositions across multiple **tools**, while maintaining separation between:

1. **Raw Component Files:** 
   - Contain base configuration files for individual tools.
   - Organized directly in the root (`raw-files` folder, for now).

2. **Configuration Templates Folder:**
   - Aimed at providing reusable **example configurations**.
   - These are **NOT** directly used but serve as references for defining meaningful local compositions.

3. **Local Packages (Within Domains):**
   - These packages define the **final profiles** by composing configurations from raw files and examples.
   - They determine the structure and nature of how the tools work together.

---

## File Structure Proposal

Here’s a proposed organization for the configuration system:

```plaintext
project-root/
│
├── raw-files/
│   ├── tool-1.config.json
│   ├── tool-2.config.yaml
│   ├── ... (all modular components for tools)
│
├── templates/
│   ├── example-1-config.json
│   ├── example-2-config.js
│   ├── README.md (document each template’s purpose)
│
├── packages/
│   ├── domain-1/
│   │   ├── profile-a.jsx
│   │   └── profile-b.jsx
│   ├── domain-2/
│       ├── profile-c.jsx
│       └── ... (more composable profiles)
│
└── README.md
```

### Folder Details

1. **`raw-files/` Folder (Components):**
   - Each file directly defines a modular configuration for a tool (JSON, YAML, etc.).
   - Keep these atomic; no interdependencies or compositions.

2. **`templates/` Folder (Usage Examples):**
   - Provides reusable examples for developers to understand how to compose the raw configurations.
   - Include **documentation** in this folder (`README.md`) to describe templates pragmatically (e.g., which tools they configure, expected data structure, or use case).

3. **`packages/` Folder (Profiles by Domains):**
   - Final compositions defined in JSX structure.
   - Use **JSX syntax** to compose various raw configurations and templates into profiles as per domain-specific tooling needs.
   - Profiles serve as "ready-to-use" configurations tailored for the domain.

---

## Example JSX Representation (Profile Composition)

Below is a JSX representation of how modular raw files and templates can be composed into a profile.

```jsx
// File: packages/domain-1/profile-a.jsx

import Tool1Config from "../../raw-files/tool-1.config.json";
import Tool2Config from "../../raw-files/tool-2.config.yaml";
import ExampleTemplate from "../../templates/example-1-config.json";

const ProfileA = () => {
    return (
        <configProfile>
            <toolConfiguration>
                <tool name="Tool1" config={Tool1Config} />
                <tool name="Tool2" config={Tool2Config} />
            </toolConfiguration>

            <examples>
                <template example={ExampleTemplate} />
            </examples>
        </configProfile>
    );
};

export default ProfileA;
```

---

## Example Template Documentation (`templates/README.md`)

```markdown
# Configuration Templates

The templates in this folder provide reusable examples for composing raw configuration files 
into meaningful local configurations. These are **not** to be used directly but serve as guidance.

## Template Structure

- `example-1-config.json`: Demonstrates how to integrate Tool1 and Tool2 configurations for basic workflows.
- `example-2-config.js`: A script-based example showcasing extensibility with advanced hooks or overrides.

Refer to `packages/` for how these templates are utilized in finalized profiles.

---

Keep templates as examples only; DO NOT use them for production.
```

---

## Final Recap & Notes

1. **File Organization:**
   - Keep `raw-files` atomic.
   - Use `templates` only as examples for usage patterns.
   - Define domain-specific profiles in JSX within the `packages` folder.

2. **JSX Approach:**
   - Compose modular configurations into profiles using JSX components.
   - Profiles serve as the entry point for Prompto conversion or runtime usage.

3. **Prepare for Prompto Conversion:**
   - Ensure all profiles are structured as JSX components like the provided example.
   - The profiles should encapsulate all modular configuration logic for the respective domains.

---

This structure ensures clear separation of concerns, maximum reusability, and flexibility for creating meaningful domain profiles from modular components. Let’s work hands-on with this if you’re ready to proceed!