const fs = require('fs');
const path = require('path');

// Reuse directory and file helpers
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`Created: ${filePath}`);
}

function createChapter4() {
  const basePath = path.join(__dirname, 'docs', 'discovery', 'chapters', 'self-governance');
  ensureDir(basePath);

  // Chapter 4 Index
  writeFile(path.join(basePath, 'index.md'), `# Chapter 4: Self-Governance

Spicetime’s self-governance model is designed to amplify fairness and inclusivity through decentralized systems and ethical principles. Learn how participants can take ownership of governance decisions while ensuring ethical AI plays an integral part.

---

### Sections

1. [Principles of Governance](./governance_principles.md)
2. [Decentralized Governance](./decentralized_governance.md)
3. [Ethical AI in Decision-Making](./ethical_ai_autonomous_decision.md)

---

[Back to Discovery Hub](../../hub.md)`);

  // Sections
  const sections = {
    "governance_principles.md": `# Principles of Governance

### Shared Responsibility

Spicetime’s governance focuses on:
1. **Fair Decision-Making**:
   - All voices matter, and proposals are voted on democratically.
2. **Transparency and Trust**:
   - Decisions, metrics, and processes are publicly available for review.`,

    "decentralized_governance.md": `# Decentralized Governance

Spicetime builds **trustless ecosystems**, enabling autonomous governance mechanisms where decisions are executed programmatically through:

1. **Smart Contracts**:
   - Automatically execute rules without any single party holding control.
2. **Distributed Consensus**:
   - Ensure fairness by leveraging tools like global token-weighted voting systems.`,

    "ethical_ai_autonomous_decision.md": `# Ethical AI in Decision-Making

Spicetime employs ethical AI that:
- Avoids discrimination.
- Allows explainable decision processes for transparency.
- Improves based on **diverse feedback loops**.

AI is always accountable, ensuring fairness for all system decisions.`
  };

  // Write sections
  for (const [fileName, content] of Object.entries(sections)) {
    writeFile(path.join(basePath, fileName), content);
  }

  console.log('Chapter 4: Self-Governance has been set up. 🎉');
}

// Create Chapter 4
createChapter4();