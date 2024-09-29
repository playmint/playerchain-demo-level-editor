import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Camera } from "./Camera";

// TODO:
// Test function to snap a cube to the mouse - rounded to the nearst 1 or something
// Looking at the demo videos, I think the snapping is to be at the line intersections! ... nice and easy

// Import the spaceship to scale, have it follow the camera's x and z position (lerping?)
// Probably before that make it so wasd controls cameras x and z position

function App() {
  return (
    <Canvas>
      <Camera />
    </Canvas>
  );
}

export default App;
