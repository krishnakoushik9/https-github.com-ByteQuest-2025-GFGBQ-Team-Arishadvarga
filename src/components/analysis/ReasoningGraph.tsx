import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle, Search, Activity, Sparkles } from 'lucide-react';
import type { ExplainableReasoning } from '@/types/medical';

export function ReasoningGraph({ reasoning }: { reasoning: ExplainableReasoning }) {
    if (!reasoning?.reasoningSteps?.length) return null;

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-200">
                    <Sparkles size={22} className="text-white" />
                </div>
                <span>Diagnostic Reasoning Graph</span>
                <span className="ml-auto text-xs font-medium text-violet-600 border border-violet-200 px-3 py-1.5 rounded-full bg-violet-50">
                    Explainable AI
                </span>
            </h3>

            <div className="relative pl-12 border-l-2 border-violet-100 space-y-10">
                {reasoning.reasoningSteps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        {/* Node Icon */}
                        <div className={`absolute -left-[49px] top-0 bg-white border-2 rounded-full p-2 z-10 shadow-sm ${index === reasoning.reasoningSteps.length - 1
                                ? 'border-green-400'
                                : 'border-violet-200'
                            }`}>
                            {index === reasoning.reasoningSteps.length - 1 ? (
                                <CheckCircle size={18} className="text-green-500" />
                            ) : (
                                <ArrowDown size={18} className="text-violet-400" />
                            )}
                        </div>

                        {/* Node Content */}
                        <div className="bg-white rounded-xl p-6 border border-slate-100 hover:border-violet-300 hover:shadow-md transition-all duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100">
                                    {step.category}
                                </span>
                                {step.confidence && (
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <span className="text-slate-500">Confidence</span>
                                        <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                                                style={{ width: `${step.confidence * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-violet-600 font-semibold">{Math.round(step.confidence * 100)}%</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-base font-medium text-slate-800 leading-relaxed mb-4">
                                {step.description}
                            </p>

                            {step.evidenceUsed.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {step.evidenceUsed.map((ev, i) => (
                                        <span key={i} className="text-xs flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                                            <Search size={12} className="text-slate-400" />
                                            {ev}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
                                <div className="p-1.5 bg-violet-100 rounded-lg">
                                    <ArrowDown size={14} className="text-violet-600" />
                                </div>
                                <p className="text-sm font-medium text-violet-800 bg-violet-50 px-4 py-2.5 rounded-lg border border-violet-100 leading-relaxed">
                                    {step.conclusion}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
