import "./App.css";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Camera } from "./Camera";
import { GuideLines } from "./GuideLines";
import { ReferenceSphere } from "./ReferenceSphere";

function App() {
  const [isDrawingLine, setIsDrawingLine] = useState(false);

  const drawLineButton = () => {
    setIsDrawingLine(!isDrawingLine);
  };

  return (
    <>
      <Canvas>
        <Camera />
        <GuideLines />
        <ReferenceSphere isEnabled={isDrawingLine} />
      </Canvas>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <button onClick={drawLineButton}>
          {isDrawingLine ? "Complete Line" : "Start New Line"}
        </button>
      </div>
    </>
  );
}

export default App;
