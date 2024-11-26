uniform float u_time;
uniform vec2 u_frequency;



varying float vZPosition;  // Varying for z position

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * u_frequency.x + u_time * 2.0) * 0.2;
  modelPosition.z += sin(modelPosition.y * u_frequency.y + u_time * 2.0) * 0.2;

  // Pass the modified z position to the fragment shader
  vZPosition = modelPosition.z;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

}