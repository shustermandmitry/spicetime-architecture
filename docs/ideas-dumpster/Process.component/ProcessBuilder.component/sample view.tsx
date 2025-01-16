import React, {useState} from 'react';
import {ArrowRight, Clock, Code, GitBranch, Pause, Play, Split} from 'lucide-react';

const ProcessEditor = () => {
    const [viewMode, setViewMode] = useState('visual');

    return (
        <div className="w-full h-96 bg-slate-50 p-4 rounded-lg shadow-lg flex flex-col">
            {/* Top toolbar */}
            <div className="h-10 bg-white rounded-t-lg border-b flex items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <Clock size={20} className="text-blue-600"/>
                    <span className="font-medium">Process: OrderFulfillment</span>
                </div>
                <div className="flex space-x-2">
                    <button
                        className={`px-3 py-1 rounded ${viewMode === 'visual' ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                        onClick={() => setViewMode('visual')}>
                        <GitBranch size={16}/>
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${viewMode === 'code' ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                        onClick={() => setViewMode('code')}>
                        <Code size={16}/>
                    </button>
                </div>
            </div>

            {/* Main workspace */}
            <div className="flex-1 flex">
                {/* Left toolbar - Process components */}
                <div className="w-48 bg-white border-r border-slate-200 p-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Components</h3>
                    <div className="space-y-2">
                        <div className="p-2 border rounded bg-white hover:bg-slate-50 cursor-pointer">
                            <div className="flex items-center space-x-2">
                                <Play size={14} className="text-green-600"/>
                                <span className="text-sm">Process</span>
                            </div>
                        </div>
                        <div className="p-2 border rounded bg-white hover:bg-slate-50 cursor-pointer">
                            <div className="flex items-center space-x-2">
                                <Split size={14} className="text-orange-600"/>
                                <span className="text-sm">Branch</span>
                            </div>
                        </div>
                        <div className="p-2 border rounded bg-white hover:bg-slate-50 cursor-pointer">
                            <div className="flex items-center space-x-2">
                                <Pause size={14} className="text-blue-600"/>
                                <span className="text-sm">State</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main canvas/code area */}
                <div className="flex-1 bg-slate-100 p-4">
                    {viewMode === 'visual' ? (
                        <div className="h-full bg-white rounded-lg p-4">
                            {/* Example process diagram */}
                            <div className="flex items-center justify-center space-x-4">
                                <div className="p-3 border-2 border-green-500 rounded-lg">
                                    <span className="text-sm">Start</span>
                                </div>
                                <ArrowRight size={20} className="text-slate-400"/>
                                <div className="p-3 border-2 border-orange-500 rounded-lg">
                                    <span className="text-sm">ValidateOrder</span>
                                </div>
                                <ArrowRight size={20} className="text-slate-400"/>
                                <div className="p-3 border-2 border-blue-500 rounded-lg flex items-center space-x-2">
                                    <span className="text-sm">ProcessPayment</span>
                                    <Split size={14} className="text-orange-600"/>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-white rounded-lg p-4 font-mono text-sm">
                            {/* Example process code */}
                            <pre className="text-slate-700">
{`const OrderFulfillment = Process({
  initial: "start",
  states: {
    start: {
      on: { NEXT: "validateOrder" }
    },
    validateOrder: {
      on: { 
        VALID: "processPayment",
        INVALID: "rejected"
      }
    },
    processPayment: Branch({
      success: "fulfillOrder",
      failure: "retryPayment"
    })
  }
});`}
              </pre>
                        </div>
                    )}
                </div>

                {/* Right panel - Properties */}
                <div className="w-64 bg-white border-l border-slate-200 p-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Properties</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-600">Name</label>
                            <input
                                type="text"
                                className="w-full mt-1 px-2 py-1 border rounded text-sm"
                                value="ProcessPayment"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">Type</label>
                            <input
                                type="text"
                                className="w-full mt-1 px-2 py-1 border rounded text-sm"
                                value="Branch"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">Next States</label>
                            <div className="mt-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-2 py-1 border rounded text-sm"
                                        value="success → fulfillOrder"
                                        readOnly
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-2 py-1 border rounded text-sm"
                                        value="failure → retryPayment"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessEditor;