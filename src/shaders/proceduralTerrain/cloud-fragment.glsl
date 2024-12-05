precision mediump float;

uniform float u_time;
varying vec2 vUv;
// varying float vZPosition;

void main() {

    vec2 center = vec2(0.5); // Center of the circle
    float radius = 0.5; // Adjust radius for visibility

    // Calculate distance from center
    float dist = distance(vUv, center);

    // Discard fragments outside the circle
    if (dist > radius) {
        discard;
    }

  gl_FragColor = vec4(1.0,0.5,0.0, 1.0);
}
