import React, { useState } from 'react';
import { AppState, Question, Answer, AnalysisResult, UserContext } from './types';
import { generateQuestions, analyzeAttachmentStyle, generateAllImages } from './services/geminiService';
import { Quiz } from './components/Quiz';
import { WrappedView } from './components/WrappedView';
import { LoadingScreen } from './components/LoadingScreen';
import { PreQuizForm } from './components/PreQuizForm';
import { Sparkles, BrainCircuit, Heart, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);

  const handleStart = () => {
      setAppState(AppState.USER_CONTEXT);
  };

  const handleContextComplete = async (context: UserContext) => {
      setUserContext(context);
      setAppState(AppState.GENERATING_QUIZ);
      try {
          const qs = await generateQuestions(context);
          setQuestions(qs);
          setAppState(AppState.QUIZ);
      } catch (e) {
          console.error(e);
          alert("Failed to initialize. Please refresh.");
          setAppState(AppState.WELCOME);
      }
  };

  const handleQuizComplete = async (answers: Answer[]) => {
    if (!userContext) return;
    setAppState(AppState.ANALYZING);
    
    try {
      // 1. Text Analysis
      let analysis = await analyzeAttachmentStyle(answers, userContext);
      setResult(analysis);

      // 2. Image Generation (Parallel)
      try {
          analysis = await generateAllImages(analysis);
          setResult(analysis);
      } catch (imgError) {
          console.warn("Image generation incomplete", imgError);
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
      setUserContext(null);
  };

  return (
    <div className="w-full h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      
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
              Unlock the geometry of your heart. 
              <br/>42 Questions. Deep AI Analysis.
            </p>
            <button 
              onClick={handleStart}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-zinc-100 text-zinc-950 font-display rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 hover:scale-105"
            >
              Begin Journey
              <Sparkles className="ml-2 w-5 h-5 text-purple-600" />
            </button>
          </motion.div>
        </div>
      )}

      {appState === AppState.USER_CONTEXT && (
          <PreQuizForm onComplete={handleContextComplete} />
      )}

      {(appState === AppState.GENERATING_QUIZ || appState === AppState.ANALYZING) && (
        <LoadingScreen mode={appState === AppState.GENERATING_QUIZ ? 'quiz' : 'analysis'} />
      )}

      {appState === AppState.QUIZ && (
        <Quiz questions={questions} onComplete={handleQuizComplete} />
      )}

      {appState === AppState.WRAPPED && result && (
        <WrappedView result={result} onRestart={restart} />
      )}

    </div>
  );
};

export default App;