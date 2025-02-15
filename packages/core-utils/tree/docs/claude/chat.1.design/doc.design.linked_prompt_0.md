# Tree Core Design: Test-First Evolution

## 1. Core Evolution Model

### 1.1 Primitive Seeds
```typescript
// Base fossil seed - provides core evolution patterns
const fossilSeed = {
  aliases: ['FossilSeed', 'ProtoSeed'],
  evolve: Object.create, // Basic evolution through prototype chain
};

// Object seed extends fossil with object manipulation
const objSeed = Object.create(fossilSeed, {
  aliases: {
    value: ['Seed', 'ObjectSeed']
  },
  evolve: {
    value: function(transformer) {
      // Overloaded evolution patterns
      if (typeof transformer === 'function') {
        return transform(this); // Simple transformation
      }
      if (transformer.extend) {
        return Object.create(this, transformer.extend); // Prototype extension
      }
      if (transformer.mixin) {
        return Object.assign(Object.create(this), transformer.mixin); // Property mixing
      }
      if (transformer.chain) {
        return transformer.chain(this); // Chain transformation
      }
    }
  }
});
```

### 1.2 Testing Strategy
```typescript
describe('Tree Evolution', () => {
  describe('FossilSeed', () => {
    test('provides basic Object.create evolution', () => {
      const child = fossilSeed.evolve({}); 
      expect(Object.getPrototypeOf(child)).toBe(fossilSeed);
    });
    
    test('maintains alias list', () => {
      expect(fossilSeed.aliases).toContain('FossilSeed');
      expect(fossilSeed.aliases).toContain('ProtoSeed');
    });
  });

  describe('ObjectSeed', () => {
    test('supports simple transform', () => {
      const result = objSeed.evolve(x => ({ ...x, value: 5 }));
      expect(result.value).toBe(5);
    });

    test('supports prototype extension', () => {
      const result = objSeed.evolve({
        extend: {
          method: { value: () => 'extended' }
        }
      });
      expect(result.method()).toBe('extended');
      expect(Object.getPrototypeOf(result)).toBe(objSeed);
    });

    test('supports property mixing', () => {
      const result = objSeed.evolve({
        mixin: { prop: 'mixed' }
      });
      expect(result.prop).toBe('mixed');
      expect(Object.getPrototypeOf(result)).toBe(objSeed);
    });

    test('supports chain transformation', () => {
      const result = objSeed.evolve({
        chain: x => ({ transformed: true })
      });
      expect(result.transformed).toBe(true);
    });
  });
});
```

## 2. Tree Composition

### 2.1 Branch Pattern
```typescript
const createBranch = (parent, value) => {
  const branch = Object.create(parent);
  branch.value = value;
  branch.parent = parent;
  return branch;
};

// Test
test('branch creates child with value and parent reference', () => {
  const parent = objSeed.evolve({});
  const branch = createBranch(parent, 5);
  
  expect(branch.value).toBe(5);
  expect(branch.parent).toBe(parent);
  expect(Object.getPrototypeOf(branch)).toBe(parent);
});
```

### 2.2 Evolution Pipeline
```typescript
const createPipeline = (...transforms) => {
  return (seed) => transforms.reduce(
    (result, transform) => result.evolve(transform),
    seed
  );
};

// Test
test('pipeline composes multiple transforms', () => {
  const pipeline = createPipeline(
    x => ({ ...x, a: 1 }),
    { extend: { method: { value: () => 'test' } } },
    { mixin: { b: 2 } }
  );
  
  const result = pipeline(objSeed);
  expect(result.a).toBe(1);
  expect(result.method()).toBe('test');
  expect(result.b).toBe(2);
});
```

## 3. Primitive Tree Types

Each primitive type extends the base object seed with type-specific behaviors:

### 3.1 Number Tree
```typescript
const numberSeed = objSeed.evolve({
  extend: {
    add: { value: function(n) { return this.value + n; } },
    multiply: { value: function(n) { return this.value * n; } }
  }
});

// Test
test('number tree supports arithmetic operations', () => {
  const num = createBranch(numberSeed, 5);
  expect(num.add(3)).toBe(8);
  expect(num.multiply(2)).toBe(10);
});
```

### 3.2 Array Tree
```typescript
const arraySeed = objSeed.evolve({
  extend: {
    map: { value: function(fn) { return this.value.map(fn); } },
    filter: { value: function(fn) { return this.value.filter(fn); } }
  }
});

// Test
test('array tree supports collection operations', () => {
  const arr = createBranch(arraySeed, [1, 2, 3]);
  expect(arr.map(x => x * 2)).toEqual([2, 4, 6]);
  expect(arr.filter(x => x > 1)).toEqual([2, 3]);
});
```

## 4. Implementation Notes

1. **Test-First Development**
   - Write tests for each evolution pattern
   - Verify type-specific behaviors
   - Test composition patterns
   - Ensure proper prototype chain

2. **Evolution Patterns**
   - Simple transformation (function)
   - Prototype extension (extend)
   - Property mixing (mixin)
   - Chain transformation (chain)

3. **Type System**
   - Base object seed
   - Primitive-specific seeds
   - Maintain prototype relationships
   - Support type-specific operations

4. **Composition Model**
   - Branch creation
   - Pipeline composition
   - Parent references
   - Evolution tracking

The core utility provides the foundation for composing tree structures through evolution patterns, while maintaining type safety and proper prototype relationships. Each primitive type extends this base functionality with its own specific operations.

Implementation should follow the test-first approach, with each feature being defined through tests before implementation begins.
