import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { Camera } from "./Camera";
import { GuideLines } from "./GuideLines";
import { ReferenceSphere } from "./ReferenceSphere";
import { LineRenderer } from "./LineRenderer";
import Overlay from "./Overlay";
import * as THREE from "three";

function App() {
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [mouseWorldPos, setMouseWorldPos] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  // State to hold all lines (each line is an array of Vector3 points)
  const [lines, setLines] = useState<THREE.Vector3[][]>([]);

  // State for the current line being drawn
  const [currentLine, setCurrentLine] = useState<THREE.Vector3[]>([]);

  // State to track which line is being hovered over
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

  const drawLineButton = useCallback(() => {
    if (isDrawingLine) {
      // Complete the current line
      setIsDrawingLine(false);
      if (currentLine.length > 0) {
        // Add the current line to the collection of lines
        setLines((prevLines) => [...prevLines, currentLine]);
        setCurrentLine([]);
      }
    } else {
      // Start a new line
      setIsDrawingLine(true);
      setCurrentLine([]);
    }
  }, [isDrawingLine, currentLine]);

  const deleteLine = (index: number) => {
    setLines((prevLines) => prevLines.filter((_, i) => i !== index));
  };

  const undoLastPoint = useCallback(() => {
    if (isDrawingLine && currentLine.length > 0) {
      setCurrentLine((prev) => prev.slice(0, -1));
    }
  }, [isDrawingLine, currentLine]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDrawingLine) {
        if (event.key === "n") {
          drawLineButton();
        }
      } else {
        if (event.key === "Enter") {
          drawLineButton();
        } else if (event.key === "Escape" || event.key === "n") {
          setIsDrawingLine(false);
          setCurrentLine([]);
        } else if (event.key === "z") {
          undoLastPoint();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawLineButton, isDrawingLine, undoLastPoint]);

  return (
    <>
      <Canvas>
        <Camera />
        <GuideLines />
        {isDrawingLine && (
          <PointerMovePlane
            setMouseWorldPos={setMouseWorldPos}
            addPointToCurrentLine={(point) =>
              setCurrentLine((prev) => [...prev, point])
            }
          />
        )}
        <ReferenceSphere isEnabled={isDrawingLine} position={mouseWorldPos} />
        {lines.map((linePoints, index) => (
          <LineRenderer
            key={index}
            points={linePoints}
            color={hoveredLineIndex === index ? "yellow" : "white"}
          />
        ))}
        {isDrawingLine && currentLine.length > 0 && (
          <LineRenderer
            points={[...currentLine, new THREE.Vector3(...mouseWorldPos)]}
            color="grey"
          />
        )}
      </Canvas>
      <Overlay mouseWorldPos={mouseWorldPos} isDrawingLine={isDrawingLine} />
      <div className="container">
        <button className="button" onClick={drawLineButton}>
          {isDrawingLine ? "[Enter] Complete Line" : "[n] Start New Line"}
        </button>
        {lines.map((_line, index) => (
          <div
            key={index}
            className="row"
            onMouseEnter={() => setHoveredLineIndex(index)}
            onMouseLeave={() => setHoveredLineIndex(null)}
          >
            <span>Line {index + 1}</span>
            <button className="delete-button" onClick={() => deleteLine(index)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

type SetMouseWorldPosType = React.Dispatch<
  React.SetStateAction<[number, number, number]>
>;

function PointerMovePlane({
  setMouseWorldPos,
  addPointToCurrentLine,
}: {
  setMouseWorldPos: SetMouseWorldPosType;
  addPointToCurrentLine: (point: THREE.Vector3) => void;
}) {
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const point = event.point;

    // Round the X and Y coordinates to the nearest 10
    const x = Math.round(point.x / 10) * 10;
    const y = Math.round(point.y / 10) * 10;

    setMouseWorldPos([x, y, 0]);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (event.shiftKey) return; // Ignore if shift key is held down
    event.stopPropagation(); // Prevent the event from bubbling up
    const point = event.point;

    // Round the X and Y coordinates to the nearest 10
    const x = Math.round(point.x / 10) * 10;
    const y = Math.round(point.y / 10) * 10;

    const newPoint = new THREE.Vector3(x, y, 0);
    addPointToCurrentLine(newPoint);
  };

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      visible={false}
    >
      <planeGeometry args={[10000, 10000]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

export default App;
