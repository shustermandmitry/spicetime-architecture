const fs = require("fs");
const path = require("path");
const glob = require("glob");

/**
 * Aggregates the contents of files matching the given folders and outputs to the console.
 * Supports recursive folder traversal using `/**`.
 */
async function aggregateFiles() {
  // Step 1: Get relative paths for folders
  const foldersInput = prompt(
    "Enter relative paths for folders (comma-separated, e.g., './src, ./lib', supports './**' for recursion): "
  );
  if (!foldersInput) {
    console.error("No folders provided. Exiting...");
    return;
  }
  const folderPaths = foldersInput.split(",").map((folder) => folder.trim());

  // Step 2: Get target file extensions
  const extensionsInput = prompt(
    "Enter target file extensions (comma-separated, e.g., '.ts, .js'): "
  );
  if (!extensionsInput) {
    console.error("No file extensions provided. Exiting...");
    return;
  }
  const extensions = extensionsInput.split(",").map((ext) => ext.trim());

  let aggregatedContent = "";

  // Step 3: Traverse folders and aggregate content
  for (const folderPath of folderPaths) {
    const absFolderPath = path.resolve(folderPath.replace("/**", "")); // Normalize base folder path
    const globPattern = folderPath.endsWith("/**")
      ? path.join(absFolderPath, "**/*") // Recursive glob pattern
      : path.join(absFolderPath, "*"); // Single-level glob pattern

    try {
      // Get all matched files based on the pattern
      const matchedFiles = glob.sync(globPattern, { nodir: true });

      // Filter files by extension
      const filteredFiles = matchedFiles.filter((file) =>
        extensions.some((ext) => file.endsWith(ext))
      );

      // Read and aggregate file contents
      for (const file of filteredFiles) {
        const fileContent = fs.readFileSync(file, "utf8");
        aggregatedContent += `/*PATH  ${file} */\n`;
        aggregatedContent += `${fileContent}\n\n`;
      }
    } catch (error) {
      console.error(
        `Error processing path "${folderPath}": ${error.message}`
      );
      continue;
    }
  }

  // Output all aggregated content to the terminal
  console.log(aggregatedContent);
}

// Mock prompt for simplicity in non-browser environments
function prompt(question) {
  const readlineSync = require("readline-sync");
  return readlineSync.question(question);
}

// Run the aggregation script
aggregateFiles().catch((error) => {
  console.error(`An error occurred: ${error.message}`);
});