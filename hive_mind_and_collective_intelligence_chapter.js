const fs = require('fs');
const path = require('path');

// Helper function to ensure a directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function to write a file
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`Created: ${filePath}`);
}

// Chapter data
const chapters = [
  {
    folder: "privacy-and-consciousness",
    index: `# Chapter 1: Privacy and Consciousness

Privacy forms the foundation of individuality, creativity, and self-awareness, an essential aspect of the Spicetime philosophy. This chapter explores the role of privacy in enhancing personal space, protecting the inner self, and ensuring ethical data usage, alongside the linkage between privacy and the development of consciousness.

---

### Sections

1. [Basics of Privacy](./privacy_basics.md)
2. [Ethics of Data Ownership](./ethical_data_ownership.md)
3. [Privacy and the Self](./self_and_consciousness.md)

---

[Back to Discovery Hub](../../hub.md)
`,
    sections: {
      "privacy_basics.md": `# The Basics of Privacy

Privacy is not just a feature; it is a **human right** and the foundation of individuality. In Spicetime, privacy plays a dual role:

1. **Empowering Creativity**: By offering safe spaces for free thought, Spicetime enables individuals to explore ideas without fear of judgment or interference.
2. **Protecting Personal Assets**: Privacy ensures that sensitive data—whether it’s intellectual property, personal communications, or emotional insights—is safeguarded.

### Key Principles of Privacy in Spicetime:

- **No Data Ownership by Platforms**: Any data you create belongs solely to you.
- **Encrypted Thought Spaces**: Personal brainstorming areas are inaccessible to anyone but the user, even by administrators.
- **Transparency of Data Flows**: Users can see exactly where their data is used and revoke permissions at any time.`,
      "ethical_data_ownership.md": `# Ethics of Data Ownership

Spicetime redefines how users interact with their data by adopting principles of **ethical ownership**, ensuring that:

1. **Users are the sole owners of their data**: Spicetime does not harvest or store data beyond the user's control.
2. **Granular Permissions**: You decide which apps or collaborators can access your data, and these settings can be changed instantly.
3. **No Monetization Without Consent**: Data will never be sold, shared, or analyzed for profit without explicit user agreement.

By fostering an ecosystem where ethics drive decisions, Spicetime ensures every individual feels secure, respected, and autonomous.`,
      "self_and_consciousness.md": `# Privacy and the Self

### Nurturing Consciousness

Privacy acts as an incubator for self-awareness and growth. In Spicetime, privacy is seen as:

1. **A Reflection Space**: Where users can think critically and emotionally, shaping their inner identity.
2. **Creativity Unleashed**: Secure environments allow people to take risks, play with new ideas, and embrace failure as part of learning.

### Spicetime’s Privacy Pillars:

- **Self-Control**: Maintain full control over how much of yourself you expose to the world.
- **Collaboration with Choice**: Engage with others on your terms while retaining ownership of your originality.`,
    },
  },
  {
    folder: "hive-mind-and-collective-intelligence",
    index: `# Chapter 2: Hive Mind and Collective Intelligence

The Hive Mind represents a new paradigm of collaboration, where individuals act as nodes within a larger network. Spicetime enables a hybrid model where individuality is preserved as part of a shared collective intelligence.

---

### Sections

1. [What is the Hive Mind?](./hive_mind_basics.md)
2. [Technology and Design of the Hive](./hive_technology_and_design.md)
3. [Balancing Self and the Hive](./self_and_hive_balance.md)

---

[Back to Discovery Hub](../../hub.md)
`,
    sections: {
      "hive_mind_basics.md": `# What is the Hive Mind?

### Defining the Hive Mind

The Hive Mind isn’t a replacement for the individual—it’s a **cooperation amplifier**. Spicetime’s Hive Mind allows people to:

1. Share information seamlessly while keeping personal data private.
2. Collaborate on creative projects without hierarchical barriers.
3. Tap into **collective creativity** while maintaining individuality.

### Key Benefits of the Hive Mind:

- **Collective Knowledge**: Every participant contributes insights, strengthening the network.
- **Democratic Collaboration**: Equality among collaborators ensures no single voice dominates.
- **Innovation at Scale**: Ideas evolve faster when people connect freely.`,
      "hive_technology_and_design.md": `# Technology and Design of the Hive

Spicetime’s technical design empowers Hive Mind functionality using advanced tools like:

1. **Real-Time Collaboration Engines**: Tools for seamless idea exchange and debate across multiple nodes (users).
2. **Secure Multi-Party Computation**: Every user’s data remains private, even in collaborative projects.
3. **AI Augmented Networks**: AI identifies synergies and potential partnerships within the hive.

Spicetime ensures that all systems are designed with integrity, scalability, and respect for participant privacy.`,
      "self_and_hive_balance.md": `# Balancing the Self and the Hive

A Hive thrives on diversity, where individual creativity fuels collective growth. Spicetime builds this balance with:

1. **Autonomous Spaces**:
   - Where individuals can develop ideas before contributing to the group.

2. **Encouraging Unique Inputs**:
   - Spicetime intentionally avoids enforcing group consensus, prioritizing diverse approaches.

The Hive Mind grows stronger through the **accumulation of unique input**, not conformity.`,
    },
  },
  // Add Dreamer Apps, Self-Governance, Ecosystem, and Future chapters!
];

// Setup the full folder and file structure
function createDocsStructure() {
  const basePath = path.join(__dirname, 'docs', 'discovery', 'chapters');
  console.log('Starting setup...');

  chapters.forEach((chapter) => {
    const chapterPath = path.join(basePath, chapter.folder);
    ensureDir(chapterPath);

    // Write the index
    writeFile(path.join(chapterPath, 'index.md'), chapter.index);

    // Write the sections
    for (const [fileName, content] of Object.entries(chapter.sections)) {
      writeFile(path.join(chapterPath, fileName), content);
    }
  });

  console.log('Documentation structure has been set up. 🎉');
}

// Run the setup
createDocsStructure();