# Why We Build on Penpot

## Core Alignment

### Component-First Philosophy

Penpot naturally aligns with our component-based thinking:

- Starts with basic shapes and structures
- Builds up through composition
- Thinks in terms of reusable pieces
- No templates forcing decisions

### Open Architecture

- Open source foundation
- Built for extensibility
- Clear separation of concerns
- Plugin system we can build on

## Key Features We Leverage

### Visual Structure

```
Component in Penpot = Component in React
├── Basic shapes = Basic HTML elements
├── Groups = Container components
├── Styles = Component props
└── Libraries = Component libraries
```

### Code Generation

- SVG-native design
- Clean CSS output
- Direct path to React components
- No design-to-code translation needed

### Development Flow

```
Design → Component → Implementation
↑                              ↓
└──────── Iteration ───────────┘
```

## Why It Works for Us

### 1. Natural Component Creation

Instead of fighting with templates:

- Start with structure
- Add styling later
- Build up complexity
- Keep things modular

### 2. Developer-Friendly

Just like coding:

- Start with basic elements
- Compose bigger pieces
- Reuse common patterns
- Maintain clear structure

### 3. Domain Flexibility

Easy to adapt for different needs:

- UI components
- Process flows
- Data visualizations
- Document structures

## Practical Benefits

### For Developers

- Work in familiar patterns
- Natural path to implementation
- Clear component boundaries
- Easy to version and share

### For Design System

- Consistent components
- Shared libraries
- Clear documentation
- Easy updates

### For Teams

- Common language
- Clear workflows
- Easy collaboration
- No design-dev gap

## How We Extend It

### ComponentBuilder Integration

```typescript
interface PenpotExtension {
  // Core extensions
  components: {
    visual: PenpotVisual,
    code: ReactComponent,
    tree: ComponentTree
  },
  
  // Bridges
  transformers: {
    toReact: (visual: PenpotVisual) => ReactComponent,
    toTree: (visual: PenpotVisual) => ComponentTree,
    fromReact: (component: ReactComponent) => PenpotVisual
  },
  
  // Domain support
  domains: {
    [domain: string]: {
      components: PenpotComponent[],
      constraints: PenpotConstraint[],
      tools: PenpotTool[]
    }
  }
}
```

### View Synchronization

```typescript
// Example: Keeping views in sync
class PenpotSync {
  onVisualUpdate(change: PenpotChange) {
    // Update React
    const reactComponent = this.transformers.toReact(change.component);
    this.views.code.update(reactComponent);
    
    // Update Tree
    const treeNode = this.transformers.toTree(change.component);
    this.views.tree.update(treeNode);
  }
}
```

## Compared to Alternatives

### Why Not Figma?

- Closed source
- Template-focused
- Less developer-friendly
- Harder to extend

### Why Not Canva?

- Too template-driven
- Limited component model
- Not built for developers
- Complex marketplace

### Why Not Custom Built?

- Reinventing the wheel
- Missing mature features
- More maintenance
- Less community support

## Best Practices

### 1. Component Structure

- Keep components atomic
- Clear hierarchy
- Consistent naming
- Well-defined props

### 2. Development Flow

- Design in components
- Think in React terms
- Use shared libraries
- Regular synchronization

### 3. Team Workflow

- Common conventions
- Clear documentation
- Regular reviews
- Shared components

## Future Possibilities

### Enhanced Integration

- Better code generation
- Real-time collaboration
- Advanced constraints
- Smart suggestions

### Domain Expansion

- More domain types
- Custom visualizations
- Domain-specific tools
- Cross-domain linking

### Tool Evolution

- Smart guides
- Component analysis
- Performance insights
- Accessibility checks

## Getting Started

### Basic Setup

1. Install Penpot
2. Add our extensions
3. Configure domains
4. Set up sync

### First Component

1. Create basic structure
2. Add constraints
3. Generate code
4. Test and iterate

### Team Adoption

1. Share conventions
2. Build component library
3. Document patterns
4. Regular reviews