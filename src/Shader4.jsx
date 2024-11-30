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
  const debugObject = {};

  debugObject.depthColor = "#186691";
  debugObject.surfaceColor = "#9BD8FF";

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_frequency: { value: new THREE.Vector2(10, 5) },
      u_bigWavesElevation: { value: 0.2 },
      u_bigWavesFrequency: { value: new THREE.Vector2(1, 2) },
      u_bigWavesSpeed: { value: 0.75 },
      u_depthColor: { value: new THREE.Color(debugObject.depthColor) },
      u_surfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
      u_colorOffset: { value: 0.175 },
      u_colorMultiplier: { value: 5 },
      u_smallWavesElevation: { value: 0.15 },
      u_smallWavesFrequency: { value: 1.5 },
      u_smallWavesSpeed: { value: 0.2 },
      u_smallWavesIterations: { value: 4 },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  useEffect(() => {
    const gui = new GUI({ width: 400 });
    gui.add(mesh.current.rotation, "x", 0, Math.PI * 2);
    gui.add(mesh.current.rotation, "y", 0, Math.PI * 2);
    gui.add(mesh.current.rotation, "z", 0, Math.PI * 2);
    gui
      .add(uniforms.u_bigWavesElevation, "value")
      .min(0)
      .max(1)
      .name("u_bigWavesElevation");
    gui
      .add(uniforms.u_bigWavesFrequency.value, "x")
      .min(0)
      .max(10)
      .name("u_bigWavesFrequencyX");
    gui
      .add(uniforms.u_bigWavesFrequency.value, "y")
      .min(0)
      .max(10)
      .name("u_bigWavesFrequencyY");
    gui
      .add(uniforms.u_bigWavesSpeed, "value")
      .min(0)
      .max(4)
      .name("u_bigWavesSpeed");
    gui
      .add(uniforms.u_smallWavesElevation, "value")
      .min(0)
      .max(1)
      .name("u_smallWavesElevation");
    gui
      .add(uniforms.u_smallWavesFrequency, "value")
      .min(0)
      .max(10)
      .name("u_smallWavesFrequency");
    gui
      .add(uniforms.u_smallWavesSpeed, "value")
      .min(0)
      .max(4)
      .name("u_smallWavesSpeed");
    gui
      .add(uniforms.u_smallWavesIterations, "value")
      .min(0)
      .max(5)
      .step(1)
      .name("u_smallWavesIterations");
    gui
      .addColor(debugObject, "depthColor")
      .name("depthColor")
      .onChange(() => {
        uniforms.u_depthColor.value.set(debugObject.depthColor);
      });
    gui
      .addColor(debugObject, "surfaceColor")
      .name("surfaceColor")
      .onChange(() => {
        uniforms.u_depthColor.value.set(debugObject.surfaceColor);
      });
    gui
      .add(uniforms.u_colorOffset, "value")
      .min(0)
      .max(1)
      .name("u_colorOffset");
    gui
      .add(uniforms.u_colorMultiplier, "value")
      .min(0)
      .max(10)
      .name("u_colorMultiplier");
    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <mesh ref={mesh} rotation={[Math.PI / 1.6, 0, 0]}>
      <planeGeometry args={[5, 5, 512, 512]} />
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
