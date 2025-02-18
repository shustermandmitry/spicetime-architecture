// Core Types
type Monkey<T = any, R = any> = {
  name: string;
  recipe: (value: T) => R;
};

type Branch<T = any> = {
  id: string;
  monkey: Monkey<T>;
  leaves: Map<string, T>;
};

type Tree<T = any> = {
  id: string;
  value: T;
  branches: Map<string, Branch<any>>;
};

// Forest Management
const createForest = () => {
  const trees = new Map<string, Tree>();

  // The FossilSeed - ancient source of all trees
  const fossilSeed = {
    // Breed new tree species
    breed: <T>(initialValue: T) => {
      // Return seed that can grow trees
      return {
        // Grow new tree with initial value
        grow: () => {
          const treeId = crypto.randomUUID();
          const tree: Tree<T> = {
            id: treeId,
            value: initialValue,
            branches: new Map()
          };
          
          trees.set(treeId, tree);

          // Tree API
          return {
            // Create new branch with monkey
            branch: <R>(monkey: Monkey<T, R>) => {
              const branchId = crypto.randomUUID();
              const branch: Branch<R> = {
                id: branchId,
                monkey,
                leaves: new Map()
              };

              tree.branches.set(monkey.name, branch);

              // Branch API
              return {
                // Create new leaf using monkey's recipe
                leaf: () => {
                  const leafId = crypto.randomUUID();
                  const value = monkey.recipe(tree.value);
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

  return {
    fossilSeed,
    trees
  };
};

// Example Usage
const { fossilSeed } = createForest();

// Create banana tree with base value
const bananaSeed = fossilSeed.breed({
  type: 'banana',
  sweetness: 7,
  ripeness: 'green'
});

const bananaTree = bananaSeed.grow();

// Different monkeys with different recipes
const bigVanya = {
  name: 'big-vanya',
  recipe: (banana) => ({
    ...banana,
    size: 'large',
    ripeness: 'perfect'
  })
};

const crazyVanya = {
  name: 'crazy-vanya',
  recipe: (banana) => ({
    ...banana,
    type: 'crazy-banana',
    flavor: 'wild'
  })
};

// Each branch gets its own monkey with its recipe
const bigBranch = bananaTree.branch(bigVanya);
const crazyBranch = bananaTree.branch(crazyVanya);

// Each monkey makes different bananas
const bigBanana = bigBranch.leaf();    // Large, perfect banana
const crazyBanana = crazyBranch.leaf(); // Wild, crazy banana

// Lion example
const lionSeed = fossilSeed.breed({
  type: 'lion',
  skill: 'monkey-catching'
});

const lionTree = lionSeed.grow();

const fishermanLeo = {
  name: 'fisherman-leo',
  recipe: (lion) => ({
    ...lion,
    skill: 'fishing',
    catch: 'fish'
  })
};

const unluckyLeo = {
  name: 'unlucky-leo',
  recipe: (lion) => ({
    ...lion,
    skill: 'failing',
    tools: []  // No tools for catching monkeys!
  })
};

const fishingBranch = lionTree.branch(fishermanLeo);
const unluckyBranch = lionTree.branch(unluckyLeo);

const fishingLion = fishingBranch.leaf();  // Lion that catches fish
const unluckyLion = unluckyBranch.leaf();  // Lion that can't catch monkeys

export { createForest };
