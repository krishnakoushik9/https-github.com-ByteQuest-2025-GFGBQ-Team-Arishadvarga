'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoginOverlayProps {
    onLogin: () => void;
}

export function LoginOverlay({ onLogin }: LoginOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '40px',
                }}
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(16,185,129,0.3)',
                    }}
                >
                    <Shield size={40} color="#ffffff" />
                </motion.div>

                <div style={{ textAlign: 'center' }}>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        style={{
                            fontSize: '48px',
                            fontWeight: 800,
                            color: '#ffffff',
                            marginBottom: '8px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        CDSS
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        style={{
                            fontSize: '18px',
                            color: '#94a3b8',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                        }}
                    >
                        Arishadvarga Team
                    </motion.p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    style={{ marginTop: '20px' }}
                >
                    <Button
                        size="lg"
                        onClick={onLogin}
                        style={{
                            minWidth: '200px',
                            height: '56px',
                            fontSize: '16px',
                            background: '#ffffff',
                            color: '#0f172a',
                            border: 'none',
                        }}
                        rightIcon={<ArrowRight size={20} />}
                    >
                        Enter System
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    color: '#475569',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                }}
            >
                SECURE CLINICAL ENVIRONMENT
            </motion.div>
        </motion.div>
    );
}
