/**
     * Example test for service discovery.
     */
    import { describe, it, expect, vi } from "vitest";
    import { discoveryService } from "./discovery";

    vi.mock("cross-fetch", () => ({
      fetch: vi.fn(async () => ({
        ok: true,
        json: async () => ({
          data: {
            services: [{ name: "ExampleService", url: "http://localhost:5000/graphql" }],
          },
        }),
      })),
    }));

    describe("Discovery Service", () => {
      it("should return discovered schemas", async () => {
        const schemas = await discoveryService.discoverSchemas();
        expect(schemas).toHaveLength(1);
        expect(schemas[0]).toHaveProperty("schema");
        expect(schemas[0]).toHaveProperty("executor");
      });
    });
