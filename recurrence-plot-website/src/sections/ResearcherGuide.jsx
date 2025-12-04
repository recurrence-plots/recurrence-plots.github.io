import React from 'react';
import Section from '../components/Section';
import Accordion from '../components/Accordion';
import { BookOpen } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const ResearcherGuide = () => {
    const items = [
        {
            title: "Why Recurrence Plots? (vs. Linear Methods)",
            content: (
                <div className="space-y-4">
                    <p>
                        Traditional linear methods like <strong>Fourier Transform (FFT)</strong> or <strong>Auto-Correlation</strong> are excellent for analyzing stationary, periodic signals. However, biological systems (like the brain) are inherently <strong>non-linear, non-stationary, and chaotic</strong>.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Stationarity:</strong> Linear methods assume statistical properties (mean, variance) remain constant. Brain dynamics shift rapidly between states.
                        </li>
                        <li>
                            <strong>Chaos:</strong> Linear methods treat irregularity as "noise". Recurrence plots reveal the hidden deterministic structure within this "noise".
                        </li>
                        <li>
                            <strong>Phase Space:</strong> RPs visualize the trajectory in phase space, preserving the full dynamical invariant of the system, which is lost in simple frequency analysis.
                        </li>
                    </ul>
                </div>
            )
        },
        {
            title: "Mathematical Foundation: Takens' Theorem",
            content: (
                <div className="space-y-4">
                    <p>
                        The core mathematical justification comes from <strong>Takens' Embedding Theorem (1981)</strong>. It states that we can reconstruct a topologically equivalent phase space from a single observed time series <InlineMath math="x(t)" />.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto my-4">
                        <BlockMath math="\vec{v}_i = [x_i, x_{i+\tau}, x_{i+2\tau}, ..., x_{i+(m-1)\tau}]" />
                    </div>
                    <p>
                        This delay-coordinate map is a diffeomorphism (smooth, invertible map) on the underlying attractor, meaning the topological properties (like fractal dimension, Lyapunov exponents) are preserved in our reconstruction.
                    </p>
                </div>
            )
        },
        {
            title: "Choosing Parameters: m and τ",
            content: (
                <div className="space-y-4">
                    <p>
                        Correct reconstruction depends on two critical parameters. If chosen incorrectly, the structure is distorted.
                    </p>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">1. Time Delay (<InlineMath math="\tau" />)</h4>
                        <p className="mb-2">
                            Determined using <strong>Average Mutual Information (AMI)</strong>. We choose the first local minimum of the AMI function.
                        </p>
                        <ul className="list-disc pl-5 text-sm">
                            <li>Too small: Coordinates are correlated, trajectory is flattened along diagonal.</li>
                            <li>Too large: Dynamics are disconnected, structure is lost.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">2. Embedding Dimension (<InlineMath math="m" />)</h4>
                        <p className="mb-2">
                            Determined using <strong>False Nearest Neighbors (FNN)</strong>. We increase <InlineMath math="m" /> until the percentage of false neighbors drops to zero.
                        </p>
                        <ul className="list-disc pl-5 text-sm">
                            <li>Too small: Trajectory intersects itself (projection overlap).</li>
                            <li>Too large: Adds computational cost and noise sensitivity.</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            title: "Research Applications & Utility",
            content: (
                <div className="space-y-4">
                    <p>
                        Beyond MCI detection, Recurrence Quantification Analysis (RQA) is a powerful tool for any researcher dealing with complex time series data.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white border border-slate-200 p-3 rounded-lg">
                            <h5 className="font-bold text-blue-600">Physiology</h5>
                            <p className="text-sm">Heart rate variability (HRV), EEG analysis, gait dynamics.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-3 rounded-lg">
                            <h5 className="font-bold text-teal-600">Engineering</h5>
                            <p className="text-sm">Fault detection in rotating machinery, chemical reactor stability.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-3 rounded-lg">
                            <h5 className="font-bold text-indigo-600">Climate</h5>
                            <p className="text-sm">El Niño prediction, paleoclimate transitions.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-3 rounded-lg">
                            <h5 className="font-bold text-purple-600">Finance</h5>
                            <p className="text-sm">Stock market crash prediction, regime switching.</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <Section id="guide" className="bg-slate-50">
            <div className="text-center mb-12">
                <span className="text-purple-600 font-medium text-sm uppercase tracking-wider">For Researchers</span>
                <h2 className="text-4xl font-bold mt-2 mb-4 text-slate-900">Deep Dive</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Understanding the mathematical and theoretical underpinnings of Phase Space Reconstruction.
                </p>
            </div>

            <Accordion items={items} />

            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-100 text-sm">
                    <BookOpen size={16} />
                    <span>Recommended Reading: Marwan et al. (2007) "Recurrence plots for the analysis of complex systems"</span>
                </div>
            </div>
        </Section>
    );
};

export default ResearcherGuide;
