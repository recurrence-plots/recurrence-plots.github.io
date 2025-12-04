import React, { useState, useEffect, useMemo } from 'react';

// ============================================
// SIGNAL GENERATION
// ============================================

const generateSignal = (type, length = 150, frequency = 0.05, noiseLevel = 0) => {
  const t = Array.from({ length }, (_, i) => i);
  let signal;
  
  switch (type) {
    case 'sine':
      signal = t.map(i => Math.sin(2 * Math.PI * frequency * i));
      break;
    case 'noise':
      signal = t.map(() => (Math.random() - 0.5) * 2);
      break;
    case 'lorenz':
      signal = generateLorenz(length);
      break;
    case 'drift':
      signal = t.map(i => Math.sin(2 * Math.PI * frequency * i) + i * 0.015);
      break;
    case 'intermittent':
      signal = generateIntermittent(length);
      break;
    case 'quasiperiodic':
      signal = t.map(i => Math.sin(2 * Math.PI * 0.05 * i) + Math.sin(2 * Math.PI * 0.05 * 1.414 * i));
      break;
    case 'fmri_healthy':
      signal = t.map(i => Math.sin(0.03 * i) * 0.5 + Math.sin(0.08 * i) * 0.3 + (Math.random() - 0.5) * 0.15);
      break;
    case 'fmri_mci':
      signal = t.map(i => Math.sin(0.03 * i + Math.random() * 0.3) * 0.4 + (Math.random() - 0.5) * 0.5);
      break;
    default:
      signal = t.map(i => Math.sin(2 * Math.PI * frequency * i));
  }
  
  if (noiseLevel > 0) {
    signal = signal.map(v => v + (Math.random() - 0.5) * 2 * noiseLevel);
  }
  return signal;
};

const generateLorenz = (n) => {
  const sigma = 10, rho = 28, beta = 8/3, dt = 0.01;
  let x = 1, y = 1, z = 1;
  const result = [];
  for (let i = 0; i < n * 10; i++) {
    x += sigma * (y - x) * dt;
    y += (x * (rho - z) - y) * dt;
    z += (x * y - beta * z) * dt;
    if (i % 10 === 0) result.push(x);
  }
  const min = Math.min(...result), max = Math.max(...result);
  return result.map(v => (v - min) / (max - min) * 2 - 1);
};

const generateIntermittent = (n) => {
  const result = [];
  let phase = 'laminar', counter = 0;
  for (let i = 0; i < n; i++) {
    if (phase === 'laminar') {
      result.push(0.5 + (Math.random() - 0.5) * 0.05);
      if (++counter > 30 && Math.random() > 0.95) { phase = 'burst'; counter = 0; }
    } else {
      result.push((Math.random() - 0.5) * 2);
      if (++counter > 10 && Math.random() > 0.8) { phase = 'laminar'; counter = 0; }
    }
  }
  return result;
};

// ============================================
// RECURRENCE MATRIX
// ============================================

const computeRecurrenceMatrix = (signal, m = 3, tau = 1, threshold = 0.3) => {
  const n = signal.length - (m - 1) * tau;
  if (n <= 0) return { matrix: [], binary: [] };
  
  const vectors = [];
  for (let i = 0; i < n; i++) {
    const vec = [];
    for (let j = 0; j < m; j++) vec.push(signal[i + j * tau]);
    vectors.push(vec);
  }
  
  const matrix = [];
  let maxDist = 0;
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      let dist = 0;
      for (let k = 0; k < m; k++) dist += Math.pow(vectors[i][k] - vectors[j][k], 2);
      dist = Math.sqrt(dist);
      row.push(dist);
      if (dist > maxDist) maxDist = dist;
    }
    matrix.push(row);
  }
  
  const eps = threshold * maxDist * 0.5;
  const binary = matrix.map(row => row.map(d => d <= eps ? 1 : 0));
  return { matrix, binary, maxDist };
};

// ============================================
// RQA METRICS
// ============================================

