import React, { useEffect, useRef } from 'react';

const RecurrencePlotCanvas = ({ matrix, size = 250, showBinary = false, binary = [] }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!matrix.length || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const n = matrix.length;
        const cellSize = size / n;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, size, size);

        if (showBinary && binary.length) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (binary[i][j] === 1) {
                        ctx.fillStyle = '#1e3a5f'; // Dark blue for recurrence
                        ctx.fillRect(j * cellSize, i * cellSize, Math.max(cellSize, 1), Math.max(cellSize, 1));
                    }
                }
            }
        } else {
            let maxD = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (matrix[i][j] > maxD) maxD = matrix[i][j];
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    // Invert distance for visibility: closer = darker
                    const gray = Math.floor((matrix[i][j] / maxD) * 255);
                    ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize + 1, cellSize + 1);
                }
            }
        }

        // LOI (Line of Identity)
        ctx.strokeStyle = 'rgba(239,68,68,0.6)'; // Red
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, size);
        ctx.stroke();
    }, [matrix, binary, size, showBinary]);

    return <canvas ref={canvasRef} width={size} height={size} className="rounded-lg border border-gray-200 shadow-sm" />;
};

export default RecurrencePlotCanvas;
