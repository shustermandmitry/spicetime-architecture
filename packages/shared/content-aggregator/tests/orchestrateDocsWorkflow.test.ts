import { describe, it, expect, vi } from "vitest";
import * as fs from "fs";
import { setupPaths } from "../src/utils/pathUtils";
import { orchestrateDocsWorkflow } from "../src/workflows/orchestrateDocsWorkflow";

vi.mock("fs", () => ({
  existsSync: vi.fn(),
}));

describe("orchestrateDocsWorkflow", () => {
  it("should throw if schema does not exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const paths = setupPaths();
    await expect(orchestrateDocsWorkflow(paths)).rejects.toThrow("Schema file not found");
  });

  it("should run successfully if files exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);

    const paths = setupPaths();
    await expect(orchestrateDocsWorkflow(paths)).resolves.toBeUndefined();
  });
});
