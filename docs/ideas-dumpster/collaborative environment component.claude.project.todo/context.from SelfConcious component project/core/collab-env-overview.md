# Collaborative Environment

Path: `/docs/collaborative-environment/README.md`

## Overview

The Collaborative Environment provides a real-time, multi-layered workspace for distributed development teams. Each
layer consists of multiple JSX strings defining content and layout, with state management and messaging handled through
standard GraphQL patterns.

## Core Components

### Layer System

- Multiple JSX strings per layer (content, layout)
- Nested Remix routing for navigation
- React-mosaic for window management
- Customizable views per collaborator

### State and Messaging

- GraphQL schemas define layer capabilities
- Apollo Client for state management
- Standard GQL queries, mutations, and subscriptions
- Real-time updates through GQL subscriptions

### Integration System

- Layer schemas stitch into global schema
- Standard Apollo hooks for data access
- Window composition through layout JSX
- Nested routing for layer organization

## Directory Structure

```
docs/
├── collaborative-environment/
│   ├── getting-started/
│   │   ├── setup.md
│   │   ├── basic-usage.md
│   │   └── configuration.md
│   ├── core/
│   │   ├── layer-system.md
│   │   ├── schema-design.md
│   │   └── integration.md
│   ├── components/
│   │   ├── layer-manager.md
│   │   ├── workspace.md
│   │   └── windows.md
│   └── guides/
       ├── creating-layers.md
       ├── custom-views.md
       └── collaboration-patterns.md
```

## Key Features

1. **Layer Management**
    - Multiple JSX strings define each layer
    - Flexible window arrangements
    - Nested routing structure
    - Customizable per collaborator

2. **State Management**
    - GraphQL schema per layer
    - Standard Apollo Client hooks
    - Real-time subscriptions
    - Schema stitching for integration

3. **Collaboration Tools**
    - Live updates through subscriptions
    - Shared workspace state
    - Window composition
    - Customizable views

## Development Stack

- **Remix**: Routing and nested navigation
- **React-mosaic**: Window management
- **GraphQL**: Schema-based state and messaging
- **Apollo Client**: Data management and real-time updates

## Next Steps

1. Follow the [Getting Started](./getting-started/setup.md) guide
2. Understand [Layer System](./core/layer-system.md) concepts
3. Learn about [Schema Design](./core/schema-design.md)

## Integration with SpiceTime

While built on SpiceTime principles, this collaborative environment focuses specifically on enabling distributed
development workflows through:

- Layer-based visualization
- Standard GraphQL patterns
- Multi-JSX composition
- Nested routing