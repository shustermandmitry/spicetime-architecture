# Request Routing Patterns

Path: `/docs/collaborative-environment/core/request-routing.md`

## Request Flow

Requests flow through a middleware pipeline where tools self-select based on their capabilities:

```typescript
// HiveMind sets up the pipeline but doesn't make decisions
const resolver = {
  Mutation: {
    updateFile: async (_, args, context) => {
      // Run through middleware pipeline
      return context.pipeline.process({
        type: 'FILE_UPDATE',
        metadata: getGrpcMetadata(context),
        payload: args
      });
    }
  }
};

// Tools register as middleware
interface MiddlewareTool {
  // Each tool decides if it wants to handle the request
  canHandle(request: Request): boolean;
  // Tool processes request if it wants to
  process(request: Request): Promise<Response>;
  // Optional cost/capability advertising
  getCosts?(): CostStructure;
}

// Example tool that handles file updates
class FileServiceTool implements MiddlewareTool {
  canHandle(request: Request) {
    // Tool's own intelligence decides if it can/wants to handle this
    return this.analyzeRequest(request);
  }

  process(request: Request) {
    // Tool handles request its own way
    return this.processFile(request);
  }
}
```

## Middleware Pipeline

The pipeline is pluggable - tools can be added or removed:

```typescript
class RequestPipeline {
  constructor(private tools: MiddlewareTool[]) {}

  async process(request: Request) {
    // Let each tool look at the request
    for (const tool of this.tools) {
      if (await tool.canHandle(request)) {
        return tool.process(request);
      }
    }
    throw new Error('No tool claimed request');
  }
}
```

## Using gRPC Patterns

gRPC is just one possible transport plugin:

```typescript
// gRPC plugin adds metadata handling
const grpcPlugin = {
  name: 'grpc',
  
  addMetadata(request: Request) {
    return {
      ...request,
      metadata: {
        deadline: request.deadline,
        priority: request.priority,
        // other gRPC metadata
      }
    };
  }
};

// Other transport plugins possible
const customPlugin = {
  name: 'custom-transport',
  // Custom transport logic
};
```

## Tool Intelligence

Tools make their own decisions about requests:

```typescript
class SmartFileTool implements MiddlewareTool {
  canHandle(request: Request) {
    // Tool uses its own criteria:
    return this.checkCapabilities(request) &&
           this.assessCost(request) &&
           this.hasCapacity(request);
  }

  getCosts() {
    // Advertise current costs/capabilities
    return {
      processing: this.currentLoad,
      storage: this.availableSpace,
      bandwidth: this.networkCapacity
    };
  }
}
```

## HiveMind's Role

HiveMind mainly facilitates:

- Pipeline setup
- Tool registration
- Basic routing
- Request distribution

The intelligence lives in the tools themselves.

## Best Practices

1. **Tool Design**
    - Self-contained intelligence
    - Clear capability reporting
    - Efficient request analysis

2. **Pipeline Management**
    - Pluggable architecture
    - Simple routing logic
    - Performance monitoring

3. **Request Flow**
    - Clear metadata structure
    - Efficient tool matching
    - Fallback handling

## Example Setup

```typescript
// Setting up the pipeline
const pipeline = new RequestPipeline([
  new FileServiceTool(),
  new DocumentTool(),
  new BuildTool(),
  // Tools examine requests in order
]);

// HiveMind just passes requests through
const hiveMind = new HiveMind({
  pipeline,
  plugins: [
    grpcPlugin,
    // Other transport plugins
  ]
});
```

## Extension Points

1. **New Tools**
    - Add specialized tools
    - Implement custom intelligence
    - Define unique capabilities

2. **Transport Plugins**
    - gRPC support
    - Custom protocols
    - Legacy systems

3. **Monitoring**
    - Tool performance
    - Request patterns
    - Resource usage