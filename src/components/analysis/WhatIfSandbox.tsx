import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sliders, RefreshCw, RotateCcw } from 'lucide-react';
import type { VitalSigns } from '@/types/medical';

interface WhatIfSandboxProps {
    initialVitals: Partial<VitalSigns>;
    onSimulate: (vitals: Partial<VitalSigns>) => void;
    isSimulating: boolean;
}

export function WhatIfSandbox({ initialVitals, onSimulate, isSimulating }: WhatIfSandboxProps) {
    const [vitals, setVitals] = React.useState<Partial<VitalSigns>>(initialVitals);
    const [changed, setChanged] = React.useState(false);

    const handleChange = (key: keyof VitalSigns, value: number) => {
        setVitals(prev => {
            const next = { ...prev, [key]: value };
            return next;
        });
        setChanged(true);
    };

    return (
        <div className="bg-slate-900 text-white rounded-xl overflow-hidden shadow-lg border border-slate-800">
            <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2">
                    <Sliders size={18} className="text-cyan-400" />
                    Clinical "What-If" Sandbox
                </h3>
                <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded border border-cyan-800">
                    Simulation Mode
                </span>
            </div>

            <div className="p-6">
                <p className="text-slate-400 text-sm mb-6">
                    Adjust clinical parameters to simulate different patient states and observe how it affects the AI diagnosis.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase font-semibold">Systolic BP</label>
                        <input
                            type="number"
                            value={vitals.bloodPressureSystolic || ''}
                            onChange={e => handleChange('bloodPressureSystolic', Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase font-semibold">Heart Rate</label>
                        <input
                            type="number"
                            value={vitals.heartRate || ''}
                            onChange={e => handleChange('heartRate', Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase font-semibold">SpO2 (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={vitals.oxygenSaturation || ''}
                                onChange={e => handleChange('oxygenSaturation', Number(e.target.value))}
                                className={`w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none ${(vitals.oxygenSaturation || 100) < 90 ? 'text-red-400 border-red-900/50' : ''
                                    }`}
                            />
                            {(vitals.oxygenSaturation || 100) < 90 && (
                                <span className="absolute right-2 top-2 text-red-500 text-xs">⚠️</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase font-semibold">Temp (°C)</label>
                        <input
                            type="number"
                            value={vitals.temperature || ''}
                            onChange={e => handleChange('temperature', Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                        onClick={() => {
                            setVitals(initialVitals);
                            setChanged(false);
                            onSimulate(initialVitals);
                        }}
                    >
                        <RotateCcw size={14} className="mr-2" /> Reset
                    </Button>
                    <button
                        onClick={() => onSimulate(vitals)}
                        disabled={!changed && !isSimulating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isSimulating
                                ? 'bg-cyan-900/50 text-cyan-400 cursor-wait'
                                : changed
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/20 hover:shadow-lg text-white'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {isSimulating ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" /> Simulating...
                            </>
                        ) : (
                            <>
                                <Sliders size={16} /> Run Simulation
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
