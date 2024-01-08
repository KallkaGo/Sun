varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  vPosition = position;
  vUv = uv;
  gl_Position = projectedPosition;
}