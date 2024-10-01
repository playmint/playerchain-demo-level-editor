// LineRenderer.tsx
import { Line } from "@react-three/drei";
import * as THREE from "three";

export function LineRenderer({
  points,
  color,
}: {
  points: THREE.Vector3[];
  color: string;
}) {
  return (
    <Line
      points={points}
      color={color}
      lineWidth={5}
      position={[0, 0, 0]}
      opacity={0.75}
      transparent={true}
    />
  );
}
