import { PerspectiveCamera, OrthographicCamera } from "@react-three/drei";
import { BackgroundGrid } from "./BackgroundGrid";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";

const fog = false;

export function Camera({
  orthographic,
  zoom,
}: {
  orthographic: boolean;
  zoom: number;
}) {
  const [currentZoom, setCurrentZoom] = useState(10);

  useFrame(() => {
    setCurrentZoom((prevZoom) => {
      const lerpFactor = 0.25;
      return prevZoom + (zoom - prevZoom) * lerpFactor;
    });
  });

  return (
    <>
      {orthographic ? (
        <OrthographicCamera
          makeDefault
          zoom={currentZoom}
          near={0.1}
          far={1000}
          position={[0, 0, 10]}
        />
      ) : (
        <PerspectiveCamera
          makeDefault
          position={[0, 0, (35 - currentZoom) * 32]}
          fov={40}
          near={1}
          far={1000}
        />
      )}
      <color attach="background" args={[0x112059]} />
      <ambientLight color={0x404040} />
      <directionalLight position={[-1, 1, 1]} intensity={12} color={0xffffff} />
      <directionalLight position={[1, -1, 1]} intensity={8} color={0xffaf7b} />
      {fog ?? <fog attach="fog" args={[0x444466, 100, 1]} />}
      <BackgroundGrid />
    </>
  );
}
