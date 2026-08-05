export const volumetricLightVertexShader = `
  varying vec2 vUv;
  varying vec3 vLocalPos;

  void main() {
    vUv = uv;
    vLocalPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const volumetricLightFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uCoreWidth;
  uniform float uRadius;

  varying vec2 vUv;
  varying vec3 vLocalPos;

  void main() {
    // True radial falloff: distance from the cone axis, normalized by the base
    // radius, so the beam is brightest in the middle and dissolves to the cone
    // surface. uCoreWidth > 1 tightens the bright core.
    float r = length(vLocalPos.xz) / max(uRadius, 0.0001);
    float radial = smoothstep(1.0, 0.0, r * uCoreWidth);

    // Vertical fade: dissolve at the apex (uv.y = 1), full body in the middle,
    // soft base (uv.y = 0).
    float vertical = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

    float alpha = radial * vertical * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export const volumetricLightShader = {
  vertexShader: volumetricLightVertexShader,
  fragmentShader: volumetricLightFragmentShader,
}
