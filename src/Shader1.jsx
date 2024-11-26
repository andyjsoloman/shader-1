/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/shader1/vertex-a-s1.glsl";
import vertexShaderReverse from "./shaders/shader1/vertex-b-s1.glsl";
import fragmentShader from "./shaders/shader1/fragment-s1.glsl";
import { useFrame } from "@react-three/fiber";

export default function Shader1() {
  const mesh1 = useRef();
  const mesh2 = useRef();

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    mesh1.current.material.uniforms.u_time.value = clock.getElapsedTime();
    mesh2.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <>
      <mesh ref={mesh1} position={[22.2, 0, 0]} rotation-y={-0.5}>
        <planeGeometry args={[5, 5, 128, 128]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShaderReverse}
          side={THREE.DoubleSide}
          uniforms={uniforms}
        />
      </mesh>
      <mesh ref={mesh2} position={[17.8, 0, 0]} rotation-y={0.5}>
        <planeGeometry args={[5, 5, 128, 128]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          side={THREE.DoubleSide}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
}
