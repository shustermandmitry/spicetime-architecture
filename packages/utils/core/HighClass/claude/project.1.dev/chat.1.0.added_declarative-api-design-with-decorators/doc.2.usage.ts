// HighClass Usage Examples

import { HighClass, do_, compose, fix, decorators } from './highclass';

// 1. Basic Context Evolution
const baseContext = {
  name: 'base',
  greet: (ctx, name) => `Hello, ${name}`
};

const evolved = HighClass.make(baseContext)
  .extend({
    farewell: (ctx, name) => `Goodbye, ${name}`
  });

// 2. Using 'do' for Local Composition
const mathContext = {
  add: (ctx, a, b) => a + b,
  multiply: (ctx, a, b) => a * b
};

const calculate = do_(mathContext)(
  (ctx, x) => ctx.add(x, 10),
  (ctx, x) => ctx.multiply(x, 2)
);

// 3. Context-Aware Transformations
const counterContext = {
  count: 0,
  increment: (ctx) => ({ ...ctx, count: ctx.count + 1 }),
  decrement: (ctx) => ({ ...ctx, count: ctx.count - 1 })
};

const counter = HighClass.make(counterContext)
  .transform(
    (ctx) => ctx.increment(ctx),
    decorators.frozen
  );

// 4. Inheritance Chain
const animalContext = {
  type: 'animal',
  makeSound: (ctx) => 'generic sound'
};

const dogContext = HighClass.make(animalContext)
  .extend({
    type: 'dog',
    makeSound: (ctx) => 'woof'
  })
  .transform(decorators.protected);

// 5. Complex Composition with do_
const processingContext = {
  validate: (ctx, data) => ({ ...data, valid: true }),
  transform: (ctx, data) => ({ ...data, processed: true }),
  store: (ctx, data) => ({ ...data, stored: true })
};

const processData = do_(processingContext)(
  (ctx, data) => ctx.validate(ctx, data),
  (ctx, data) => ctx.transform(ctx, data),
  (ctx, data) => ctx.store(ctx, data)
);

// 6. Temporal Context Example
const timeContext = {
  past: { events: [] },
  present: { current: null },
  future: { scheduled: [] }
};

const timekeeper = HighClass.make(timeContext)
  .transform(
    (ctx) => ({
      ...ctx,
      recordEvent: (ctx, event) => ({
        ...ctx,
        past: {
          ...ctx.past,
          events: [...ctx.past.events, event]
        }
      })
    })
  );

// 7. Using fix for Complex Transformations
const loggingTransform = fix({
  log: (ctx, msg) => console.log(msg)
})(
  (ctx, target) => ({
    ...target,
    logged: true,
    log: ctx.log
  })
);

// 8. Advanced Composition with Context Awareness
const pipeline = do_({
  transform: (ctx, x) => x * 2,
  validate: (ctx, x) => x > 0,
  process: (ctx, x) => x.toString()
})(
  (ctx, input) => ctx.transform(ctx, input),
  (ctx, input) => ctx.validate(ctx, input) ? input : null,
  (ctx, input) => input && ctx.process(ctx, input)
);