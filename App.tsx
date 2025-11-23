import React, { useState, useEffect } from 'react';
import { AppState, Question, Answer, AnalysisResult } from './types';
import { generateQuestions, analyzeAttachmentStyle, generateSoulImage } from './services/geminiService';
import { Quiz } from './components/Quiz';
import { WrappedView } from './components/WrappedView';
import { LoadingScreen } from './components/LoadingScreen';
import { Sparkles, BrainCircuit, Heart, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const startQuiz = async () => {
    setAppState(AppState.GENERATING_QUIZ);
    try {
      const qs = await generateQuestions();
      setQuestions(qs);
      setAppState(AppState.QUIZ);
    } catch (e) {
      console.error(e);
      alert("Failed to initialize the soul link. Please refresh.");
      setAppState(AppState.WELCOME);
    }
  };

  const handleQuizComplete = async (answers: Answer[]) => {
    setAppState(AppState.ANALYZING);
    try {
      // Step 1: Analyze Text
      const analysis = await analyzeAttachmentStyle(answers);
      setResult(analysis);

      // Step 2: Generate Image
      if (analysis.imagePrompt) {
         try {
            const imgBase64 = await generateSoulImage(analysis.imagePrompt);
            if (imgBase64) {
                setResult(prev => prev ? { ...prev, generatedImageBase64: imgBase64 } : null);
            }
         } catch (imgError) {
             console.warn("Image gen failed, proceeding with text only");
         }
      }
      
      setAppState(AppState.WRAPPED);
    } catch (e) {
      console.error(e);
      alert("Analysis disrupted. Please try again.");
      setAppState(AppState.WELCOME);
    }
  };

  const restart = () => {
      setAppState(AppState.WELCOME);
      setResult(null);
      setQuestions([]);
  };

  // Render Logic
  return (
    <div className="w-full h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      
      {/* Welcome Screen */}
      {appState === AppState.WELCOME && (
        <div className="h-full flex flex-col items-center justify-center p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-zinc-950 to-zinc-950" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 text-center max-w-2xl"
          >
            <div className="mb-6 flex justify-center">
                <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
                    <Fingerprint className="w-12 h-12 text-purple-500" />
                </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              SoulSync
            </h1>
            <p className="text-xl text-zinc-400 mb-8 font-light leading-relaxed">
              A deep-dive, AI-powered psychological assessment. 
              42 questions to uncover the geometry of your heart.
            </p>
            
            <button 
              onClick={startQuiz}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-zinc-100 text-zinc-950 font-display rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 hover:scale-105"
            >
              Start Assessment
              <Sparkles className="ml-2 w-5 h-5 text-purple-600" />
            </button>

            <div className="mt-12 flex gap-8 justify-center text-zinc-600 text-sm">
                <div className="flex items-center gap-2"><BrainCircuit size={16}/> AI Analysis</div>
                <div className="flex items-center gap-2"><Heart size={16}/> 8 Dimensions</div>
                <div className="flex items-center gap-2"><Fingerprint size={16}/> Unique Code</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Loading Screens (Replaced with new Component) */}
      {(appState === AppState.GENERATING_QUIZ || appState === AppState.ANALYZING) && (
        <LoadingScreen mode={appState === AppState.GENERATING_QUIZ ? 'quiz' : 'analysis'} />
      )}

      {/* Quiz Screen */}
      {appState === AppState.QUIZ && (
        <Quiz questions={questions} onComplete={handleQuizComplete} />
      )}

      {/* Results Screen */}
      {appState === AppState.WRAPPED && result && (
        <WrappedView result={result} onRestart={restart} />
      )}

    </div>
  );
};

export default App;