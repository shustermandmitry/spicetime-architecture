const fs = require("fs");
const path = require("path");

// 1. Force root working directory to the directory containing this script
const repoRoot = path.resolve(__dirname); // Absolute path to the script directory
process.chdir(repoRoot); // Change to repo root directory

console.log(`[INFO]: Script root directory is set to: ${repoRoot}`);
console.log(`[INFO]: Current working directory is: ${process.cwd()}`);

// Helper: Symlink creation with debug logs
function createSymlink(target, link) {
  try {
    if (fs.existsSync(link)) {
      fs.unlinkSync(link); // Remove any existing symlink or file
    }

    fs.symlinkSync(target, link); // Create the symlink
    console.log(`Created symlink: ${link} -> ${target}`);
  } catch (error) {
    console.error(`[ERROR]: Failed to create symlink: ${link} -> ${target}`);
    console.error(`Reason: ${error.message}`);
    console.error(`[DEBUG]: Target exists? ${fs.existsSync(target)}`);
    console.error(`[DEBUG]: Target path: ${target}`);
    console.error(`[DEBUG]: Link path: ${link}`);
  }
}

// Ensure a directory exists
function ensureDirSync(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`[ERROR]: Failed to ensure directory "${dirPath}": ${error.message}`);
  }
}

// Process Root-Level Configurations
function processRootConfigs(contextDir) {
  // List of root-level files or directories to symlink
  const configFiles = {
    ".github/workflows": ".github/workflows", // Example config
    // Add other configurations here as needed
  };

  // Loop through each config file or directory
  Object.entries(configFiles).forEach(([fileName, relativePath]) => {
    const targetPath = path.join(repoRoot, relativePath); // Target in root
    const linkPath = path.join(contextDir, fileName); // Link in context

    console.log(`[DEBUG]: Checking existence of targetPath: ${targetPath}`);
    if (fs.existsSync(targetPath)) {
      createSymlink(targetPath, linkPath);
    } else {
      console.warn(`[WARNING]: File or directory "${relativePath}" not found.`);
    }
  });
}

// Main Script
function recreateContextFolder() {
  const contextDir = path.join(repoRoot, "context");

  console.log(`[INFO]: Cleaning up old "context" folder...`);
  if (fs.existsSync(contextDir)) {
    fs.rmSync(contextDir, { recursive: true, force: true });
  }

  console.log(`[INFO]: Ensuring context folder exists...`);
  ensureDirSync(contextDir);

  console.log(`[INFO]: Processing root-level configurations...`);
  processRootConfigs(contextDir);

  console.log(`[INFO]: Script completed successfully! 🎉`);
}

// Execute the script
recreateContextFolder();