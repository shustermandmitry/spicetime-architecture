# Top/Bottom Merge Profiles

## Core Concept

Merge profiles control how processes combine by specifying:
- Where unmatched stages flow (top/bottom)
- How matching stages combine
- How artifacts preserve relationships
- How name conflicts resolve

## Profile Structure

### Base Profile Rules
- Direction of stage flow for unmatched stages
- Strategy for matching stage combination
- Artifact preservation patterns
- Name resolution approach

### Stage Flow Control
Profile determines where unmatched stages go:
- Flow to top: new capabilities overlay base
- Flow to bottom: new capabilities underlay base
- Mixed flow: explicit stage-by-stage control
- Relationship preservation throughout

### Combination Strategies
For matching stages, profile specifies:
- State merging patterns
- Tool combination rules
- Artifact flow paths
- Context preservation

## Profile Types

### Simple Profiles
Basic composition control:
- All unmatched stages to top/bottom
- Direct matching stage combination
- Straightforward artifact flow
- Default name resolution

### Stage-Specific Profiles
Granular control over stages:
- Per-stage flow direction
- Custom combination rules
- Targeted artifact handling
- Stage-specific naming

### Relationship Profiles
Composition based on relationships:
- Relationship-driven flow
- Context-aware combination
- Relationship-preserving artifacts
- Semantic name resolution

## Key Aspects

1. **Flow Control**
   - Clear stage placement
   - Maintained relationships
   - Coherent structure
   - Natural evolution

2. **Combination Rules**
   - Clean stage merging
   - Tool integration
   - Artifact preservation
   - Context maintenance

3. **Name Resolution**
   - Conflict handling
   - Namespace management
   - Semantic preservation
   - Clear references

The key is that profiles make process composition predictable and maintainable while preserving essential relationships.