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

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function easeInCubic(value) {
  return value ** 3;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  let frameId = 0;
  let cancelled = false;
  const startTime = performance.now() + delay;

  const tick = (time) => {
    if (cancelled) return;
    const progress = Math.min(Math.max((time - startTime) / duration, 0), 1);
    onUpdate(start + (end - start) * ease(progress));

    if (progress < 1) frameId = requestAnimationFrame(tick);
    else onEnd?.();
  };

  const timeoutId = window.setTimeout(() => {
    frameId = requestAnimationFrame(tick);
  }, delay);

  return () => {
    cancelled = true;
    window.clearTimeout(timeoutId);
    cancelAnimationFrame(frameId);
  };
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

export function runBorderGlowSweep(element, delay = 0) {
  if (!element) return () => {};
  const cancellations = [];
  const angleStart = 110;
  const angleEnd = 465;
  element.classList.add("sweep-active");
  element.style.setProperty("--cursor-angle", `${angleStart}deg`);

  cancellations.push(animateValue({
    delay,
    duration: 480,
    onUpdate: (value) => element.style.setProperty("--edge-proximity", value),
  }));
  cancellations.push(animateValue({
    delay,
    duration: 1350,
    end: 55,
    ease: easeInCubic,
    onUpdate: (value) => element.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`),
  }));
  cancellations.push(animateValue({
    delay: delay + 1350,
    duration: 1850,
    start: 55,
    end: 100,
    onUpdate: (value) => element.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`),
  }));
  cancellations.push(animateValue({
    delay: delay + 2200,
    duration: 1150,
    start: 100,
    end: 0,
    ease: easeInCubic,
    onUpdate: (value) => element.style.setProperty("--edge-proximity", value),
    onEnd: () => element.classList.remove("sweep-active"),
  }));

  return () => {
    cancellations.forEach((cancel) => cancel());
    element.classList.remove("sweep-active");
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
    return runBorderGlowSweep(cardRef.current);
  }, [animated]);

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
