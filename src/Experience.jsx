import { useRef } from "react";
import vertexShader from "./shaders/test/vertex.glsl";
import fragmentShader from "./shaders/test/fragment.glsl";
export default function ShaderPlane() {
  const mesh = useRef();

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[5, 5, 32, 32]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}
