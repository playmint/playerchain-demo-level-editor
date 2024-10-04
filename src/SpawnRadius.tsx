// SpawnRadius.tsx
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

interface SpawnRadiusProps {
  radius: number;
}

function SpawnRadius({ radius }: SpawnRadiusProps) {
  const lineRef = useRef<THREE.LineLoop>(null);

  // Memoize the geometry to prevent unnecessary recalculations
  const geometry = useMemo(() => {
    const points = [];
    const segments = 48;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0)
      );
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [radius]);

  // Compute line distances required for dashed lines
  useEffect(() => {
    if (lineRef.current) {
      (
        lineRef.current.geometry as THREE.BufferGeometry
      ).computeBoundingSphere();
    }
  }, [geometry]);

  return (
    <lineLoop ref={lineRef} geometry={geometry}>
      <lineDashedMaterial
        color="white"
        dashSize={10}
        gapSize={10}
        linewidth={1}
        transparent
        opacity={0.2}
      />
    </lineLoop>
  );
}

export default SpawnRadius;
