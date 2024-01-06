#include "/node_modules/lygia/generative/snoise.glsl"
varying vec2 vUv;
uniform float uTime;
varying vec3 vPosition;

float fbm(vec4 p) {
  float sum = 0.;
  float amp = 1.;
  float scale = 1.;
  for(int i = 0; i < 8; i++) {
    sum += snoise(p * scale) * amp;
    amp *= .9;
    scale *= 2.;
    p.w += 100.;
  }
  return sum;
}

void main() {
  vec4 p = vec4(vPosition * 4., uTime * .01);
  vec4 p1 = vec4(vPosition * 2., uTime * .01);
  float light = max(snoise(p1), 0.);
  float noisy = fbm(p);
  gl_FragColor = vec4(vec3(noisy), 1.);
  gl_FragColor.xyz *= mix(1.,light,.7);

}