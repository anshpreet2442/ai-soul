import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult, AttachmentDimension } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Share2, RefreshCw, Zap } from 'lucide-react';

interface WrappedViewProps {
    result: AnalysisResult;
    onRestart: () => void;
}

export const WrappedView: React.FC<WrappedViewProps> = ({ result, onRestart }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Total slides: Intro + Analysis Slides + Chart + Image + Summary
    const slides = [
        // Slide 0: Intro
        { type: 'intro', title: "Your Soul's Data is Ready" },
        // Slides 1-N: AI Generated insights
        ...result.slides.map(s => ({ type: 'ai-content', ...s })),
        // Slide N+1: The 8 Parameter Chart
        { type: 'chart', title: "The Shape of Your Heart" },
        // Slide N+2: The Generated Image & Code
        { type: 'reveal', title: "Your Attachment Signature" },
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            // Loop back to start of results or just stay? Let's stay at end.
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    // Data for Chart
    const chartData = Object.entries(result.scores).map(([key, value]) => ({
        subject: key,
        A: value,
        fullMark: 100,
    }));

    return (
        <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50 overflow-hidden">
            {/* Tap zones for navigation */}
            <div className="absolute inset-0 flex z-40">
                <div className="w-1/3 h-full" onClick={handlePrev} />
                <div className="w-2/3 h-full" onClick={handleNext} />
            </div>

            {/* Progress Indicators */}
            <div className="absolute top-4 left-0 right-0 z-50 px-4 flex gap-1">
                {slides.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-white"
                            initial={{ width: "0%" }}
                            animate={{ width: idx < currentSlide ? "100%" : idx === currentSlide ? "100%" : "0%" }} // Simple filled state
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    className="w-full h-full max-w-md mx-auto relative flex flex-col"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                >
                    {renderSlideContent(slides[currentSlide], result, chartData, onRestart)}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const renderSlideContent = (slide: any, result: AnalysisResult, chartData: any[], onRestart: () => void) => {
    switch (slide.type) {
        case 'intro':
            return (
                <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-indigo-900 to-purple-900">
                    <h1 className="text-5xl font-display font-bold mb-4 text-center">We've Looked Deep Inside.</h1>
                    <p className="text-xl opacity-80 text-center">Based on 42 points of data...</p>
                </div>
            );
        case 'ai-content':
            return (
                <div className="flex-1 flex flex-col justify-center p-8" style={{ backgroundColor: slide.bgColor || '#18181b' }}>
                    <h2 className="text-4xl font-display font-bold mb-6" style={{ color: slide.textColor || '#fff' }}>{slide.title}</h2>
                    <p className="text-2xl leading-relaxed font-medium" style={{ color: slide.textColor || '#fff' }}>
                        {slide.content}
                    </p>
                </div>
            );
        case 'chart':
            return (
                <div className="flex-1 flex flex-col justify-center items-center p-6 bg-zinc-900">
                    <h2 className="text-3xl font-display font-bold mb-8 text-center text-purple-400">Your Emotional Landscape</h2>
                    <div className="w-full h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="#3f3f46" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fill="#8b5cf6"
                                    fillOpacity={0.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            );
        case 'reveal':
            return (
                <div className="flex-1 flex flex-col justify-between p-6 bg-zinc-950 relative overflow-hidden">
                    {/* Comic Book Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="z-10 mt-12 relative">
                         {/* Comic Header Box */}
                        <div className="bg-yellow-400 text-black px-4 py-1 inline-block transform -rotate-2 mb-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                             <p className="text-sm uppercase font-black tracking-widest">The Verdict</p>
                        </div>
                        <h1 className="text-6xl font-display font-black text-white italic drop-shadow-[4px_4px_0px_#7c3aed]">
                            {result.attachmentStyleName}
                        </h1>
                    </div>

                    <div className="z-10 flex-1 flex flex-col items-center justify-center">
                        {result.generatedImageBase64 ? (
                            <div className="relative group">
                                {/* Comic Frame Border */}
                                <div className="absolute -inset-2 bg-black skew-y-1 rounded-sm"></div>
                                <div className="absolute -inset-2 bg-white skew-y-1 transform translate-x-1 translate-y-1 border-2 border-black"></div>
                                
                                <motion.img 
                                    src={result.generatedImageBase64} 
                                    alt="Soul Comic" 
                                    className="relative w-72 h-72 object-cover border-4 border-black z-10"
                                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                />
                                {/* Speech Bubble */}
                                <motion.div 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute -top-6 -right-8 bg-white text-black p-3 rounded-[50%] rounded-bl-none border-2 border-black z-20 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]"
                                >
                                    <Zap className="w-6 h-6 fill-yellow-400 text-black" />
                                </motion.div>
                            </div>
                        ) : (
                            <div className="w-64 h-64 bg-zinc-800 animate-pulse border-4 border-black" />
                        )}
                        
                        <div className="mt-12 relative">
                             <div className="absolute inset-0 bg-purple-600 blur-xl opacity-50"></div>
                             <div className="relative bg-black px-8 py-4 border-2 border-white/20 flex items-center justify-center transform hover:scale-105 transition-transform cursor-help">
                                <span className="text-5xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                                    {result.twoLetterCode}
                                </span>
                             </div>
                        </div>
                    </div>

                    <div className="z-10 mb-8 flex gap-4 justify-center">
                        <button 
                            onClick={onRestart}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-black border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,0.2)] font-bold hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            <RefreshCw className="w-4 h-4" /> RESTART
                        </button>
                    </div>
                </div>
            );
        default:
            return null;
    }
};