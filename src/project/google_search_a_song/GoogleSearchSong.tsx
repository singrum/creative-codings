import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

export default function GoogleSearchSong() {
  return (
    <>
      <div className="flex flex-col h-full items-center justify-center">
        <div className="flex flex-col h-[500px]">
          <div className="text-[#969ba1] flex justify-center h-6">
            듣는 중...
          </div>
          <Canvas
            camera={{ position: [0, 0, 3] }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.NoToneMapping;
            }}
          >
            <Scene />
          </Canvas>
          <div className="text-[#969ba1] flex justify-center h-6"></div>
        </div>
      </div>
    </>
  );
}
