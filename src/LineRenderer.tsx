// LineRenderer.tsx
import { Line } from "@react-three/drei";
import * as THREE from "three";

export function LineRenderer({
  points,
  color,
  width,
}: {
  points: THREE.Vector3[];
  color: string;
  width: number;
}) {
  return (
    <Line
      points={points}
      color={color}
      lineWidth={width}
      position={[0, 0, 0]}
      opacity={0.75}
      transparent={true}
    />
  );
}
