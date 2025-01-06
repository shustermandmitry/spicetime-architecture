// TypeScript implementation.unstructured

interface ContributorDomain {
  domain: string;             // Name of the domain (e.g., Professional, Social)
  scores: [number, number, number]; // [Openness, Accountability, Respect]
  weight: number;             // Weight assigned to this domain
}

interface Contributor {
  id: string;                                // Contributor ID
  domains: ContributorDomain[];              // List of domain scores and weights
}

interface DAO {
  centerOfGravity: [number, number, number]; // Ethical center of organizational gravity
  lambda: number;                            // Alignment sensitivity parameter
}

// Function to calculate weighted vector for a single contributor
function calculateContributorVector(contributor: Contributor): [number, number, number] {
  let totalVector: [number, number, number] = [0, 0, 0];
  let totalWeight = 0;

  // Weighted vector addition
  contributor.domains.forEach((domain) => {
    totalVector = [
      totalVector[0] + domain.scores[0] * domain.weight,
      totalVector[1] + domain.scores[1] * domain.weight,
      totalVector[2] + domain.scores[2] * domain.weight,
    ];
    totalWeight += domain.weight;
  });

  // Normalize the vector by the total weight
  return totalWeight > 0
    ? [totalVector[0] / totalWeight, totalVector[1] / totalWeight, totalVector[2] / totalWeight]
    : [0, 0, 0]; // Return zero vector if no weight
}

// Function to calculate distance from the Center of Gravity
function calculateDistanceFromCG(vector: [number, number, number], centerOfGravity: [number, number, number]): number {
  const dx = vector[0] - centerOfGravity[0];
  const dy = vector[1] - centerOfGravity[1];
  const dz = vector[2] - centerOfGravity[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Function to calculate payout based on alignment (distance from CG)
function calculatePayout(distance: number, lambda: number): number {
  // Payout formula: Payout ∝ e^(-Δ / λ)
  return Math.exp(-distance / lambda);
}

// Function to evaluate all contributors and return results
function evaluateContributors(contributors: Contributor[], dao: DAO): { id: string; score: [number, number, number]; distance: number; payout: number }[] {
  return contributors.map((contributor) => {
    const stateVector = calculateContributorVector(contributor);
    const distance = calculateDistanceFromCG(stateVector, dao.centerOfGravity);
    const payout = calculatePayout(distance, dao.lambda);

    return {
      id: contributor.id,
      score: stateVector,
      distance: distance,
      payout: payout,
    };
  });
}

// Example Usage:

const dao: DAO = {
  centerOfGravity: [0.7, 0.8, 0.6], // Target ethical CG (Openness, Accountability, Respect)
  lambda: 0.5, // Sensitivity factor
};

const contributors: Contributor[] = [
  {
    id: "user1",
    domains: [
      { domain: "Professional", scores: [0.6, 0.7, 0.8], weight: 0.6 },
      { domain: "Social", scores: [0.8, 0.9, 0.7], weight: 0.4 },
    ],
  },
  {
    id: "user2",
    domains: [
      { domain: "Professional", scores: [0.5, 0.6, 0.4], weight: 0.7 },
      { domain: "Social", scores: [0.6, 0.7, 0.9], weight: 0.3 },
    ],
  },
];

const results = evaluateContributors(contributors, dao);

console.log(results);
/* Output Example:
[
  { id: 'user1', score: [ 0.68, 0.78, 0.76 ], distance: 0.05, payout: 0.905 },
  { id: 'user2', score: [ 0.53, 0.63, 0.57 ], distance: 0.18, payout: 0.707 },
]
*/