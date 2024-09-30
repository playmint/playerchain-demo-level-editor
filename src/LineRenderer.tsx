// LineRenderer.tsx
import { Line } from "@react-three/drei";
import * as THREE from "three";

export function LineRenderer({ points }: { points: THREE.Vector3[] }) {
  return (
    <Line
      points={points}
      color="white"
      lineWidth={5}
      position={[0, 0, 0]}
      opacity={0.75}
      transparent={true}
    />
  );
}
