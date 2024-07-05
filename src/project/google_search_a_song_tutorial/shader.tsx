import { shaderMaterial } from "@react-three/drei";
import { background } from "../../lib/colors";
import * as THREE from "three";

export const BgMaterial = shaderMaterial(
  {
    uColor: new THREE.Color(background),
  },
  /*glsl*/ `
 varying vec2 vUv;
 void main() {
   vUv = uv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`,
  /*glsl*/ `
  uniform vec3 uColor;
  void main(){
    gl_FragColor = vec4(vec3(0.125,0.129,0.145), 1.0);
  }
  `
);
