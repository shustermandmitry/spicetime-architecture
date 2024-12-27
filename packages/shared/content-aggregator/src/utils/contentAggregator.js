const fs = require("fs");
const path = require("path");
const prompts = require("prompts");

const OUTPUT_FILE = path.join(__dirname, "contentAggregator.out.txt");

/**
 * Recursively collect files from a root directory that match the specified extensions.
 *
 * @param {string} rootDir - The root directory to start searching from
 * @param {string[]} extensions - Array of extensions to match (e.g., ['.md', '.json'])
 * @param {string[]} filesList - Accumulator for list of files
 * @returns {string[]} - List of files matching the extensions
 */
function collectFiles(rootDir, extensions, filesList = []) {
  try {
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(rootDir, entry.name);

      if (entry.isDirectory()) {
        // Recursively collect from subdirectories
        collectFiles(fullPath, extensions, filesList);
      } else if (extensions.includes(path.extname(entry.name))) {
        // Collect file if it matches the specified extensions
        filesList.push(fullPath);
      }
    });
  } catch (err) {
    console.error(`Error reading directory '${rootDir}':`, err.message);
  }

  return filesList;
}

/**
 * Write content from each file into the output file.
 *
 * @param {string[]} files - List of files to aggregate
 * @param {string} output - Path to the output file
 */
function writeAggregatedContent(files, output) {
  try {
    const outputStream = fs.createWriteStream(output, { flags: "w" });
    console.log(`Writing aggregated content to: ${output}`);

    files.forEach((file) => {
      try {
        const content = fs.readFileSync(file, "utf8");
        outputStream.write(`--- File: ${file} ---\n`);
        outputStream.write(content + "\n\n");
      } catch (err) {
        console.error(`Error reading file '${file}':`, err.message);
      }
    });

    outputStream.end();
    console.log("Aggregation completed successfully!");
  } catch (err) {
    console.error(`Error writing to output file '${output}':`, err.message);
  }
}

/**
 * Main function to run the content aggregation.
 *
 * @param {string} rootDir - Root directory to aggregate from
 * @param {string[]} extensions - List of file extensions to include
 */
function aggregateContent(rootDir, extensions) {
  try {
    console.log("Starting content aggregation...");
    if (!fs.existsSync(rootDir)) {
      console.error(`Error: Root directory '${rootDir}' does not exist.`);
      return;
    }

    // Collect files
    const files = collectFiles(rootDir, extensions);

    if (files.length === 0) {
      console.warn("No matching files found!");
    } else {
      // Write aggregated content to the output file
      writeAggregatedContent(files, OUTPUT_FILE);
    }
  } catch (err) {
    console.error("Unhandled exception occurred:", err.message);
  }
}

/**
 * Prompt user for parameters and execute aggregation.
 */
async function main() {
  try {
    // Prompt for root directory
    const rootResponse = await prompts({
      type: "text",
      name: "root",
      message: "Enter the relative or absolute path to the root directory:",
      validate: (value) =>
        value && fs.existsSync(value) ? true : "Directory does not exist!",
    });

    if (!rootResponse.root) {
      console.log("No directory specified. Exiting.");
      return;
    }

    const rootPath = path.resolve(rootResponse.root);

    // Prompt for file extensions
    const extResponse = await prompts({
      type: "text",
      name: "extensions",
      message:
        "Enter file extensions to search for (comma-separated, e.g., .md,.json):",
      validate: (value) =>
        value && value.split(",").every((ext) => ext.startsWith("."))
          ? true
          : "Enter valid extensions starting with '.'",
    });

    if (!extResponse.extensions) {
      console.log("No extensions specified. Exiting.");
      return;
    }

    const fileExtensions = extResponse.extensions.split(",").map((ext) => ext.trim());

    // Execute aggregation
    aggregateContent(rootPath, fileExtensions);
  } catch (err) {
    console.error("An unexpected error occurred during prompting:", err.message);
  }
}

main();