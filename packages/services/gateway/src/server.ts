import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

export interface ServerConfig {
  port: number;
}

export class GatewayServer {
  private server: ApolloServer;
  
  constructor(private config: ServerConfig) {
    this.server = new ApolloServer({
      typeDefs: `#graphql
        type Query {
          health: String
        }
      `,
      resolvers: {
        Query: {
          health: () => 'OK'
        }
      }
    });
  }

  async start() {
    const { url } = await startStandaloneServer(this.server, {
      listen: { port: this.config.port }
    });
    console.log(`Server ready at ${url}`);
  }
}