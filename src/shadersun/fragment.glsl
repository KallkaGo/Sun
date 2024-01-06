uniform samplerCube uPerlin;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

varying vec3 dir;
varying vec3 vNormal;

float sun() {
  float sum = 0.;
  sum += textureCube(uPerlin, vLayer0).r;
  sum += textureCube(uPerlin, vLayer1).r;
  sum += textureCube(uPerlin, vLayer2).r;
  sum *= .33;
  return sum;
}

vec3 brightnessToColor(float b) {
  b *= .25;
  return (vec3(b, b * b, b * b * b * b) / .25) * .8;
}

float fresnel(vec3 dir, vec3 worldNormal) {
  return pow(1. - clamp(dot(dir, worldNormal), 0., 1.), 3.);
}

void main() {
  float brightness = sun();
  float strength = fresnel(dir, vNormal);
  brightness = brightness * 4. + 1.;
  brightness += strength;
  vec3 col = brightnessToColor(brightness);
  gl_FragColor = vec4(col, 1.);
  // gl_FragColor = vec4(strength );

}