# **C4Builder Configuration**

## **Purpose**

The `c4builder.config.js` file configures **C4Builder**, a tool used for generating C4 Model diagrams as part of the documentation process. The configuration defines input directories, output locations, and automation commands to streamline the architecture generation process.

---

## **Key Configuration Options**

### **PlantUML Version**
Specifies the PlantUML version used for generating diagrams. This ensures consistent output regardless of the local version installed.

Example:
```javascript
plantumlVersion: "1.2022.7"
```

---

### **Output Directory**
The folder where the generated diagrams are stored. This is typically a subdirectory of the `docs` folder.

Example:
```javascript
outDir: "docs.typedoc/.generated/architecture"
```

All generated diagrams will be saved here, and the `docs.typedoc:build` process includes them in the final site.

---

### **Input Directories**
Defines the directories containing files used as input sources for C4Builder.

- **Diagrams Directory**: Contains C4 Model diagrams written in PlantUML.
- **Decisions Directory**: Contains architectural decision records (e.g., ADR files).

Example:
```javascript
input: [
  "docs.typedoc/architecture/diagrams",
  "docs.typedoc/architecture/decisions"
]
```

---

### **Automation**
Enables automation tasks on successful generation of diagrams. For example, the following command regenerates Typedoc documentation:

```javascript
watch: {
  onSuccess: "npm run docs.typedoc:build"
}
```

This ensures that architecture diagrams are always up-to-date in the published documentation.

---

## **How C4Builder Fits**
- **Input Diagrams**: Source files using PlantUML are fed into C4Builder.
- **Generated Output**: Diagrams are created and stored in the output directory.
- **Documentation Integration**: Diagrams are included in the documentation built by Typedoc.

---

## **Workflow**

1. Add or update architecture documentation in the **input directories**.
2. Run the command:
   ```sh
   pnpm run c4builder
   ```
3. The output is automatically included in documentation after:
   ```sh
   pnpm run docs.typedoc:build
   ```

This process ensures a clean and updated representation of both architecture and decisions.

---

## **Benefits**
- Ensures architecture documents and diagrams stay synchronized.
- Simplifies the inclusion of visual elements in documentation.
- Automates steps for efficiency and reliability.

---

## **Future Configurations**
- Add support for other diagram standards (e.g., Graphviz, Mermaid).
- Improve error reporting for complex architectures.
- Extend automation for CI/CD pipeline integration.