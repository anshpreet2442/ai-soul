import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bot, BrainCircuit } from 'lucide-react';

interface LoadingScreenProps {
    mode: 'quiz' | 'analysis';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ mode }) => {
    const [thought, setThought] = useState("");
    
    // Fake thought stream for analysis mode
    useEffect(() => {
        if (mode === 'analysis') {
            const thoughts = [
                "Scanning emotional patterns...",
                "Correlating 42 data points...",
                "Detecting anxiety spectrum...",
                "Measuring avoidance vectors...",
                "Synthesizing soul signature...",
                "Generating comic illustration...",
                "Finalizing report..."
            ];
            let i = 0;
            const interval = setInterval(() => {
                setThought(thoughts[i % thoughts.length]);
                i++;
            }, 1500);
            return () => clearInterval(interval);
        } else {
            setThought("Consulting Gemini Psychology Model...");
        }
    }, [mode]);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center z-50">
            {/* Background Layer */}
            {mode === 'analysis' ? (
                // Multi-color Morph for Analysis
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-xy">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]" />
                </div>
            ) : (
                // Dark background for Quiz Gen
                <div className="absolute inset-0 bg-zinc-950" />
            )}

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-md p-8">
                
                {/* Visual Icon */}
                <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
                    
                    {mode === 'quiz' && (
                        /* Morphy Bubble Loader */
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" style={{animationDelay: '2s'}}></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" style={{animationDelay: '4s'}}></div>
                            
                            <div className="absolute inset-4 bg-zinc-900 rounded-full flex items-center justify-center shadow-inner border border-white/10">
                                <BrainCircuit className="w-12 h-12 text-white animate-pulse" />
                            </div>
                        </div>
                    )}

                    {mode === 'analysis' && (
                        /* 3D Lightning Bolt + AI Emoji */
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Background glow/morph */}
                            <motion.div 
                                className="absolute inset-0 bg-yellow-500/30 rounded-full blur-3xl"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            
                            {/* 3D Lightning Bolt */}
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, -5, 5, 0],
                                    filter: ["drop-shadow(0px 0px 10px rgba(234, 179, 8, 0.5))", "drop-shadow(0px 0px 30px rgba(234, 179, 8, 1))", "drop-shadow(0px 0px 10px rgba(234, 179, 8, 0.5))"]
                                }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                className="relative z-10"
                            >
                                <Zap className="w-32 h-32 text-yellow-400 fill-yellow-400" style={{ filter: "drop-shadow(4px 4px 0px rgba(0,0,0,0.5))" }} />
                            </motion.div>

                            {/* Floating AI Emoji */}
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

                {/* Text */}
                <h2 className="text-3xl font-display font-bold text-white text-center mb-4 tracking-tight">
                    {mode === 'quiz' ? "Synthesizing Test..." : "Analyzing Soul..."}
                </h2>
                
                <div className="h-8 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={thought}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-lg text-purple-200 font-mono text-center"
                        >
                            {thought}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};