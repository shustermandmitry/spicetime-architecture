// Core types that represent the fractal pattern
type DomainTic = {
  version: string;
  frozen: boolean;
  proto: DomainTic | null;
  extensions: Map<string, any>;
  dependents: Set<string>;
};

type Interpreter = {
  language: string;
  runtime: (code: string) => any;
  tools: Map<string, Function>;
};

type Domain = {
  name: string;
  process: Process;
  tools: ToolTree;
  runtime: Map<string, Interpreter>;
  currentTic: DomainTic;
};

type Process = {
  steps: string[];
  subProcesses: Map<string, Process>;
  toolScope: ToolTree;
};

type ToolTree = {
  local: Map<string, Function>;
  exposed: Map<string, Function>;
  children: Map<string, ToolTree>;
};

// The fossilSeed - source of all domains
const fossilSeed = {
  // Breed new domain
  breed: (name: string, process: Process) => {
    const domain: Domain = {
      name,
      process,
      tools: createToolTree(),
      runtime: new Map(),
      currentTic: {
        version: '0.0.0',
        frozen: false,
        proto: null,
        extensions: new Map(),
        dependents: new Set()
      }
    };

    return {
      // Grow domain with initial interpreter
      grow: (language: string, runtime: Function) => {
        domain.runtime.set(language, {
          language,
          runtime,
          tools: new Map()
        });

        // Domain tree API
        return {
          // Create new branch (subprocess)
          branch: (name: string, subprocess: Process) => {
            domain.process.subProcesses.set(name, subprocess);
            
            return {
              // Create leaf (specific implementation)
              leaf: (implementation: any) => {
                const tic = Object.create(domain.currentTic);
                tic.extensions.set(name, implementation);
                return implementation;
              },
              
              // Generate new seed from branch
              giveSeed: () => {
                return fossilSeed.breed(name, subprocess);
              }
            };
          },

          // Add tool to domain
          addTool: (scope: string[], tool: Function) => {
            let toolTree = domain.tools;
            for (const level of scope.slice(0, -1)) {
              if (!toolTree.children.has(level)) {
                toolTree.children.set(level, createToolTree());
              }
              toolTree = toolTree.children.get(level)!;
            }
            const toolName = scope[scope.length - 1];
            toolTree.local.set(toolName, tool);
            return tool;
          },

          // Create new tic in time
          tic: (version: string) => {
            if (!domain.currentTic.frozen) {
              throw new Error('Current tic must be frozen before creating new one');
            }
            
            const newTic = Object.create(domain.currentTic);
            newTic.version = version;
            newTic.frozen = false;
            newTic.proto = domain.currentTic;
            newTic.extensions = new Map();
            
            domain.currentTic = newTic;
            return newTic;
          },

          // Freeze current tic
          freeze: () => {
            domain.currentTic.frozen = true;
            return domain.currentTic;
          }
        };
      }
    };
  }
};

// Helper to create tool tree
const createToolTree = (): ToolTree => ({
  local: new Map(),
  exposed: new Map(),
  children: new Map()
});

// Example: WebDev domain
const webDevSeed = fossilSeed.breed('webdev', {
  steps: ['design', 'spec', 'implement', 'test'],
  subProcesses: new Map(),
  toolScope: createToolTree()
});

const webDev = webDevSeed.grow('react', (code) => {
  // React runtime interpretation
});

// Core utils subdomain
const utilsBranch = webDev.branch('utils', {
  steps: ['core', 'compose', 'specialize'],
  subProcesses: new Map(),
  toolScope: createToolTree()
});

// Add tool to utils
webDev.addTool(['utils', 'core'], () => {
  // Core utility implementation
});

// Create new tic when needed
const currentTic = webDev.tic('1.0.0');

// Freeze when ready
webDev.freeze();

// Components can depend on frozen tic
const componentSeed = utilsBranch.giveSeed();

export { fossilSeed };
