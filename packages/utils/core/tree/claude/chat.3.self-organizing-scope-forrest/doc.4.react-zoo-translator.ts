// Translation dictionary between React and Zoo domains
const domainDictionary = {
  // Core React concepts translated to Zoo
  component: 'animal',
  props: 'traits',
  state: 'mood',
  effect: 'behavior',
  context: 'environment',
  ref: 'memory',
  
  // Utility types translated
  pure: 'wellBehaved',
  memoized: 'trained',
  callback: 'trick',
  
  // Locations translated
  utils: 'toolbox',
  hooks: 'skills',
  components: 'species'
};

// Core scope that holds all utility functions
const createZooCore = () => {
  const scope = {
    // Core utilities live at the root scope
    core: new Map(),
    // Branch scopes for different utility families
    branches: new Map(),
    // Translation layer
    translate: new Map()
  };

  return {
    // Register a pure utility function in a branch
    addTool: (branchName, toolName, fn) => {
      if (!scope.branches.has(branchName)) {
        scope.branches.set(branchName, new Map());
      }
      scope.branches.get(branchName).set(toolName, fn);
      
      // Add translation
      scope.translate.set(toolName, {
        reactName: toolName,
        zooName: `${branchName}${toolName}Animal`,
        branch: branchName
      });
    },

    // Create scope for accessing utilities
    makeScope: (branchName) => {
      const branchScope = scope.branches.get(branchName);
      if (!branchScope) return null;

      // Create proxy that translates access
      return new Proxy({}, {
        get: (target, prop) => {
          const tool = branchScope.get(prop);
          if (tool) {
            // Wrap tool with translation info
            return Object.assign(tool, {
              __translation: scope.translate.get(prop)
            });
          }
          return undefined;
        }
      });
    }
  };
};

// Example Usage:

// Create core zoo
const zoo = createZooCore();

// Add some example React utility functions with zoo translations
zoo.addTool('format', 'formatDate', (date) => ({
  formatted: new Date(date).toLocaleDateString(),
  original: date
}));

zoo.addTool('validate', 'validateEmail', (email) => ({
  isValid: email.includes('@'),
  message: email.includes('@') ? 'Valid email' : 'Invalid email'
}));

// Access utilities through scoped translation
const formatTools = zoo.makeScope('format');
const validateTools = zoo.makeScope('validate');

// Use with translation information preserved
const { formatted } = formatTools.formatDate(new Date());
console.log(formatTools.formatDate.__translation);
// {
//   reactName: 'formatDate',
//   zooName: 'formatDateAnimal',
//   branch: 'format'
// }

// React usage example:
const ExampleComponent = () => {
  // Normal React code using the utilities
  const handleValidate = (email) => {
    const result = validateTools.validateEmail(email);
    return result.isValid;
  };
  
  return (
    <div>
      <span>{formatTools.formatDate(new Date()).formatted}</span>
    </div>
  );
};

// Example of how utilities organize in the scope tree:
const utilityOrganization = {
  // Core scope (root)
  core: {
    // Format branch
    format: {
      formatDate: "Function that formats dates",
      formatNumber: "Function that formats numbers",
      // Each utility is a "well-behaved animal" in the zoo
    },
    // Validation branch
    validate: {
      validateEmail: "Function that validates emails",
      validatePhone: "Function that validates phone numbers",
    },
    // Each branch is a family of related utilities
  }
};

export { createZooCore, domainDictionary };
