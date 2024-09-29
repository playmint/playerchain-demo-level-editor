import { OrthographicCamera } from "@react-three/drei";
import { BackgroundGrid } from "./BackgroundGrid";
import { useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const fog = false;

export function Camera() {
  const [currentZoom, setCurrentZoom] = useState(10);
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isShiftDown, setIsShiftDown] = useState(false);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.shiftKey) {
        setIsDragging(true);
        setLastMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && lastMousePosition) {
        const rect = gl.domElement.getBoundingClientRect();

        // Convert screen coordinates to Normalized Device Coordinates
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const lastX = ((lastMousePosition.x - rect.left) / rect.width) * 2 - 1;
        const lastY = -((lastMousePosition.y - rect.top) / rect.height) * 2 + 1;

        // Create vectors from Normalized Device Coordinates
        const currentMouse = new THREE.Vector3(x, y, 0);
        const lastMouse = new THREE.Vector3(lastX, lastY, 0);

        currentMouse.unproject(camera);
        lastMouse.unproject(camera);

        const delta = new THREE.Vector3().subVectors(currentMouse, lastMouse);

        camera.position.sub(delta);
        camera.updateMatrixWorld();

        setLastMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setLastMousePosition(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftDown(true);
      } else if (event.key === "0") {
        camera.position.x = 0;
        camera.position.y = 0;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftDown(false);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (isShiftDown) {
        event.preventDefault();
        const zoomSpeed = 0.005;
        setCurrentZoom((prevZoom) => {
          let newZoom = prevZoom - event.deltaY * zoomSpeed;
          // Clamp the zoom level
          newZoom = Math.max(1, Math.min(newZoom, 10));
          return newZoom;
        });
      }
    };

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    gl.domElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      gl.domElement.removeEventListener("wheel", handleWheel);
    };
  }, [isDragging, lastMousePosition, camera, gl, isShiftDown]);

  useEffect(() => {
    (camera as THREE.OrthographicCamera).zoom = currentZoom;
    camera.updateProjectionMatrix();
  }, [currentZoom, camera]);

  return (
    <>
      <OrthographicCamera
        makeDefault
        zoom={currentZoom}
        near={0.1}
        far={1000}
        position={[camera.position.x, camera.position.y, 10]}
      />
      <color attach="background" args={["#171717"]} />
      {/* 0x112059 - original (without quotes)*/}
      <ambientLight color={0x404040} />
      <directionalLight position={[-1, 1, 1]} intensity={12} color={0xffffff} />
      <directionalLight position={[1, -1, 1]} intensity={8} color={0xffaf7b} />
      {fog ?? <fog attach="fog" args={[0x444466, 100, 1]} />}
      <BackgroundGrid />
    </>
  );
}
