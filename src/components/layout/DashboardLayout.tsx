'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Activity,
    Users,
    FileText,
    Settings,
    Search,
    Bell,
    Menu,
    ChevronRight,
    ChevronLeft,
    User,
    Shield,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

const navigationItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Patient Cases', href: '/cases', icon: Users },
    { name: 'New Assessment', href: '/assessment', icon: FileText },
    { name: 'Audit Log', href: '/audit', icon: Shield },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside style={{
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            width: isCollapsed ? '72px' : '260px',
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            transition: 'width 0.3s ease',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Logo */}
            <div style={{
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                padding: isCollapsed ? '0 16px' : '0 20px',
                borderBottom: '1px solid #f1f5f9',
                justifyContent: isCollapsed ? 'center' : 'space-between',
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
                    }}>
                        <Activity size={20} color="#ffffff" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>CDSS</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '-2px' }}>Clinical Support</div>
                        </div>
                    )}
                </Link>
                {!isCollapsed && (
                    <button
                        onClick={onToggle}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#94a3b8',
                        }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '24px 12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: isCollapsed ? '12px' : '12px 16px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    background: isActive ? '#ecfdf5' : 'transparent',
                                    color: isActive ? '#059669' : '#475569',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '14px',
                                    transition: 'all 0.2s',
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    position: 'relative',
                                }}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '3px',
                                        height: '24px',
                                        background: '#10b981',
                                        borderRadius: '0 4px 4px 0',
                                    }} />
                                )}
                                <item.icon size={20} style={{ color: isActive ? '#10b981' : '#94a3b8' }} />
                                {!isCollapsed && item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Collapse Toggle */}
            {isCollapsed && (
                <div style={{ padding: '0 12px 24px', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={onToggle}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#f1f5f9',
                            cursor: 'pointer',
                            color: '#64748b',
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* User Profile */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid #f1f5f9',
                background: '#fafafa',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <User size={18} color="#ffffff" />
                    </div>
                    {!isCollapsed && (
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Dr. Smith</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Physician</div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

interface TopBarProps {
    onMenuClick?: () => void;
    sidebarCollapsed?: boolean;
}

export function TopBar({ onMenuClick, sidebarCollapsed }: TopBarProps) {
    return (
        <header style={{
            height: '72px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button
                    onClick={onMenuClick}
                    style={{
                        display: 'none',
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#64748b',
                    }}
                >
                    <Menu size={20} />
                </button>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                    }} />
                    <input
                        type="text"
                        placeholder="Search patients, cases..."
                        style={{
                            width: '320px',
                            padding: '10px 14px 10px 44px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            fontSize: '14px',
                            color: '#0f172a',
                            outline: 'none',
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Notifications */}
                <button style={{
                    position: 'relative',
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#64748b',
                }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        border: '2px solid #ffffff',
                    }} />
                </button>

                <Link href="/assessment">
                    <Button leftIcon={<FileText size={16} />}>
                        New Case
                    </Button>
                </Link>
            </div>
        </header>
    );
}

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div style={{
                marginLeft: sidebarCollapsed ? '72px' : '260px',
                transition: 'margin-left 0.3s ease',
            }}>
                <TopBar
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    sidebarCollapsed={sidebarCollapsed}
                />
                <main style={{ padding: '32px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
