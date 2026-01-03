'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { generatePseudonymizedId } from '@/lib/utils';
import { Info, User, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const patientSchema = z.object({
    pseudonymizedId: z.string().min(1, 'Patient ID is required'),
    ageRange: z.enum(['0-17', '18-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+']),
    biologicalSex: z.enum(['male', 'female']),
    heightCm: z.number().min(0).optional(),
    weightKg: z.number().min(0).optional(),
    consentGiven: z.boolean().refine(val => val === true, {
        message: 'Patient consent is required to proceed',
    }),
});

export type PatientIntakeData = z.infer<typeof patientSchema>;

interface PatientIntakeFormProps {
    onSubmit: (data: PatientIntakeData) => void;
    initialData?: Partial<PatientIntakeData>;
}

export function PatientIntakeForm({ onSubmit, initialData }: PatientIntakeFormProps) {
    const [generatedId, setGeneratedId] = React.useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PatientIntakeData>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            pseudonymizedId: initialData?.pseudonymizedId || '',
            consentGiven: false,
            ...initialData,
        },
    });

    React.useEffect(() => {
        if (!initialData?.pseudonymizedId && !generatedId) {
            const newId = generatePseudonymizedId();
            setGeneratedId(newId);
            setValue('pseudonymizedId', newId);
        }
    }, [initialData, setValue, generatedId]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Alert variant="info" title="GDPR-Compliant Data Handling">
                This system uses pseudonymized identifiers to protect patient privacy. No personally identifiable information (PII) is stored. All data processing complies with European healthcare regulations.
            </Alert>

            <Card padding="none" className="overflow-hidden">
                <div style={{ padding: '24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '8px', background: '#ecfdf5', borderRadius: '8px' }}>
                            <User size={20} color="#059669" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Patient Identifier</h3>
                            <p style={{ margin: '2px 0 0', fontSize: '14px', color: '#64748b' }}>Pseudonymized case identifier</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '24px' }}>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                                CASE ID
                            </label>
                            <div style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                                {watch('pseudonymizedId')}
                            </div>
                        </div>
                        <div style={{ padding: '6px 12px', background: '#ecfdf5', color: '#059669', fontSize: '11px', fontWeight: 700, borderRadius: '20px', textTransform: 'uppercase' }}>
                            Pseudonymized
                        </div>
                    </div>
                    <input type="hidden" {...register('pseudonymizedId')} />
                </div>
            </Card>

            <Card padding="lg">
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '24px' }}>Demographics</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Age Range *</label>
                        <select
                            {...register('ageRange')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                background: '#ffffff',
                                color: '#0f172a',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                        >
                            <option value="">Select age range</option>
                            <option value="0-17">0-17 years (Pediatric)</option>
                            <option value="18-29">18-29 years (Young Adult)</option>
                            <option value="30-39">30-39 years (Adult)</option>
                            <option value="40-49">40-49 years (Adult)</option>
                            <option value="50-59">50-59 years (Senior)</option>
                            <option value="60-69">60-69 years (Senior)</option>
                            <option value="70-79">70-79 years (Geriatric)</option>
                            <option value="80+">80+ years (Geriatric)</option>
                        </select>
                        {errors.ageRange && <p className="text-red-500 text-sm mt-1">{errors.ageRange.message}</p>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Biological Sex *</label>
                        <select
                            {...register('biologicalSex')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                background: '#ffffff',
                                color: '#0f172a',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                        >
                            <option value="">Select biological sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.biologicalSex && <p className="text-red-500 text-sm mt-1">{errors.biologicalSex.message}</p>}
                    </div>

                    <div>
                        <Input
                            label="Height (cm)"
                            type="number"
                            placeholder="e.g., 175"
                            {...register('heightCm', { valueAsNumber: true })}
                            error={errors.heightCm?.message}
                        />
                    </div>

                    <div>
                        <Input
                            label="Weight (kg)"
                            type="number"
                            placeholder="e.g., 70"
                            {...register('weightKg', { valueAsNumber: true })}
                            error={errors.weightKg?.message}
                        />
                    </div>
                </div>
            </Card>

            <Card padding="lg">
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Patient Consent</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                    Required acknowledgment before proceeding
                </p>

                <label
                    style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '20px',
                        borderRadius: '12px',
                        border: `1px solid ${errors.consentGiven ? '#fca5a5' : '#e2e8f0'}`,
                        background: errors.consentGiven ? '#fef2f2' : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    className="hover:border-emerald-200"
                >
                    <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
                        <input
                            type="checkbox"
                            {...register('consentGiven')}
                            style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
                        />
                        {watch('consentGiven') ? (
                            <CheckSquare size={24} color="#10b981" />
                        ) : (
                            <Square size={24} color="#94a3b8" />
                        )}
                    </div>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                            Patient Consent Obtained
                        </div>
                        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                            I confirm that the patient has provided informed consent for:
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px', color: '#64748b' }}>
                                <li>Collection and processing of clinical data</li>
                                <li>AI-assisted diagnostic analysis</li>
                                <li>Storage of pseudonymized health information</li>
                            </ul>
                        </div>
                    </div>
                </label>
                {errors.consentGiven && (
                    <p className="text-red-500 text-sm mt-2 ml-1">{errors.consentGiven.message}</p>
                )}
            </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px' }}>
                <Button
                    type="submit"
                    size="lg"
                    rightIcon={<ArrowRight size={18} />}
                >
                    Continue to Medical History
                </Button>
            </div>
        </form>
    );
}
