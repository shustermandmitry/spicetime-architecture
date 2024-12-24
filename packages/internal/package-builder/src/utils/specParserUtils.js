// src/utils/specParser.js
const yaml = require("yaml");
const fs = require("fs");

exports.specToDocs = (spec, outputPath) => {
  const docContent = yaml.stringify(spec);
  fs.writeFileSync(outputPath, `---\n${docContent}\n---`);
};