'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ConfidenceScore, ConfidenceRing } from '@/components/ui/ConfidenceScore';
import {
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    CheckCircle,
    Info,
    ExternalLink
} from 'lucide-react';
import type { DifferentialDiagnosis, Evidence } from '@/types/medical';

interface DiagnosisCardProps {
    diagnosis: DifferentialDiagnosis;
    isExpanded?: boolean;
    onToggle?: () => void;
    className?: string;
}

export function DiagnosisCard({
    diagnosis,
    isExpanded = false,
    onToggle,
    className,
}: DiagnosisCardProps) {
    const probabilityColors = {
        high: 'success',
        moderate: 'warning',
        low: 'info',
    } as const;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: diagnosis.rank * 0.1 }}
        >
            <Card
                className={cn('overflow-hidden', className)}
                padding="none"
            >
                {/* Header */}
                <button
                    onClick={onToggle}
                    className="w-full p-4 flex items-center gap-4 text-left hover:bg-neutral-50 transition-colors"
                >
                    <div className="flex-shrink-0">
                        <ConfidenceRing score={diagnosis.confidenceScore} size={60} strokeWidth={5} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-neutral-500">#{diagnosis.rank}</span>
                            <Badge variant={probabilityColors[diagnosis.probability]} size="sm">
                                {diagnosis.probability} probability
                            </Badge>
                            {diagnosis.icdCode && (
                                <Badge variant="outline" size="sm">
                                    {diagnosis.icdCode}
                                </Badge>
                            )}
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-900 truncate">
                            {diagnosis.condition}
                        </h4>
                    </div>

                    <div className="flex-shrink-0 text-neutral-400">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-neutral-100"
                        >
                            <div className="p-4 space-y-4">
                                {/* Confidence Score Bar */}
                                <div>
                                    <ConfidenceScore
                                        score={diagnosis.confidenceScore}
                                        label="Confidence Score"
                                        size="md"
                                    />
                                </div>

                                {/* Supporting Evidence */}
                                {diagnosis.supportingEvidence.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            Supporting Evidence
                                        </h5>
                                        <div className="space-y-2">
                                            {diagnosis.supportingEvidence.map((evidence, index) => (
                                                <EvidenceItem key={index} evidence={evidence} type="supporting" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contradicting Evidence */}
                                {diagnosis.contradictingEvidence.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                            Contradicting Evidence
                                        </h5>
                                        <div className="space-y-2">
                                            {diagnosis.contradictingEvidence.map((evidence, index) => (
                                                <EvidenceItem key={index} evidence={evidence} type="contradicting" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Considerations */}
                                {diagnosis.additionalConsiderations && (
                                    <div className="bg-neutral-50 rounded-lg p-3">
                                        <h5 className="text-sm font-semibold text-neutral-700 mb-1 flex items-center gap-2">
                                            <Info className="h-4 w-4 text-blue-500" />
                                            Additional Considerations
                                        </h5>
                                        <p className="text-sm text-neutral-600">
                                            {diagnosis.additionalConsiderations}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}

interface EvidenceItemProps {
    evidence: Evidence;
    type: 'supporting' | 'contradicting';
}

function EvidenceItem({ evidence, type }: EvidenceItemProps) {
    const weightColors = {
        strong: type === 'supporting' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
        moderate: type === 'supporting' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-700',
        weak: 'bg-neutral-100 text-neutral-600',
    };

    const typeIcons = {
        symptom: '🔹',
        vital: '💓',
        lab: '🧪',
        history: '📋',
        medication: '💊',
        demographic: '👤',
    };

    return (
        <div className={cn(
            'flex items-center gap-2 p-2 rounded-lg text-sm',
            weightColors[evidence.weight]
        )}>
            <span>{typeIcons[evidence.type]}</span>
            <span className="flex-1">{evidence.description}</span>
            <Badge variant="outline" size="sm" className="text-xs">
                {evidence.weight}
            </Badge>
        </div>
    );
}

interface DiagnosisListProps {
    diagnoses: DifferentialDiagnosis[];
    maxInitialDisplay?: number;
}

export function DiagnosisList({ diagnoses, maxInitialDisplay = 5 }: DiagnosisListProps) {
    const [expandedId, setExpandedId] = React.useState<string | null>(null);
    const [showAll, setShowAll] = React.useState(false);

    const displayedDiagnoses = showAll ? diagnoses : diagnoses.slice(0, maxInitialDisplay);

    return (
        <div className="space-y-4">
            {displayedDiagnoses.map((diagnosis) => (
                <DiagnosisCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    isExpanded={expandedId === diagnosis.id}
                    onToggle={() => setExpandedId(expandedId === diagnosis.id ? null : diagnosis.id)}
                />
            ))}

            {diagnoses.length > maxInitialDisplay && !showAll && (
                <button
                    onClick={() => setShowAll(true)}
                    className="w-full py-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Show {diagnoses.length - maxInitialDisplay} more diagnoses
                    <ChevronDown className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
