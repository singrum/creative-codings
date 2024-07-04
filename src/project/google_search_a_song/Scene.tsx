import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import { OrbitControls } from "@react-three/drei";
import { background, blue, green, red, yellow } from "../../lib/colors";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { BgMaterial } from "./shader";

import { ImprovedNoise } from "three/examples/jsm/Addons.js";
import { clamp } from "three/src/math/MathUtils.js";

extend({ BgMaterial });

function getColorByValue(value: number) {
  // 0, 1

  const absVal = Math.abs(value - 0.5) * 2;

  if (absVal < 1 / 7) {
    return red;
  } else if (absVal < 3 / 7) {
    return green;
  } else if (absVal < 5 / 7) {
    return blue;
  } else {
    return yellow;
  }
}

function OuterPoints({ amplitude }: { amplitude: number }) {
  const dots = useRef<THREE.Group>(null!);
  const [colors, setColors] = useState<string[]>(null!);
  const noise = useMemo(() => {
    return new ImprovedNoise();
  }, []);

  const positions = useMemo(() => {
    const sphereGeom = new THREE.IcosahedronGeometry(1.0, 2);
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
      const hypot = Math.hypot(dot.position.x, dot.position.z);
      let val =
        Math.atan(dot.position.y / hypot) +
        noise.noise(
          Math.atan(dot.position.x / dot.position.z),
          Math.atan(dot.position.y / hypot),
          state.clock.oldTime / 500
        ) *
          1;
      val = (val + Math.PI / 2 + state.clock.oldTime / 500) % Math.PI;
      val = val < 0 ? val + Math.PI : val;
      val = val / Math.PI;
      newColors.push(getColorByValue(val));
    }
    setColors(newColors);

    for (let dot of dots.current.children) {
      const hypot = Math.hypot(dot.position.x, dot.position.z);
      let length =
        1 +
        amplitude *
          Math.sin(
            (state.clock.oldTime * 10) / 1000 +
              noise.noise(
                Math.atan(dot.position.x / dot.position.z) * 1000,
                Math.atan(dot.position.y / hypot) * 1000,
                0 // state.clock.oldTime / 1000
              ) *
                1.0 *
                Math.PI
          );
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
            <circleGeometry args={[0.03]} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default function Scene() {
  const centerCircle = useRef<Mesh>(null!);
  const [amplitude, setAmplitude] = useState<number>(0);
  const [analyser, setAnalyser] = useState<AnalyserNode>(null!);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const context = new AudioContext();
      const analyser_ = context.createAnalyser();
      const mediaStreamAudioSourceNode =
        context.createMediaStreamSource(stream);
      mediaStreamAudioSourceNode.connect(analyser_, 0);

      setAnalyser(analyser_);
    });
  }, []);
  useFrame((state) => {
    const pcmData = new Float32Array(analyser.fftSize);
    centerCircle.current.lookAt(state.camera.position);
    analyser.getFloatTimeDomainData(pcmData);
    let sum = 0.0;
    for (const amplitude of pcmData) {
      sum += amplitude * amplitude;
    }
    const rms = Math.sqrt(sum / pcmData.length);
    setAmplitude(Math.min(1, rms / 0.5));
  });

  return (
    <>
      <color attach="background" args={[background]} />
      <OrbitControls
        enableZoom={false}
        autoRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <ambientLight intensity={1} />

      {/* <directionalLight /> */}

      <mesh ref={centerCircle}>
        <bgMaterial />
        <circleGeometry args={[1.0]} />
      </mesh>

      <OuterPoints amplitude={amplitude} />
    </>
  );
}
