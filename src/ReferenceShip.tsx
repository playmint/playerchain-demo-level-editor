import { useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import shipGLTF from "./assets/ship.glb?url";
//import shipGLTF from "./assets/walls/wall_medium.glb?url";
import * as THREE from "three";

export const ReferenceShip = () => {
  const gltf = useGLTF(shipGLTF);
  //gltf.scene.scale.set(10, 10, 10);
  const { camera } = useThree();
  const [shipPosition, setShipPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [shipRotation, setShipRotation] = useState(new THREE.Quaternion());

  useFrame(() => {
    const middleNDC = new THREE.Vector3(0, 0, 0); // NDC coordinates for the middle
    middleNDC.unproject(camera);
    const middleWorld = middleNDC.clone().sub(camera.position).normalize();
    const distance = -camera.position.z / middleWorld.z;
    const targetPos = camera.position
      .clone()
      .add(middleWorld.multiplyScalar(distance));

    // Smoothly interpolate the position
    shipPosition.lerp(targetPos, 0.1);
    setShipPosition(shipPosition.clone());

    // Calculate the direction vector and target rotation
    const direction = new THREE.Vector3()
      .subVectors(targetPos, shipPosition)
      .normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), // Adjust this vector to change the initial direction
      direction
    );

    // Apply a -90 degree rotation offset around the Z-axis
    const offsetQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1), // Z-axis
      THREE.MathUtils.degToRad(90) // -90 degrees
    );
    targetQuaternion.multiply(offsetQuaternion);

    // Smoothly interpolate the rotation
    shipRotation.slerp(targetQuaternion, 0.1);
    setShipRotation(shipRotation.clone());
  });

  return (
    <primitive
      object={gltf.scene}
      position={shipPosition}
      quaternion={shipRotation}
      scale={[1, 1, 1]}
    />
  );
};
