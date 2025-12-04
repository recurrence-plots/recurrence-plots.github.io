import React, { useState, useMemo } from 'react';
import Section from '../components/Section';
import TimeSeriesPlot from '../components/TimeSeriesPlot';
import RecurrencePlotCanvas from '../components/RecurrencePlotCanvas';
import { generateSignal, computeRecurrenceMatrix, computeRQA } from '../utils/signal';
import { Settings, Activity, BarChart2 } from 'lucide-react';

const InteractiveTutorial = () => {
    const [signalType, setSignalType] = useState('sine');
    const [frequency, setFrequency] = useState(0.05);
    const [noiseLevel, setNoiseLevel] = useState(0);
    const [m, setM] = useState(3);
    const [tau, setTau] = useState(1);
    const [threshold, setThreshold] = useState(0.3);
    const [showBinary, setShowBinary] = useState(false);

    const signal = useMemo(() => generateSignal(signalType, 150, frequency, noiseLevel), [signalType, frequency, noiseLevel]);
    const { matrix, binary } = useMemo(() => computeRecurrenceMatrix(signal, m, tau, threshold), [signal, m, tau, threshold]);
    const rqa = useMemo(() => computeRQA(binary), [binary]);

    const signals = [
        { value: 'sine', label: 'Sine Wave' },
        { value: 'noise', label: 'White Noise' },
        { value: 'lorenz', label: 'Lorenz (Chaotic)' },
        { value: 'drift', label: 'Drifting Sine' },
        { value: 'intermittent', label: 'Intermittent' },
        { value: 'quasiperiodic', label: 'Quasi-periodic' },
    ];

    return (
        <Section id="demo" className="bg-slate-50">
            <div className="mb-12 text-center">
                <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Hands-On</span>
                <h2 className="text-4xl font-bold mt-2 mb-4 text-slate-900">Interactive Demo</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Adjust the parameters to see how the recurrence plot changes in real-time.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                {/* Signal Selector */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {signals.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setSignalType(s.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${signalType === s.value
                                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200 ring-offset-2'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Controls & Time Series */}
                    <div className="space-y-8">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity size={18} className="text-blue-600" />
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Time Series</h4>
                            </div>
                            <div className="h-32">
                                <TimeSeriesPlot signal={signal} height={128} />
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Settings size={18} className="text-blue-600" />
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Parameters</h4>
                            </div>

                            <div className="space-y-6">
                                {/* Signal Params */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex justify-between text-xs font-medium mb-2 text-slate-500">
                                            <span>Frequency</span>
                                            <span className="font-mono text-slate-900">{frequency.toFixed(3)}</span>
                                        </div>
                                        <input type="range" min="0.01" max="0.15" step="0.005" value={frequency}
                                            onChange={(e) => setFrequency(parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-medium mb-2 text-slate-500">
                                            <span>Noise</span>
                                            <span className="font-mono text-slate-900">{(noiseLevel * 100).toFixed(0)}%</span>
                                        </div>
                                        <input type="range" min="0" max="0.5" step="0.05" value={noiseLevel}
                                            onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-slate-200" />

                                {/* Embedding Params */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-medium mb-2 text-slate-500">
                                            <span>Dimension (m)</span>
                                            <span className="font-mono text-purple-600 font-bold">{m}</span>
                                        </div>
                                        <input type="range" min="1" max="10" step="1" value={m}
                                            onChange={(e) => setM(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-medium mb-2 text-slate-500">
                                            <span>Time lag (τ)</span>
                                            <span className="font-mono text-purple-600 font-bold">{tau}</span>
                                        </div>
                                        <input type="range" min="1" max="15" step="1" value={tau}
                                            onChange={(e) => setTau(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-medium mb-2 text-slate-500">
                                            <span>Threshold (ε)</span>
                                            <span className="font-mono text-purple-600 font-bold">{threshold.toFixed(2)}</span>
                                        </div>
                                        <input type="range" min="0.1" max="1" step="0.05" value={threshold}
                                            onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: RP & Metrics */}
                    <div className="space-y-8">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-6">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recurrence Plot</h4>
                                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                                    <button onClick={() => setShowBinary(false)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!showBinary ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                                        Distance
                                    </button>
                                    <button onClick={() => setShowBinary(true)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${showBinary ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                                        Binary
                                    </button>
                                </div>
                            </div>

                            <RecurrencePlotCanvas matrix={matrix} binary={binary} size={300} showBinary={showBinary} />

                            <p className="text-xs text-slate-400 text-center mt-4 font-medium">
                                {showBinary ? 'Black = recurrence (d < ε)' : 'Darker = closer states'} · <span className="text-red-400">Red dashed = LOI</span>
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart2 size={18} className="text-blue-600" />
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">RQA Metrics</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="text-2xl font-bold text-blue-600">{(rqa.RR * 100).toFixed(1)}%</div>
                                    <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">RR</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="text-2xl font-bold text-green-600">{(rqa.DET * 100).toFixed(1)}%</div>
                                    <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">DET</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="text-2xl font-bold text-purple-600">{(rqa.LAM * 100).toFixed(1)}%</div>
                                    <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">LAM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default InteractiveTutorial;
