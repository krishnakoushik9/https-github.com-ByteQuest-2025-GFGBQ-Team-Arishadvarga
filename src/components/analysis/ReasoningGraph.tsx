import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle, AlertTriangle, Search, BookOpen, Activity } from 'lucide-react';
import type { ExplainableReasoning } from '@/types/medical';

export function ReasoningGraph({ reasoning }: { reasoning: ExplainableReasoning }) {
    if (!reasoning?.reasoningSteps?.length) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Activity size={20} className="text-violet-600" />
                Diagnostic Reasoning Graph
                <span className="ml-auto text-xs font-normal text-slate-500 border border-slate-200 px-2 py-0.5 rounded bg-slate-50">
                    Explainable AI
                </span>
            </h3>

            <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                {reasoning.reasoningSteps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        {/* Node Icon */}
                        <div className="absolute -left-[41px] top-0 bg-white border-2 border-slate-200 rounded-full p-1.5 z-10">
                            {index === reasoning.reasoningSteps.length - 1 ? (
                                <CheckCircle size={16} className="text-green-600" />
                            ) : (
                                <ArrowDown size={16} className="text-slate-400" />
                            )}
                        </div>

                        {/* Node Content */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:border-violet-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {step.category}
                                </span>
                                {step.confidence && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                        <span>Confidence</span>
                                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                                                style={{ width: `${step.confidence * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm font-medium text-slate-900 mb-2">
                                {step.description}
                            </p>

                            {step.evidenceUsed.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {step.evidenceUsed.map((ev, i) => (
                                        <span key={i} className="text-xs flex items-center gap-1 text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md">
                                            <Search size={10} />
                                            {ev}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-start gap-2">
                                <ArrowDown size={14} className="text-violet-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-violet-700 bg-violet-50 px-2 py-1 rounded inline-block">
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
