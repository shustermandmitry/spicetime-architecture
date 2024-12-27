import { describe, it, expect, vi } from "vitest";
import { orchestrateDocsWorkflow } from "./orchestrateDocsWorkflow"; // Adjust the import path as necessary

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs"); // Import original fs to preserve its structure
  return {
    ...actual,
    default: {
      ...actual,
      readFileSync: vi.fn((filePath: string) => {
        if (filePath === "nonexistent") {
          throw new Error("Schema file not found");
        }
        return `
          type Query {
            hello: String
          }
        `;
      }),
      existsSync: vi.fn((filePath: string) => {
        return filePath === "valid-schema"; // Mock file existence for "valid-schema"
      }),
    },
  };
});

vi.mock("@graphql-tools/load", () => {
  return {
    loadSchemaSync: vi.fn((filePath: string) => {
      if (filePath === "valid-schema") {
        return {
          getTypeMap: () => ({
            Query: { name: "Query" },
          }),
        };
      }
      throw new Error("Failed to load schema");
    }),
  };
});

describe("orchestrateDocsWorkflow", () => {
  it("should throw if schema does not exist", async () => {
    const paths = {
      schemaPath: "nonexistent",
      outputPath: "/tmp/output",
    };

    await expect(() =>
      orchestrateDocsWorkflow(paths)
    ).rejects.toThrowError("Schema file not found");
  });

  it("should run successfully if files exist", async () => {
    const paths = {
      schemaPath: "valid-schema",
      outputPath: "/tmp/output",
    };

    await expect(orchestrateDocsWorkflow(paths)).resolves.toBeUndefined();
  });
});