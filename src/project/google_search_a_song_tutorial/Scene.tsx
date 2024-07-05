import React from "react";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import { OrbitControls } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { BgMaterial } from "./shader";

import { ImprovedNoise } from "three/examples/jsm/Addons.js";
import { clamp, euclideanModulo } from "three/src/math/MathUtils.js";
import { useControls } from "leva";

const background = "#202125";
const red = "#ea4135";
const green = "#34a853";
const blue = "#1a73e9";
const yellow = "#fabd03";
const stripeColors = [yellow, blue, green, red, green, blue];

function stripe(value: number, length: number) {
  value = euclideanModulo(value, length) / length;
  value = Math.floor(value * stripeColors.length);
  return stripeColors[value];
}

function OuterPoints() {
  const dots = useRef<THREE.Group>(null!);
  const [colors, setColors] = useState<string[]>(null!);
  const noise = useMemo(() => {
    return new ImprovedNoise();
  }, []);

  const positions = useMemo(() => {
    const sphereGeom = new THREE.IcosahedronGeometry(1.0, 3);
    let gp = sphereGeom.attributes.position;

    const wPos = Array<THREE.Vector3>();
    for (let i = 0; i < gp.count; i++) {
      let p = new THREE.Vector3().fromBufferAttribute(gp, i);
      if (wPos.every((e) => !e.equals(p))) {
        wPos.push(p);
      }
    }
    return wPos;
  }, []);
  useFrame((state) => {
    dots.current.children.forEach((e) => e.lookAt(state.camera.position));
    const newColors = [];
    for (let dot of dots.current.children) {
      const normal = dot.position.clone().normalize();
      let val = noise.noise(
        normal.x / 2.5 + state.clock.oldTime / 800,
        normal.y / 2.5,
        normal.z / 2.5
      );

      newColors.push(stripe(val * 0.5 + state.clock.oldTime / 1000, 0.9));
    }
    setColors(newColors);
    const amplitude = 0.05;
    for (let dot of dots.current.children) {
      const phase =
        (noise.noise(
          dot.position.x + state.clock.oldTime / 1000,
          dot.position.y,
          dot.position.z
        ) *
          2 *
          Math.PI) /
        0.9;
      let length = 1 + amplitude * Math.sin(state.clock.oldTime / 100 + phase);
      length = clamp(length, 0.2, 1.2);
      dot.position.setLength(length);
      dot.scale.set(length, length, length);
    }
  });
  return (
    <>
      <group ref={dots}>
        {positions.map((pos, i) => (
          <mesh position={pos} key={i}>
            <meshBasicMaterial color={colors ? colors[i] : "white"} />
            <circleGeometry args={[0.025]} />
          </mesh>
        ))}
      </group>
    </>
  );
}
export default function Scene() {
  const centerPlane = useRef<Mesh>(null!);
  useFrame((state) => {
    centerPlane.current.lookAt(state.camera.position);
  });
  return (
    <>
      <OrbitControls
        enableZoom={false}
        autoRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <ambientLight intensity={0.2} />
      <directionalLight intensity={0.5} position={[1, 1, 2]} />
      <mesh ref={centerPlane}>
        <meshBasicMaterial color={background} />
        <planeGeometry args={[10, 10]} />
      </mesh>
      <OuterPoints />
    </>
  );
}
