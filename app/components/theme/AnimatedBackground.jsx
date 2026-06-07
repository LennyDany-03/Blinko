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

  // ─── Instagram Mesh ────────────────────────────────
  if (backgroundId === "instagram-mesh") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)" }} />
        {[
          { color: "rgba(131,58,180,0.45)", x: "10%", y: "20%", size: 500, delay: 0 },
          { color: "rgba(253,29,29,0.4)", x: "65%", y: "15%", size: 450, delay: 2.5 },
          { color: "rgba(252,176,69,0.35)", x: "40%", y: "65%", size: 520, delay: 5 },
          { color: "rgba(236,72,153,0.35)", x: "85%", y: "45%", size: 400, delay: 1.5 }
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
              borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
              background: `radial-gradient(circle, ${patch.color}, transparent 70%)`,
              filter: "blur(60px)",
              animationDuration: `${(18 + i * 4) * speed}s`,
              animationDelay: `${patch.delay}s`,
              willChange: "transform",
              mixBlendMode: "hard-light"
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

  // ─── PRO: Cyber Rain ─────────────────────────────────
  if (backgroundId === "cyber-rain") {
    const lines = Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 100,
      height: 40 + Math.random() * 120,
      width: 1 + Math.random() * 2,
      delay: Math.random() * 4,
      duration: 1.5 + Math.random() * 3,
      color: i % 3 === 0 ? "#00f0ff" : i % 3 === 1 ? "#bf5af2" : "#ff006e"
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #05001a 0%, #0a0025 50%, #050010 100%)" }} />
        {lines.map((line, i) => (
          <div
            key={i}
            className="animate-cyber-rain"
            style={{
              position: "absolute",
              left: `${line.x}%`,
              top: "-10%",
              width: line.width,
              height: line.height,
              background: `linear-gradient(180deg, transparent, ${line.color}, transparent)`,
              boxShadow: `0 0 ${line.width * 6}px ${line.color}44`,
              animationDuration: `${line.duration * speed}s`,
              animationDelay: `${line.delay}s`,
              willChange: "transform",
              opacity: 0.6 + Math.random() * 0.4
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO: Plasma Vortex ──────────────────────────────
  if (backgroundId === "plasma-vortex") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #1a0030 0%, #0d0015 60%, #050008 100%)" }} />
        {[
          { color: "rgba(255,110,199,0.35)", size: 500, delay: 0 },
          { color: "rgba(191,90,242,0.3)", size: 450, delay: 3 },
          { color: "rgba(255,0,110,0.25)", size: 400, delay: 6 }
        ].map((ring, i) => (
          <div
            key={i}
            className="animate-plasma-vortex"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              marginLeft: -(ring.size * scale) / 2,
              marginTop: -(ring.size * scale) / 2,
              width: ring.size * scale,
              height: ring.size * scale,
              borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
              background: `radial-gradient(circle, ${ring.color}, transparent 70%)`,
              filter: "blur(50px)",
              animationDuration: `${(25 + i * 8) * speed}s`,
              animationDelay: `${ring.delay}s`,
              willChange: "transform, filter",
              mixBlendMode: "screen"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO: Hologram Grid ──────────────────────────────
  if (backgroundId === "hologram-grid") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #000a1a 0%, #001133 50%, #000d26 100%)" }} />
        <div
          className="animate-holo-grid"
          style={{
            position: "absolute",
            inset: "-20%",
            backgroundImage: `
              linear-gradient(rgba(79,142,255,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79,142,255,0.12) 1px, transparent 1px),
              linear-gradient(45deg, rgba(79,142,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px, 50px 50px, 70px 70px",
            animationDuration: `${8 * speed}s`,
            willChange: "transform, opacity"
          }}
        />
        {/* Hexagon glow nodes */}
        {[
          { x: "20%", y: "30%", size: 8 },
          { x: "50%", y: "20%", size: 6 },
          { x: "80%", y: "40%", size: 10 },
          { x: "35%", y: "65%", size: 7 },
          { x: "70%", y: "75%", size: 9 }
        ].map((node, i) => (
          <div
            key={i}
            className="animate-node-pulse"
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
              width: node.size,
              height: node.size,
              borderRadius: "50%",
              background: "#4f8eff",
              boxShadow: "0 0 20px #4f8eff88, 0 0 40px #4f8eff44",
              animationDuration: `${(3 + i * 0.7) * speed}s`,
              animationDelay: `${i * 0.5}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO: Void Nebula ────────────────────────────────
  if (backgroundId === "void-nebula") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, #150025 0%, #0a0015 40%, #030008 100%)" }} />
        {[
          { color: "rgba(191,90,242,0.25)", size: 600, x: "25%", y: "20%", delay: 0 },
          { color: "rgba(139,92,246,0.2)", size: 500, x: "65%", y: "40%", delay: 3 },
          { color: "rgba(236,72,153,0.18)", size: 550, x: "40%", y: "65%", delay: 5 },
          { color: "rgba(59,130,246,0.15)", size: 450, x: "75%", y: "75%", delay: 2 }
        ].map((cloud, i) => (
          <div
            key={i}
            className="animate-nebula-drift"
            style={{
              position: "absolute",
              left: cloud.x,
              top: cloud.y,
              width: cloud.size * scale,
              height: cloud.size * scale,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${cloud.color}, transparent 65%)`,
              filter: "blur(70px)",
              animationDuration: `${(22 + i * 5) * speed}s`,
              animationDelay: `${cloud.delay}s`,
              willChange: "transform, filter",
              mixBlendMode: "screen"
            }}
          />
        ))}
        {/* Stars */}
        {Array.from({ length: 40 }, (_, i) => (
          <div
            key={`ns-${i}`}
            className="animate-twinkle"
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 1 + Math.random() * 1.5,
              height: 1 + Math.random() * 1.5,
              borderRadius: "50%",
              background: "#ffffff",
              animationDuration: `${(2 + Math.random() * 4) * speed}s`,
              animationDelay: `${Math.random() * 6}s`,
              opacity: 0.2 + Math.random() * 0.5
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO: Crystal Cave ───────────────────────────────
  if (backgroundId === "crystal-cave") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0d1b2a 0%, #1b2838 50%, #0a1628 100%)" }} />
        {[
          { x: "15%", y: "25%", size: 50, rotation: 15, color: "#7dd3fc", delay: 0 },
          { x: "55%", y: "15%", size: 40, rotation: 45, color: "#93c5fd", delay: 1.5 },
          { x: "75%", y: "35%", size: 60, rotation: -20, color: "#bae6fd", delay: 3 },
          { x: "30%", y: "60%", size: 35, rotation: 70, color: "#a5f3fc", delay: 2 },
          { x: "65%", y: "70%", size: 55, rotation: -45, color: "#7dd3fc", delay: 4 },
          { x: "85%", y: "60%", size: 30, rotation: 30, color: "#67e8f9", delay: 1 },
          { x: "20%", y: "80%", size: 45, rotation: -60, color: "#93c5fd", delay: 3.5 }
        ].map((crystal, i) => (
          <div
            key={i}
            className="animate-crystal-float"
            style={{
              position: "absolute",
              left: crystal.x,
              top: crystal.y,
              width: crystal.size * scale,
              height: crystal.size * scale * 1.4,
              background: `linear-gradient(135deg, ${crystal.color}40, ${crystal.color}15, transparent)`,
              border: `1px solid ${crystal.color}30`,
              clipPath: "polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)",
              boxShadow: `0 0 ${crystal.size / 2}px ${crystal.color}22`,
              animationDuration: `${(10 + i * 2) * speed}s`,
              animationDelay: `${crystal.delay}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
        {/* Ambient glow */}
        <div style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 500,
          height: 500,
          marginLeft: -250,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(125,211,252,0.06), transparent 70%)",
          filter: "blur(40px)"
        }} />
      </div>
    );
  }

  // ─── PRO: Ember Storm ────────────────────────────────
  if (backgroundId === "ember-storm") {
    const embers = Array.from({ length: 45 }, (_, i) => ({
      x: Math.random() * 100,
      size: 2 + Math.random() * 5,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6,
      color: i % 3 === 0 ? "#ff4500" : i % 3 === 1 ? "#ff6b35" : "#ffaa00"
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0a0000 0%, #1a0500 40%, #200800 100%)" }} />
        {/* Base glow */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "radial-gradient(ellipse at bottom, rgba(255,69,0,0.15), transparent 80%)",
          filter: "blur(30px)"
        }} />
        {embers.map((ember, i) => (
          <div
            key={i}
            className="animate-ember-rise"
            style={{
              position: "absolute",
              left: `${ember.x}%`,
              bottom: "0",
              width: ember.size,
              height: ember.size,
              borderRadius: "50%",
              background: ember.color,
              boxShadow: `0 0 ${ember.size * 3}px ${ember.color}66`,
              animationDuration: `${ember.duration * speed}s`,
              animationDelay: `${ember.delay}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO: Quantum Field ──────────────────────────────
  if (backgroundId === "quantum-field") {
    const dots = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 8,
      duration: 3 + Math.random() * 5,
      color: i % 4 === 0 ? "#22d3ee" : i % 4 === 1 ? "#06b6d4" : i % 4 === 2 ? "#67e8f9" : "#0ea5e9"
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #001a2e 0%, #000d1a 50%, #000508 100%)" }} />
        {dots.map((dot, i) => (
          <div
            key={i}
            className="animate-quantum-blink"
            style={{
              position: "absolute",
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              background: dot.color,
              boxShadow: `0 0 ${dot.size * 4}px ${dot.color}55`,
              animationDuration: `${dot.duration * speed}s`,
              animationDelay: `${dot.delay}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO: Prism Aurora ───────────────────────────────
  if (backgroundId === "prism-aurora") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #050008 0%, #0a000d 50%, #050010 100%)" }} />
        {[
          { color: "rgba(255,0,110,0.2)", y: "15%", height: 150, delay: 0 },
          { color: "rgba(255,165,0,0.18)", y: "25%", height: 120, delay: 1.5 },
          { color: "rgba(255,255,0,0.15)", y: "30%", height: 100, delay: 3 },
          { color: "rgba(0,255,0,0.15)", y: "35%", height: 110, delay: 4.5 },
          { color: "rgba(0,191,255,0.18)", y: "40%", height: 130, delay: 2 },
          { color: "rgba(138,43,226,0.2)", y: "48%", height: 140, delay: 5 }
        ].map((band, i) => (
          <div
            key={i}
            className="animate-prism-shift"
            style={{
              position: "absolute",
              left: "-10%",
              top: band.y,
              width: "120%",
              height: band.height * scale,
              background: `linear-gradient(180deg, transparent, ${band.color}, transparent)`,
              filter: "blur(35px)",
              animationDuration: `${(12 + i * 3) * speed}s`,
              animationDelay: `${band.delay}s`,
              willChange: "transform, filter, opacity",
              mixBlendMode: "screen"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO: Digital Rain ───────────────────────────────
  if (backgroundId === "digital-rain") {
    const chars = "01アイウエオカキクケコ";
    const columns = Array.from({ length: 25 }, (_, i) => ({
      x: (i / 25) * 100 + Math.random() * 4,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      char: chars[Math.floor(Math.random() * chars.length)]
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "#000500" }} />
        {columns.map((col, i) => (
          <div
            key={i}
            className="animate-digi-rain"
            style={{
              position: "absolute",
              left: `${col.x}%`,
              top: "-5%",
              fontSize: 12 + Math.random() * 6,
              fontFamily: "monospace",
              color: "#00ff41",
              textShadow: "0 0 8px #00ff41, 0 0 20px #00ff4166",
              animationDuration: `${col.duration * speed}s`,
              animationDelay: `${col.delay}s`,
              willChange: "transform, opacity",
              writingMode: "vertical-rl",
              lineHeight: "1.2em",
              letterSpacing: "4px",
              opacity: 0.3 + Math.random() * 0.5
            }}
          >
            {Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () => 
              chars[Math.floor(Math.random() * chars.length)]
            ).join("")}
          </div>
        ))}
      </div>
    );
  }

  // ─── PRO: Cosmic Web ─────────────────────────────────
  if (backgroundId === "cosmic-web") {
    const stars = Array.from({ length: 30 }, (_, i) => ({
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #0f0f1e 0%, #0a0a14 50%, #050508 100%)" }} />
        {/* SVG constellation lines */}
        <svg
          className="animate-cosmic-web"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animationDuration: `${5 * speed}s` }}
        >
          {stars.map((star, i) =>
            stars.slice(i + 1).filter((target) => {
              const dist = Math.sqrt(Math.pow(star.x - target.x, 2) + Math.pow(star.y - target.y, 2));
              return dist < 30;
            }).map((target, j) => (
              <line
                key={`${i}-${j}`}
                x1={`${star.x}%`} y1={`${star.y}%`}
                x2={`${target.x}%`} y2={`${target.y}%`}
                stroke="rgba(167,139,250,0.15)"
                strokeWidth="0.5"
                strokeDasharray="4 4"
              />
            ))
          )}
        </svg>
        {/* Star nodes */}
        {stars.map((star, i) => (
          <div
            key={`cs-${i}`}
            className="animate-twinkle"
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#c4b5fd" : "#818cf8",
              boxShadow: `0 0 8px ${i % 3 === 0 ? "#a78bfa" : "#818cf8"}66`,
              animationDuration: `${(2 + Math.random() * 3) * speed}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PRO LIGHT BACKGROUNDS
  // ═══════════════════════════════════════════════════════════

  // ─── PRO Light: Sunbeam Rays ─────────────────────────
  if (backgroundId === "sunbeam-rays") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fef9c3 100%)" }} />
        {/* Rotating sunbeam */}
        <div
          className="animate-sunbeam"
          style={{
            position: "absolute",
            top: "-30%",
            left: "30%",
            width: 500 * scale,
            height: 500 * scale,
            background: `conic-gradient(
              from 0deg,
              transparent 0deg, rgba(245,158,11,0.08) 15deg, transparent 30deg,
              transparent 45deg, rgba(251,191,36,0.06) 60deg, transparent 75deg,
              transparent 90deg, rgba(245,158,11,0.08) 105deg, transparent 120deg,
              transparent 135deg, rgba(251,191,36,0.06) 150deg, transparent 165deg,
              transparent 180deg, rgba(245,158,11,0.08) 195deg, transparent 210deg,
              transparent 225deg, rgba(251,191,36,0.06) 240deg, transparent 255deg,
              transparent 270deg, rgba(245,158,11,0.08) 285deg, transparent 300deg,
              transparent 315deg, rgba(251,191,36,0.06) 330deg, transparent 345deg
            )`,
            animationDuration: `${30 * speed}s`,
            willChange: "transform"
          }}
        />
        {/* Warm ambient glow */}
        <div style={{
          position: "absolute", top: "10%", right: "20%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.12), transparent 70%)",
          filter: "blur(40px)"
        }} />
      </div>
    );
  }

  // ─── PRO Light: Sakura Petals ────────────────────────
  if (backgroundId === "sakura-petals") {
    const petals = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      size: 8 + Math.random() * 14,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      color: i % 3 === 0 ? "rgba(236,72,153,0.4)" : i % 3 === 1 ? "rgba(244,114,182,0.35)" : "rgba(249,168,212,0.3)"
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 50%, #fdf2f8 100%)" }} />
        {petals.map((petal, i) => (
          <div
            key={i}
            className="animate-petal-fall"
            style={{
              position: "absolute",
              left: `${petal.x}%`,
              top: "-5%",
              width: petal.size,
              height: petal.size * 0.7,
              borderRadius: "50% 0 50% 50%",
              background: petal.color,
              animationDuration: `${petal.duration * speed}s`,
              animationDelay: `${petal.delay}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
        {/* Pink ambient glow */}
        <div style={{
          position: "absolute", bottom: "20%", left: "40%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%)",
          filter: "blur(50px)"
        }} />
      </div>
    );
  }

  // ─── PRO Light: Cloud Drift ──────────────────────────
  if (backgroundId === "cloud-drift") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #93c5fd 0%, #bfdbfe 30%, #dbeafe 60%, #eff6ff 100%)" }} />
        {[
          { x: "10%", y: "15%", w: 300, h: 80, delay: 0, opacity: 0.7 },
          { x: "50%", y: "25%", w: 250, h: 60, delay: 3, opacity: 0.5 },
          { x: "25%", y: "40%", w: 350, h: 90, delay: 1.5, opacity: 0.6 },
          { x: "60%", y: "55%", w: 280, h: 70, delay: 5, opacity: 0.4 },
          { x: "15%", y: "70%", w: 320, h: 85, delay: 2, opacity: 0.5 }
        ].map((cloud, i) => (
          <div
            key={i}
            className="animate-cloud-float"
            style={{
              position: "absolute",
              left: cloud.x,
              top: cloud.y,
              width: cloud.w * scale,
              height: cloud.h * scale,
              borderRadius: "100px",
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 4px 30px rgba(255,255,255,0.3)",
              filter: "blur(8px)",
              animationDuration: `${(20 + i * 4) * speed}s`,
              animationDelay: `${cloud.delay}s`,
              opacity: cloud.opacity,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO Light: Pastel Waves ─────────────────────────
  if (backgroundId === "pastel-waves") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #eff6ff 100%)" }} />
        {[
          { color: "rgba(139,92,246,0.15)", x: "20%", y: "20%", size: 400, delay: 0 },
          { color: "rgba(236,72,153,0.12)", x: "60%", y: "30%", size: 350, delay: 2 },
          { color: "rgba(59,130,246,0.12)", x: "40%", y: "65%", size: 420, delay: 4 },
          { color: "rgba(168,85,247,0.1)", x: "75%", y: "70%", size: 300, delay: 1 }
        ].map((blob, i) => (
          <div
            key={i}
            className="animate-pastel-flow"
            style={{
              position: "absolute",
              left: blob.x,
              top: blob.y,
              width: blob.size * scale,
              height: blob.size * scale,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
              filter: "blur(50px)",
              animationDuration: `${(16 + i * 4) * speed}s`,
              animationDelay: `${blob.delay}s`,
              willChange: "transform"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO Light: Morning Dew ──────────────────────────
  if (backgroundId === "morning-dew") {
    const dewdrops = Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 10,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 4
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)" }} />
        {dewdrops.map((drop, i) => (
          <div
            key={i}
            className="animate-dew-pulse"
            style={{
              position: "absolute",
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              width: drop.size,
              height: drop.size,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), rgba(16,185,129,${0.1 + Math.random() * 0.15}))`,
              boxShadow: "inset 0 0 4px rgba(255,255,255,0.4), 0 2px 8px rgba(16,185,129,0.1)",
              animationDuration: `${drop.duration * speed}s`,
              animationDelay: `${drop.delay}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO Light: Watercolor Wash ──────────────────────
  if (backgroundId === "watercolor-wash") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "#fefce8" }} />
        {[
          { color: "rgba(244,63,94,0.12)", x: "25%", y: "20%", size: 350, delay: 0 },
          { color: "rgba(251,191,36,0.1)", x: "65%", y: "30%", size: 300, delay: 2 },
          { color: "rgba(59,130,246,0.1)", x: "40%", y: "60%", size: 380, delay: 3 },
          { color: "rgba(236,72,153,0.08)", x: "70%", y: "70%", size: 280, delay: 1.5 }
        ].map((splash, i) => (
          <div
            key={i}
            className="animate-watercolor"
            style={{
              position: "absolute",
              left: splash.x,
              top: splash.y,
              width: splash.size * scale,
              height: splash.size * scale,
              background: `radial-gradient(circle, ${splash.color}, transparent 65%)`,
              filter: "blur(40px)",
              animationDuration: `${(18 + i * 5) * speed}s`,
              animationDelay: `${splash.delay}s`,
              willChange: "transform, border-radius"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO Light: Cotton Candy ─────────────────────────
  if (backgroundId === "cotton-candy") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #fdf2f8 0%, #eef2ff 50%, #f0f9ff 100%)" }} />
        {[
          { color: "rgba(217,70,239,0.15)", x: "20%", y: "25%", size: 200, delay: 0 },
          { color: "rgba(147,197,253,0.2)", x: "55%", y: "20%", size: 180, delay: 1.5 },
          { color: "rgba(249,168,212,0.18)", x: "40%", y: "55%", size: 220, delay: 3 },
          { color: "rgba(196,181,253,0.15)", x: "70%", y: "65%", size: 170, delay: 2 },
          { color: "rgba(253,164,175,0.12)", x: "15%", y: "70%", size: 190, delay: 4 }
        ].map((ball, i) => (
          <div
            key={i}
            className="animate-candy-bounce"
            style={{
              position: "absolute",
              left: ball.x,
              top: ball.y,
              width: ball.size * scale,
              height: ball.size * scale,
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.5), ${ball.color})`,
              filter: "blur(25px)",
              animationDuration: `${(8 + i * 2) * speed}s`,
              animationDelay: `${ball.delay}s`,
              willChange: "transform"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO Light: Golden Hour ──────────────────────────
  if (backgroundId === "golden-hour") {
    const glows = Array.from({ length: 25 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 6 + Math.random() * 12,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 5
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #fef3c7 0%, #fed7aa 50%, #fef3c7 100%)" }} />
        {/* Warm ambient glow */}
        <div style={{
          position: "absolute", top: "15%", left: "50%", marginLeft: -200,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)",
          filter: "blur(50px)"
        }} />
        {glows.map((g, i) => (
          <div
            key={i}
            className="animate-golden-pulse"
            style={{
              position: "absolute",
              left: `${g.x}%`,
              top: `${g.y}%`,
              width: g.size,
              height: g.size,
              borderRadius: "50%",
              background: i % 2 === 0 ? "rgba(245,158,11,0.3)" : "rgba(251,191,36,0.25)",
              boxShadow: `0 0 ${g.size * 2}px rgba(245,158,11,0.15)`,
              animationDuration: `${g.duration * speed}s`,
              animationDelay: `${g.delay}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO Light: Ocean Breeze ─────────────────────────
  if (backgroundId === "ocean-breeze") {
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 60%, #ccfbf1 100%)" }} />
        {[
          { y: "30%", color: "rgba(8,145,178,0.1)", height: 60, delay: 0 },
          { y: "45%", color: "rgba(6,182,212,0.08)", height: 50, delay: 2 },
          { y: "60%", color: "rgba(20,184,166,0.1)", height: 70, delay: 4 },
          { y: "75%", color: "rgba(8,145,178,0.06)", height: 55, delay: 1 }
        ].map((wave, i) => (
          <div
            key={i}
            className="animate-ocean-ripple"
            style={{
              position: "absolute",
              left: "-50%",
              top: wave.y,
              width: "200%",
              height: wave.height * scale,
              background: `linear-gradient(90deg, transparent, ${wave.color}, transparent)`,
              filter: "blur(20px)",
              animationDuration: `${(12 + i * 3) * speed}s`,
              animationDelay: `${wave.delay}s`,
              willChange: "transform"
            }}
          />
        ))}
      </div>
    );
  }

  // ─── PRO Light: Lavender Mist ────────────────────────
  if (backgroundId === "lavender-mist") {
    const particles = Array.from({ length: 35 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      color: i % 3 === 0 ? "rgba(124,58,237,0.2)" : i % 3 === 1 ? "rgba(168,85,247,0.15)" : "rgba(196,181,253,0.2)"
    }));
    return (
      <div style={baseStyle} className={className} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f3e8ff 100%)" }} />
        {/* Ambient purple glow */}
        <div style={{
          position: "absolute", top: "30%", left: "40%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)",
          filter: "blur(60px)"
        }} />
        {particles.map((p, i) => (
          <div
            key={i}
            className="animate-lavender-float"
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              animationDuration: `${p.duration * speed}s`,
              animationDelay: `${p.delay}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
