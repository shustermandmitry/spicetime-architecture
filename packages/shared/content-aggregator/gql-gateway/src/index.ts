/**
     * Entry point for the Gateway server.
     * This file initializes the server, stitches schemas, applies middleware, and starts the server.
     */
    import { ApolloServer } from "@apollo/server";
    import { startStandaloneServer } from "@apollo/server/standalone";
    import { stitchSchemas } from "@graphql-tools/stitch";
    import { buildContext } from "./services/auth";
    import { accountsSchema } from "./schemas/accounts";
    import { permissionsSchema } from "./schemas/permissions";
    import { discoveryService } from "./services/discovery";

    /**
     * Function to initialize and start the GraphQL Gateway server.
     */
    async function startGateway() {
      console.log("🚀 Starting Gateway module...");

      // Discover schemas dynamically
      const additionalSchemas = await discoveryService.discoverSchemas();

      // Stitch schemas together
      const stitchedSchema = stitchSchemas({
        subschemas: [
          accountsSchema,
          permissionsSchema,
          ...additionalSchemas, // Add discovered schemas
        ],
      });

      // Initialize Apollo Server
      const server = new ApolloServer({
        schema: stitchedSchema,
        // Attach authentication context
        context: async ({ req }) => buildContext(req),
      });

      // Start the standalone server
      const PORT = process.env.PORT || 4000;
      const { url } = await startStandaloneServer(server, { listen: { port: PORT } });

      console.log(`🚀 Gateway ready at ${url}`);
    }

    // Start the gateway server
    startGateway().catch((error) => {
      console.error("❌ Failed to start Gateway server:", error);
    });
