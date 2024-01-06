uniform samplerCube uPerlin;

varying vec3 vPosition;

vec3 brightnessToColor(float b) {
  b *= .25;
  return (vec3(b, b * b, b * b * b * b) / .25) * .8;
}

void main() {
  float radial = 1. - vPosition.z;

  radial = pow(radial, 3.);

  float birghtness = 1. + radial * .83;

  gl_FragColor.rgb = brightnessToColor(birghtness);

  gl_FragColor.a = radial;


}