const computeRQA = (binary) => {
  const n = binary.length;
  if (n === 0) return { RR: 0, DET: 0, LAM: 0 };
  
  let recCount = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) recCount += binary[i][j];
  const RR = recCount / (n * n);
  
  const diagLengths = [];
  for (let k = 1; k < n; k++) {
    let len = 0;
    for (let i = 0; i < n - k; i++) {
      if (binary[i][i + k] === 1) len++;
      else { if (len > 1) diagLengths.push(len); len = 0; }
    }
    if (len > 1) diagLengths.push(len);
  }
  const diagSum = diagLengths.reduce((a, b) => a + b, 0);
  const DET = recCount > 0 ? Math.min(diagSum / recCount, 1) : 0;
  
  const vertLengths = [];
  for (let j = 0; j < n; j++) {
    let len = 0;
    for (let i = 0; i < n; i++) {
      if (binary[i][j] === 1) len++;
      else { if (len > 1) vertLengths.push(len); len = 0; }
    }
    if (len > 1) vertLengths.push(len);
  }
  const vertSum = vertLengths.reduce((a, b) => a + b, 0);
  const LAM = recCount > 0 ? Math.min(vertSum / recCount, 1) : 0;
  
  return { RR, DET, LAM };
};

// ============================================
// COMPONENTS
// ============================================

const TimeSeriesPlot = ({ signal, color = '#3b82f6', height = 100 }) => {
  const width = 400;
  const pad = 20;
  const min = Math.min(...signal), max = Math.max(...signal), range = max - min || 1;
  
  const points = signal.map((v, i) => {
    const x = pad + (i / (signal.length - 1)) * (width - 2 * pad);
    const y = pad + (1 - (v - min) / range) * (height - 2 * pad);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="w-full">
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#e5e7eb" />
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#e5e7eb" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
      <text x={width / 2} y={height - 4} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 10 }}>Time</text>
    </svg>
  );
};

const RecurrencePlotCanvas = ({ matrix, size = 250, showBinary = false, binary = [] }) => {
  const canvasRef = React.useRef(null);
  
  useEffect(() => {
    if (!matrix.length || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const n = matrix.length;
    const cellSize = size / n;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    
    if (showBinary && binary.length) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (binary[i][j] === 1) {
            ctx.fillStyle = '#1e3a5f';
            ctx.fillRect(j * cellSize, i * cellSize, Math.max(cellSize, 1), Math.max(cellSize, 1));
          }
        }
      }
    } else {
      let maxD = 0;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (matrix[i][j] > maxD) maxD = matrix[i][j];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const gray = Math.floor((1 - matrix[i][j] / maxD) * 255);
          ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
          ctx.fillRect(j * cellSize, i * cellSize, cellSize + 1, cellSize + 1);
        }
      }
    }
    
    // LOI
    ctx.strokeStyle = 'rgba(239,68,68,0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.stroke();
  }, [matrix, binary, size, showBinary]);
  
  return <canvas ref={canvasRef} width={size} height={size} className="rounded-lg border border-gray-200" />;
};

const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <span 
        className="border-b border-dashed border-blue-400 text-blue-600 cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg w-64 z-50">
          {content}
        </div>
      )}
    </span>
  );
};

// ============================================
// MAIN DEMO
// ============================================

