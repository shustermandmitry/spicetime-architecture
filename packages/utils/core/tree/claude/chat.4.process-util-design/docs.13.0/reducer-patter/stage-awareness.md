# Stage-Aware Reduction

## Core Concept

Reducers maintain stage awareness to:
- Process actions in proper context
- Manage stage-specific state
- Enable clean transitions
- Preserve stage boundaries

## Stage Context

### Context Awareness
Reducers know:
- Current stage
- Available actions
- State boundaries
- Tool context

### State Boundaries
Each stage has:
- Local state scope
- Inherited context
- Clear boundaries
- Protected access

### Action Context
Actions operate with:
- Stage awareness
- Clear authority
- Proper scope
- Context validation

## Reduction Patterns

### Local Reduction
Within stage:
- Clear scope
- Direct access
- Fast resolution
- Clean boundaries

### Cross-Stage
Between stages:
- Controlled flow
- Clear pathways
- Context preservation
- Clean handoff

### Transitional
During stage changes:
- State preservation
- Context migration
- Tool handoff
- Clean evolution

## Key Aspects

1. **Context Maintenance**
   - Stage awareness
   - Clear boundaries
   - Proper access
   - Clean flow

2. **State Protection**
   - Scope isolation
   - Controlled sharing
   - Clear ownership
   - Safe evolution

3. **Action Control**
   - Proper context
   - Clear authority
   - Clean transitions
   - Safe operations

The key is that stage awareness enables safe and coherent state management across process evolution.