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

    y += waveY(p, t, normalize(vec2(1.0, 0.35)), 0.24, 0.32, 1.1, 0.0, grad);
    y += waveY(p, t, normalize(vec2(-0.6, 0.8)), 0.15, 0.55, 1.6, 1.9, grad);
    y += waveY(p, t, normalize(vec2(0.25, -0.9)), 0.08, 0.95, 2.3, 4.1, grad);

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

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float ndv = abs(dot(normal, viewDir));
    float fresnel = pow(1.0 - ndv, 2.2);

    float depthFactor = clamp((vWorldPos.y + 4.0) / 32.0, 0.0, 1.0);
    vec3 base = mix(uDeepColor, uTopColor, depthFactor);

    vec3 color = mix(base, uTopColor, fresnel * 0.85);

    vec3 lDir = normalize(uLightDir);
    float spec = pow(max(dot(reflect(-viewDir, normal), lDir), 0.0), 48.0);
    color += uTopColor * spec * 0.35 * (0.35 + depthFactor);

    float alpha = mix(0.72, 0.96, fresnel);

    gl_FragColor = vec4(color, alpha);
  }
`

export const oceanGradientShader = {
  vertexShader: oceanGradientVertexShader,
  fragmentShader: oceanGradientFragmentShader,
}
