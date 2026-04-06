export const waterCausticsVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const waterCausticsFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  float caustic(vec2 uv, float t) {
    vec2 p = uv * 2.4;
    float v = 0.0;
    v += 0.55 * sin(p.x * 3.2 + t * 0.8);
    v += 0.45 * sin(p.y * 2.9 - t * 0.7 + 1.7);
    v += 0.35 * sin((p.x + p.y) * 2.1 + t * 0.9);
    v += 0.25 * sin((p.x - p.y) * 3.4 + t * 0.5 + 0.8);
    v += 0.2 * sin(p.x * 5.1 - p.y * 4.3 + t * 1.1);
    return pow(clamp(v * 0.22 + 0.55, 0.0, 1.0), 6.0);
  }

  void main() {
    float t = uTime * 0.35;
    vec2 uv = vUv * 3.0;
    float c1 = caustic(uv, t);
    float c2 = caustic(uv * 1.45 + vec2(2.0, 1.0), t * 0.8);
    float c = c1 * 0.7 + c2 * 0.5;
    gl_FragColor = vec4(uColor, c * uOpacity);
  }
`

export const waterCausticsShader = {
  vertexShader: waterCausticsVertexShader,
  fragmentShader: waterCausticsFragmentShader,
}
