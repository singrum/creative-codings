import { ImprovedNoise } from "three/examples/jsm/Addons.js";
import create from "zustand";

interface NoiseInfo {
  noise: ImprovedNoise;
  getNoise: (noise: string) => ImprovedNoise;
}

export const useUser = create<NoiseInfo>()((set) => ({
  noise: new ImprovedNoise(),
}));
