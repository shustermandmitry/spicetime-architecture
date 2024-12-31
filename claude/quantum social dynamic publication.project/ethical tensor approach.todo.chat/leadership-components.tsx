import React, { useState, useContext, createContext } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types for our leadership system
type LeadershipStyle = 'authoritarian' | 'democratic' | 'mediator';
type TeamHealth = 'stable' | 'unstable' | 'transitioning';

interface LeaderProps {
  style: LeadershipStyle;
  strength: number;  // 0-1
  influence: number; // 0-1
  children?: React.ReactNode;
}

interface TeamProps {
  size: number;
  children?: React.ReactNode;
}

// Context for team composition and health
const TeamContext = createContext<{
  health: TeamHealth;
  styles: LeadershipStyle[];
  updateHealth: (styles: LeadershipStyle[]) => void;
}>({
  health: 'stable',
  styles: [],
  updateHealth: () => {}
});

// Individual Leader component
const Leader: React.FC<LeaderProps> = ({ style, strength, influence, children }) => {
  const backgroundColor = {
    authoritarian: 'bg-red-100',
    democratic: 'bg-blue-100',
    mediator: 'bg-green-100'
  }[style];

  return (
    <div className={`p-4 rounded-lg ${backgroundColor}`}>
      <h3 className="font-semibold mb-2 capitalize">{style} Leader</h3>
      <div className="space-y-2">
        <div className="text-sm">Strength: {strength.toFixed(2)}</div>
        <div className="text-sm">Influence: {influence.toFixed(2)}</div>
        {children}
      </div>
    </div>
  );
};

// Team composition component
const Team: React.FC<TeamProps> = ({ size, children }) => {
  const [health, setHealth] = useState<TeamHealth>('stable');
  const [styles, setStyles] = useState<LeadershipStyle[]>([]);

  // Analyze team composition and update health
  const updateHealth = (newStyles: LeadershipStyle[]) => {
    // Check for ADM balance
    const hasAuthoritarian = newStyles.includes('authoritarian');
    const hasDemocratic = newStyles.includes('democratic');
    const hasMediator = newStyles.includes('mediator');

    // Perfect balance - all three styles
    if (hasAuthoritarian && hasDemocratic && hasMediator) {
      setHealth('stable');
    }
    // Missing mediator but has both A and D
    else if (hasAuthoritarian && hasDemocratic && !hasMediator) {
      setHealth('transitioning');
    }
    // Other incomplete combinations
    else {
      setHealth('unstable');
    }

    setStyles(newStyles);
  };

  return (
    <TeamContext.Provider value={{ health, styles, updateHealth }}>
      <div className="p-6 border rounded-xl shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Leadership Team</h2>
          <TeamHealth health={health} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {children}
        </div>
      </div>
    </TeamContext.Provider>
  );
};

// Team health indicator
const TeamHealth: React.FC<{ health: TeamHealth }> = ({ health }) => {
  const colors = {
    stable: 'bg-green-100 text-green-800',
    unstable: 'bg-red-100 text-red-800',
    transitioning: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[health]}`}>
      {health}
    </span>
  );
};

// Example usage component
const LeadershipTeam: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <Team size={3}>
        <Leader 
          style="authoritarian"
          strength={0.8}
          influence={0.7}
        />
        <Leader 
          style="democratic"
          strength={0.7}
          influence={0.8}
        />
        <Leader 
          style="mediator"
          strength={0.9}
          influence={0.6}
        />
      </Team>
      
      <Alert className="mt-8">
        <AlertDescription>
          This team composition shows balanced ADM dynamics, indicating stable leadership potential.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LeadershipTeam;