# JavaScript Behavior Fixes Design Document

## Core Principles
- Predictability
- Consistency
- Minimal Overhead
- Maximum Compatibility

## 1. `this` Binding Problem

### Current JavaScript Behavior
```javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
  }
  
  startAutoIncrement() {
    // Context is lost!
    setInterval(this.increment, 1000);
  }
}

const counter = new Counter();
counter.startAutoIncrement(); // Breaks! `this` is not the counter instance
```

### Proposed Solution: Auto-Binding Decorator
```typescript
// Conceptual implementation
function autobind(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  return {
    configurable: true,
    get() {
      // Always bind the method to the current instance
      return originalMethod.bind(this);
    }
  };
}

class Counter {
  count = 0;
  
  @autobind
  increment() {
    this.count++;
  }
  
  startAutoIncrement() {
    // Now works correctly!
    setInterval(this.increment, 1000);
  }
}
```

### Alternative Approach: Base Class Method Binding
```typescript
class BindingFixed {
  // Utility method to bind all methods in the constructor
  constructor() {
    const proto = Object.getPrototypeOf(this);
    Object.getOwnPropertyNames(proto)
      .filter(prop => typeof this[prop] === 'function')
      .forEach(method => {
        this[method] = this[method].bind(this);
      });
  }
}

class Counter extends BindingFixed {
  count = 0;
  
  increment() {
    this.count++;
  }
  
  startAutoIncrement() {
    // Guaranteed to work
    setInterval(this.increment, 1000);
  }
}
```

## 2. Type Coercion Normalization

### Current JavaScript Weirdness
```javascript
console.log([] == false);  // true 🤨
console.log([] + {});      // "[object Object]" 🤯
console.log([] + []);      // "" 😕
```

### Proposed Strict Typing Methods
```typescript
class StrictType {
  // Predictable type conversion
  static strictEqual(a: any, b: any): boolean {
    // Strict type and value comparison
    return a === b;
  }
  
  // Safe type conversion
  static convert<T>(value: any, type: new (...args: any[]) => T): T | null {
    try {
      if (value instanceof type) return value;
      
      switch(type) {
        case Number:
          const num = Number(value);
          return isNaN(num) ? null : num as T;
        case String:
          return String(value) as T;
        case Boolean:
          return Boolean(value) as T;
        default:
          return null;
      }
    } catch {
      return null;
    }
  }
}
```

## 3. Prototype Method Inheritance Enhancement

### Current Inheritance Challenges
```javascript
class Parent {
  method() {
    return 'Parent';
  }
}

class Child extends Parent {
  method() {
    // How to call parent method cleanly?
    return super.method() + ' Child';
  }
}
```

### Proposed Inheritance Utility
```typescript
class InheritanceHelper {
  // Provide a clean way to extend methods
  static extend(baseMethod: Function, extensionMethod: Function) {
    return function(this: any, ...args: any[]) {
      const baseResult = baseMethod.apply(this, args);
      return extensionMethod.call(this, baseResult, ...args);
    };
  }
}

class Parent {
  method() {
    return 'Parent';
  }
}

class Child extends Parent {
  method = InheritanceHelper.extend(
    Parent.prototype.method, 
    (baseResult) => baseResult + ' Child'
  );
}
```

## 4. Default Parameter Improvements

### Current Default Parameter Limitations
```javascript
function createUser(
  name, 
  createdAt = new Date()  // Evaluates EVERY call
) {
  return { name, createdAt };
}

// Each call creates a new Date
const user1 = createUser('Alice');
const user2 = createUser('Bob');
// user1.createdAt !== user2.createdAt
```

### Proposed Default Parameter Strategy
```typescript
class DefaultParams {
  // Memoized default value generator
  static memoize(generator: () => any) {
    let value: any;
    let computed = false;
    
    return () => {
      if (!computed) {
        value = generator();
        computed = true;
      }
      return value;
    };
  }
}

function createUser(
  name, 
  createdAt = DefaultParams.memoize(() => new Date())
) {
  return { 
    name, 
    createdAt: createdAt() 
  };
}

// Now createdAt is consistent across calls
const user1 = createUser('Alice');
const user2 = createUser('Bob');
// user1.createdAt === user2.createdAt
```

## Future Considerations
- Performance optimization
- TypeScript compatibility
- Potential standardization

## Implementation Phases
1. Proof of concept
2. Comprehensive testing
3. Refactoring and optimization
4. Community feedback

---

## Open Questions
- What other JavaScript behaviors are most frustrating?
- Which of these solutions feels most valuable?
- How can we balance fixing behaviors without over-complicating the API?
