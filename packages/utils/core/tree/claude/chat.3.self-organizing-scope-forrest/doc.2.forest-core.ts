// Core Types
type Genome = {
  domain: string;
  traits: any;
};

type Tree = {
  id: string;
  genome: Genome;
  branches: Map<string, Branch>;
};

type Branch<T = any> = {
  id: string;
  parent: string;
  value: T;
  leaves: Map<string, T>;
};

// Forest Management
const createForest = () => {
  const species = new Map<string, Genome>();
  const trees = new Map<string, Tree>();
  
  // The FossilSeed - ancient source of all tree species
  const fossilSeed = {
    // Breed new species from traits
    breed: (traits: Partial<Genome>) => {
      const genome: Genome = {
        domain: traits.domain || 'default',
        traits: traits.traits || {}
      };
      
      // Register species genome
      const id = crypto.randomUUID();
      species.set(id, genome);

      // Return seed that can grow trees
      return {
        // Grow new tree instance from seed
        grow: (value: any) => {
          const treeId = crypto.randomUUID();
          const tree: Tree = {
            id: treeId,
            genome,
            branches: new Map()
          };
          
          trees.set(treeId, tree);

          // Tree API
          return {
            // Create new branch with value type
            branch: <T>(name: string, value: T) => {
              const branchId = crypto.randomUUID();
              const branch: Branch<T> = {
                id: branchId,
                parent: treeId,
                value,
                leaves: new Map()
              };

              tree.branches.set(name, branch);

              // Branch API
              return {
                // Grow new leaf (instance) with value
                leaf: (value: T) => {
                  const leafId = crypto.randomUUID();
                  branch.leaves.set(leafId, value);
                  return value;
                }
              };
            }
          };
        }
      };
    }
  };

  // Forest-wide operations
  const forest = {
    // Find trees by domain
    find: (domain: string) => {
      return Array.from(trees.values())
        .filter(tree => tree.genome.domain === domain);
    },

    // Get traits from domain
    from: (domain: string) => {
      const domainTrees = forest.find(domain);
      return new Proxy({}, {
        get(target, prop) {
          // Find first tree with matching trait
          const tree = domainTrees.find(t => 
            prop in t.genome.traits);
          return tree ? tree.genome.traits[prop] : undefined;
        }
      });
    }
  };

  return {
    fossilSeed,
    forest
  };
};

// Example Usage
const { fossilSeed, forest } = createForest();

// Breed new species
const oakSeed = fossilSeed.breed({
  domain: 'oak',
  traits: {
    height: 30,
    leafType: 'broad'
  }
});

// Grow tree with initial value
const oak = oakSeed.grow({ type: 'deciduous' });

// Add branch with typed value
const lowBranch = oak.branch('low', {
  height: 5,
  diameter: 0.3
});

// Grow leaves (instances) on branch
const leaf1 = lowBranch.leaf({
  height: 6,
  diameter: 0.35
});

const leaf2 = lowBranch.leaf({
  height: 4,
  diameter: 0.25
});

// Access traits by domain
const { height, leafType } = forest.from('oak');

export { createForest };
