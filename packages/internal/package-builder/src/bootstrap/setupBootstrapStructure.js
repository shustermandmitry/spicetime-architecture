// src/bootstrap/setup.js
const fs = require("fs-extra");
const path = require("path");

const generateStructure = (basePath, structure) => {
  if (!structure || !structure.length) return;

  structure.forEach((item) => {
    const fullPath = path.join(basePath, item.name);

    if (item.type === "folder") {
      fs.ensureDirSync(fullPath);
      if (item.children) generateStructure(fullPath, item.children);
    } else if (item.type === "file") {
      fs.ensureFileSync(fullPath);
      fs.writeFileSync(fullPath, item.content || "", "utf-8");
    }
  });
};

/** Example: bootstrap.config.json
const config = require("./bootstrap.config.json");

const basePath = path.resolve(__dirname, "../../../output"); // Adjust as necessary
generateStructure(basePath, config.structure);

console.log(`🔧 Bootstrapped structure at ${basePath}`);
 */