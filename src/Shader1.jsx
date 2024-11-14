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

  //RANDOMS FUNCTION
  // useEffect(() => {
  //   if (mesh1.current) {
  //     const count = mesh1.current.geometry.attributes.position.count;
  //     const randoms = new Float32Array(count);

  //     for (let i = 0; i < count; i++) {
  //       randoms[i] = Math.random();
  //     }

  //     mesh1.current.geometry.setAttribute(
  //       "aRandom",
  //       new THREE.BufferAttribute(randoms, 1)
  //     );
  //   }
  // }, []);

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
      <mesh ref={mesh1} position={[2.2, 0, 0]} rotation-y={-0.5}>
        <planeGeometry args={[5, 5, 128, 128]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShaderReverse}
          // wireframe={true}
          side={THREE.DoubleSide}
          uniforms={uniforms}
        />
      </mesh>
      <mesh ref={mesh2} position={[-2.2, 0, 0]} rotation-y={0.5}>
        <planeGeometry args={[5, 5, 128, 128]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          // wireframe={true}
          side={THREE.DoubleSide}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
}
