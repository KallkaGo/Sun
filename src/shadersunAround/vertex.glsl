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

  vNormal = normal;

  vec4 modelPosition = modelMatrix * vec4(position, 1.);

  dir = normalize(modelPosition.xyz - cameraPosition);

  vec4 viewPosition = viewMatrix * modelPosition; 
  vec4 projectedPosition = projectionMatrix * viewPosition;
  vPosition = position;
  vUv = uv;
  gl_Position = projectedPosition;
}