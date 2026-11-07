import { useEffect, useRef } from "react";
import { createSpaceEffects } from "./spaceEffects.js";

export default function Starfield() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopCursor = window.matchMedia(
      "(min-width: 701px) and (hover: hover) and (pointer: fine)",
    );
    const pointer = { x: 0, y: 0, strength: 0, targetStrength: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = null;
    let elapsed = 0;
    const scenery = createSpaceEffects();
    const depth = 1500;
    const makeStar = (z = Math.random() * depth) => {
      const tint = Math.random();
      // Interpolate each star between #FDCC0D and white, including its trail.
      const color = [253, 204, 13]
        .map((channel) => Math.round(channel + (255 - channel) * tint))
        .join(",");
      return {
        x: (Math.random() - 0.5) * 2800,
        y: (Math.random() - 0.5) * 2800,
        z,
        size: 0.4 + Math.random() * 1.1,
        color,
      };
    };

    function resetPointer() {
      pointer.targetStrength = 0;
    }

    function trackPointer(event) {
      if (
        !desktopCursor.matches ||
        motion.matches ||
        event.pointerType !== "mouse"
      )
        return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.targetStrength = 1;
    }

    function leaveWindow(event) {
      if (event.relatedTarget === null) resetPointer();
    }

    function attract(x, y) {
      const dx = pointer.x - x;
      const dy = pointer.y - y;
      const distance = Math.hypot(dx, dy);
      const radius = 160;
      if (!pointer.strength || distance >= radius) return { x, y };

      // A local gravity well: smoothly bend nearby paths, never the camera.
      // Bound the pull and soften its center so stars cannot jump or jitter.
      const falloff = (1 - distance / radius) ** 2;
      const pull = (24 * pointer.strength * falloff) / Math.max(32, distance);
      const twist =
        Math.max(0, 1 - distance / 65) ** 2 * pointer.strength * 0.16;
      return { x: x + dx * pull - dy * twist, y: y + dy * pull + dx * twist };
    }

    function drawBlackHole() {
      if (pointer.strength < 0.001) return;
      context.save();
      context.translate(pointer.x, pointer.y);
      context.globalAlpha = pointer.strength;

      // A diffuse yellow glow, without an accretion disk or outlined rim.
      const glow = context.createRadialGradient(0, 0, 0, 0, 0, 34);
      glow.addColorStop(0, "rgba(253,204,13,0.22)");
      glow.addColorStop(0.35, "rgba(253,204,13,0.13)");
      glow.addColorStop(1, "rgba(253,204,13,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(0, 0, 34, 0, Math.PI * 2);
      context.fill();

      // The native cursor hotspot stays at the exact center of the dark core.
      const shadow = context.createRadialGradient(0, 0, 0, 0, 0, 22);
      shadow.addColorStop(0, "rgba(3,6,12,1)");
      shadow.addColorStop(0.34, "rgba(3,6,12,1)");
      shadow.addColorStop(1, "rgba(3,6,12,0)");
      context.fillStyle = shadow;
      context.beginPath();
      context.arc(0, 0, 22, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    function draw(time = null) {
      const moving = !motion.matches && !document.hidden;
      const delta =
        lastTime !== null && time !== null
          ? Math.min((time - lastTime) / 1000, 0.05)
          : 0;
      lastTime = time;
      if (moving) elapsed += delta;
      context.clearRect(0, 0, width, height);
      scenery.drawNebulae(context, width, height, elapsed);
      scenery.drawDistantStars(context, width, height, elapsed);
      const focal = Math.max(width, height) * 0.68;
      const centerX = width * 0.56;
      const centerY = height * 0.42;
      const interactive = desktopCursor.matches && !motion.matches;
      if (interactive && moving) {
        const easing = 1 - Math.exp(-delta * 4);
        pointer.strength +=
          (pointer.targetStrength - pointer.strength) * easing;
      } else if (!interactive) {
        pointer.strength = 0;
        resetPointer();
      }

      for (const star of starsRef.current) {
        if (moving) star.z -= delta * 65;
        if (star.z < 12) Object.assign(star, makeStar(depth));
        const scale = focal / star.z;
        const { x, y } = attract(
          centerX + star.x * scale,
          centerY + star.y * scale,
        );
        if (x < -30 || x > width + 30 || y < -30 || y > height + 30) continue;
        const alpha = Math.min(0.8, 0.15 + (1 - star.z / depth) * 0.65);
        context.fillStyle = `rgba(${star.color},${alpha})`;
        context.beginPath();
        context.arc(x, y, Math.min(star.size * scale, 2.2), 0, Math.PI * 2);
        context.fill();
        if (moving && star.z < 650) {
          const previousScale = focal / (star.z + 8);
          context.strokeStyle = `rgba(${star.color},${alpha * 0.4})`;
          context.lineWidth = Math.min(scale * 0.5, 1.2);
          const tail = attract(
            centerX + star.x * previousScale,
            centerY + star.y * previousScale,
          );
          context.beginPath();
          context.moveTo(tail.x, tail.y);
          context.lineTo(x, y);
          context.stroke();
        }
      }
      drawBlackHole();
      if (moving) frame = requestAnimationFrame(draw);
    }

    function restart() {
      cancelAnimationFrame(frame);
      lastTime = null;
      draw();
    }
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      resetPointer();
      if (!starsRef.current.length) {
        starsRef.current = Array.from({ length: width < 700 ? 450 : 950 }, () =>
          makeStar(),
        );
      }
      restart();
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", trackPointer, { passive: true });
    window.addEventListener("pointerout", leaveWindow);
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", restart);
    motion.addEventListener("change", restart);
    desktopCursor.addEventListener("change", restart);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("pointerout", leaveWindow);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", restart);
      motion.removeEventListener("change", restart);
      desktopCursor.removeEventListener("change", restart);
    };
  }, []);

  return (
    <div className="space-background" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="viewport-frame" />
    </div>
  );
}
