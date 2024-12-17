const fs = require('fs');
const path = require('path');

// Helper functions
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim(), 'utf8');
}

// Paths
const DISCOVERY_PATH = path.join(__dirname, 'docs', 'discovery');
const DREAMER_PATH = path.join(DISCOVERY_PATH, 'chapters', 'dreamer-apps-and-tools');

// Step 4: Add Dreamer Apps and Tools Chapter
function createDreamerChapter() {
  try {
    console.log('Adding Dreamer Apps and Tools chapter...');

    // Create the dreamer tools folder
    ensureDir(DREAMER_PATH);

    // Create files
    const indexContent = `# Chapter 3: Dreamer Apps and Tools

Spicetime's tools for building your dreams efficiently and collaboratively.

---

### Sections

1. [DreamScaper](./dreamscaper.md)
2. [DreamCatcher](./dreamcatcher.md)
3. [DreamWeaver](./dreamweaver.md)
4. [Modular Integration](./modular_integration.md)

---

[Back to Discovery Hub](../../hub.md)
    `;
    writeFile(path.join(DREAMER_PATH, 'index.md'), indexContent);

    const dreamscaperContent = `# DreamScaper

Turn unstructured ideas into actionable frameworks using this intuitive **dream journaling** app.`;
    writeFile(path.join(DREAMER_PATH, 'dreamscaper.md'), dreamscaperContent);

    const dreamcatcherContent = `# DreamCatcher

Find collaborators who share your vision, based on shared passions, goals, and expertise.`;
    writeFile(path.join(DREAMER_PATH, 'dreamcatcher.md'), dreamcatcherContent);

    const dreamweaverContent = `# DreamWeaver

Bring modular ideas together, combining workflows into fully realized outputs.`;
    writeFile(path.join(DREAMER_PATH, 'dreamweaver.md'), dreamweaverContent);

    const modularContent = `# Modular Integration

Learn how Spicetime's apps work together, creating seamless workflows between tools.`;
    writeFile(path.join(DREAMER_PATH, 'modular_integration.md'), modularContent);

    console.log('Dreamer Apps and Tools chapter added successfully! 🎉');
  } catch (err) {
    console.error('Error adding Dreamer Apps chapter:', err);
  }
}

// Run patch
createDreamerChapter();