import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import PhaseSpaceViz from '../components/PhaseSpaceViz';
import TimeSeriesPlot from '../components/TimeSeriesPlot';
import { generateSignal } from '../utils/signal';
import { SlidersHorizontal, Activity, Box } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

const InteractivePipeline = () => {
    const [tau, setTau] = useState(10);
    const [signal, setSignal] = useState([]);
    const [isDark, setIsDark] = useState(false);

    // Generate a Lorenz attractor signal for the demo
    useEffect(() => {
        const data = generateSignal('lorenz', 500, 0.05, 0);
        setSignal(data);

        // Check for dark mode
        const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkDark();

        // Listen for theme changes
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Don't render until signal is loaded
    if (!signal || signal.length === 0) {
        return (
            <Section id="pipeline" className="bg-white dark:bg-slate-950 transition-colors duration-300">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="text-slate-500 dark:text-slate-400 mt-4">Loading visualization...</p>
                </div>
            </Section>
        );
    }

    return (
        <Section id="pipeline" className="bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="text-center mb-12">
                <span className="text-teal-600 dark:text-teal-400 font-medium text-sm uppercase tracking-wider">The Gemini Showcase</span>
                <h2 className="text-4xl font-bold mt-2 mb-4 text-slate-900 dark:text-white">Interactive Phase Space</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Experience how we unfold 1D time series into 3D structures. Adjust the Time Delay (<span className="font-mono">τ</span>) to see how it affects the reconstruction.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <SlidersHorizontal size={20} />
                            Parameters
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Time Delay (τ): {tau}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={tau}
                                    onChange={(e) => setTau(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                    Optimal τ unfolds the attractor. Too low = compressed diagonal. Too high = disconnected.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Activity size={20} />
                            1. Input Signal
                        </h3>
                        <div className="h-32 w-full bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-2 mb-2">
                            <TimeSeriesPlot signal={signal.slice(0, 200)} color={isDark ? '#2dd4bf' : '#4f46e5'} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                            Lorenz System (X-component)
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <Box size={20} />
                            2. Sliding Window Embedding
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">
                            We reconstruct the hidden 3D geometry by creating vectors from time-delayed samples:
                        </p>
                        <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg text-center overflow-x-auto">
                            <BlockMath math="\vec{v}(t) = [x(t), x(t+\tau), x(t+2\tau)]" />
                        </div>
                        <div className="mt-4 text-xs text-blue-700 dark:text-blue-300">
                            <ul className="list-disc pl-4 space-y-1">
                                <li><strong>x(t)</strong>: Current value</li>
                                <li><strong>x(t+τ)</strong>: Value <InlineMath math="\tau" /> steps ahead</li>
                                <li><strong>x(t+2τ)</strong>: Value <InlineMath math="2\tau" /> steps ahead</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Visualization */}
                <div className="lg:col-span-2">
                    <PhaseSpaceViz signal={signal} tau={tau} isDark={isDark} />
                </div>
            </div>
        </Section>
    );
};

export default InteractivePipeline;
