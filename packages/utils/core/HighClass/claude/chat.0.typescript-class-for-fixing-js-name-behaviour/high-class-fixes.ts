// Class fix factories
const fixes = {
  // Prevents name replacement by class name
  name: (BaseClass) => class extends BaseClass {
    constructor(instanceName?: string) {
      super(instanceName);
      Object.defineProperty(this, 'name', {
        value: instanceName,
        writable: false,
        enumerable: true,
        configurable: false
      });
    }
  },

  // Binds all methods to the instance
  binding: (BaseClass) => class extends BaseClass {
    constructor(...args: any[]) {
      super(...args);
      
      // Automatically bind all methods
      const proto = Object.getPrototypeOf(this);
      Object.getOwnPropertyNames(proto)
        .filter(prop => typeof this[prop] === 'function' && prop !== 'constructor')
        .forEach(method => {
          this[method] = this[method].bind(this);
        });
    }
  },

  // More fixes can be added here
};

// Composition function
function fix(...fixNames: Array<keyof typeof fixes>) {
  return (BaseClass: any = class {}) => {
    return fixNames.reduce(
      (AccumulatedClass, fixName) => fixes[fixName](AccumulatedClass),
      BaseClass
    );
  };
}

export { fix, fixes };
