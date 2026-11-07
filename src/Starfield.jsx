import { useEffect, useRef, useState } from "react";

export default function Starfield() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    const depth = 1500;
    const makeStar = (z = Math.random() * depth) => ({
      x: (Math.random() - 0.5) * 2800,
      y: (Math.random() - 0.5) * 2800,
      z,
      size: 0.4 + Math.random() * 1.1,
      warm: Math.random() > 0.84,
    });

    function draw(time = 0) {
      const moving = !paused && !motion.matches && !document.hidden;
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      context.clearRect(0, 0, width, height);
      const focal = Math.max(width, height) * 0.68;
      const centerX = width * 0.56;
      const centerY = height * 0.42;

      for (const star of starsRef.current) {
        if (moving) star.z -= delta * 65;
        if (star.z < 12) Object.assign(star, makeStar(depth));
        const scale = focal / star.z;
        const x = centerX + star.x * scale;
        const y = centerY + star.y * scale;
        if (x < -30 || x > width + 30 || y < -30 || y > height + 30) continue;
        const alpha = Math.min(0.8, 0.15 + (1 - star.z / depth) * 0.65);
        context.fillStyle = star.warm
          ? `rgba(237,193,148,${alpha})`
          : `rgba(202,221,246,${alpha})`;
        context.beginPath();
        context.arc(x, y, Math.min(star.size * scale, 2.2), 0, Math.PI * 2);
        context.fill();
        if (moving && star.z < 650) {
          const previousScale = focal / (star.z + 8);
          context.strokeStyle = `rgba(177,207,244,${alpha * 0.4})`;
          context.lineWidth = Math.min(scale * 0.5, 1.2);
          context.beginPath();
          context.moveTo(
            centerX + star.x * previousScale,
            centerY + star.y * previousScale,
          );
          context.lineTo(x, y);
          context.stroke();
        }
      }
      if (moving) frame = requestAnimationFrame(draw);
    }

    function restart() {
      cancelAnimationFrame(frame);
      lastTime = 0;
      draw();
    }
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!starsRef.current.length) {
        starsRef.current = Array.from({ length: width < 700 ? 450 : 950 }, () =>
          makeStar(),
        );
      }
      restart();
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", restart);
    motion.addEventListener("change", restart);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", restart);
      motion.removeEventListener("change", restart);
    };
  }, [paused]);

  return (
    <>
      <div className="space-background" aria-hidden="true">
        <canvas ref={canvasRef} />
        <div className="viewport-frame" />
      </div>
      <button
        type="button"
        className="starfield-control"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{" "}
        {paused ? "Resume starfield" : "Pause starfield"}
      </button>
    </>
  );
}
