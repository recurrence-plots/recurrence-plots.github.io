import React from 'react';
import Section from '../components/Section';
import { ArrowRight, Activity, Brain, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <Section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:bg-blue-500/20 animate-blob" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:bg-teal-500/20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:bg-indigo-500/20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm mb-8 shadow-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            New Research: MCI Detection via Recurrence Plots
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                        Unveiling the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">Hidden Dynamics</span> of the Brain
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        We leverage <strong>Phase Space Reconstruction</strong> and <strong>Deep Learning</strong> to detect Mild Cognitive Impairment from fMRI data with unprecedented accuracy.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#demo"
                            className="group px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg flex items-center gap-2"
                        >
                            Interactive Demo
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="#guide"
                            className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                            <Brain size={20} />
                            Read the Guide
                        </a>
                    </div>
                </motion.div>

                {/* Stats / Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left"
                >
                    <div className="p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Non-Linear Analysis</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Capturing chaotic transitions often missed by traditional linear methods.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm hover:border-teal-500/50 transition-colors">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center mb-4">
                            <Brain size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Latent Embeddings</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Compressing 224x224 Recurrence Plots into meaningful 14x14 feature vectors.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm hover:border-indigo-500/50 transition-colors">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mb-4">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">93% Accuracy</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Achieved on the ADNI dataset, outperforming baseline RQA metrics.</p>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-600 animate-bounce"
            >
                <ChevronDown size={24} />
            </motion.div>
        </Section>
    );
};

export default Hero;
