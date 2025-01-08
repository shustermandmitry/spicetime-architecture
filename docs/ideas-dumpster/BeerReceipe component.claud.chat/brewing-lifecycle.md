# Brewing Lifecycle System

## Stage Enumeration

```typescript
enum BrewStage {
    SETUP = 'setup',
    MASH = 'mash',
    SPARGE = 'sparge',
    BOIL = 'boil',
    COOL = 'cool',
    FERMENT = 'ferment',
    PRIME = 'prime',
    BOTTLE = 'bottle',
    CONDITION = 'condition',
    COMPLETE = 'complete'
}

interface StageRequirements {
    nextStage: BrewStage;
    conditions: Condition[];
    timeEstimate: number; // minutes
}
```

## Stage Progression Logic

```typescript
interface StageFlow {
    [BrewStage.SETUP]: {
        requirements: {
            grainWeight: boolean;
            waterTemp: boolean;
            waterVolume: boolean;
        };
        nextStage: BrewStage.MASH;
        sensorData: {
            weight?: number;
            temp?: number;
            volume?: number;
        };
    };

    [BrewStage.MASH]: {
        requirements: {
            tempRange: [148, 158];
            time: 60; // minutes
            conversion: boolean; // iodine test
        };
        nextStage: BrewStage.SPARGE;
        sensorData: {
            temp: number;
            time: number;
        };
    };

    [BrewStage.BOIL]: {
        requirements: {
            preBoilVolume: number;
            rolling: boolean;
            hopAdditions: {
                time: number;
                added: boolean;
            }[];
        };
        nextStage: BrewStage.COOL;
        sensorData: {
            temp: number;
            time: number;
            boilDetection: boolean;
        };
    };

    [BrewStage.FERMENT]: {
        requirements: {
            tempRange: [62, 75];
            gravityStable: boolean;
            timeMinimum: 168; // hours (1 week)
        };
        nextStage: BrewStage.PRIME;
        sensorData: {
            temp: number;
            gravity: number;
            co2: number;
        };
    };
}
```

## Stage Components

### Stage Controller

```typescript
class StageController {
  currentStage: BrewStage;
  recipe: Recipe;
  sensors: SensorArray;
  
  canProgress(): boolean {
    const requirements = StageFlow[this.currentStage].requirements;
    return this.checkRequirements(requirements);
  }
  
  progressStage(): void {
    if (this.canProgress()) {
      const nextStage = StageFlow[this.currentStage].nextStage;
      this.currentStage = nextStage;
      this.initializeStage(nextStage);
    }
  }
}
```

## Stage-Specific Requirements

### SETUP → MASH

```typescript
const setupRequirements = {
  grain: {
    weight: {
      target: recipe.grainBill.totalWeight,
      tolerance: 0.1 // lbs
    },
    temp: {
      target: recipe.mashTemp,
      tolerance: 2 // °F
    }
  },
  water: {
    volume: {
      target: recipe.mashWater,
      tolerance: 0.25 // gallons
    },
    temp: {
      target: recipe.strikeTemp,
      tolerance: 2 // °F
    }
  },
  equipment: {
    clean: boolean,
    ready: boolean
  }
}
```

### MASH → BOIL

```typescript
const mashRequirements = {
    temperature: {
        range: [148, 158],
        duration: 60, // minutes
        readings: number[] // temperature log
    },
    conversion: {
        iodineTest: boolean,
        time: {
            minimum: 45, // minutes
            maximum: 90  // minutes
        }
    }
}
```

### BOIL → COOL

```typescript
const boilRequirements = {
  temperature: {
    target: 212, // °F
    rolling: boolean,
    duration: 60 // minutes
  },
  hops: {
    additions: [
      {
        time: 60,
        amount: number,
        added: boolean
      },
      {
        time: 15,
        amount: number,
        added: boolean
      }
    ]
  },
  volume: {
    preBoil: number,
    postBoil: number
  }
}
```

### FERMENT → PRIME

```typescript
const fermentRequirements = {
  gravity: {
    readings: number[],
    stable: {
      duration: 72, // hours
      tolerance: 0.001
    },
    target: recipe.finalGravity
  },
  temperature: {
    range: recipe.yeast.tempRange,
    history: number[]
  },
  time: {
    minimum: 168, // hours
    current: number
  }
}
```

## Sensor Integration

### Temperature Monitoring

```typescript
class TempMonitor {
  readings: number[];
  interval: number;
  
  isInRange(range: [number, number]): boolean {
    const current = this.getLatestReading();
    return current >= range[0] && current <= range[1];
  }
  
  getSlope(timeWindow: number): number {
    // Calculate rate of change
    return this.calculateSlope(this.getReadings(timeWindow));
  }
}
```

### Gravity Monitoring

```typescript
class GravityMonitor {
  readings: {
    time: number;
    value: number;
  }[];
  
  isStable(duration: number, tolerance: number): boolean {
    const recentReadings = this.getReadings(duration);
    const variance = this.calculateVariance(recentReadings);
    return variance <= tolerance;
  }
}
```

## User Interface States

### Stage Display

```jsx
const StageDisplay = ({ stage, requirements }) => {
  const progress = calculateProgress(stage, requirements);
  
  return (
    <div className="stage-display">
      <h2>{stage.toUpperCase()}</h2>
      <ProgressBar value={progress} />
      <RequirementsList 
        items={requirements}
        completed={getCompletedRequirements(requirements)}
      />
      <TimeRemaining estimate={getTimeEstimate(stage)} />
    </div>
  );
};
```

### Alerts & Notifications

```typescript
interface BrewAlert {
  stage: BrewStage;
  type: 'info' | 'warning' | 'error';
  message: string;
  action?: () => void;
}

const alerts = {
  [BrewStage.MASH]: [
    {
      condition: (temp: number) => temp > 158,
      type: 'warning',
      message: 'Mash temperature too high',
      action: () => suggestCooling()
    }
  ],
  [BrewStage.BOIL]: [
    {
      condition: (time: number) => isHopAdditionTime(time),
      type: 'info',
      message: 'Add hops now',
      action: () => markHopAddition()
    }
  ]
}
```

## Timeline Visualization

```jsx
const BrewTimeline = ({ currentStage, stages }) => {
  return (
    <div className="timeline">
      {stages.map(stage => (
        <TimelineStage
          key={stage}
          stage={stage}
          current={stage === currentStage}
          completed={isStageCompleted(stage)}
          requirements={getStageRequirements(stage)}
        />
      ))}
    </div>
  );
};
```

This system provides a complete temporal framework for brewing progression, with:

1. Clear stage definitions
2. Measurable progression requirements
3. Sensor integration
4. User interface states
5. Alert system
6. Timeline visualization

Each stage has specific requirements that must be met before progression, creating a guided but flexible brewing
process.
