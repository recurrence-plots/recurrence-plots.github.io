import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Attractor = ({ signal, tau, color = '#4f46e5' }) => {
    const points = useMemo(() => {
        const pts = [];
        // Create 3D embedding: [x(t), x(t+tau), x(t+2tau)]
        // We need enough points. Signal length should be sufficient.
        // Limit points to avoid performance issues if signal is huge.
        const limit = Math.min(signal.length - 2 * tau, 2000);

        for (let i = 0; i < limit; i++) {
            const x = signal[i];
            const y = signal[i + tau];
            const z = signal[i + 2 * tau];
            // Scale for visualization
            pts.push(new THREE.Vector3(x * 2, y * 2, z * 2));
        }
        return pts;
    }, [signal, tau]);

    const ref = useRef();

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={ref}>
            <Line
                points={points}
                color={color}
                lineWidth={2}
                opacity={0.8}
                transparent
            />
        </group>
    );
};

const PhaseSpaceViz = ({ signal, tau, isDark }) => {
    return (
        <div className="w-full h-[400px] bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner relative">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {isDark && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

                <Attractor
                    signal={signal}
                    tau={tau}
                    color={isDark ? '#2dd4bf' : '#4f46e5'} // Teal in dark, Indigo in light
                />

                {/* Axes Helper - custom to look nicer */}
                <gridHelper args={[10, 10, isDark ? '#1e293b' : '#e2e8f0', isDark ? '#0f172a' : '#f1f5f9']} />
            </Canvas>

            <div className="absolute bottom-4 left-4 text-xs font-mono text-slate-400 pointer-events-none">
                <div>x(t) vs x(t+τ) vs x(t+2τ)</div>
                <div>τ = {tau}</div>
            </div>
        </div>
    );
};

export default PhaseSpaceViz;
