# Linguistic Composition Patterns

```typescript
// Hierarchical composition with commas
const createFeature = compose(
  with(styles), build(style),
  with(layout), build(component),
  with(spec), build(feature)
);

// Creates natural groupings
const configureComponent = compose(
  with(theme), with(styles), build(component),
  with(props), with(state), build(behavior)
);

// Reads like nested sentences
const setupPage = compose(
  with(styles), with(layout), build(page),
  with(data), with(props), build(components),
  with(context), with(theme), build(environment)
);
```

We should look into packages that support this kind of linguistic composition. Some possibilities:
- Ramda has compose patterns that could be extended
- Sanctuary focuses on these kinds of hierarchical patterns
- Fantasy Land specs might have relevant patterns
- Parsimmon or similar parser combinator libraries

The key is using comma-separated groupings to create natural language hierarchies through composition.