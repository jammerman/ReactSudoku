import React, { useEffect, useRef } from "react";
/**
 * Click the button to fire 500 confetti squares from above the window.
 * Uses canvas + requestAnimationFrame for smooth performance.
 */
export default function ConfettiButton() {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const particlesRef = useRef([]);
    const runningRef = useRef(false);
    const lastTimeRef = useRef(0);
    const COLORS = [
        "#e6194B", "#3cb44b", "#ffe119", "#0082c8", "#f58231",
        "#911eb4", "#46f0f0", "#f032e6", "#d2f53c", "#fabebe",
        "#008080", "#e6beff", "#aa6e28", "#fffac8", "#800000",
        "#aaffc3", "#808000", "#ffd8b1", "#000080", "#808080"
    ];
    // Fullscreen, crisp canvas on HiDPI
    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const { innerWidth: cssW, innerHeight: cssH } = window;
        canvas.style.width = cssW + "px";
        canvas.style.height = cssH + "px";
        canvas.style.zIndex = 9999;
        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);
    const spawnParticles = (count = 500) => {
        const { innerWidth: W } = window;
        const particles = [];
        for (let i = 0; i < count; i++) {
            const size = 3 + Math.random() * 6; // square size (px)
            particles.push({
                x: Math.random() * W,              // anywhere across screen
                y: -20 - Math.random() * 120,      // start above viewport
                vx: (Math.random() - 0.5) * 80,    // horizontal drift
                vy: 60 + Math.random() * 220,      // downward speed
                ax: (Math.random() - 0.5) * 10,    // gentle horizontal accel (wind wiggle)
                ay: 120,                            // gravity
                angle: Math.random() * Math.PI,    // rotation
                angVel: (Math.random() - 0.5) * 4, // rotation speed
                size,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                // Optional: slight per-particle air resistance
                drag: 0.0005 + Math.random() * 0.0015,
            });
        }
        particlesRef.current = particles;
    };
    const step = (ts) => {
        if (!runningRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = window.innerWidth;
        const H = window.innerHeight;
        const last = lastTimeRef.current || ts;
        const dt = Math.min(0.033, (ts - last) / 1000); // clamp dt for stability
        lastTimeRef.current = ts;
        ctx.clearRect(0, 0, W, H);
        const particles = particlesRef.current;
        // Animate each particle
        for (let p of particles) {
            // Update velocity with gravity and a tiny wind wiggle
            p.vx += p.ax * dt;
            p.vy += p.ay * dt;
            // Air resistance (very slight)
            p.vx *= 1 - p.drag;
            p.vy *= 1 - p.drag * 0.5;
            // Update position
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            // Rotate
            p.angle += p.angVel * dt;
            // Draw square (rotated)
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            const s = p.size;
            ctx.fillRect(-s / 2, -s / 2, s, s);
            ctx.restore();
        }
        // Cull off-screen particles to end animation
        particlesRef.current = particles.filter(
            (p) => p.y < H + p.size && p.x > -50 && p.x < W + 50
        );
        if (particlesRef.current.length > 0) {
            rafRef.current = requestAnimationFrame(step);
        } else {
            // Stop when all confetti have fallen
            runningRef.current = false;
            ctx.clearRect(0, 0, W, H);
        }
    };
    const fire = () => {
        // If already running, restart with fresh batch
        runningRef.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        spawnParticles(500);
        lastTimeRef.current = 0;
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(step);
    };
    useEffect(() => {
        // Cleanup on unmount
        return () => {
            runningRef.current = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);
    return (
       <>
           <button
                onClick={fire}
                style={{
                    position: "relative",
                    zIndex: 2,
                    padding: "0.6rem 1rem",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                }}
           >
                🎉 Drop Confetti
           </button>
           <canvas
                ref={canvasRef}
                aria-hidden
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none", // let clicks pass through
                }}
            />
       </>
    );
}
