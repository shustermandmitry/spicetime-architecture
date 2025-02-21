// HighClass Final Specification

// Stage 1: Core Context Handler
type Context = Record<string, any>;
type ContextualFn = (context: Context, ...args: any[]) => any;

// Core 'do' function - operates in local context
const do_ = (context: Context) => (...fns: ContextualFn[]) => {
  // Compose functions with explicit context passing
  const composed = fns.reduce((f, g) => 
    (ctx: Context, ...args: any[]) => f(ctx, g(ctx, ...args))
  );
  
  // Returns function that carries its context
  return Object.assign(composed, { context });
};

// Stage 2: Base Composers
const compose = (...fns: ContextualFn[]) => 
  (context: Context, ...args: any[]) => 
    fns.reduce((f, g) => (...args) => f(g(...args)))(context, ...args);

// Fix evolves using do
const fix = (context: Context) => (...transforms: ContextualFn[]) => {
  const doWithContext = do_(context);
  return doWithContext(...transforms);
};

// Stage 3: Evolution Manager
class HighClass {
  private context: Context;

  constructor(baseContext: Context = {}) {
    this.context = Object.freeze({ ...baseContext });
  }

  // Core evolution methods
  extend(newContext: Context): HighClass {
    return new HighClass({
      ...this.context,
      ...newContext
    });
  }

  // Context-aware transformations
  transform(...fns: ContextualFn[]): HighClass {
    const transformed = fix(this.context)(...fns);
    return new HighClass(transformed.context);
  }

  // Static creation methods
  static make = (context: Context) => new HighClass(context);
  static from = this.make;  // Alias
  static evolve = this.make; // Alias
}

// Stage 4: Contextual Decorators
const decorators = {
  // Freezing
  frozen: (context: Context) => Object.freeze(context),

  // Protection
  protected: (context: Context, prop: string) => ({
    ...context,
    [prop]: Object.freeze(context[prop])
  }),

  // Context inheritance
  inherit: (parent: Context) => (child: Context) => ({
    ...Object.create(parent),
    ...child
  })
};

export { HighClass, do_, compose, fix, decorators };