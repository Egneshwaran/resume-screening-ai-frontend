import React, { useEffect, useRef } from 'react';

const AnimatedDarkBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width, height;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        let time = 0;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            const fov = 350;
            const cols = 50;
            const rows = 35;
            const xSpace = width / cols * 1.5;
            const zSpace = 40;

            const gridLines = [];

            for (let z = 0; z < rows; z++) {
                gridLines[z] = [];
                for (let x = 0; x < cols; x++) {
                    let pX = (x - cols / 2) * xSpace;
                    // Move the wave to simulate forward motion
                    let rawZ = z * zSpace - (time * 15) % zSpace;
                    let pZ = rawZ > 0 ? rawZ : rawZ + rows * zSpace;

                    // Holographic AI mathematical wave
                    let pY = Math.sin(pX * 0.005 + time * 1.5) * 40 + Math.cos(pZ * 0.01 + time * 1.5) * 40 + 150;

                    if (pZ < 1) pZ = 1;
                    let scale = fov / (fov + pZ);
                    let screenX = pX * scale + width / 2;
                    let screenY = pY * scale + height / 2 + 100; // Shift down slightly

                    let radius = 1.2 * scale;
                    if (radius < 0) radius = 0;

                    // Calculate distance-based fade out
                    const depth = pZ / (rows * zSpace);
                    const opacity = Math.max(0, 1 - depth);

                    gridLines[z].push({ x: screenX, y: screenY, op: opacity });

                    // Draw data nodes
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(168, 85, 247, ${opacity * 0.9})`; // Cyber purple dots
                    ctx.fill();
                }
            }

            // Draw holographic connecting lines
            ctx.lineWidth = 0.5;
            for (let z = 0; z < rows; z++) {
                for (let x = 0; x < cols - 1; x++) {
                    const p1 = gridLines[z][x];
                    const p2 = gridLines[z][x + 1];
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${Math.min(p1.op, p2.op) * 0.3})`; // Cyan circuit links
                    ctx.stroke();
                }
            }

            for (let z = 0; z < rows - 1; z++) {
                for (let x = 0; x < cols; x++) {
                    const p1 = gridLines[z][x];
                    const p2 = gridLines[z + 1][x];
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${Math.min(p1.op, p2.op) * 0.3})`; // Cyan circuit links
                    ctx.stroke();
                }
            }

            time += 0.015;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden hidden dark:block z-0">
            {/* Deep dark AI theme background */}
            <div className="absolute inset-0 bg-[#080c17]"></div>

            {/* Ambient cyber glows */}
            <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-900/10 blur-[150px] rounded-full mix-blend-screen animate-float"></div>

            {/* 3D Wave Grid Hologram */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen"
            />

            {/* Powerful fade-out at the top half so it never clashes with hero text or header */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#080c17] via-[#080c17]/60 to-transparent opacity-100 h-[60vh]"></div>
        </div>
    );
};

export default AnimatedDarkBackground;
