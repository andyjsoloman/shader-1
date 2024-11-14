precision mediump float;

uniform float u_time;
varying float vZPosition;

void main() {
  // Map the z position to a color gradient
  float colorFactor = (sin(vZPosition * 5.0) + 1.0) * 0.5; // Range [0, 1]
  
  // Use colorFactor to create a gradient effect
  vec3 color = mix(vec3(0.3058,0.8039,0.7686), vec3(0.3333,0.3843,0.4392), colorFactor);

  gl_FragColor = vec4(color, 1.0);
}


