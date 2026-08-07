export const oceanGradientVertexShader = `
  uniform float uTime;
  uniform float uAmplitude;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;

  // Gerstner-style wave: displaces Y and (by disp) the XZ plane so crests
  // lean and slide instead of just bobbing; accumulates the surface gradient
  // for normal perturbation in the fragment pass.
  float gerstner(vec2 p, float t, vec2 dir, float a, float f, float s, float ph, float disp, inout vec2 grad, inout vec2 xz) {
    float c = dot(dir, p) * f + t * s + ph;
    float w = a * cos(c);
    grad += dir * (a * f * cos(c));
    xz += dir * w * disp;
    return a * sin(c);
  }

  void main() {
    vUv = uv;

    float t = uTime * 0.45;
    // Slow wind rotation — the whole sea drifts as one coherent body instead
    // of five independent scrolling layers.
    float wind = t * 0.02;
    mat2 rot = mat2(cos(wind), -sin(wind), sin(wind), cos(wind));
    vec2 p = position.xz;

    vec2 grad = vec2(0.0);
    vec2 xz = vec2(0.0);
    float y = 0.0;

    // Octave 1 — broad primary swell
    y += gerstner(p, t, rot * normalize(vec2(1.0, 0.35)), 0.30, 0.30, 1.1, 0.0, 0.35, grad, xz);
    // Octave 2 — secondary diagonal swell
    y += gerstner(p, t, rot * normalize(vec2(-0.6, 0.8)), 0.19, 0.52, 1.6, 1.9, 0.30, grad, xz);
    // Octave 3 — fine chop detail
    y += gerstner(p, t, rot * normalize(vec2(0.25, -0.9)), 0.10, 0.92, 2.3, 4.1, 0.25, grad, xz);
    // Octave 4 — high-frequency glint ripple (reads as sun shimmer on the surface)
    y += gerstner(p, t, rot * normalize(vec2(0.8, 0.55)), 0.05, 1.5, 2.9, 5.7, 0.15, grad, xz);
    // Octave 5 — micro ripple, adds crest texture at any distance
    y += gerstner(p, t, rot * normalize(vec2(0.35, 0.9)), 0.022, 2.6, 3.6, 8.2, 0.10, grad, xz);

    vec3 pos = position;
    pos.y += y * uAmplitude;
    pos.xz += xz * uAmplitude * 0.6;

    vec3 normal = normalize(vec3(-grad.x, 1.0, -grad.y));
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
  }
`

export const oceanGradientFragmentShader = `
  uniform vec3 uTopColor;
  uniform vec3 uMidColor;
  uniform vec3 uDeepColor;
  uniform vec3 uSunColor;
  uniform vec3 uHazeColor;
  uniform vec3 uLightDir;
  uniform float uTime;
  uniform float uClarity;
  uniform float uHazeDensity;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float ndv = abs(dot(normal, viewDir));
    float fresnel = pow(1.0 - ndv, 2.0);

    // Three-stop depth gradient — surface → mid → deep. Clarity pushes the
    // bright color deeper into the water column.
    float df = clamp((vWorldPos.y + 4.0) / (22.0 + 14.0 * uClarity), 0.0, 1.0);
    vec3 base = mix(uDeepColor, uMidColor, smoothstep(0.0, 0.6, df));
    base = mix(base, uTopColor, smoothstep(0.35, 1.0, df));

    // Cinematic fresnel blend — grazing angles fade the surface out so the
    // mid-water and seabed read through; straight-on stays solid.
    vec3 color = mix(base, uTopColor, fresnel * 0.65);

    vec3 lDir = normalize(uLightDir);
    vec3 refl = reflect(-viewDir, normal);

    // Warm sun glint on wave crests for sparkle.
    float spec = pow(max(dot(refl, lDir), 0.0), 48.0);
    color += mix(uTopColor, uSunColor, 0.7) * spec * 0.5 * (0.35 + df);
    // White-hot core of the glint — the surface "catches" the light.
    color += uSunColor * pow(spec, 2.0) * 0.3;

    // Broad low-power sheen lobe for a wet, oily-smooth surface look.
    float sheen = pow(max(dot(refl, lDir), 0.0), 6.0);
    color += uTopColor * sheen * 0.07 * (0.4 + df);

    // Crest foam — white where the wave steepens (normal pulled sideways).
    float steep = 1.0 - normal.y;
    color += uSunColor * smoothstep(0.72, 0.96, steep) * 0.22 * (0.3 + df);

    // Slow rolling light-bank shimmer — large-scale brightness undulation so
    // the surface never reads as static.
    float shimmer =
      0.5 + 0.5 * sin(vWorldPos.x * 0.35 + uTime * 0.25) * sin(vWorldPos.z * 0.3 - uTime * 0.2);
    color += uTopColor * shimmer * 0.05 * df;

    // Underwater haze — distance-based scattering toward the fog color, so
    // the surface dissolves into the depths instead of ending in a hard edge.
    float dist = length(cameraPosition - vWorldPos);
    float haze = 1.0 - exp(-dist * uHazeDensity);
    color = mix(color, uHazeColor, haze * 0.85);

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
