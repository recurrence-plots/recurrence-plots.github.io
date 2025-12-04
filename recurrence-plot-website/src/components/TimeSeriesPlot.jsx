import React from 'react';

const TimeSeriesPlot = ({ signal, color = '#3b82f6', height = 100 }) => {
    const width = 400;
    const pad = 20;
    const min = Math.min(...signal);
    const max = Math.max(...signal);
    const range = max - min || 1;

    const points = signal.map((v, i) => {
        const x = pad + (i / (signal.length - 1)) * (width - 2 * pad);
        const y = pad + (1 - (v - min) / range) * (height - 2 * pad);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#e5e7eb" strokeWidth="1" />
            <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#e5e7eb" strokeWidth="1" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x={width / 2} y={height - 4} textAnchor="middle" className="fill-gray-400 text-[10px] font-sans">Time</text>
        </svg>
    );
};

export default TimeSeriesPlot;
