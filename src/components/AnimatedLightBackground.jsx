import React, { useEffect, useRef } from 'react';

const AnimatedLightBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Responsive particle count setup
        const connectionDistance = 150;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const numParticles = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 100);
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 2 + 1.0
                });
            }
        };

        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particleColor = 'rgba(99, 102, 241, 0.4)'; // Indigo-500 with higher opacity
            const lineColor = 'rgba(99, 102, 241, ';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Keep bounded
                p.x = Math.max(0, Math.min(canvas.width, p.x));
                p.y = Math.max(0, Math.min(canvas.height, p.y));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        const opacity = 1 - (distance / connectionDistance);
                        // Make line lighter than particles
                        ctx.strokeStyle = `${lineColor}${opacity * 0.10})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden block dark:hidden z-0">
            {/* Soft AI-themed gradient backing base */}
            <div className="absolute inset-0 bg-slate-50 opacity-95"></div>

            {/* Animated Floating Glow Orbs for depth */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply animate-float animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/20 blur-[120px] rounded-full mix-blend-multiply animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-cyan-400/20 blur-[100px] rounded-full mix-blend-multiply animate-float" style={{ animationDelay: '4s' }}></div>

            {/* 3D Neural Network connecting particle lines */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-90"
            />
        </div>
    );
};

export default AnimatedLightBackground;
