export const volumetricLightVertexShader = `
  uniform float uTime;
  uniform float uHeight;

  varying vec2 vUv;
  varying vec3 vLocalPos;

  void main() {
    vUv = uv;
    vLocalPos = position;

    // Gentle 3D bend — the beam sways like light through moving water.
    // The apex (top) sways most; the base stays anchored near the surface.
    float k = (position.y + uHeight * 0.5) / uHeight;
    k = k * k;
    vec3 pos = position;
    pos.x += sin(position.y * 1.6 + uTime * 0.5) * 0.06 * k;
    pos.z += cos(position.y * 1.3 + uTime * 0.4 + 1.2) * 0.05 * k;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const volumetricLightFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uCoreWidth;
  uniform float uRadius;
  uniform float uTime;

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

    // Slow shimmer — light catching suspended particles inside the shaft.
    float shimmer = 0.78 + 0.22 * sin(vLocalPos.y * 2.2 + uTime * 0.9);

    float alpha = radial * vertical * uOpacity * shimmer;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export const volumetricLightShader = {
  vertexShader: volumetricLightVertexShader,
  fragmentShader: volumetricLightFragmentShader,
}
