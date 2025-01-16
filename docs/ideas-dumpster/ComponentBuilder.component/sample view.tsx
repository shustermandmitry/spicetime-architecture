import React, {useState} from 'react';
import {Code, GitBranch, Layers, Layout, Palette, Split} from 'lucide-react';

const ComponentBuilder = () => {
    const [activeView, setActiveView] = useState('visual');
    const [activeDomain, setActiveDomain] = useState('react');
    const [selectedComponent, setSelectedComponent] = useState(null);

    return (
        <div className="w-full h-96 bg-slate-50 flex flex-col rounded-lg shadow-lg">
            {/* Top Bar */}
            <div className="h-12 bg-white px-4 flex items-center justify-between border-b">
                <div className="flex items-center space-x-4">
                    <span className="font-medium text-slate-700">Component Builder</span>
                    {/* View Toggles */}
                    <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                        <button
                            className={`p-1 rounded ${activeView === 'visual' ? 'bg-white shadow' : 'text-slate-600'}`}
                            onClick={() => setActiveView('visual')}
                        >
                            <Layout size={16}/>
                        </button>
                        <button
                            className={`p-1 rounded ${activeView === 'code' ? 'bg-white shadow' : 'text-slate-600'}`}
                            onClick={() => setActiveView('code')}
                        >
                            <Code size={16}/>
                        </button>
                        <button
                            className={`p-1 rounded ${activeView === 'tree' ? 'bg-white shadow' : 'text-slate-600'}`}
                            onClick={() => setActiveView('tree')}
                        >
                            <GitBranch size={16}/>
                        </button>
                    </div>
                </div>

                {/* Domain Selector */}
                <select
                    className="bg-slate-100 border-0 rounded p-1 text-sm"
                    value={activeDomain}
                    onChange={(e) => setActiveDomain(e.target.value)}
                >
                    <option value="react">React Components</option>
                    <option value="process">Process Builder</option>
                    <option value="blog">Blog Editor</option>
                </select>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Left Sidebar - Component Palette */}
                <div className="w-48 bg-white border-r p-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Palette size={16}/>
                        <span className="font-medium text-sm">Components</span>
                    </div>

                    {/* Domain-specific component palette */}
                    <div className="space-y-2">
                        {activeDomain === 'react' && (
                            <>
                                <div className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
                                    <div className="text-sm">Container</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
                                    <div className="text-sm">Button</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
                                    <div className="text-sm">Input</div>
                                </div>
                            </>
                        )}
                        {activeDomain === 'process' && (
                            <>
                                <div className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
                                    <div className="text-sm">State</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
                                    <div className="text-sm">Branch</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
                                    <div className="text-sm">Action</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex">
                    {/* Canvas/Code/Tree Area */}
                    <div className="flex-1 bg-slate-100 p-4">
                        {activeView === 'visual' && (
                            <div
                                className="w-full h-full bg-white rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                                <div className="text-slate-400">Drag components here</div>
                            </div>
                        )}
                        {activeView === 'code' && (
                            <div className="w-full h-full bg-white rounded-lg p-4 font-mono text-sm">
                <pre className="text-slate-700">
                  {`const MyComponent = () => {
  return (
    <div>
      {/* Components will appear here */}
    </div>
  )
}`}
                </pre>
                            </div>
                        )}
                        {activeView === 'tree' && (
                            <div className="w-full h-full bg-white rounded-lg p-4">
                                <div className="flex items-center space-x-2 text-sm mb-2">
                                    <Layers size={16}/>
                                    <span>MyComponent</span>
                                </div>
                                <div className="pl-6 border-l-2 border-slate-200 ml-2">
                                    <div className="text-sm text-slate-600">No components yet</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Properties */}
                    <div className="w-64 bg-white border-l p-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <Split size={16}/>
                            <span className="font-medium text-sm">Properties</span>
                        </div>
                        {selectedComponent ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-600 block mb-1">Name</label>
                                    <input type="text" className="w-full p-1 text-sm border rounded"/>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-600 block mb-1">Type</label>
                                    <input type="text" className="w-full p-1 text-sm border rounded" readOnly/>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400">
                                Select a component to edit properties
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentBuilder;