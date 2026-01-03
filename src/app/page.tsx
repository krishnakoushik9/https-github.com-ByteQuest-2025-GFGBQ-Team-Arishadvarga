'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { getRecentCases, type SavedCase } from '@/lib/db';
import {
  Users,
  Brain,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Shield,
  Stethoscope,
  ArrowUpRight,
  Zap,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const [recentCases, setRecentCases] = React.useState<(SavedCase & { id: string })[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCases() {
      try {
        const cases = await getRecentCases(5);
        setRecentCases(cases);
      } catch (error) {
        console.error('Error fetching recent cases:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Dynamic stats based on loaded cases
  const totalRedFlags = recentCases.reduce((acc, c) => acc + c.analysis.redFlags.length, 0);

  const stats = [
    {
      label: 'Saved Cases',
      value: String(recentCases.length),
      change: 'In database',
      icon: Users,
      iconBg: '#10b981',
    },
    {
      label: 'AI Analyses',
      value: String(recentCases.length),
      change: 'Completed',
      icon: Brain,
      iconBg: '#3b82f6',
    },
    {
      label: 'Red Flags',
      value: String(totalRedFlags),
      change: 'Detected',
      icon: AlertTriangle,
      iconBg: '#f59e0b',
    },
    {
      label: 'Diagnoses',
      value: String(recentCases.reduce((acc, c) => acc + c.analysis.differentialDiagnoses.length, 0)),
      change: 'Generated',
      icon: CheckCircle,
      iconBg: '#22c55e',
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#059669', marginBottom: '8px' }}>
              Welcome back, Dr. Smith
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Clinical Dashboard
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>
              You have <strong style={{ color: '#334155' }}>{recentCases.length} saved cases</strong> in the system.
            </p>
          </div>
          <Link href="/assessment">
            <Button size="lg" rightIcon={<ArrowRight size={16} />}>
              Start New Assessment
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: stat.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <stat.icon size={24} color="#ffffff" />
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748b',
                  background: '#f1f5f9',
                  padding: '4px 10px',
                  borderRadius: '20px',
                }}>
                  {stat.change}
                </span>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                {loading ? '...' : stat.value}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '24px',
        }}>
          {/* Recent Cases */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Recent Cases</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>Latest patient assessments from Firebase</p>
              </div>
              <Link href="/cases" style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
              }}>
                View All <ArrowUpRight size={14} />
              </Link>
            </div>

            <div>
              {loading ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #e2e8f0',
                    borderTopColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 12px'
                  }} />
                  <p style={{ color: '#64748b', fontSize: '14px' }}>Loading cases...</p>
                </div>
              ) : recentCases.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <Users size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                  <p style={{ color: '#64748b', fontSize: '14px' }}>No cases saved yet. Start a new assessment!</p>
                </div>
              ) : (
                recentCases.map((item, i) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '16px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      borderBottom: i < recentCases.length - 1 ? '1px solid #f1f5f9' : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Priority Bar */}
                    <div style={{
                      width: '4px',
                      height: '48px',
                      borderRadius: '4px',
                      background: item.analysis.redFlags.length > 0 ? '#ef4444' : '#10b981',
                    }} />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          color: '#94a3b8',
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}>
                          {item.patient.pseudonymizedId}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          background: '#d1fae5',
                          color: '#047857',
                        }}>
                          Saved
                        </span>
                        {item.analysis.redFlags.length > 0 && (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            borderRadius: '20px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <AlertTriangle size={10} />
                            {item.analysis.redFlags.length} Flag{item.analysis.redFlags.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#1e293b',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.encounter.chiefComplaint}
                      </p>
                    </div>

                    {/* Time */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: '#94a3b8',
                      flexShrink: 0,
                    }}>
                      <Clock size={14} />
                      {getTimeAgo(item.savedAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Quick Actions */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/assessment" style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                  }}>
                    <Stethoscope size={20} />
                    New Patient Assessment
                    <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                  </button>
                </Link>
                <Link href="/cases" style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}>
                    <Users size={20} color="#64748b" />
                    View All Cases
                  </button>
                </Link>
                <button style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}>
                  <Shield size={20} color="#64748b" />
                  View Audit Log
                </button>
              </div>
            </div>

            {/* AI Engine Status */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #a7f3d0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}>
                  <Zap size={22} color="#ffffff" />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>AI Engine</h4>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Clinical Engine Online</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#475569' }}>Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>Online</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#475569' }}>Cases Analyzed</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{recentCases.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#475569' }}>Red Flags Found</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: totalRedFlags > 0 ? '#dc2626' : '#0f172a' }}>{totalRedFlags}</span>
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Shield size={20} color="#3b82f6" />
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Compliance</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['GDPR', 'HIPAA Ready', 'ISO 27001', 'CE Mark'].map((badge) => (
                  <span key={badge} style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                  }}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '32px 0 16px',
          marginTop: '40px',
          borderTop: '1px solid #e2e8f0',
        }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Developed by <span style={{ fontWeight: 600, color: '#059669' }}>Arishadvarga Team</span>
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Clinical Decision Support System v1.0 • For licensed healthcare professionals only
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
