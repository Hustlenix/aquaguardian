// Ocean gradient + layered Gerstner-style wave shader.
// Vertex: 4 octaves of directional swell with analytic wave normals.
// Fragment: fresnel-based transparency (solid straight-on, more transparent
// at grazing angles) blended with a depth-based color gradient (light surface
// color at the top -> deep navy below) plus tight sun glint with a white-hot
// core, a broad sheen, and a slow rolling light-bank shimmer.

export const oceanGradientVertexShader = `
  uniform float uTime;
  uniform float uAmplitude;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;

  float waveY(vec2 p, float t, vec2 dir, float a, float f, float s, float ph, inout vec2 grad) {
    float c = dot(dir, p) * f + t * s + ph;
    grad += dir * (a * f * cos(c));
    return a * sin(c);
  }

  void main() {
    vUv = uv;

    float t = uTime * 0.45;
    vec2 p = position.xz;

    vec2 grad = vec2(0.0);
    float y = 0.0;

    // Octave 1 — broad primary swell
    y += waveY(p, t, normalize(vec2(1.0, 0.35)), 0.30, 0.30, 1.1, 0.0, grad);
    // Octave 2 — secondary diagonal swell
    y += waveY(p, t, normalize(vec2(-0.6, 0.8)), 0.19, 0.52, 1.6, 1.9, grad);
    // Octave 3 — fine chop detail
    y += waveY(p, t, normalize(vec2(0.25, -0.9)), 0.10, 0.92, 2.3, 4.1, grad);
    // Octave 4 — high-frequency glint ripple (reads as sun shimmer on the surface)
    y += waveY(p, t, normalize(vec2(0.8, 0.55)), 0.05, 1.5, 2.9, 5.7, grad);

    vec3 pos = position;
    pos.y += y * uAmplitude;

    vec3 normal = normalize(vec3(-grad.x, 1.0, -grad.y));
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
  }
`

export const oceanGradientFragmentShader = `
  uniform vec3 uTopColor;
  uniform vec3 uDeepColor;
  uniform vec3 uLightDir;
  uniform float uTime;
  uniform float uClarity;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float ndv = abs(dot(normal, viewDir));
    float fresnel = pow(1.0 - ndv, 2.0);

    // Depth-based gradient: light surface color near the top, deep navy below.
    // Clarity pushes the bright color deeper into the water column.
    float depthFactor = clamp((vWorldPos.y + 4.0) / (22.0 + 14.0 * uClarity), 0.0, 1.0);
    vec3 base = mix(uDeepColor, uTopColor, depthFactor);

    // Cinematic fresnel blend — grazing angles fade the surface out so the
    // mid-water and seabed read through; straight-on stays solid.
    vec3 color = mix(base, uTopColor, fresnel * 0.65);

    vec3 lDir = normalize(uLightDir);
    vec3 refl = reflect(-viewDir, normal);

    // Tight sun glint on wave crests for sparkle.
    float spec = pow(max(dot(refl, lDir), 0.0), 48.0);
    color += uTopColor * spec * 0.5 * (0.35 + depthFactor);

    // White-hot core of the glint — the surface "catches" the light.
    color += vec3(0.9, 0.97, 1.0) * pow(spec, 2.0) * 0.28;

    // Broad low-power sheen lobe for a wet, oily-smooth surface look.
    float sheen = pow(max(dot(refl, lDir), 0.0), 6.0);
    color += uTopColor * sheen * 0.07 * (0.4 + depthFactor);

    // Slow rolling light-bank shimmer — large-scale brightness undulation so
    // the surface never reads as static.
    float shimmer =
      0.5 + 0.5 * sin(vWorldPos.x * 0.35 + uTime * 0.25) * sin(vWorldPos.z * 0.3 - uTime * 0.2);
    color += uTopColor * shimmer * 0.05 * depthFactor;

    // Fresnel-based transparency: solid when looking straight down, more
    // transparent at grazing angles (never fully invisible).
    float alpha = mix(0.96, 0.5, fresnel);

    gl_FragColor = vec4(color, alpha);
  }
`

export const oceanGradientShader = {
  vertexShader: oceanGradientVertexShader,
  fragmentShader: oceanGradientFragmentShader,
}
