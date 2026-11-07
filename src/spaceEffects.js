// Render distant scenery independently of the cursor's local gravity well.
export function createSpaceEffects() {
  function cloudTexture(color) {
    const texture = document.createElement("canvas");
    texture.width = texture.height = 384;
    const painter = texture.getContext("2d");
    if (!painter) return null;

    // Cache overlapping wisps once instead of rebuilding gradients every frame.
    const wisps = [
      [0.27, 0.55, 0.24],
      [0.39, 0.43, 0.28],
      [0.51, 0.51, 0.3],
      [0.63, 0.4, 0.24],
      [0.72, 0.48, 0.2],
      [0.48, 0.66, 0.22],
    ];
    for (const [x, y, radius] of wisps) {
      const glow = painter.createRadialGradient(
        x * 384,
        y * 384,
        0,
        x * 384,
        y * 384,
        radius * 384,
      );
      glow.addColorStop(0, `rgba(${color},0.055)`);
      glow.addColorStop(0.45, `rgba(${color},0.025)`);
      glow.addColorStop(1, `rgba(${color},0)`);
      painter.fillStyle = glow;
      painter.fillRect(0, 0, 384, 384);
    }
    return texture;
  }

  const clouds = [cloudTexture("114,97,174"), cloudTexture("66,139,167")];
  // These normalized regions guarantee a gap of at least 17% of the shorter
  // viewport dimension, even after resizing. Generate once, never per frame.
  const pulsars = [
    [0.08, 0.3, 0.1, 0.26],
    [0.47, 0.53, 0.08, 0.22],
    [0.7, 0.92, 0.1, 0.26],
    [0.08, 0.28, 0.5, 0.65],
    [0.72, 0.92, 0.5, 0.65],
    [0.08, 0.23, 0.84, 0.94],
    [0.4, 0.6, 0.82, 0.92],
  ].map(([left, right, top, bottom]) => ({
    x: left + Math.random() * (right - left),
    y: top + Math.random() * (bottom - top),
    period: 4 + Math.random() * 4,
    phase: Math.random() * Math.PI * 2,
    size: 0.75 + Math.random() * 0.35,
    brightness: 0.2 + Math.random() * 0.1,
    warmth: Math.random(),
  }));

  function point(context, x, y, radius, color, opacity, haloSize) {
    const glow = context.createRadialGradient(x, y, 0, x, y, haloSize);
    glow.addColorStop(0, `rgba(${color},${opacity * 0.3})`);
    glow.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, haloSize, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = `rgba(${color},${opacity})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  return {
    drawNebulae(context, width, height, seconds) {
      const drift = (seconds * Math.PI * 2) / 100;
      const size = Math.max(width, height) * 0.9;
      context.save();
      if (clouds[0])
        context.drawImage(
          clouds[0],
          width * 0.12 - size * 0.5 + Math.sin(drift) * 12,
          height * 0.68 - size * 0.3,
          size,
          size * 0.65,
        );
      if (clouds[1])
        context.drawImage(
          clouds[1],
          width * 0.82 - size * 0.5,
          height * 0.24 - size * 0.35 + Math.cos(drift) * 9,
          size,
          size * 0.7,
        );
      context.restore();
    },
    drawDistantStars(context, width, height, seconds) {
      for (const pulsar of pulsars) {
        // Independent, smooth pulses; the faint core never disappears.
        const pulse =
          (1 +
            Math.sin((seconds * Math.PI * 2) / pulsar.period + pulsar.phase)) /
          2;
        const color = `255,${Math.round(228 + pulsar.warmth * 27)},${Math.round(163 + pulsar.warmth * 92)}`;
        point(
          context,
          width * pulsar.x,
          height * pulsar.y,
          pulsar.size + pulse * 0.35,
          color,
          pulsar.brightness + pulse * 0.26,
          6 + pulse * 4,
        );
      }
    },
  };
}
