# HighClass: Simple Yet Powerful

## Clean Syntax Examples

### Basic Class Evolution
```javascript
// Before (traditional JavaScript)
class UserService {
  constructor() {
    this.users = [];
    this.addUser = this.addUser.bind(this);
  }
  addUser(user) { /* ... */ }
}

// After (HighClass)
const UserService = do({
  users: [],
  addUser: (ctx, user) => ({ 
    ...ctx, 
    users: [...ctx.users, user] 
  })
});
```

### Easy Composition
```javascript
// Processing pipeline with clear data flow
const processOrder = do({
  validate: (ctx, order) => /* validation logic */,
  calculate: (ctx, order) => /* pricing logic */,
  save: (ctx, order) => /* storage logic */
})(
  (ctx, order) => ctx.validate(order),
  (ctx, order) => ctx.calculate(order),
  (ctx, order) => ctx.save(order)
);

// Use it simply
const result = processOrder(context, orderData);
```

### State Management Made Clear
```javascript
const counter = do({
  count: 0,
  increment: (ctx) => ({ ...ctx, count: ctx.count + 1 }),
  decrement: (ctx) => ({ ...ctx, count: ctx.count - 1 })
});

// Clean state updates
const newState = counter.increment(currentState);
```

### Time-Aware Operations
```javascript
const timekeeper = do({
  events: [],
  record: (ctx, event) => ({
    ...ctx,
    events: [...ctx.events, { ...event, timestamp: Date.now() }]
  })
});

// Each operation creates new state, preserving history
const withNewEvent = timekeeper.record(state, { type: 'USER_LOGIN' });
```

### Powerful Function Generation
```javascript
// Generate functions that know their context
const mathOps = do({
  add: (x, y) => x + y,
  multiply: (x, y) => x * y
})(
  // Creates a new named operation
  (ctx) => ({
    ...ctx,
    double: (x) => ctx.multiply(x, 2),
    addThenDouble: (x, y) => ctx.double(ctx.add(x, y))
  })
);
```

### React Component Evolution
```javascript
const Button = do({
  render: (ctx, props) => (
    <button onClick={() => ctx.handleClick(props)}>
      {props.children}
    </button>
  )
})(
  // Add behavior
  (ctx) => ({
    ...ctx,
    handleClick: (props) => props.onClick?.()
  }),
  // Add styling
  (ctx) => ({
    ...ctx,
    styles: { padding: '8px', borderRadius: '4px' }
  })
);
```

## Why It's Better

1. **No More `this` Confusion**
   - Context is explicit
   - Functions are pure
   - State flow is clear

2. **Immutable By Default**
   - Each operation creates new state
   - History is preserved
   - Easy to track changes

3. **Composition Is Natural**
   - Functions combine cleanly
   - Context flows predictably
   - Easy to extend

4. **Time-Aware Development**
   - Each change creates a new layer
   - Past states are preserved
   - Future extensions are clean

## Coming Soon

The next evolution (MiddleClass) will make this even more elegant:

```javascript
// Future syntax preview
const process = using(context)
  .with(validateOrder)
  .then(calculatePrice)
  .finally(saveToDatabase);

const result = process(order);
```

Start with these patterns - they're the foundation for even more powerful abstractions to come.