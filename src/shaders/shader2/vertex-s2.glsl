uniform float u_time;
attribute float aRandom;

varying vec2 vUv;
varying float vZPosition;  // Varying for z position

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * 4.0 + u_time * 2.0) * 0.2;
  
  modelPosition.y += sin(modelPosition.z * 6.0 + u_time * 2.0) * 0.1;

  // Pass the modified z position to the fragment shader
  vZPosition = modelPosition.z;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}