"use client";

/**
 * AnimatedBackground — Renders one of 10 animated background effects
 * using pure CSS animations for GPU-accelerated performance.
 * 
 * Props:
 *   backgroundId: string — one of the ANIMATED_BACKGROUNDS ids
 *   animationStrength: number 0–1 — controls animation speed/scale
 *   className: string — extra wrapper classes
 */
export default function AnimatedBackground({ 
  backgroundId = "none", 
  animationStrength = 0.6, 
  className = "" 
}) {
  if (!backgroundId || backgroundId === "none") return null;

  const speed = animationStrength > 0 ? (1.2 - animationStrength) : 1;
  const scale = 0.7 + (animationStrength * 0.5);

  const baseStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    overflow: "hidden",
    pointerEvents: "none"
  };

  // ─── Aurora Waves ─────────────────────────────────
  if (backgroundId === "aurora-waves") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0c0a20 0%, #1a0533 50%, #0d0d2b 100%)" }} />
        {[
          { color: "rgba(102,126,234,0.4)", size: 500, x: "15%", y: "20%", delay: 0 },
          { color: "rgba(168,85,247,0.35)", size: 550, x: "60%", y: "30%", delay: 2 },
          { color: "rgba(240,147,251,0.3)", size: 480, x: "40%", y: "70%", delay: 4 },
          { color: "rgba(94,231,223,0.25)", size: 420, x: "80%", y: "60%", delay: 6 }
        ].map((orb, i) => (
          <div
            key={i}
            className="animate-aurora-drift"
            style={{
              position: "absolute",
              left: orb.x,
              top: orb.y,
              width: orb.size * scale,
              height: orb.size * scale,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
              filter: "blur(80px)",
              animationDuration: `${(18 + i * 4) * speed}s`,
              animationDelay: `${orb.delay}s`,
              willChange: "transform",
              mixBlendMode: "screen"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── Floating Orbs ────────────────────────────────
  if (backgroundId === "floating-orbs") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0c0a1a 0%, #1a0533 50%, #0d0d2b 100%)" }} />
        {[
          { color1: "#7c3aed", color2: "#c084fc", size: 140, x: "20%", y: "25%", delay: 0 },
          { color1: "#ec4899", color2: "#f472b6", size: 100, x: "65%", y: "35%", delay: 3 },
          { color1: "#06b6d4", color2: "#22d3ee", size: 120, x: "45%", y: "65%", delay: 1.5 },
          { color1: "#8b5cf6", color2: "#a78bfa", size: 80, x: "80%", y: "70%", delay: 4.5 },
          { color1: "#f43f5e", color2: "#fb7185", size: 60, x: "15%", y: "75%", delay: 2 }
        ].map((orb, i) => (
          <div
            key={i}
            className="animate-orb-float"
            style={{
              position: "absolute",
              left: orb.x,
              top: orb.y,
              width: orb.size * scale,
              height: orb.size * scale,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${orb.color2}, ${orb.color1} 60%, transparent 100%)`,
              boxShadow: `0 0 ${40 * scale}px ${orb.color1}66, inset 0 0 ${20 * scale}px rgba(255,255,255,0.1)`,
              animationDuration: `${(12 + i * 3) * speed}s`,
              animationDelay: `${orb.delay}s`,
              willChange: "transform",
              opacity: 0.7
            }}
          />
        ))}
      </div>
    );
  }

  // ─── Particle Universe ────────────────────────────
  if (backgroundId === "particle-universe") {
    const particles = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 20
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #05050f 0%, #0a0a1f 50%, #050515 100%)" }} />
        {particles.map((p, i) => (
          <div
            key={i}
            className="animate-particle-drift"
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#38bdf8" : "#ffffff",
              boxShadow: `0 0 ${p.size * 3}px ${i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#38bdf8" : "#ffffff"}55`,
              animationDuration: `${p.duration * speed}s`,
              animationDelay: `${p.delay}s`,
              willChange: "transform",
              opacity: 0.6 + Math.random() * 0.4
            }}
          />
        ))}
      </div>
    );
  }

  // ─── Developer Grid ───────────────────────────────
  if (backgroundId === "developer-grid") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "#0a0f0a" }} />
        {/* Grid lines */}
        <div
          className="animate-grid-scroll"
          style={{
            position: "absolute",
            inset: "-50%",
            backgroundImage: `
              linear-gradient(rgba(0,255,136,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,136,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animationDuration: `${40 * speed}s`,
            willChange: "transform"
          }}
        />
        {/* Scanning line */}
        <div
          className="animate-scan-line"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
            boxShadow: "0 0 20px #00ff88, 0 0 60px #00ff8844",
            animationDuration: `${8 * speed}s`,
            willChange: "transform",
            opacity: 0.5
          }}
        />
        {/* Corner glow */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle at 0% 0%, rgba(0,255,136,0.08), transparent 70%)",
          pointerEvents: "none"
        }} />
      </div>
    );
  }

  // ─── Glass Bubbles ────────────────────────────────
  if (backgroundId === "glass-bubbles") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 50%, #e1f5fe 100%)" }} />
        {[
          { size: 200, x: "15%", y: "20%", delay: 0 },
          { size: 150, x: "60%", y: "30%", delay: 2 },
          { size: 180, x: "40%", y: "65%", delay: 1 },
          { size: 120, x: "75%", y: "70%", delay: 3 },
          { size: 90, x: "25%", y: "80%", delay: 4 }
        ].map((bubble, i) => (
          <div
            key={i}
            className="animate-orb-float"
            style={{
              position: "absolute",
              left: bubble.x,
              top: bubble.y,
              width: bubble.size * scale,
              height: bubble.size * scale,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)",
              border: "1px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)",
              boxShadow: "inset 0 0 30px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.05)",
              animationDuration: `${(14 + i * 3) * speed}s`,
              animationDelay: `${bubble.delay}s`,
              willChange: "transform"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── Gradient Mesh ────────────────────────────────
  if (backgroundId === "gradient-mesh") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "#050510" }} />
        {[
          { color: "rgba(99,102,241,0.4)", x: "20%", y: "15%", size: 500, delay: 0 },
          { color: "rgba(236,72,153,0.35)", x: "70%", y: "25%", size: 450, delay: 2 },
          { color: "rgba(14,165,233,0.3)", x: "50%", y: "70%", size: 520, delay: 4 },
          { color: "rgba(168,85,247,0.25)", x: "10%", y: "60%", size: 400, delay: 1 }
        ].map((patch, i) => (
          <div
            key={i}
            className="animate-mesh-morph"
            style={{
              position: "absolute",
              left: patch.x,
              top: patch.y,
              width: patch.size * scale,
              height: patch.size * scale,
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              background: `radial-gradient(circle, ${patch.color}, transparent 70%)`,
              filter: "blur(60px)",
              animationDuration: `${(20 + i * 5) * speed}s`,
              animationDelay: `${patch.delay}s`,
              willChange: "transform",
              mixBlendMode: "screen"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── Liquid Flow ──────────────────────────────────
  if (backgroundId === "liquid-flow") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }} />
        {[
          { color: "rgba(233,69,96,0.35)", x: "30%", y: "20%", size: 350, delay: 0 },
          { color: "rgba(99,102,241,0.3)", x: "60%", y: "50%", size: 400, delay: 3 },
          { color: "rgba(168,85,247,0.25)", x: "20%", y: "70%", size: 300, delay: 1.5 }
        ].map((blob, i) => (
          <div
            key={i}
            className="animate-liquid-morph"
            style={{
              position: "absolute",
              left: blob.x,
              top: blob.y,
              width: blob.size * scale,
              height: blob.size * scale,
              background: `radial-gradient(circle, ${blob.color}, transparent 60%)`,
              filter: "blur(50px)",
              animationDuration: `${(18 + i * 6) * speed}s`,
              animationDelay: `${blob.delay}s`,
              willChange: "transform, border-radius",
              mixBlendMode: "screen"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── Neural Network ───────────────────────────────
  if (backgroundId === "neural-network") {
    const nodes = [
      { x: 15, y: 20 }, { x: 45, y: 15 }, { x: 75, y: 25 },
      { x: 25, y: 50 }, { x: 55, y: 45 }, { x: 85, y: 55 },
      { x: 20, y: 80 }, { x: 50, y: 75 }, { x: 80, y: 80 }
    ];
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)" }} />
        {/* SVG Lines */}
        <svg
          className="animate-neural-pulse"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animationDuration: `${6 * speed}s` }}
        >
          {nodes.map((node, i) =>
            nodes.slice(i + 1).filter((_, j) => j < 3).map((target, j) => (
              <line
                key={`${i}-${j}`}
                x1={`${node.x}%`} y1={`${node.y}%`}
                x2={`${target.x}%`} y2={`${target.y}%`}
                stroke="rgba(139,92,246,0.15)"
                strokeWidth="1"
              />
            ))
          )}
        </svg>
        {/* Nodes */}
        {nodes.map((node, i) => (
          <div
            key={i}
            className="animate-node-pulse"
            style={{
              position: "absolute",
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#8b5cf6",
              boxShadow: "0 0 12px #8b5cf688, 0 0 24px #8b5cf644",
              animationDuration: `${(3 + i * 0.5) * speed}s`,
              animationDelay: `${i * 0.3}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── Northern Lights ──────────────────────────────
  if (backgroundId === "northern-lights") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #020810 0%, #0a1628 40%, #061a14 100%)" }} />
        {[
          { color: "rgba(34,197,94,0.2)", y: "20%", delay: 0, height: 200 },
          { color: "rgba(6,182,212,0.18)", y: "30%", delay: 2, height: 180 },
          { color: "rgba(168,85,247,0.15)", y: "25%", delay: 4, height: 160 },
          { color: "rgba(34,197,94,0.12)", y: "35%", delay: 1, height: 220 }
        ].map((band, i) => (
          <div
            key={i}
            className="animate-aurora-wave"
            style={{
              position: "absolute",
              left: "-20%",
              top: band.y,
              width: "140%",
              height: band.height * scale,
              background: `linear-gradient(180deg, transparent, ${band.color}, transparent)`,
              filter: "blur(40px)",
              animationDuration: `${(12 + i * 4) * speed}s`,
              animationDelay: `${band.delay}s`,
              willChange: "transform",
              transformOrigin: "center"
            }}
          />
        ))}
        {/* Stars */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={`star-${i}`}
            className="animate-twinkle"
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: 1 + Math.random() * 1.5,
              height: 1 + Math.random() * 1.5,
              borderRadius: "50%",
              background: "white",
              animationDuration: `${(2 + Math.random() * 3) * speed}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.5
            }}
          />
        ))}
      </div>
    );
  }

  // ─── Luxury Sparkles ──────────────────────────────
  if (backgroundId === "luxury-sparkles") {
    const sparkles = Array.from({ length: 40 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #1a1a1a 0%, #1f1a0e 30%, #0d0d0d 60%, #1a1510 100%)"
        }} />
        {/* Gold ambient glow */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)",
          filter: "blur(60px)"
        }} />
        {/* Sparkle particles */}
        {sparkles.map((s, i) => (
          <div
            key={i}
            className="animate-sparkle"
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#d4af37" : "#ffd700",
              boxShadow: `0 0 ${s.size * 4}px ${i % 2 === 0 ? "#d4af37" : "#ffd700"}44`,
              animationDuration: `${s.duration * speed}s`,
              animationDelay: `${s.delay}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
