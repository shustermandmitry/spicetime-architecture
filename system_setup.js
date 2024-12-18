const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// Base path for the discovery folder
const baseDiscoveryPath = path.join(__dirname, "docs", "discovery");

// File and content mapping for modular structure
const filesAndContent = {
  vision: {
    file: "vision.md",
    content: `
# Vision and Philosophy

### Purpose
- Empower communities to measure their economies without compromising privacy.
- Foster balance between individual freedom and collective community cohesion.

### Key Pillars
- Privacy-preserving AI metrics.
- Modular feedback through tools and gadgets.
- Dynamic, need-driven taxation.
- Ethical redistribution of wealth.

### Notes
_(Placeholder for more philosophical content to be added later.)_
`,
  },
  architecture: {
    file: "architecture.md",
    content: `
# System Architecture

### Overview
- Distributed and modular by design, giving autonomy to each community.
- AI provides aggregate insights while ensuring privacy.

### Core Components
1. Feedback Framework (open marketplace for tools).
2. Privacy-Preserving Metrics (community-focused data analysis).
3. Dynamic Taxation Engine (real-time adjustments).  
4. Transaction Symmetry (natural economic balance).  
5. Redistribution Mechanisms (control of wealth gravity).

### Notes
_(Placeholder for technical diagrams and architectural visualizations.)_
`,
  },
  measurables: {
    file: "measurables.md",
    content: `
# Measurables and Feedback Marketplace

### Purpose
- Enable modular measurement and tracking tailored to local needs.

### Core Metrics
- **Community Wealth Distribution** (track diffusion and concentration).  
- **Reserves Health** (buffer management).  
- **Ethical Redistribution Scores** (align policies with values).  

### Tools
- **Feedback gadgets** for visualizing metrics.  
- Dashboards, reserve calculators, real-time analyzers.
`,
  },
  taxation: {
    file: "taxation.md",
    content: `
# Dynamic Needs-Based Taxation

### Purpose
- Adjust taxation rates dynamically based on community reserves and needs.

### Key Concepts
- Increase taxes to replenish reserves or fund emergencies.  
- Reduce taxes when reserves are robust to foster growth.  
- Communities define redistribution ethics and thresholds.  

### Future Expansion
_(Placeholder for detailed formulas, governance rules, and edge cases.)_
`,
  },
  symmetry: {
    file: "symmetry.md",
    content: `
# Transaction Symmetry and Redistribution

### Purpose
- Maintain and/or override natural balance in economic systems.  

### Emergent Symmetry
- The natural split of transactions aligns:
  1. "One for me" (individual).  
  2. "One for you" (transaction cost).  
  3. "One for the community" (tax/reinvestment).  

### Controlling Wealth Gravity
- Redistribution ensures wealth neither becomes too concentrated nor too dispersed.  
- Communities can adjust this balance dynamically.  
`,
  },
  scaling: {
    file: "scaling.md",
    content: `
# Scaling, Governance, and Social Design

### Overview
- Communities balance cohesion and freedom using AI feedback and analytics.

### Governance Models  
- Local autonomy for communities to set goals, taxes, and redistribution ethics.  
- Interoperability for seamless interaction between communities.

### Notes
_(Placeholder for describing governance hierarchies and approval workflows.)_
`,
  },
  roadmap: {
    file: "roadmap.md",
    content: `
# Roadmap for Implementation

1. Finalize key metric definitions and tool designs.  
2. Build an open marketplace for feedback and analytics tools.  
3. Prototype needs-based taxation systems for pilot communities.  
4. Test and refine measurement rules and redistribution mechanisms.  
5. Scale across larger networks while retaining modular autonomy.  
`,
  },
};

// Function to create the discovery folder structure
function createDiscoveryStructure() {
  console.log(chalk.blue("Creating discovery folder structure..."));

  // Ensure the base discovery directory exists
  if (!fs.existsSync(baseDiscoveryPath)) {
    fs.mkdirSync(baseDiscoveryPath, { recursive: true });
    console.log(chalk.green(`Directory created: ${baseDiscoveryPath}`));
  }

  // Create folders and files for each section
  Object.keys(filesAndContent).forEach((section) => {
    const sectionFolder = path.join(baseDiscoveryPath, section);
    const filePath = path.join(sectionFolder, filesAndContent[section].file);

    // Ensure the section folder exists
    if (!fs.existsSync(sectionFolder)) {
      fs.mkdirSync(sectionFolder, { recursive: true });
      console.log(chalk.green(`Created folder: ${sectionFolder}`));
    }

    // Write the content to the appropriate file in the section folder
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, filesAndContent[section].content.trim(), "utf8");
      console.log(chalk.green(`Created file: ${filePath}`));
    } else {
      console.log(chalk.yellow(`File already exists, skipped: ${filePath}`));
    }
  });

  console.log(chalk.blue("Discovery folder structure setup complete!"));
}

// Run the function
createDiscoveryStructure();