const InteractiveDemo = () => {
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
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      {/* Signal selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {signals.map(s => (
          <button
            key={s.value}
            onClick={() => setSignalType(s.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              signalType === s.value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Time Series</h4>
            <TimeSeriesPlot signal={signal} height={100} />
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Signal Parameters</h4>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Frequency</span>
                <span className="font-mono">{frequency.toFixed(3)}</span>
              </div>
              <input type="range" min="0.01" max="0.15" step="0.005" value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Noise</span>
                <span className="font-mono">{(noiseLevel * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0" max="0.5" step="0.05" value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Embedding Parameters</h4>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Dimension (m)</span>
                <span className="font-mono text-purple-600">{m}</span>
              </div>
              <input type="range" min="1" max="10" step="1" value={m}
                onChange={(e) => setM(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Time lag (τ)</span>
                <span className="font-mono text-purple-600">{tau}</span>
              </div>
              <input type="range" min="1" max="15" step="1" value={tau}
                onChange={(e) => setTau(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Threshold (ε)</span>
                <span className="font-mono text-purple-600">{threshold.toFixed(2)}</span>
              </div>
              <input type="range" min="0.1" max="1" step="0.05" value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Right: RP + RQA */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Recurrence Plot</h4>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button onClick={() => setShowBinary(false)}
                  className={`px-3 py-1 text-xs rounded-md ${!showBinary ? 'bg-white shadow' : ''}`}>
                  Distance
                </button>
                <button onClick={() => setShowBinary(true)}
                  className={`px-3 py-1 text-xs rounded-md ${showBinary ? 'bg-white shadow' : ''}`}>
                  Binary
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <RecurrencePlotCanvas matrix={matrix} binary={binary} size={280} showBinary={showBinary} />
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              {showBinary ? 'Black = recurrence (d < ε)' : 'Darker = closer states'} · Red dashed = LOI
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">RQA Metrics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{(rqa.RR * 100).toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Recurrence Rate</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl">
                <div className="text-2xl font-bold text-green-600">{(rqa.DET * 100).toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Determinism</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{(rqa.LAM * 100).toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Laminarity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TYPOLOGY GALLERY
// ============================================

const TypologyGallery = () => {
  const types = [
    { type: 'noise', name: 'Homogeneous', desc: 'Stationary, random process', interp: 'No structure, states don\'t persist', bg: 'bg-blue-50' },
    { type: 'sine', name: 'Periodic', desc: 'Regular oscillations', interp: 'Diagonal lines reveal period', bg: 'bg-green-50' },
    { type: 'drift', name: 'Drift', desc: 'Non-stationary, trending', interp: 'Fading corners = parameter change', bg: 'bg-amber-50' },
    { type: 'intermittent', name: 'Disrupted', desc: 'Regime transitions', interp: 'White bands = rare states', bg: 'bg-red-50' },
  ];
  
  return (
    <div className="grid grid-cols-4 gap-6">
      {types.map(t => {
        const sig = generateSignal(t.type, 120);
        const { matrix, binary } = computeRecurrenceMatrix(sig, 3, 1, 0.4);
        return (
          <div key={t.name} className="text-center">
            <div className={`${t.bg} rounded-2xl p-4 mb-4 inline-block`}>
              <RecurrencePlotCanvas matrix={matrix} binary={binary} size={160} showBinary={true} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{t.name}</h4>
            <p className="text-sm text-gray-500 mb-1">{t.desc}</p>
            <p className="text-xs text-gray-400">{t.interp}</p>
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// INTERPRETATION TABLE
// ============================================

const InterpretationTable = () => {
  const rows = [
    { obs: 'Homogeneity', interp: 'Process is stationary' },
    { obs: 'Fading corners', interp: 'Non-stationarity, drift or trend' },
    { obs: 'White bands', interp: 'Rare states or transitions' },
    { obs: 'Periodic/checkerboard', interp: 'Cyclicities present' },
    { obs: 'Single isolated points', interp: 'Heavy fluctuation, random' },
    { obs: 'Diagonal lines (∥ LOI)', interp: 'Deterministic evolution' },
    { obs: 'Vertical/horizontal lines', interp: 'Laminar states, trapped' },
  ];
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">Observation</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Interpretation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-3 text-sm text-gray-900">{r.obs}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{r.interp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// BRAIN COMPARISON
// ============================================

const BrainComparison = () => {
  const healthy = useMemo(() => generateSignal('fmri_healthy', 150), []);
  const mci = useMemo(() => generateSignal('fmri_mci', 150), []);
  const { matrix: hMatrix } = useMemo(() => computeRecurrenceMatrix(healthy, 5, 2, 0.4), [healthy]);
  const { matrix: mMatrix } = useMemo(() => computeRecurrenceMatrix(mci, 5, 2, 0.4), [mci]);
  
  return (
    <div className="grid grid-cols-2 gap-12">
      <div className="text-center">
        <div className="bg-green-50 rounded-2xl p-6 mb-4 inline-block">
          <RecurrencePlotCanvas matrix={hMatrix} size={260} />
        </div>
        <h3 className="text-xl font-bold mb-3">Healthy Control</h3>
        <ul className="text-sm text-gray-600 space-y-2 text-left max-w-xs mx-auto">
          <li className="flex gap-2"><span className="text-green-500">●</span>Shorter, thinner diagonal lines</li>
          <li className="flex gap-2"><span className="text-green-500">●</span>Sharper box-like structures</li>
          <li className="flex gap-2"><span className="text-green-500">●</span>Greater modularity</li>
        </ul>
      </div>
      <div className="text-center">
        <div className="bg-red-50 rounded-2xl p-6 mb-4 inline-block">
          <RecurrencePlotCanvas matrix={mMatrix} size={260} />
        </div>
        <h3 className="text-xl font-bold mb-3">MCI Patient</h3>
        <ul className="text-sm text-gray-600 space-y-2 text-left max-w-xs mx-auto">
          <li className="flex gap-2"><span className="text-red-500">●</span>Longer, thicker diagonal lines</li>
          <li className="flex gap-2"><span className="text-red-500">●</span>Smoother box-like structures</li>
          <li className="flex gap-2"><span className="text-red-500">●</span>Slow transitions</li>
        </ul>
      </div>
    </div>
  );
};

// ============================================
// EMBEDDING VISUALIZATION
// ============================================

const EmbeddingViz = () => {
  const [showLatent, setShowLatent] = useState(false);
  
  const rqaPoints = [
    { x: -1.5, y: 0.8, c: 'HC' }, { x: -1.2, y: 0.3, c: 'HC' }, { x: -0.8, y: 1.2, c: 'HC' },
    { x: -1.0, y: -0.5, c: 'HC' }, { x: -0.4, y: 0.1, c: 'HC' }, { x: 0.1, y: -0.1, c: 'HC' },
    { x: 0.3, y: -0.8, c: 'MCI' }, { x: 0.8, y: -0.3, c: 'MCI' }, { x: -0.2, y: 0.2, c: 'MCI' },
    { x: 1.2, y: 0.5, c: 'MCI' }, { x: -0.6, y: -0.3, c: 'MCI' }, { x: 0.2, y: 0.4, c: 'MCI' },
  ];
  
  const latentPoints = [
    { x: -2.8, y: 1.0, c: 'HC' }, { x: -2.5, y: 0.6, c: 'HC' }, { x: -2.9, y: 1.3, c: 'HC' },
    { x: -2.6, y: 0.9, c: 'HC' }, { x: -2.4, y: 0.4, c: 'HC' }, { x: -2.7, y: 1.1, c: 'HC' },
    { x: 2.5, y: -0.8, c: 'MCI' }, { x: 2.8, y: -0.4, c: 'MCI' }, { x: 2.3, y: -1.1, c: 'MCI' },
    { x: 2.6, y: -0.6, c: 'MCI' }, { x: 2.9, y: -0.9, c: 'MCI' }, { x: 2.4, y: -0.3, c: 'MCI' },
  ];
  
  const points = showLatent ? latentPoints : rqaPoints;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setShowLatent(false)}
            className={`px-5 py-2 rounded-lg text-sm font-medium ${!showLatent ? 'bg-white shadow' : 'text-gray-500'}`}>
            RQA Features
          </button>
          <button onClick={() => setShowLatent(true)}
            className={`px-5 py-2 rounded-lg text-sm font-medium ${showLatent ? 'bg-white shadow' : 'text-gray-500'}`}>
            Autoencoder Embeddings
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-6">
        <svg viewBox="-4 -2 8 4" className="w-full h-64">
          <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#e5e7eb" strokeWidth="0.02" />
          <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#e5e7eb" strokeWidth="0.02" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={-p.y} r={0.15}
              fill={p.c === 'HC' ? '#22c55e' : '#ef4444'}
              className="transition-all duration-500"
            />
          ))}
        </svg>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">MCI</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${showLatent ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {showLatent ? '✓ Clear separation → 93% accuracy' : '⚠ Overlapping clusters'}
        </div>
      </div>
    </div>
  );
};

// ============================================
// RESULTS TABLE
// ============================================

const ResultsTable = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 bg-gray-50 border-b">
      <h4 className="font-semibold">Classification Results by Brain Network</h4>
      <p className="text-sm text-gray-500">ADNI dataset, n=100 (50 HC, 50 MCI)</p>
    </div>
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Network</th>
          <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Accuracy</th>
          <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Precision</th>
          <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Recall</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {[
          { n: 'Cerebellum', a: '93.33%', p: '0.89', r: '1.00', best: true },
          { n: 'Cingulo-Opercular', a: '92.86%', p: '1.00', r: '0.83' },
          { n: 'Sensorimotor', a: '92.86%', p: '0.87', r: '1.00' },
          { n: 'Default Mode', a: '92.31%', p: '0.83', r: '1.00' },
          { n: 'Frontoparietal', a: '85.71%', p: '1.00', r: '0.80' },
          { n: 'Occipital', a: '78.57%', p: '0.71', r: '0.83' },
        ].map(row => (
          <tr key={row.n} className={row.best ? 'bg-green-50' : ''}>
            <td className="px-6 py-3 text-sm">{row.n}</td>
            <td className={`px-6 py-3 text-sm text-center font-semibold ${row.best ? 'text-green-600' : ''}`}>{row.a}</td>
            <td className="px-6 py-3 text-sm text-center text-gray-600">{row.p}</td>
            <td className="px-6 py-3 text-sm text-center text-gray-600">{row.r}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============================================
// MAIN APP
// ============================================

export default function RecurrencePlotApp() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-semibold">Recurrence Plots</div>
          <div className="flex gap-4 text-sm">
            {['Definition', 'Demo', 'Typology', 'Brain Data'].map(s => (
              <a key={s} href={`#${s.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-gray-900">{s}</a>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-20">
        <div className="text-center max-w-3xl mx-auto px-6">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            Interactive Tutorial
          </span>
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            Recurrence Plots<br />At A Glance
          </h1>
          <p className="text-xl text-gray-500 mb-8">
            Visualize when dynamical systems revisit previous states.<br />
            Applied here to detect Mild Cognitive Impairment from fMRI.
          </p>
          <p className="text-gray-400 mb-8">Ninad Aithal · Centre for Brain Research, IISc Bengaluru</p>
          <a href="#definition" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800">
            Start Learning ↓
          </a>
        </div>
      </section>
      
      {/* Definition */}
      <section id="definition" className="py-24 max-w-4xl mx-auto px-6">
        <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Fundamentals</span>
        <h2 className="text-4xl font-bold mt-2 mb-6">What is a Recurrence Plot?</h2>
        <p className="text-lg text-gray-600 mb-8">
          A <Tooltip content="Introduced by Eckmann, Kamphorst & Ruelle in 1987">recurrence plot</Tooltip> (RP) 
          visualizes when a <Tooltip content="Multi-dimensional space of system state variables">phase space</Tooltip> trajectory 
          returns to previously visited regions. It reveals hidden structure in time series that linear methods miss.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8">
          <h3 className="text-lg font-semibold text-center mb-4">Mathematical Definition</h3>
          <div className="text-center font-mono text-xl mb-4 bg-white/50 rounded-xl py-4">
            R<sub>i,j</sub> = Θ(ε − ‖x⃗<sub>i</sub> − x⃗<sub>j</sub>‖)
          </div>
          <div className="grid grid-cols-4 gap-3 text-sm text-center">
            <div className="bg-white/60 rounded-xl p-3">
              <div className="font-mono text-blue-600">N</div>
              <div className="text-gray-600 text-xs">States</div>
            </div>
            <div className="bg-white/60 rounded-xl p-3">
              <div className="font-mono text-blue-600">ε</div>
              <div className="text-gray-600 text-xs">Threshold</div>
            </div>
            <div className="bg-white/60 rounded-xl p-3">
              <div className="font-mono text-blue-600">‖·‖</div>
              <div className="text-gray-600 text-xs">Norm</div>
            </div>
            <div className="bg-white/60 rounded-xl p-3">
              <div className="font-mono text-blue-600">Θ</div>
              <div className="text-gray-600 text-xs">Heaviside</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Demo */}
      <section id="demo" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Hands-On</span>
          <h2 className="text-4xl font-bold mt-2 mb-8">Interactive Demo</h2>
          <InteractiveDemo />
        </div>
      </section>
      
      {/* Typology */}
      <section id="typology" className="py-24 max-w-5xl mx-auto px-6">
        <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Large-Scale Patterns</span>
        <h2 className="text-4xl font-bold mt-2 mb-4">Typology</h2>
        <p className="text-lg text-gray-600 mb-8">
          Global patterns that characterize the overall dynamics (Eckmann et al., 1987).
        </p>
        <TypologyGallery />
      </section>
      
      {/* Interpretation */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Reference</span>
          <h2 className="text-4xl font-bold mt-2 mb-8">Interpretation Guide</h2>
          <InterpretationTable />
        </div>
      </section>
      
      {/* Embeddings */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Innovation</span>
        <h2 className="text-4xl font-bold mt-2 mb-4">From Plots to Embeddings</h2>
        <p className="text-lg text-gray-600 mb-8">
          Traditional RQA uses hand-crafted features. We use a CNN autoencoder to learn discriminative embeddings directly from the RP images.
        </p>
        <EmbeddingViz />
      </section>
      
      {/* Brain Data */}
      <section id="brain-data" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Application</span>
          <h2 className="text-4xl font-bold mt-2 mb-4">Detecting MCI from Brain Dynamics</h2>
          <p className="text-lg text-gray-600 mb-12">
            Resting-state fMRI from ADNI dataset (100 subjects). Dosenbach atlas with 160 ROIs across 6 networks.
          </p>
          <BrainComparison />
          <div className="mt-12">
            <ResultsTable />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">© 2024 Ninad Aithal · IISc Bengaluru</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="https://tinyurl.com/ycyhka6m" className="text-gray-500 hover:text-gray-900">GitHub</a>
            <a href="https://arxiv.org/abs/2311.18265" className="text-gray-500 hover:text-gray-900">Paper</a>
            <a href="http://www.recurrence-plot.tk" className="text-gray-500 hover:text-gray-900">RP Reference</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
