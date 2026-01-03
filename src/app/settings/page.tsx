'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Settings as SettingsIcon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Settings</h1>
                <p style={{ color: '#64748b', marginBottom: '32px' }}>Configure system preferences and user profile</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card padding="lg">
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '24px' }}>Profile Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <Input label="Full Name" defaultValue="Dr. Smith" />
                            <Input label="Role" defaultValue="Physician" disabled />
                            <Input label="Email" defaultValue="dr.smith@hospital.org" />
                            <Input label="Department" defaultValue="Internal Medicine" />
                        </div>
                    </Card>

                    <Card padding="lg">
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '24px' }}>System Preferences</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <div style={{ fontWeight: 500, color: '#0f172a' }}>Dark Mode</div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>Switch between light and dark themes</div>
                                </div>
                                <div style={{
                                    padding: '4px 12px',
                                    background: '#f1f5f9',
                                    borderRadius: '50px',
                                    fontSize: '13px',
                                    color: '#64748b',
                                    fontWeight: 500
                                }}>System Default</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <div style={{ fontWeight: 500, color: '#0f172a' }}>Notifications</div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>Receive alerts for critical lab results</div>
                                </div>
                                <div style={{
                                    padding: '4px 12px',
                                    background: '#ecfdf5',
                                    borderRadius: '50px',
                                    fontSize: '13px',
                                    color: '#059669',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                                    Enabled
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button>Save Preferences</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
