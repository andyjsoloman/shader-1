/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/shader2/vertex-s2.glsl";
import fragmentShader from "./shaders/shader2/fragment-s2.glsl";
import { useFrame } from "@react-three/fiber";

export default function Shader2() {
  const mesh = useRef();

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
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <>
      <mesh ref={mesh}>
        <planeGeometry args={[5, 5, 128, 128]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          wireframe={true}
          side={THREE.DoubleSide}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
}
