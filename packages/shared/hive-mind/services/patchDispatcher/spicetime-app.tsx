import React, { createContext, useContext, useReducer } from 'react';
import { FileTab } from './components/FileTab';

// Types for our repository space
interface RepoNode {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: { [key: string]: RepoNode };
}

// State represents current conditions of our space
interface SpicetimeState {
  repository: RepoNode;
  activePatches: Array<{
    id: string;
    content: string;
    parsed?: Array<{
      targetPath: string;
      content: string;
    }>;
  }>;
  activeTabs: string[];
}

// Actions that can modify our state
type SpicetimeAction =
  | { type: 'ADD_PATCH'; payload: { id: string; content: string } }
  | { type: 'PROCESS_PATCH'; payload: { id: string; targetPath: string; content: string } }
  | { type: 'COMMIT_CHANGES'; payload: { commitMessage: string } }
  | { type: 'OPEN_TAB'; payload: { id: string } }
  | { type: 'CLOSE_TAB'; payload: { id: string } };

// Context for sharing state across components
const SpicetimeContext = createContext<{
  state: SpicetimeState;
  dispatch: React.Dispatch<SpicetimeAction>;
} | null>(null);

// Main application component
const SpicetimeApp: React.FC = () => {
  const [state, dispatch] = useReducer(spicetimeReducer, {
    repository: { type: 'directory', name: 'root', children: {} },
    activePatches: [],
    activeTabs: []
  });

  return (
    <SpicetimeContext.Provider value={{ state, dispatch }}>
      <div className="h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-xl">SpicetimeApp</h1>
        </header>
        
        <div className="flex-1 flex">
          {/* Repository Structure View */}
          <aside className="w-64 bg-gray-100 p-4">
            <RepositoryTree node={state.repository} />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white p-4">
            <TabBar tabs={state.activeTabs} />
            {state.activeTabs.map(tabId => (
              <FileTab key={tabId} id={tabId} />
            ))}
          </main>

          {/* Patch Processing Panel */}
          <PatchDispatcher />
        </div>
      </div>
    </SpicetimeContext.Provider>
  );
};

// PatchDispatcher component
const PatchDispatcher: React.FC = () => {
  const context = useContext(SpicetimeContext);
  if (!context) throw new Error('Must be used within SpicetimeContext');
  const { state, dispatch } = context;

  const handlePatchDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    for (const file of files) {
      if (file.name.includes('.patch.')) {
        const content = await file.text();
        dispatch({
          type: 'ADD_PATCH',
          payload: { id: file.name, content }
        });
      }
    }
  };

  const handlePatchProcess = (patchId: string) => {
    const patch = state.activePatches.find(p => p.id === patchId);
    if (!patch || !patch.parsed) return;

    patch.parsed.forEach(({ targetPath, content }) => {
      dispatch({
        type: 'PROCESS_PATCH',
        payload: { id: patchId, targetPath, content }
      });
    });
  };

  return (
    <aside 
      className="w-96 bg-gray-50 p-4 border-l"
      onDragOver={e => e.preventDefault()}
      onDrop={handlePatchDrop}
    >
      <h2 className="text-lg font-semibold mb-4">Patch Dispatcher</h2>
      
      {/* Active Patches List */}
      <div className="space-y-4">
        {state.activePatches.map(patch => (
          <div key={patch.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">{patch.id}</h3>
            <div className="mt-2 space-y-2">
              {patch.parsed?.map(({ targetPath }) => (
                <div key={targetPath} className="text-sm">
                  → {targetPath}
                </div>
              ))}
            </div>
            <button
              onClick={() => handlePatchProcess(patch.id)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Process
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 border-2 border-dashed rounded text-center">
        Drop .patch files here
      </div>
    </aside>
  );
};

export default SpicetimeApp;