import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Answer } from '../types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface QuizProps {
    questions: Question[];
    onComplete: (answers: Answer[]) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const currentQuestion = questions[currentIndex];

    const handleSelect = (value: number) => {
        setSelectedOption(value);
        // Small delay to show selection animation before moving next
        setTimeout(() => {
            const newAnswer: Answer = {
                questionId: currentQuestion.id,
                questionText: currentQuestion.text,
                dimension: currentQuestion.dimension,
                value: value
            };

            const updatedAnswers = [...answers, newAnswer];
            setAnswers(updatedAnswers);
            setSelectedOption(null);

            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete(updatedAnswers);
            }
        }, 300);
    };

    // Progress percentage
    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-zinc-950 text-white relative overflow-hidden">
            {/* Background ambient blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />

            <div className="w-full max-w-2xl z-10">
                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-800 rounded-full mb-12 overflow-hidden">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-8 rounded-3xl shadow-2xl"
                    >
                        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4 block">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                        
                        <h2 className="text-2xl md:text-3xl font-display font-medium leading-tight mb-8 min-h-[100px]">
                            {currentQuestion.text}
                        </h2>

                        <div className="flex flex-col gap-3">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleSelect(val)}
                                    className={`
                                        w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between group
                                        ${selectedOption === val 
                                            ? 'bg-white text-zinc-900 shadow-lg scale-[1.02]' 
                                            : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white'}
                                    `}
                                >
                                    <span className="font-medium">
                                        {val === 1 && "Strongly Disagree"}
                                        {val === 2 && "Disagree"}
                                        {val === 3 && "Neutral"}
                                        {val === 4 && "Agree"}
                                        {val === 5 && "Strongly Agree"}
                                    </span>
                                    {selectedOption === val && (
                                        <CheckCircle2 className="w-5 h-5 text-zinc-900" />
                                    )}
                                    {selectedOption !== val && (
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
