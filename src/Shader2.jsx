/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/shader2/vertex-s2.glsl";
import fragmentShader from "./shaders/shader2/fragment-s2.glsl";
import { useFrame } from "@react-three/fiber";

export default function Shader2() {
  const mesh = useRef();

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_frequency: { value: new THREE.Vector2(10, 5) },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={mesh} position={[20, 0, 0]}>
      <planeGeometry args={[5, 5, 128, 128]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        wireframe={true}
        side={THREE.DoubleSide}
        uniforms={uniforms}
      />
    </mesh>
  );
}
