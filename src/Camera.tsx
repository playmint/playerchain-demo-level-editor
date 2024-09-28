import { PerspectiveCamera, OrthographicCamera } from "@react-three/drei";
import { BackgroundGrid } from "./BackgroundGrid";
import { useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const fog = false;

export function Camera({
  orthographic,
  zoom,
}: {
  orthographic: boolean;
  zoom: number;
}) {
  const [currentZoom, setCurrentZoom] = useState(10);
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.shiftKey) {
        setIsDragging(true);
        setLastMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && lastMousePosition) {
        const deltaX = event.clientX - lastMousePosition.x;
        const deltaY = event.clientY - lastMousePosition.y;

        // Adjust camera position based on mouse movement and zoom level
        const movementFactor = 0.25 * (10 / currentZoom);
        camera.position.x -= deltaX * movementFactor;
        camera.position.y += deltaY * movementFactor;

        setLastMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setLastMousePosition(null);
    };

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, lastMousePosition, camera, gl, currentZoom]);

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
