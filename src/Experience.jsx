import * as THREE from "three";
import Shader1 from "./Shader1";
import Shader2 from "./Shader2";
import Shader3 from "./Shader3";
import Shader4 from "./Shader4";
import useFirework from "./effects/useFirework";

export default function Experience() {
  useFirework(100, new THREE.Vector3());
  return (
    <>
      <Shader1 />
      <Shader2 />;
      <Shader3 />
      <Shader4 />
    </>
  );
}
