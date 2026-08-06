export const waterCausticsVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const waterCausticsFragmentShader = `
  uniform float uTime;
  uniform float uScale;
  uniform vec3 uColor;
  uniform vec3 uWarmColor;
  uniform float uOpacity;
  varying vec2 vUv;

  // Sum of absolute sines — produces the sharp, tangled network pattern of
  // real caustics (light lensed through the animated surface).
  float caustic(vec2 p, float t) {
    float v = 0.0;
    v += 0.55 * abs(sin(p.x * 3.1 + t * 0.9));
    v += 0.45 * abs(sin(p.y * 2.7 - t * 0.7 + 1.3));
    v += 0.35 * abs(sin((p.x + p.y) * 2.3 + t * 1.1));
    v += 0.25 * abs(sin((p.x - p.y) * 3.7 + t * 0.5));
    v += 0.2 * abs(sin(p.x * 5.3 - p.y * 4.1 + t * 1.3));
    v += 0.15 * abs(sin(p.x * 3.9 + p.y * 5.7 - t * 1.6 + 0.8));
    return pow(v * 0.58, 3.0);
  }

  void main() {
    float t = uTime * 0.35;
    vec2 uv = vUv * 3.0 * uScale;

    // Animated warp — the water surface above acts as a slow lens, so the
    // caustic network bends and drifts instead of scrolling uniformly.
    vec2 warp = vec2(
      sin(uv.y * 1.7 + t * 0.6) * 0.28,
      cos(uv.x * 1.5 - t * 0.5) * 0.28
    );

    float c1 = caustic(uv + warp * 0.4, t);
    float c2 = caustic(uv * 1.45 + vec2(2.0, 1.0) + warp, t * 0.8);
    // Slow large-scale layer — reads as water-surface lensing drifting across the seabed.
    float c3 = caustic(uv * 0.7 + vec2(4.0, 3.0) - warp * 0.6, t * 1.3);

    float c = c1 * 0.65 + c2 * 0.45 + c3 * 0.35;

    // Cool cyan base with a subtle warm gold cast — sun-through-water feel.
    vec3 tint = mix(uColor, uWarmColor, 0.22);

    // Soft edge fade so the light dissolves into the seabed instead of
    // ending in a hard rectangle.
    float d = length(vUv - 0.5) * 2.0;
    float edge = 1.0 - smoothstep(0.7, 1.05, d);

    gl_FragColor = vec4(tint, c * uOpacity * edge);
  }
`

export const waterCausticsShader = {
  vertexShader: waterCausticsVertexShader,
  fragmentShader: waterCausticsFragmentShader,
}
