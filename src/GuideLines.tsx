import { Line } from "@react-three/drei";
import * as THREE from "three";

export function GuideLines() {
  const pointsX = [];
  pointsX.push(new THREE.Vector3(-500, 0, 0));
  pointsX.push(new THREE.Vector3(500, 0, 0));
  const pointsY = [];
  pointsY.push(new THREE.Vector3(0, 500, 0));
  pointsY.push(new THREE.Vector3(0, -500, 0));

  return (
    <>
      <Line points={pointsX} color="red" lineWidth={1} />
      <Line points={pointsY} color="lime" lineWidth={1} />
    </>
  );
}
