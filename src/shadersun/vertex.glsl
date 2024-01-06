varying vec2 vUv;
varying vec3 vPosition;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

varying vec3 dir;
varying vec3 vNormal;

uniform float uTime;

mat2 rotate(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {

  vNormal = (modelMatrix * vec4(normal, 0.)).xyz;
  float t = uTime * 0.005;
  mat2 rot = rotate(t);

  vec3 p0 = position;
  p0.yz = rot * p0.yz;
  vLayer0 = p0;

  mat2 rot1 = rotate(t + 10.);
  vec3 p1 = position;
  p1.xz = rot1 * p1.xz;
  vLayer1 = p1;

  mat2 rot2 = rotate(t + 30.);
  vec3 p2 = position;
  p2.xy = rot2 * p2.xy;
  vLayer2 = p2;

  vec4 modelPosition = modelMatrix * vec4(position, 1.);

  dir = normalize(cameraPosition - modelPosition.xyz);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  vPosition = position;
  vUv = uv;
  gl_Position = projectedPosition;
}