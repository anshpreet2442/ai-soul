import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bot, BrainCircuit, Timer, Lightbulb, Palette } from 'lucide-react';
import { getLoadingFacts } from '../services/geminiService';

interface LoadingScreenProps {
    mode: 'quiz' | 'analysis';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ mode }) => {
    const [thought, setThought] = useState("");
    const [progress, setProgress] = useState(0);
    const [facts, setFacts] = useState<string[]>([]);
    const [currentFactIndex, setCurrentFactIndex] = useState(0);

    useEffect(() => {
        if (mode === 'analysis') {
            const fetchFacts = async () => {
                const f = await getLoadingFacts();
                setFacts(f);
            };
            fetchFacts();
        }
    }, [mode]);

    useEffect(() => {
        if (facts.length > 0 && mode === 'analysis') {
            const interval = setInterval(() => {
                setCurrentFactIndex(prev => (prev + 1) % facts.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [facts, mode]);

    useEffect(() => {
        if (mode === 'analysis') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 98) return prev; 
                    // Slower progress to account for image gen
                    return prev + (Math.random() * 2); 
                });
            }, 800);
            return () => clearInterval(interval);
        }
    }, [mode]);
    
    useEffect(() => {
        if (mode === 'analysis') {
            const thoughts = [
                "Scanning emotional patterns...",
                "Decoding your heart's geometry...",
                "Consulting the Tarot Oracle...",
                "Sketching your Soul Comic...",
                "Searching for your Celebrity Match...",
                "Analyzing Red & Green Flags...",
                "Composing your Anthem...",
                "Finalizing the Report..."
            ];
            let i = 0;
            const interval = setInterval(() => {
                setThought(thoughts[i % thoughts.length]);
                i++;
            }, 3000); // Slower updates
            return () => clearInterval(interval);
        } else {
            setThought("Crafting personalized questions...");
        }
    }, [mode]);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center z-50">
            {mode === 'analysis' ? (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-xy">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]" />
                </div>
            ) : (
                <div className="absolute inset-0 bg-zinc-950" />
            )}

            <div className="relative z-10 flex flex-col items-center justify-center max-w-lg p-8 w-full">
                <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                    {mode === 'quiz' && (
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" style={{animationDelay: '2s'}}></div>
                            <div className="absolute inset-4 bg-zinc-900 rounded-full flex items-center justify-center shadow-inner border border-white/10">
                                <BrainCircuit className="w-12 h-12 text-white animate-pulse" />
                            </div>
                        </div>
                    )}

                    {mode === 'analysis' && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.div 
                                className="absolute inset-0 bg-yellow-500/30 rounded-full blur-3xl"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, -5, 5, 0],
                                }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                className="relative z-10"
                            >
                                <Palette className="w-32 h-32 text-yellow-400 fill-yellow-400" style={{ filter: "drop-shadow(4px 4px 0px rgba(0,0,0,0.5))" }} />
                            </motion.div>
                            <motion.div 
                                className="absolute -top-4 -right-4 text-4xl"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Bot className="w-12 h-12 text-white fill-purple-600" />
                            </motion.div>
                        </div>
                    )}
                </div>

                {mode === 'analysis' && (
                    <div className="w-full h-2 bg-black/40 rounded-full mb-6 overflow-hidden relative border border-white/10">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "tween" }}
                        />
                    </div>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                    {mode === 'analysis' && <Timer className="w-4 h-4 text-yellow-400" />}
                    <span className="text-sm font-mono text-yellow-400/80 uppercase tracking-widest">
                        {mode === 'quiz' ? "Initializing" : `Creating Art: ${Math.floor(progress)}%`}
                    </span>
                </div>

                <h2 className="text-3xl font-display font-bold text-white text-center mb-4 tracking-tight">
                    {mode === 'quiz' ? "Synthesizing Test..." : "Designing Results..."}
                </h2>
                
                <div className="h-16 overflow-hidden relative w-full flex justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={thought}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-lg text-purple-200 font-mono text-center absolute"
                        >
                            {thought}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {mode === 'analysis' && facts.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-sm w-full"
                    >
                        <div className="flex items-center gap-2 mb-2 text-pink-400">
                            <Lightbulb className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Relationship Fact</span>
                        </div>
                        <div className="h-16 relative overflow-hidden">
                             <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentFactIndex}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    className="text-sm text-zinc-300 leading-snug"
                                >
                                    {facts[currentFactIndex]}
                                </motion.p>
                             </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};