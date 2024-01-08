#include "/node_modules/lygia/generative/snoise.glsl"
varying vec2 vUv;
uniform float uTime;
uniform float uAm;
uniform float uFm;
uniform float uOffset;
uniform int uItr;

varying vec3 vPosition;

float fbm(vec4 p) {
  float sum = 0.;
  float amp = 1.;
  float scale = 1.;
  for(int i = 0; i < uItr; i++) {
    sum += snoise(p * scale) * amp;
    amp *= uAm;
    scale *= uFm;
    p.w += uOffset;
  }
  return sum;
}

void main() {
  vec4 p = vec4(vPosition * 4., uTime * .01);
  vec4 p1 = vec4(vPosition * 2., uTime * .01);
  float light = max(snoise(p1), 0.);
  float noisy = fbm(p);
  // noisy = fbm(vec4(vUv,0.,uTime*.01));
  gl_FragColor = vec4(vec3(noisy), 1.);
  gl_FragColor.xyz *= mix(1., light, .7);

}