import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import "./LightRays.css";

const DEFAULT_COLOR = "#ffffff";

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? [
        parseInt(match[1], 16) / 255,
        parseInt(match[2], 16) / 255,
        parseInt(match[3], 16) / 255,
      ]
    : [1, 1, 1];
}

function getAnchorAndDirection(origin, width, height) {
  const outside = 0.2;
  const placements = {
    "top-left": { anchor: [0, -outside * height], direction: [0, 1] },
    "top-right": { anchor: [width, -outside * height], direction: [0, 1] },
    left: { anchor: [-outside * width, 0.5 * height], direction: [1, 0] },
    right: { anchor: [(1 + outside) * width, 0.5 * height], direction: [-1, 0] },
    "bottom-left": { anchor: [0, (1 + outside) * height], direction: [0, -1] },
    "bottom-center": { anchor: [0.5 * width, (1 + outside) * height], direction: [0, -1] },
    "bottom-right": { anchor: [width, (1 + outside) * height], direction: [0, -1] },
  };

  return placements[origin] ?? {
    anchor: [0.5 * width, -outside * height],
    direction: [0, 1],
  };
}

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 rayPos;
uniform vec2 rayDir;
uniform vec3 raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2 mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float rayStrength(
  vec2 raySource,
  vec2 rayReferenceDirection,
  vec2 coordinate,
  float seedA,
  float seedB,
  float speed
) {
  vec2 sourceToCoordinate = coordinate - raySource;
  vec2 normalizedDirection = normalize(sourceToCoordinate);
  float cosineAngle = dot(normalizedDirection, rayReferenceDirection);
  float distortedAngle = cosineAngle
    + distortion * sin(iTime * 2.0 + length(sourceToCoordinate) * 0.01) * 0.2;
  float spread = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float distanceFromSource = length(sourceToCoordinate);
  float maximumDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp(
    (maximumDistance - distanceFromSource) / maximumDistance,
    0.0,
    1.0
  );
  float fadeFalloff = clamp(
    (iResolution.x * fadeDistance - distanceFromSource) / (iResolution.x * fadeDistance),
    0.5,
    1.0
  );
  float pulse = pulsating > 0.5
    ? 0.8 + 0.2 * sin(iTime * speed * 3.0)
    : 1.0;
  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed))
      + (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0,
    1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spread * pulse;
}

void mainImage(out vec4 fragmentColor, in vec2 fragmentCoordinate) {
  vec2 coordinate = vec2(fragmentCoordinate.x, iResolution.y - fragmentCoordinate.y);
  vec2 finalDirection = rayDir;

  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPosition = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPosition - rayPos);
    finalDirection = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rayA = vec4(1.0) * rayStrength(
    rayPos,
    finalDirection,
    coordinate,
    36.2214,
    21.11349,
    1.5 * raysSpeed
  );
  vec4 rayB = vec4(1.0) * rayStrength(
    rayPos,
    finalDirection,
    coordinate,
    22.3991,
    18.0234,
    1.1 * raysSpeed
  );

  fragmentColor = rayA * 0.5 + rayB * 0.4;

  if (noiseAmount > 0.0) {
    float grain = noise(coordinate * 0.01 + iTime * 0.1);
    fragmentColor.rgb *= 1.0 - noiseAmount + noiseAmount * grain;
  }

  float brightness = 1.0 - coordinate.y / iResolution.y;
  float paperGlow = 0.58 + brightness * 0.42;
  fragmentColor.rgb *= paperGlow;

  if (saturation != 1.0) {
    float grayscale = dot(fragmentColor.rgb, vec3(0.299, 0.587, 0.114));
    fragmentColor.rgb = mix(vec3(grayscale), fragmentColor.rgb, saturation);
  }

  fragmentColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

export default function LightRays({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1,
  saturation = 1,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0,
  distortion = 0,
  className = "",
}) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const { gl } = renderer;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.replaceChildren(gl.canvas);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      rayPos: { value: [0, 0] },
      rayDir: { value: [0, 1] },
      raysColor: { value: hexToRgb(raysColor) },
      raysSpeed: { value: raysSpeed },
      lightSpread: { value: lightSpread },
      rayLength: { value: rayLength },
      pulsating: { value: pulsating ? 1 : 0 },
      fadeDistance: { value: fadeDistance },
      saturation: { value: saturation },
      mousePos: { value: [0.5, 0.5] },
      mouseInfluence: { value: mouseInfluence },
      noiseAmount: { value: noiseAmount },
      distortion: { value: distortion },
    };

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      const dpr = renderer.dpr;
      uniforms.iResolution.value = [width * dpr, height * dpr];
      const { anchor, direction } = getAnchorAndDirection(
        raysOrigin,
        width * dpr,
        height * dpr,
      );
      uniforms.rayPos.value = anchor;
      uniforms.rayDir.value = direction;
    };

    const handleMouseMove = (event) => {
      const bounds = container.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - bounds.left) / bounds.width,
        y: (event.clientY - bounds.top) / bounds.height,
      };
    };

    let frameId = 0;
    const render = (time) => {
      uniforms.iTime.value = time * 0.001;
      if (followMouse && mouseInfluence > 0) {
        smoothMouseRef.current.x = smoothMouseRef.current.x * 0.92 + mouseRef.current.x * 0.08;
        smoothMouseRef.current.y = smoothMouseRef.current.y * 0.92 + mouseRef.current.y * 0.08;
        uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y];
      }
      renderer.render({ scene: mesh });
      frameId = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    if (followMouse) window.addEventListener("mousemove", handleMouseMove, { passive: true });
    resize();
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      const loseContext = gl.getExtension("WEBGL_lose_context");
      loseContext?.loseContext();
      gl.canvas.remove();
    };
  }, [
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  return (
    <div
      ref={containerRef}
      className={`light-rays-container ${className}`.trim()}
    />
  );
}
