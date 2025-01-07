# Middleware Distribution

Path: `/docs/collaborative-environment/core/middleware-distribution.md`

## Service Subscription Flow

When a node wants to use a service:

```graphql
# Service discovery and subscription
type Mutation {
  subscribeToService(
    serviceId: ID!
    subscriptionLevel: String!
  ): ServiceSubscription! {
    id: ID!
    middleware: MiddlewarePackage!
    accessToken: String!
  }
}

# Middleware package info
type MiddlewarePackage {
  code: String!          # The actual middleware code
  version: String!
  dependencies: [String!]!
  configuration: JSON
}
```

## Dynamic Tool Installation

Services provide their middleware as part of subscription:

```typescript
// Service includes its middleware in subscription response
class FileService {
  async handleSubscription(request) {
    return {
      subscription: {
        id: 'sub-123',
        accessToken: generateToken(),
        middleware: {
          code: await this.getMiddlewareCode(),
          version: '1.0.0',
          dependencies: ['@grpc/client'],
          configuration: {
            endpoints: this.endpoints,
            protocols: ['grpc', 'ws']
          }
        }
      }
    };
  }
}

// Node dynamically installs service middleware
class Node {
  async subscribeToService(serviceId: string) {
    const { subscription } = await this.subscribe(serviceId);
    
    // Install middleware from subscription
    await this.pipeline.installMiddleware({
      code: subscription.middleware.code,
      config: subscription.middleware.configuration,
      token: subscription.accessToken
    });
  }
}
```

## Middleware Lifecycle

1. **Discovery**
    - Node discovers available services
    - Reviews service capabilities/costs
    - Initiates subscription

2. **Installation**
    - Service provides middleware package
    - Node validates package
    - Middleware installed in pipeline

3. **Updates**
    - Service pushes middleware updates
    - Node manages versions
    - Graceful transitions

```typescript
// Service pushes middleware updates
class ServiceProvider {
  async pushUpdate(subscribers) {
    const update = {
      version: '1.1.0',
      code: await this.getUpdatedMiddleware(),
      changeLog: 'Performance improvements'
    };

    for (const subscriber of subscribers) {
      await subscriber.notify({
        type: 'MIDDLEWARE_UPDATE',
        update
      });
    }
  }
}
```

## Security Considerations

1. **Code Validation**
    - Verify middleware signatures
    - Sandbox execution
    - Resource limits

2. **Access Control**
    - Token management
    - Permission scoping
    - Usage monitoring

```typescript
// Middleware sandbox
class MiddlewareSandbox {
  async runMiddleware(code: string, request: Request) {
    return this.isolate.run(code, {
      memory: '128MB',
      timeout: '5s',
      permissions: ['network', 'state']
    });
  }
}
```

## Best Practices

1. **Subscription Management**
    - Clear service terms
    - Version control
    - Update policies

2. **Middleware Design**
    - Self-contained
    - Minimal dependencies
    - Clear configuration

3. **Distribution**
    - Efficient delivery
    - Delta updates
    - Rollback support

## Example Flow

```typescript
// Service advertises its middleware
class ServiceAdvertisement {
  getServiceDetails() {
    return {
      id: 'file-service-1',
      capabilities: ['file-storage', 'versioning'],
      subscription: {
        levels: ['basic', 'premium'],
        middleware: {
          size: '2MB',
          runtime: 'node16',
          updateFrequency: 'weekly'
        }
      }
    };
  }
}

// Node manages subscribed middleware
class NodeMiddlewareManager {
  async handleServiceSubscription(subscription) {
    // Add to pipeline
    this.pipeline.add({
      id: subscription.id,
      middleware: await this.loadMiddleware(subscription),
      config: subscription.configuration
    });

    // Setup update handling
    this.setupUpdateListener(subscription);
  }
}
```