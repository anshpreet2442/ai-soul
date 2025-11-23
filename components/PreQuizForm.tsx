import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../types';
import { ArrowRight, Heart, User, Sparkles, HelpCircle, Eye } from 'lucide-react';

interface PreQuizFormProps {
    onComplete: (context: UserContext) => void;
}

export const PreQuizForm: React.FC<PreQuizFormProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<Partial<UserContext>>({
        relationshipHistoryCount: 0,
        insecurity: "",
        selfLoveTrait: ""
    });

    const handleNext = (data: Partial<UserContext>) => {
        const updated = { ...formData, ...data };
        setFormData(updated);
        
        if (step < 4) { // Increased steps
            setStep(prev => prev + 1);
        } else {
            onComplete(updated as UserContext);
        }
    };

    const steps = [
        {
            id: 'basics',
            question: "First, tell us who you are.",
            icon: <User className="w-8 h-8 text-purple-400" />,
            render: () => (
                <div className="flex flex-col gap-4 w-full">
                    <input 
                        type="text" 
                        placeholder="Your Name (or Nickname)" 
                        className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-purple-500 transition-colors"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        defaultValue={formData.name}
                    />
                    <div className="flex gap-4">
                        <input 
                            type="number" 
                            placeholder="Age" 
                            className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-purple-500 transition-colors w-1/3"
                            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                            defaultValue={formData.age}
                        />
                        <select 
                            className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-purple-500 transition-colors w-2/3"
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            defaultValue={formData.gender || ""}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => formData.name && formData.age && formData.gender && handleNext({})}
                        disabled={!formData.name || !formData.age || !formData.gender}
                        className="mt-4 bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next <ArrowRight size={18} />
                    </button>
                </div>
            )
        },
        {
            id: 'status',
            question: "What's your heart's current status?",
            icon: <Heart className="w-8 h-8 text-pink-500" />,
            render: () => (
                <div className="flex flex-col gap-3 w-full">
                    {['Single', 'Relationship', 'Complicated', 'Married'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleNext({ relationshipStatus: status as any })}
                            className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-left hover:bg-zinc-800 hover:border-pink-500 transition-all flex justify-between group"
                        >
                            {status}
                            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-pink-500" />
                        </button>
                    ))}
                </div>
            )
        },
        {
            id: 'mirror',
            question: "Mirror, Mirror...",
            icon: <Eye className="w-8 h-8 text-cyan-400" />,
            render: () => (
                <div className="flex flex-col gap-4 w-full">
                     <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400 ml-1">My biggest insecurity is...</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Not being enough, Being abandoned..." 
                            className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors"
                            onChange={(e) => setFormData({...formData, insecurity: e.target.value})}
                            defaultValue={formData.insecurity}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400 ml-1">I love this about myself...</label>
                        <input 
                            type="text" 
                            placeholder="e.g., My empathy, My humor..." 
                            className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors"
                            onChange={(e) => setFormData({...formData, selfLoveTrait: e.target.value})}
                            defaultValue={formData.selfLoveTrait}
                        />
                    </div>
                    <button 
                        onClick={() => formData.insecurity && formData.selfLoveTrait && handleNext({})}
                        disabled={!formData.insecurity || !formData.selfLoveTrait}
                        className="mt-4 bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reflect & Continue <ArrowRight size={18} />
                    </button>
                </div>
            )
        },
        {
            id: 'history',
            question: "A quick look at the past...",
            icon: <HelpCircle className="w-8 h-8 text-blue-400" />,
            render: () => (
                <div className="flex flex-col gap-6 w-full">
                    <div className="text-center">
                        <label className="text-sm text-zinc-400 mb-2 block">Serious Relationships Count</label>
                        <div className="text-6xl font-display font-bold text-white mb-4">
                            {formData.relationshipHistoryCount}
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="20" 
                            value={formData.relationshipHistoryCount}
                            onChange={(e) => setFormData({...formData, relationshipHistoryCount: parseInt(e.target.value)})}
                            className="w-full accent-blue-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <button 
                         onClick={() => handleNext({})}
                         className="bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200"
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                </div>
            )
        },
        {
            id: 'intent',
            question: "Why are you here today?",
            icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
            render: () => (
                <div className="flex flex-col gap-3 w-full">
                    {[
                        "To understand my patterns",
                        "To find out why it didn't work",
                        "Curiosity / Just for fun",
                        "To improve my current relationship"
                    ].map((intent) => (
                        <button
                            key={intent}
                            onClick={() => handleNext({ intent })}
                            className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-left hover:bg-zinc-800 hover:border-yellow-500 transition-all flex justify-between group"
                        >
                            {intent}
                            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500" />
                        </button>
                    ))}
                </div>
            )
        }
    ];

    const currentStep = steps[step];

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-zinc-950 text-white relative overflow-hidden">
             <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
             
             <div className="w-full max-w-md z-10">
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
                        {currentStep.icon}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center"
                    >
                        <h2 className="text-3xl font-display font-bold text-center mb-8 leading-tight">
                            {currentStep.question}
                        </h2>
                        {currentStep.render()}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-12 flex justify-center gap-2">
                    {steps.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-300 ${idx <= step ? 'w-8 bg-purple-500' : 'w-2 bg-zinc-800'}`} 
                        />
                    ))}
                </div>
             </div>
        </div>
    );
};