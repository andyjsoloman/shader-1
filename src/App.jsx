/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";

import "./App.css";
import Experience from "./Experience";
import { OrbitControls } from "@react-three/drei";

function App() {
  return (
    <>
      <Canvas shadows>
        <color args={["#292d35"]} attach="background" />
        <OrbitControls />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
