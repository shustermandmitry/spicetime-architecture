# Stage Artifacts

## Core Concept

Each stage builds and maintains specific artifacts that:
- Represent stage-specific work products
- Take form as JSX strings
- Flow between stages
- Enable stage composition

## Artifact Types

### Design Stage
Design produces:
- Component JSX trees
- Layout structures
- Style definitions
- Configuration specs

### Build Stage
Build creates:
- Compiled components
- Bundled resources
- Package structures
- Deployment configs

### Production Stage
Production maintains:
- Runtime instances
- State snapshots
- Performance metrics
- System health data

## Artifact Flow

### Between Stages
Artifacts progress through:
- Stage completion triggers
- Dependency resolution
- Tool transformations
- Context adaptation

### During Composition
Artifacts merge through:
- Tree combination rules
- Style resolution
- Resource deduplication
- Context merging

## JSX Structure

### Component Trees
JSX represents:
- Component hierarchy
- Property definitions
- Event handlers
- Child relationships

### Stage Context
JSX includes:
- Tool configurations
- Stage parameters
- Build requirements
- Runtime needs

## Key Aspects

1. **Stage Specific**
   - Clear purpose per stage
   - Natural representation
   - Tool compatibility
   - Flow patterns

2. **Flow Support**
   - Clean progression
   - Merge handling
   - Transform capability
   - Context preservation

3. **Composition Ready**
   - Tree merging
   - Style resolution
   - Resource handling
   - Context combination

The key is that artifacts represent stage-specific work while enabling natural flow and composition.