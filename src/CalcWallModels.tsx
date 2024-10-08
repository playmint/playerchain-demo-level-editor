import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import wall_mediumGLTF from "./assets/walls/wall_medium2.glb?url";
import wall_largeGLTF from "./assets/walls/wall_large2.glb?url";
import wall_cornerMediumGLTF from "./assets/walls/wall_cornerMedium2.glb?url";

interface CalcWallModelsProps {
  lines: THREE.Vector3[][];
  setModels: (
    models: { name: string; position: THREE.Vector3; rotation: number }[]
  ) => void;
}

const CalcWallModels: React.FC<CalcWallModelsProps> = ({
  lines,
  setModels,
}) => {
  const { scene: wallMedium } = useGLTF(wall_mediumGLTF);
  const { scene: wallLarge } = useGLTF(wall_largeGLTF);
  const { scene: wallCornerMedium } = useGLTF(wall_cornerMediumGLTF);
  const groupRef = useRef<THREE.Group>(null);
  let models: { name: string; position: THREE.Vector3; rotation: number }[] =
    [];

  useEffect(() => {
    calculateWalls();
    setModels(models);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  const calculateWalls = () => {
    // Clear previous walls
    if (groupRef.current) {
      groupRef.current.clear();
    }
    models = [];

    lines.forEach((line) => {
      for (let i = 0; i < line.length - 1; i++) {
        const start = new THREE.Vector3(...line[i]);
        const end = new THREE.Vector3(...line[i + 1]);

        const distance = start.distanceTo(end);
        const rotation = Math.atan2(end.y - start.y, end.x - start.x);
        const isDiagonal =
          Math.abs(end.x - start.x) === Math.abs(end.y - start.y);

        if (isDiagonal) {
          // Place a corner wall
          placeWall(
            wallCornerMedium,
            start,
            rotation + Math.PI / 4,
            "wallCornerMedium"
          );
        } else {
          let remainingDistance = distance;
          const currentPosition = start.clone();

          while (remainingDistance > 0) {
            if (remainingDistance >= 20) {
              // Place a large wall
              placeWall(
                wallLarge,
                currentPosition,
                rotation + Math.PI / 2,
                "wallLarge"
              );
              currentPosition.add(
                new THREE.Vector3(
                  20 * Math.cos(rotation),
                  20 * Math.sin(rotation),
                  0
                )
              );
              remainingDistance -= 20;
            } else if (remainingDistance >= 10) {
              // Place a medium wall
              placeWall(
                wallMedium,
                currentPosition,
                rotation + Math.PI / 2,
                "wallMedium"
              );
              currentPosition.add(
                new THREE.Vector3(
                  10 * Math.cos(rotation),
                  10 * Math.sin(rotation),
                  0
                )
              );
              remainingDistance -= 10;
            }
          }
        }
      }
    });
  };

  const placeWall = (
    wall: THREE.Object3D,
    position: THREE.Vector3,
    rotation: number,
    name: string
  ) => {
    const wallClone = wall.clone();
    wallClone.position.copy(position);
    wallClone.rotation.z = rotation;
    wallClone.scale.set(10, 10, 10); // 10x scale
    if (groupRef.current) {
      groupRef.current.add(wallClone);
    }
    models.push({ name, position: position.clone(), rotation });
  };

  return <group ref={groupRef} />;
};

export default CalcWallModels;
