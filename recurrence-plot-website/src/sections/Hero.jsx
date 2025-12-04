import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white pt-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0 opacity-5">
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
            </div>

            <div className="text-center max-w-4xl mx-auto px-6 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6 border border-blue-100">
                        Interactive Research Showcase
                    </span>
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
                        Recurrence Plots<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                            At A Glance
                        </span>
                    </h1>
                    <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Visualize when dynamical systems revisit previous states.
                        Applied here to detect <span className="font-semibold text-slate-700">Mild Cognitive Impairment</span> from fMRI data.
                    </p>
                    <p className="text-slate-400 mb-12 font-medium">Ninad Aithal · Centre for Brain Research, IISc Bengaluru</p>

                    <div className="flex justify-center gap-4">
                        <a href="#definition" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
                            Start Learning <ArrowDown size={18} />
                        </a>
                        <a href="#demo" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-all">
                            Try Demo
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
