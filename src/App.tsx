import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Camera } from "./Camera";
import { useEffect, useState } from "react";

const ZOOM_STEP = 1;

// TODO:
// Test function to snap a cube to the mouse - rounded to the nearst 1 or something
// Looking at the demo videos, I think the snapping is to be at the line intersections! ... nice and easy

// Import the spaceship to scale, have it follow the camera's x and z position (lerping?)
// Probably before that make it so wasd controls cameras x and z position

function App() {
  const [isOrthographic, setIsOrthographic] = useState(true);
  const [grab, setGrab] = useState(false);
  const [zoom, setZoomOrtho] = useState(10);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "p" || event.key === "P") {
        setIsOrthographic((prev) => !prev);
      } else if (event.key === "=") {
        setZoomOrtho((prevZoom) => Math.min(35, prevZoom + ZOOM_STEP));
      } else if (event.key === "-") {
        setZoomOrtho((prevZoom) => Math.max(1, prevZoom - ZOOM_STEP));
      } else if (event.shiftKey) {
        setGrab(!grab);
        // change cursor to grabby hand
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [grab, isOrthographic]);

  return (
    <div className="app-container">
      <ul className="info-panel">
        <div className="info-item">
          {"[P] "} {isOrthographic ? "Orthographic Mode" : "Perspective Mode"}
        </div>
        <div className="info-item">
          {"[+/-] "} {"Zoom: " + zoom}
        </div>
      </ul>
      <Canvas>
        <Camera orthographic={isOrthographic} zoom={zoom} />
      </Canvas>
    </div>
  );
}

export default App;
