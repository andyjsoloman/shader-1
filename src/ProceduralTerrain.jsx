/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/proceduralTerrain/pt-vertex.glsl";
import fragmentShader from "./shaders/proceduralTerrain/pt-fragment.glsl";
import { useFrame, useThree } from "@react-three/fiber";
import { GUI } from "lil-gui";
import { SUBTRACTION, Evaluator, Brush } from "three-bvh-csg";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function ProceduralTerrain() {
  const mesh = useRef();

  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(10, 10, 512, 512);
    geom.rotateX(-Math.PI / 2); // Rotate once
    return geom;
  }, []);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
    }),
    []
  );

  // Define the custom shader material
  const material = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshStandardMaterial,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      //   silent: true,

      // MeshStandardMaterial properties
      metalness: 0,
      roughness: 0.5,

      // Custom shader properties

      uniforms: uniforms,
      wireframe: false,

      side: THREE.DoubleSide,
    });
  }, [uniforms]);

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  useEffect(() => {
    const gui = new GUI({ width: 400 });

    return () => {
      gui.destroy();
    };
  }, []);

  // Create the board using CSG
  const board = useMemo(() => {
    const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11));
    const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10));
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

  const { scene } = useThree();

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
        castShadow
        receiveShadow
        rotation={[-Math.PI, 0, 0]}
        geometry={geometry}
      >
        <primitive object={material} attach="material" />
      </mesh>
    </>
  );
}
