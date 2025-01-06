# **Documentation Generation System**

## What is it?

The documentation system is responsible for:
1. Generating **developer-facing documentation** using **Typedoc**.
2. Creating **architecture visualizations** using **C4Builder**.
3. Maintaining consistent and automatically generated artifacts.

## **C4Builder**

C4Builder is a tool for generating C4 Model diagrams, which are widely used to describe software architecture. It integrates with **PlantUML** to generate these diagrams effectively.

### **Configuration File: `c4builder.config.js`**

The `c4builder.config.js` file defines the settings for generating diagrams. Below is an overview of these keys:

- **`plantumlVersion`**:
  Specifies the version of PlantUML to use for generating diagrams.
  
  ```json
  plantumlVersion: "1.2022.7"
  ```

- **`outDir`**:
  The folder where the generated diagrams will be saved. For example:
  
  ```json
  outDir: "docs.typedoc/.generated/architecture"
  ```

- **`input`**:
  An array of directories containing source files for input into the diagram generator.

  Example directories:
  - **`diagrams/`**: For source PlantUML files describing architecture.
  - **`decisions/`**: For decision files explaining architectural choices.

- **`watch`**:
  Defines automation that triggers after successful generation. For example:

  ```json
  onSuccess: "npm run docs.typedoc:build"
  ```

This command rebuilds the Typedoc documentation whenever diagrams are successfully generated.

---

## **How Documentation is Generated**

1. **Typedoc**:
   - Typedoc processes comments in code to create developer-friendly documentation.
   - It maps directly to code files and creates a structured representation of the entire API.

2. **C4Builder**:
   - C4Builder transforms plaintext definitions (e.g., PlantUML) into architecture models and diagrams.
   - These diagrams are then made available in the corresponding documentation folder.

Both tools combine to create a cohesive, visually appealing, and well-structured documentation system.

---

## **How to Run It**

To generate the documentation and diagrams:
1. Run the diagram generation command:
   ```sh
   pnpm run c4builder
   ```
   This will generate architecture visualizations and place them in the output directory defined in `c4builder.config.js`.

2. Build the Typedoc documentation:
   ```sh
   pnpm run docs.typedoc:build
   ```
   This uses the generated diagrams to create a formatted and comprehensive documentation site.

---

## **Future Enhancements**

- Integration with CI/CD pipelines to automatically deploy documentation updates.
- Support for additional diagram types and source formats.
- Automated diagram validation when new architecture or decisions are committed.