// HighClass Core API Surface
class HighClass {
  // Static factory with aliases
  static getHighClass = (baseClass: any) => new HighClass(baseClass);
  static toHighClass = this.getHighClass;
  static HighClass = this.getHighClass;
  static makeHighClass = this.getHighClass;

  // Bootstrap Stage 1: Core Decorators
  @frozen
  private static decorators = {
    bind: (target: object, context: any = null) => {
      // Base binding decorator
      return function decorator(target: any, prop: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = context ? original.bind(context) : original.bind(target);
        return descriptor;
      };
    },

    // Binding variants with clear intent
    bound: this.decorators.bind,
    locallyBound: (target: object) => this.decorators.bind(target, null),
    withContext: this.decorators.bind,
    
    // Lexical binding (discouraged but available)
    lexicallyBound: (target: object, lexicalContext: any) => 
      this.decorators.bind(target, lexicalContext),
    withLocalContext: this.decorators.lexicallyBound,

    // Protection and freezing
    frozen: (target: object) => {
      Object.freeze(target);
      return target;
    },
    protected: (target: object, prop: string) => {
      Object.defineProperty(target, prop, {
        configurable: false,
        writable: false
      });
      return target;
    }
  };

  // Bootstrap Stage 2: Composers
  @frozen
  private static composers = {
    fix: (...decorators: Function[]) => (target: any) => {
      decorators.forEach(d => d(target));
      return target;
    },
    
    extendSelf: this.composers.fix,
    
    compose: (...fns: Function[]) => 
      fns.reduce((f, g) => (...args: any[]) => f(g(...args))),
    
    shallowMap: (decorator: Function) => (target: object) => {
      Object.getOwnPropertyNames(target).forEach(prop => {
        if (typeof target[prop] === 'function') {
          decorator(target, prop);
        }
      });
      return target;
    }
  };

  // Instance methods expose the API
  constructor(private baseClass: any) {
    // Freeze prototype chain during construction
    Object.freeze(Object.getPrototypeOf(this));
  }

  // Public API methods delegate to static implementations
  decorate = (...decorators: Function[]) => 
    HighClass.composers.fix(...decorators)(this.baseClass);
    
  extend = (extensions: object) => {
    const frozen = Object.freeze(Object.create(this.baseClass));
    return Object.assign(frozen, extensions);
  }
}

// Usage Example:
const enhancedClass = HighClass.getHighClass(BaseClass)
  .decorate(
    HighClass.decorators.frozen,
    HighClass.decorators.locallyBound
  )
  .extend({
    newMethod() { /* ... */ }
  });