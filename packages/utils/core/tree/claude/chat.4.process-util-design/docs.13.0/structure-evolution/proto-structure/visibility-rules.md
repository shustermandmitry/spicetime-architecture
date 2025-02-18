# Scope Visibility Rules

## Core Concept

Visibility rules govern:
- What each scope can access
- How state and actions flow
- Stage boundary enforcement
- Proto chain traversal

## Visibility Structure

### Basic Rules
- Lower scopes visible to higher
- Higher scopes hidden from lower
- Siblings can't see each other
- Root visible to all

### Access Patterns
Through proto chain:
- Direct parent access
- Ancestor chain traversal
- Root state availability
- Stage context boundaries

### Context Boundaries
Stages enforce:
- Scope isolation
- Controlled sharing
- Explicit interfaces
- Clean separation

## Visibility Control

### State Access
Rules for state:
- Read access flows up
- Write confined to scope
- Updates flow through chain
- History preserved

### Action Access
Rules for actions:
- Available down chain
- Stage-specific isolation
- Context-aware execution
- Clean composition

### Tool Access
Rules for tools:
- Stage-specific availability
- Capability inheritance
- Interface requirements
- Context dependencies

## Key Aspects

1. **Clean Boundaries**
   - Clear scope limits
   - Explicit sharing
   - Controlled access
   - Natural flow

2. **Chain Navigation**
   - Simple traversal
   - Clear pathways
   - Efficient access
   - Relationship preservation

3. **Context Control**
   - Scope awareness
   - State management
   - Action boundaries
   - Tool coordination

The key is that visibility rules create clean boundaries while enabling natural scope interaction.