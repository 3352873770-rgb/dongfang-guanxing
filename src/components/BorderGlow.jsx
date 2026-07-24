import { useCallback, useEffect, useRef } from "react";
import "./BorderGlow.css";

const HSL_PATTERN = /([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/;
const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];
const DEFAULT_COLORS = ["#c084fc", "#f472b6", "#38bdf8"];

function parseHSL(hslString) {
  const match = hslString.match(HSL_PATTERN);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const variables = {};

  for (let index = 0; index < opacities.length; index += 1) {
    variables[`--glow-color${keys[index]}`] = `hsl(${base} / ${Math.min(opacities[index] * intensity, 100)}%)`;
  }

  return variables;
}

function buildGradientVars(colors) {
  const palette = colors.length ? colors : DEFAULT_COLORS;
  const variables = {};

  for (let index = 0; index < GRADIENT_KEYS.length; index += 1) {
    const color = palette[Math.min(COLOR_MAP[index], palette.length - 1)];
    variables[GRADIENT_KEYS[index]] = `radial-gradient(at ${GRADIENT_POSITIONS[index]}, ${color} 0px, transparent 50%)`;
  }

  variables["--gradient-base"] = `linear-gradient(${palette[0]} 0 100%)`;
  return variables;
}

function getPointerMetrics(element, clientX, clientY) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const dx = x - centerX;
  const dy = y - centerY;
  const scaleX = dx === 0 ? Infinity : centerX / Math.abs(dx);
  const scaleY = dy === 0 ? Infinity : centerY / Math.abs(dy);
  const proximity = Math.min(Math.max(1 / Math.min(scaleX, scaleY), 0), 1);
  let angle = dx === 0 && dy === 0 ? 0 : Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (angle < 0) angle += 360;

  return { angle, proximity };
}

export function runBorderGlowSweep(element, { delay = 0, duration = 900 } = {}) {
  if (!element) return () => {};
  let frameId = 0;
  let timeoutId = 0;
  let cancelled = false;

  const reset = () => {
    element.style.setProperty("--edge-proximity", 0);
    element.classList.remove("sweep-active");
  };

  const updatePointerPass = (progress) => {
    const rect = element.getBoundingClientRect();
    const horizontalProgress = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
    const clientX = rect.left + rect.width * horizontalProgress;
    const clientY = rect.top + rect.height / 2;
    const { angle, proximity } = getPointerMetrics(element, clientX, clientY);
    element.style.setProperty("--edge-proximity", (proximity * 100).toFixed(3));
    element.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  };

  const start = () => {
    if (cancelled) return;
    element.classList.add("sweep-active");
    const startTime = performance.now();
    const tick = (time) => {
      if (cancelled) return;
      const progress = Math.min((time - startTime) / duration, 1);
      updatePointerPass(progress);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        reset();
      }
    };

    frameId = requestAnimationFrame(tick);
  };

  timeoutId = window.setTimeout(start, delay);

  return () => {
    cancelled = true;
    window.clearTimeout(timeoutId);
    cancelAnimationFrame(frameId);
    reset();
  };
}

export function decorateBorderGlowElement(element, className = "") {
  if (!element || element.dataset.borderGlowReady === "true") return () => {};
  element.dataset.borderGlowReady = "true";
  element.classList.add("border-glow-native", ...className.split(" ").filter(Boolean));

  ["border-glow-mesh", "border-glow-fill", "edge-light"].forEach((layerClass) => {
    const layer = document.createElement("span");
    layer.className = layerClass;
    layer.setAttribute("aria-hidden", "true");
    element.append(layer);
  });

  const handlePointerMove = (event) => {
    const { angle, proximity } = getPointerMetrics(element, event.clientX, event.clientY);
    element.style.setProperty("--edge-proximity", (proximity * 100).toFixed(3));
    element.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  };
  const handlePointerLeave = () => element.style.setProperty("--edge-proximity", 0);
  const handleFocus = () => {
    element.style.setProperty("--edge-proximity", 100);
    element.style.setProperty("--cursor-angle", "95deg");
  };

  element.addEventListener("pointermove", handlePointerMove, { passive: true });
  element.addEventListener("pointerleave", handlePointerLeave, { passive: true });
  element.addEventListener("focus", handleFocus);
  element.addEventListener("blur", handlePointerLeave);

  return () => {
    element.removeEventListener("pointermove", handlePointerMove);
    element.removeEventListener("pointerleave", handlePointerLeave);
    element.removeEventListener("focus", handleFocus);
    element.removeEventListener("blur", handlePointerLeave);
  };
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  sweepDelay = 0,
  sweepDuration = 900,
  colors = DEFAULT_COLORS,
  fillOpacity = 0.5,
}) {
  const cardRef = useRef(null);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;
    const { angle, proximity } = getPointerMetrics(card, event.clientX, event.clientY);
    card.style.setProperty("--edge-proximity", (proximity * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  const handlePointerLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--edge-proximity", 0);
  }, []);

  const handleFocus = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--edge-proximity", 100);
    card.style.setProperty("--cursor-angle", "95deg");
  }, []);

  useEffect(() => {
    if (!animated || !cardRef.current) return undefined;
    return runBorderGlowSweep(cardRef.current, { delay: sweepDelay, duration: sweepDuration });
  }, [animated, sweepDelay, sweepDuration]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handlePointerLeave}
      className={`border-glow-card ${className}`}
      style={{
        "--card-bg": backgroundColor,
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        "--cone-spread": coneSpread,
        "--fill-opacity": fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="border-glow-mesh" aria-hidden="true" />
      <span className="border-glow-fill" aria-hidden="true" />
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
