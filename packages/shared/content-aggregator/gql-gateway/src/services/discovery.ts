/**
     * Discovery service for dynamic schema detection.
     * Interrogates the registry service to fetch schemas from available GraphQL services.
     */
    import { introspectSchema } from "@graphql-tools/wrap";
    import { fetch } from "cross-fetch";

    interface DiscoveredService {
      name: string;
      url: string;
    }

    export const discoveryService = {
      /**
       * Discovers schemas by querying the registry service dynamically.
       *
       * @returns List of discovered schemas
       */
      discoverSchemas: async () => {
        const registryUrl = process.env.REGISTRY_URL || "http://localhost:4000";

        const query = `
          query GetRegisteredServices {
            services {
              name
              url
            }
          }
        `;

        const response = await fetch(registryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch registry: ${response.statusText}`);
        }

        const registryResponse = await response.json();
        const services: DiscoveredService[] = registryResponse.data?.services || [];

        if (!services.length) {
          throw new Error("No services discovered from the registry!");
        }

        return await Promise.all(
          services.map(async ({ name, url }) => {
            const executor = async ({ document, variables }: any) => {
              const query = document.loc && document.loc.source.body;
              const fetchResult = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, variables }),
              });
              return fetchResult.json();
            };

            return { schema: await introspectSchema(executor), executor };
          })
        );
      },
    };
