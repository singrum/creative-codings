import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import { OrbitControls } from "@react-three/drei";
import { background, blue, green, red, yellow } from "../../lib/colors";
import { extend, useFrame } from "@react-three/fiber";
import { BgMaterial } from "./shader";

import { ImprovedNoise } from "three/examples/jsm/Addons.js";
import { clamp } from "three/src/math/MathUtils.js";
import { useControls } from "leva";

extend({ BgMaterial });

function stripe(value: number) {
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
      normal.setY(normal.y + state.clock.oldTime / 1000);
      let val = noise.noise(normal.x / 4, normal.y / 4, normal.z / 4) * 1;

      val = (val + state.clock.oldTime / 800) % 1;
      newColors.push(stripe(val));
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
                Math.atan(dot.position.x / dot.position.z) * 1,
                Math.atan(dot.position.y / hypot) * 1,
                state.clock.oldTime / 1000
              ) *
                2.0 *
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
            <circleGeometry args={[0.025]} />
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
    centerCircle.current.lookAt(state.camera.position);
    if (!analyser) {
      return;
    }
    const pcmData = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(pcmData);
    let sum = 0.0;
    for (const amplitude of pcmData) {
      sum += amplitude * amplitude;
    }
    const rms = Math.sqrt(sum / pcmData.length);
    setAmplitude(Math.min(1, rms / 0.5));
  });
  const control = useControls("control", {
    amplitude: { value: 0, min: 0, max: 0.5, step: 0.01 },
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

      <mesh ref={centerCircle}>
        {/* @ts-ignore */}
        <bgMaterial />
        <planeGeometry args={[10, 10]} />
      </mesh>

      <OuterPoints amplitude={Math.max(amplitude, control.amplitude)} />
    </>
  );
}
