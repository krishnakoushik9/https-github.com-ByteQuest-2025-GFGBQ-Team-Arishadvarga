'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Shield } from 'lucide-react';

export default function AuditPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Audit Log</h1>
                <p style={{ color: '#64748b', marginBottom: '32px' }}>View system access and compliance logs</p>

                <Card padding="xl">
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <Shield size={32} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Security Audit Log</h3>
                        <p style={{ color: '#64748b' }}>All access to patient data is logged here for GDPR/HIPAA compliance.</p>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
