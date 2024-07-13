import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { ImprovedNoise } from "three/examples/jsm/Addons.js";
import { clamp, euclideanModulo } from "three/src/math/MathUtils.js";
import { useControls } from "leva";

const background = "#202125";
const red = "#ea4135";
const green = "#34a853";
const blue = "#1a73e9";
const yellow = "#fabd03";
const stripeColors = [yellow, yellow, blue, green, red, red, green, blue];

function stripe(value: number, length: number) {
  value = euclideanModulo(value, length) / length;
  value = Math.floor(value * stripeColors.length);
  return stripeColors[value];
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
      let val = noise.noise(
        normal.x / 2.5 + state.clock.oldTime / 800,
        normal.y / 2.5,
        normal.z / 2.5
      );

      newColors.push(stripe(val * 0.5 + state.clock.oldTime / 1000, 0.9));
    }
    setColors(newColors);

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
      const scale = 1 + 2 * (length - 1);
      dot.scale.set(scale, scale, scale);
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
    amplitude: { value: 0.02, min: 0, max: 0.5, step: 0.01 },
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
        <meshBasicMaterial color={background} />
        <planeGeometry args={[10, 10]} />
      </mesh>

      <OuterPoints amplitude={Math.max(amplitude, control.amplitude)} />
    </>
  );
}
