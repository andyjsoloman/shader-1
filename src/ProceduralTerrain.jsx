/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/proceduralTerrain/pt-vertex.glsl";
import fragmentShader from "./shaders/proceduralTerrain/pt-fragment.glsl";
import cloudFragmentShader from "./shaders/proceduralTerrain/cloud-fragment.glsl";
import cloudVertexShader from "./shaders/proceduralTerrain/cloud-vertex.glsl";
import { useFrame, useThree } from "@react-three/fiber";
import { GUI } from "lil-gui";
import { SUBTRACTION, Evaluator, Brush } from "three-bvh-csg";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function ProceduralTerrain() {
  const mesh = useRef();
  const { scene } = useThree();
  const debugObject = {};

  debugObject.colorWaterDeep = "#002b3d";
  debugObject.colorWaterSurface = "#66a8ff";
  debugObject.colorSand = "#ffe894";
  debugObject.colorGrass = "#85d534";
  debugObject.colorSnow = "#ffffff";
  debugObject.colorRock = "#bfbd8d";

  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(-12, 4, 0);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(15, 15, 512, 512);
    geom.rotateX(-Math.PI / 2);
    // geom.deleteAttribute("uv");
    geom.deleteAttribute("normal");
    return geom;
  }, []);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_positionFrequency: { value: 0.2 },
      u_strength: { value: 2.5 },
      u_warpFrequency: { value: 2.75 },
      u_warpStrength: { value: 0.4 },
      u_colorWaterDeep: { value: new THREE.Color(debugObject.colorWaterDeep) },
      u_colorWaterSurface: {
        value: new THREE.Color(debugObject.colorWaterSurface),
      },
      u_colorSand: { value: new THREE.Color(debugObject.colorSand) },
      u_colorGrass: { value: new THREE.Color(debugObject.colorGrass) },
      u_colorSnow: { value: new THREE.Color(debugObject.colorSnow) },
      u_colorRock: { value: new THREE.Color(debugObject.colorRock) },
    }),
    []
  );

  const cloudUniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_color: { value: new THREE.Color("#ffffff") },
    }),
    []
  );

  const material = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshStandardMaterial,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      //   silent: true,

      // MeshStandardMaterial properties
      metalness: 0,
      roughness: 0.5,
      color: "#85d534",

      // Custom shader properties
      //   castShadow: true,
      //   receiveShadow: true,
      uniforms: uniforms,
      wireframe: false,

      side: THREE.DoubleSide,
    });
  }, [uniforms]);

  const depthMaterial = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      uniforms,
      vertexShader: vertexShader,

      //   silent: true,

      // MeshDepthMaterial properties
      depthPacking: THREE.RGBADepthPacking,
    });
  }, [uniforms]);

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  useEffect(() => {
    const gui = new GUI({ width: 400 });
    gui
      .add(uniforms.u_positionFrequency, "value", 0, 1, 0.001)
      .name("u_positionFrequency");
    gui.add(uniforms.u_strength, "value", 0, 10, 0.001).name("u_strength");
    gui
      .add(uniforms.u_warpFrequency, "value", 0, 10, 0.001)
      .name("u_warpFrequency");
    gui
      .add(uniforms.u_warpStrength, "value", 0, 1, 0.001)
      .name("u_warpStrength");
    gui
      .addColor(debugObject, "colorWaterDeep")
      .onChange(() =>
        uniforms.u_colorWaterDeep.value.set(debugObject.colorWaterDeep)
      );
    gui
      .addColor(debugObject, "colorWaterSurface")
      .onChange(() =>
        uniforms.u_colorWaterSurface.value.set(debugObject.colorWaterSurface)
      );
    gui
      .addColor(debugObject, "colorSand")
      .onChange(() => uniforms.u_colorSand.value.set(debugObject.colorSand));
    gui
      .addColor(debugObject, "colorGrass")
      .onChange(() => uniforms.u_colorGrass.value.set(debugObject.colorGrass));
    gui
      .addColor(debugObject, "colorSnow")
      .onChange(() => uniforms.u_colorSnow.value.set(debugObject.colorSnow));
    gui
      .addColor(debugObject, "colorRock")
      .onChange(() => uniforms.u_colorRock.value.set(debugObject.colorRock));
    return () => gui.destroy();
  }, [uniforms]);

  //WATER
  const water = useMemo(() => {
    return new THREE.Mesh(
      new THREE.CircleGeometry(7.5, 32),
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0.4,
      })
    );
  }, []);

  useEffect(() => {
    if (water) {
      water.rotation.x = -Math.PI * 0.5;
      water.position.y = -0.1;
      scene.add(water);

      return () => {
        scene.remove(water);
      };
    }
  }, [water, scene]);

  //SMOKE
  const clouds = useMemo(() => {
    const geom = new THREE.PlaneGeometry(15, 15, 512, 512);
    geom.rotateX(-Math.PI / 2);
    // geom.deleteAttribute("uv");
    geom.deleteAttribute("normal");
    return geom;
  }, []);

  //BOARD
  const board = useMemo(() => {
    const boardFill = new Brush(new THREE.CylinderGeometry(8, 8, 2, 64));
    const boardHole = new Brush(new THREE.CylinderGeometry(7.5, 7.5, 2.5, 64));
    boardHole.position.y = 0.2;
    boardHole.updateMatrixWorld();
    const evaluator = new Evaluator();

    return evaluator.evaluate(boardFill, boardHole, SUBTRACTION);
  }, []);

  board.geometry.clearGroups();
  board.material = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: 0.3,
  });
  board.castShadow = true;
  board.receiveShadow = true;

  // Add the board to the scene
  useEffect(() => {
    if (board) {
      board.position.set(0, 0, 0);
      scene.add(board);

      return () => {
        scene.remove(board);
      };
    }
  }, [board, scene]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        color="#ffffff"
        intensity={1}
        position={[6.25, 3, 1]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-top={8}
        shadow-camera-right={8}
        shadow-camera-bottom={-8}
        shadow-camera-left={-8}
      />
      <mesh
        ref={mesh}
        position={[0, 0, 0]}
        rotation={[-Math.PI, 0, 0]}
        geometry={geometry}
        customDepthMaterial={depthMaterial}
      >
        <primitive object={material} attach="material" />
      </mesh>
      <mesh
        position={[0, 0.25, 0]}
        rotation={[-Math.PI, 0, 0]}
        geometry={clouds}
      >
        <shaderMaterial
          fragmentShader={cloudFragmentShader}
          vertexShader={cloudVertexShader}
          wireframe={true}
          side={THREE.DoubleSide}
          uniforms={cloudUniforms}
        />
      </mesh>
    </>
  );
}
