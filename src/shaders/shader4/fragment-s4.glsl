precision mediump float;

uniform vec3 u_depthColor;
uniform vec3 u_surfaceColor;
uniform float u_colorOffset;
uniform float u_colorMultiplier;

varying vec2 vUv;
varying float vElevation;



void main() {

    vec2 center = vec2(0.5); // Center of the circle
    float radius = 0.5; // Adjust radius for visibility

    // Calculate distance from center
    float dist = distance(vUv, center);

    // Discard fragments outside the circle
    if (dist > radius) {
        discard;
    }

float mixStrength = (vElevation + u_colorOffset) * u_colorMultiplier;
vec3 color = mix(u_depthColor, u_surfaceColor, mixStrength);

  gl_FragColor = vec4(color,1.0);


}


