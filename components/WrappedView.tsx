import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RefreshCw, Zap, Download, Music, Gem, Star, Heart, MapPin, Flag } from 'lucide-react';
import { generateHtmlReport } from '../services/reportGenerator';

interface WrappedViewProps {
    result: AnalysisResult;
    onRestart: () => void;
}

export const WrappedView: React.FC<WrappedViewProps> = ({ result, onRestart }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        { type: 'intro', title: "Your Soul's Data is Ready" },
        ...result.slides.map(s => ({ type: 'ai-content', ...s })),
        { type: 'chart', title: "The Shape of Your Heart" },
        { type: 'tarot', title: "Your Soul Card" },
        { type: 'advice', title: result.advice.status === 'Single' ? "The Hunt" : "The Health Check" },
        { type: 'celebrity', title: "Your Celestial Match" },
        { type: 'song', title: "Your Anthem" },
        { type: 'reveal', title: "Your Attachment Signature" },
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const handleDownload = () => {
        const htmlContent = generateHtmlReport(result);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SoulSync-Report-${result.twoLetterCode}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const chartData = Object.entries(result.scores).map(([key, value]) => ({
        subject: key,
        A: value,
        fullMark: 100,
    }));

    return (
        <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50 overflow-hidden">
            <div className="absolute inset-0 flex z-40">
                <div className="w-1/3 h-full" onClick={handlePrev} />
                <div className="w-2/3 h-full" onClick={handleNext} />
            </div>

            <div className="absolute top-4 left-0 right-0 z-50 px-4 flex gap-1">
                {slides.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-white"
                            initial={{ width: "0%" }}
                            animate={{ width: idx < currentSlide ? "100%" : idx === currentSlide ? "100%" : "0%" }} 
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
                    {renderSlideContent(slides[currentSlide], result, chartData, onRestart, handleDownload)}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const renderSlideContent = (slide: any, result: AnalysisResult, chartData: any[], onRestart: () => void, onDownload: () => void) => {
    switch (slide.type) {
        case 'intro':
            return (
                <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-indigo-900 to-purple-900">
                    <h1 className="text-5xl font-display font-bold mb-4 text-center">We've Looked Deep Inside.</h1>
                    <p className="text-xl opacity-80 text-center">Analyzing demographic context...</p>
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
                                <Radar name="Score" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.5} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            );
        case 'tarot':
            return (
                 <div className="flex-1 flex flex-col justify-center items-center p-6 bg-indigo-950 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    <Gem className="w-12 h-12 text-indigo-400 mb-4 animate-pulse" />
                    <h2 className="text-lg font-bold tracking-widest text-indigo-300 uppercase mb-4">The Oracle Speaks</h2>
                    
                    {/* Tarot Card Visual */}
                    <div className="bg-black border-4 border-indigo-500/50 p-2 rounded-lg mb-6 shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:rotate-3 transition-transform">
                         {result.tarot.imageBase64 ? (
                            <img src={result.tarot.imageBase64} alt="Tarot" className="w-48 h-72 object-cover rounded" />
                         ) : (
                            <div className="w-48 h-72 bg-zinc-800 flex items-center justify-center text-indigo-900 font-serif">?</div>
                         )}
                    </div>

                    <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">
                        {result.tarot.cardName}
                    </h1>
                    <p className="text-lg text-indigo-100 font-light italic leading-relaxed text-center px-4">
                        "{result.tarot.meaning}"
                    </p>
                </div>
            );
        case 'advice':
            return (
                <div className="flex-1 flex flex-col justify-center p-6 bg-zinc-900">
                    <h2 className="text-4xl font-display font-bold mb-8 text-yellow-400">{slide.title}</h2>
                    
                    {result.advice.status === 'Single' ? (
                        <div className="space-y-6">
                            <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700">
                                <h3 className="text-pink-500 font-bold mb-2 flex items-center gap-2">
                                    <Heart className="w-5 h-5" /> The Strategy
                                </h3>
                                <p className="text-lg">{result.advice.datingStrategy}</p>
                            </div>
                            <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700">
                                <h3 className="text-blue-500 font-bold mb-2 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" /> Where to look
                                </h3>
                                <p className="text-lg">{result.advice.meetingPlace}</p>
                            </div>
                        </div>
                    ) : (
                         <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm uppercase tracking-widest text-zinc-500">Relationship Health</span>
                                <span className={`font-bold ${
                                    (result.advice.dominantFlagScore || 50) > 50 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                    {(result.advice.dominantFlagScore || 50) > 50 ? 'GREEN DOMINANT' : 'RED ALERT'}
                                </span>
                            </div>

                            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-xl">
                                <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2"><Flag className="w-4 h-4"/> Red Flags</h4>
                                <ul className="list-disc list-inside text-sm text-red-200 opacity-80">
                                    {result.advice.redFlags?.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>

                            <div className="bg-green-900/20 border border-green-900/50 p-4 rounded-xl">
                                <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2"><Flag className="w-4 h-4"/> Green Flags</h4>
                                <ul className="list-disc list-inside text-sm text-green-200 opacity-80">
                                    {result.advice.greenFlags?.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                         </div>
                    )}
                </div>
            );
        case 'celebrity':
            return (
                <div className="flex-1 flex flex-col justify-center items-center p-6 bg-rose-950">
                    <Star className="w-12 h-12 text-rose-400 mb-4" />
                    <h2 className="text-3xl font-display font-bold mb-6 text-center">Your Celestial Match</h2>
                    
                    <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        {result.celebrityMatch.imageBase64 ? (
                            <img 
                                src={result.celebrityMatch.imageBase64} 
                                alt={result.celebrityMatch.name} 
                                className="relative w-48 h-48 object-cover rounded-full border-4 border-rose-300 shadow-2xl"
                            />
                        ) : (
                            <div className="relative w-48 h-48 bg-zinc-800 rounded-full flex items-center justify-center border-4 border-rose-300">
                                <span className="text-4xl">?</span>
                            </div>
                        )}
                    </div>

                    <h3 className="text-4xl font-bold text-white mb-2">{result.celebrityMatch.name}</h3>
                    <p className="text-rose-200 text-center max-w-xs leading-relaxed">
                        {result.celebrityMatch.reason}
                    </p>
                </div>
            );
        case 'song':
            return (
                <div className="flex-1 flex flex-col justify-center items-center p-6 bg-pink-950">
                    <div className="w-full max-w-sm bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl p-6 shadow-2xl border border-white/10">
                        <div className="w-full aspect-square bg-zinc-800 rounded-lg mb-6 relative overflow-hidden shadow-inner">
                            {result.song.coverArtBase64 ? (
                                <img src={result.song.coverArtBase64} alt="Album Art" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Music className="w-20 h-20 text-white/20" />
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1 truncate">{result.song.title}</h2>
                        <p className="text-zinc-400 text-lg mb-6">{result.song.artist}</p>
                        
                        <div className="w-full bg-zinc-700 h-1 rounded-full mb-2 overflow-hidden">
                            <div className="w-2/3 h-full bg-white rounded-full"></div>
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 mb-6">
                            <span>1:24</span>
                            <span>3:42</span>
                        </div>
                        
                        <p className="text-sm text-zinc-300 italic border-l-2 border-green-500 pl-4">
                            {result.song.reason}
                        </p>
                    </div>
                </div>
            );
        case 'reveal':
            return (
                <div className="flex-1 flex flex-col justify-between p-6 bg-zinc-950 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="z-10 mt-12 relative">
                        <div className="bg-yellow-400 text-black px-4 py-1 inline-block transform -rotate-2 mb-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                             <p className="text-sm uppercase font-black tracking-widest">The Verdict</p>
                        </div>
                        <h1 className="text-5xl font-display font-black text-white italic drop-shadow-[4px_4px_0px_#7c3aed] leading-tight">
                            {result.attachmentStyleName}
                        </h1>
                    </div>

                    <div className="z-10 flex-1 flex flex-col items-center justify-center my-4">
                        {result.generatedImageBase64 ? (
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-black skew-y-1 rounded-sm"></div>
                                <div className="absolute -inset-2 bg-white skew-y-1 transform translate-x-1 translate-y-1 border-2 border-black"></div>
                                
                                <motion.img 
                                    src={result.generatedImageBase64} 
                                    alt="Soul Comic" 
                                    className="relative w-64 h-64 object-cover border-4 border-black z-10"
                                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                />
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
                        
                        <div className="mt-8 relative">
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
                            <RefreshCw className="w-4 h-4" /> RETAKE
                        </button>
                        <button 
                            onClick={onDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white border-2 border-black shadow-[4px_4px_0px_#000] font-bold hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            <Download className="w-4 h-4" /> REPORT
                        </button>
                    </div>
                </div>
            );
        default:
            return null;
    }
};