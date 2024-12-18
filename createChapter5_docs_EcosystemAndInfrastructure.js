const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`Created: ${filePath}`);
}

function createChapter5() {
  const basePath = path.join(__dirname, 'docs', 'discovery', 'chapters', 'ecosystem-and-infrastructure');
  ensureDir(basePath);

  // Chapter 5 Index
  writeFile(
    path.join(basePath, 'index.md'),
    `# Chapter 5: Ecosystem and Infrastructure

The backbone of Spicetime is its robust and scalable infrastructure. In this chapter, we delve into how the technical foundation creates an interconnected, vibrant ecosystem that supports dreams and collaboration at scale.

---

### Sections

1. [Foundations of Ecosystem](./foundations_ecosystem.md)
2. [Technical Architecture](./technical_architecture.md)
3. [Scalability and Security](./scalability_and_security.md)

---

[Back to Discovery Hub](../../hub.md)`
  );

  // Sections
  const sections = {
    "foundations_ecosystem.md": `# Foundations of Ecosystem

Spicetime’s ecosystem thrives on principles of:

1. **Interconnectivity**: Seamless integration between people, apps, and tools.
2. **Adaptability**: Designed to evolve and support new kinds of collaboration.

The foundation ensures that everyone can participate, regardless of their technical skill level.`,

    "technical_architecture.md": `# Technical Architecture

The Spicetime infrastructure is built with cutting-edge technologies:

1. **Distributed Systems**:
   - The core services run on a global network for maximum uptime.
2. **API-Driven Connectivity**:
   - An open API ecosystem means developers can plug-and-play their tools into Spicetime seamlessly.
3. **Modular Design**:
   - Each app works independently while improving the greater ecosystem.`,

    "scalability_and_security.md": `# Scalability and Security

### Scaling Dreams

Spicetime ensures scalability to billions of users without compromising speed or experience. This is done through:

1. **Adaptive Load Balancing**:
   - Auto-scaling infrastructure ensures smooth performance under heavy usage.

2. **Data Encryption Protocols**:
   - Privacy and security are **built-in** pillars, with end-to-end encryption for every user interaction.

### Trust and Visibility
Transparency is key. All operations within Spicetime are auditable and open to review by participants. This ensures trust at every layer of the ecosystem.`
  };

  // Write sections
  for (const [fileName, content] of Object.entries(sections)) {
    writeFile(path.join(basePath, fileName), content);
  }

  console.log('Chapter 5: Ecosystem and Infrastructure has been set up. 🎉');
}

// Create Chapter 5
createChapter5();