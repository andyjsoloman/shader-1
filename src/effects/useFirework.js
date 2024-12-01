import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import fireworkVertexShader from "../shaders/firework/vertex.glsl";
import fireworkFragmentShader from "../shaders/firework/fragment.glsl";

export default function useFirework(count, position) {
  const { scene } = useThree();
  const positionsArray = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    positionsArray[i3] = Math.random() - 0.5;
    positionsArray[i3 + 1] = Math.random() - 0.5;
    positionsArray[i3 + 2] = Math.random() - 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionsArray, 3)
  );

  //Material
  const material = new THREE.ShaderMaterial({
    vertexShader: fireworkVertexShader,
    fragmentShader: fireworkFragmentShader,
  });

  //Points
  const firework = new THREE.Points(geometry, material);
  firework.position.copy(position);
  scene.add(firework);
}
