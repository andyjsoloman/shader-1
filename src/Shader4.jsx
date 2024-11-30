/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/shader4/vertex-s4.glsl";
import fragmentShader from "./shaders/shader4/fragment-s4.glsl";
import { useFrame } from "@react-three/fiber";
import { GUI } from "lil-gui";

export default function Shader4() {
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

  useEffect(() => {
    const gui = new GUI();
    gui.add(mesh.current.rotation, "x", 0, Math.PI * 2);
    gui.add(mesh.current.rotation, "y", 0, Math.PI * 2);
    gui.add(mesh.current.rotation, "z", 0, Math.PI * 2);
    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[5, 5, 128, 128]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        wireframe={false}
        side={THREE.DoubleSide}
        uniforms={uniforms}
      />
    </mesh>
  );
}
