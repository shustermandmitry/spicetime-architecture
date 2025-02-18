# JavaScript Class Fixes

## Usage Examples

### Name Preservation
```typescript
// Prevents class name from overriding instance name
const SomeClass = fix('name')(class {
  constructor(public data: string) {}
});

const instance = new SomeClass('custom name');
console.log(instance.name); // 'custom name', not 'SomeClass'
```

### Method Binding
```typescript
class Counter {
  count = 0;
  
  increment() {
    this.count++;
  }
  
  startAutoIncrement() {
    // Works even if method is passed around
    setInterval(this.increment, 1000);
  }
}

// Apply method binding
const BoundCounter = fix('binding')(Counter);
const counter = new BoundCounter();
```

### Combining Fixes
```typescript
// Chain multiple fixes
const RobustClass = fix('name', 'binding')(class {
  constructor(public data: string) {}
  
  someMethod() {
    // Always has correct 'this' context
    console.log(this.data);
  }
});
```

## Available Fixes
- `name`: Preserves instance name
- `binding`: Ensures method context preservation
