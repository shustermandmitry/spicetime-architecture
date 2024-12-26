import { setupPaths } from "./utils/pathUtils";
import { orchestrateDocsWorkflow } from "./workflows/orchestrateDocsWorkflow";

(async function main() {
  try {
    const paths = setupPaths();
    await orchestrateDocsWorkflow(paths);
  } catch (error) {
    console.error("❌ Workflow failed:", (error as Error).message);
    process.exit(1);
  }
})();
