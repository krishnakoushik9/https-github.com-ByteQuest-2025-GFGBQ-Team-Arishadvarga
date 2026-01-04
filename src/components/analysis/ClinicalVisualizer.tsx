import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { ImageIcon, Flame, TrendingUp, PlayCircle, Loader2, RefreshCw } from 'lucide-react';

interface ClinicalVisualizerProps {
    condition: string;
    description: string;
    onGenerate: (type: 'anatomy' | 'heatmap' | 'progression' | 'cinematic', context: string) => Promise<string>;
}

export function ClinicalVisualizer({ condition, description, onGenerate }: ClinicalVisualizerProps) {
    const [activeTab, setActiveTab] = React.useState('anatomy');
    const [images, setImages] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState<Record<string, boolean>>({});

    const handleGenerate = async (type: 'anatomy' | 'heatmap' | 'progression' | 'cinematic') => {
        if (loading[type] || images[type]) return;

        setLoading(prev => ({ ...prev, [type]: true }));
        try {
            const context = type === 'heatmap' ? description : condition;
            const base64 = await onGenerate(type, context);
            if (base64) {
                setImages(prev => ({ ...prev, [type]: `data:image/png;base64,${base64}` }));
            }
        } catch (error) {
            console.error(`Failed to generate ${type}:`, error);
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    // Auto-generate anatomy on mount
    React.useEffect(() => {
        handleGenerate('anatomy');
    }, [condition]);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <ImageIcon size={18} className="text-indigo-600" />
                    AI Disease Visualizer
                </h3>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                    Educational Visualization Only
                </span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
                <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="anatomy" onClick={() => handleGenerate('anatomy')}>
                        <ImageIcon size={14} className="mr-2" /> Anatomy
                    </TabsTrigger>
                    <TabsTrigger value="heatmap" onClick={() => handleGenerate('heatmap')}>
                        <Flame size={14} className="mr-2" /> Heatmap
                    </TabsTrigger>
                    <TabsTrigger value="progression" onClick={() => handleGenerate('progression')}>
                        <TrendingUp size={14} className="mr-2" /> Progression
                    </TabsTrigger>
                    <TabsTrigger value="cinematic" onClick={() => handleGenerate('cinematic')}>
                        <PlayCircle size={14} className="mr-2" /> Mechanism
                    </TabsTrigger>
                </TabsList>

                {['anatomy', 'heatmap', 'progression', 'cinematic'].map((type) => (
                    <TabsContent key={type} value={type} className="min-h-[300px] flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 relative">
                        <AnimatePresence mode="wait">
                            {loading[type] ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-3 text-slate-500"
                                >
                                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                                    <p className="text-sm font-medium">Generating visualization...</p>
                                    <p className="text-xs opacity-75">Powered by Imagen 3</p>
                                </motion.div>
                            ) : images[type] ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-full h-full p-2"
                                >
                                    <img
                                        src={images[type]}
                                        alt={type}
                                        className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-sm"
                                    />
                                    <div className="absolute bottom-4 right-4">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="bg-white/90 backdrop-blur shadow-sm text-xs h-7"
                                            onClick={() => {
                                                setImages(prev => ({ ...prev, [type]: '' }));
                                                handleGenerate(type as any);
                                            }}
                                        >
                                            <RefreshCw size={12} className="mr-1" /> Regenerate
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-3">
                                        <ImageIcon className="text-slate-300" size={32} />
                                    </div>
                                    <p className="text-slate-500 mb-4">Visualize the impact of {condition} on the body.</p>
                                    <Button onClick={() => handleGenerate(type as any)}>
                                        Generate Visualization
                                    </Button>
                                </div>
                            )}
                        </AnimatePresence>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
