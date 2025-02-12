import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { Camera } from "./Camera";
import { GuideLines } from "./GuideLines";
import { ReferenceSphere } from "./ReferenceSphere";
import { LineRenderer } from "./LineRenderer";
import { ReferenceShip } from "./ReferenceShip";
import Overlay from "./Overlay";
import ExportLevel from "./ExportLevel";
import ImportExportLines from "./ImportExportLines";
import SpawnRadius from "./SpawnRadius";
import hamburger from "./assets/hamburger.mp3";
import CalcWallModels from "./CalcWallModels";
import * as THREE from "three";

function App() {
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [isDrawingSpawnPoint, setisDrawingSpawnPoint] = useState(false);
  const [mouseWorldPos, setMouseWorldPos] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [lines, setLines] = useState<THREE.Vector3[][]>([]);
  const [spawnPoints, setSpawnPoints] = useState<THREE.Vector3[]>([]);
  const [currentLine, setCurrentLine] = useState<THREE.Vector3[]>([]);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const [hoveredSpawnPointIndex, setHoveredSpawnPointIndex] = useState<
    number | null
  >(null);
  const [wallColliderWidth, setWallColliderWidth] = useState(2.5);
  const [mirrorAllQuadrants, setMirrorAllQuadrants] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [radius, setRadius] = useState(200);
  const [models, setModels] = useState<
    { name: string; position: THREE.Vector3; rotation: number }[]
  >([]);

  const incrementWallColliderWidth = useCallback(
    () => setWallColliderWidth(wallColliderWidth + 0.5),
    [wallColliderWidth]
  );
  const decrementWallColliderWidth = useCallback(
    () => setWallColliderWidth(Math.max(0.5, wallColliderWidth - 0.5)),
    [wallColliderWidth]
  );

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseFloat(event.target.value);
    if (!isNaN(newRadius)) {
      setRadius(newRadius);
    }
  };

  const drawLineButton = useCallback(() => {
    if (isDrawingLine) {
      setIsDrawingLine(false);
      if (currentLine.length > 0) {
        setLines((prevLines) => [...prevLines, currentLine]);
        setCurrentLine([]);
      }
    } else {
      setIsDrawingLine(true);
      setCurrentLine([]);
      setisDrawingSpawnPoint(false);
    }
  }, [isDrawingLine, currentLine]);

  const drawSpawnPointButton = useCallback(() => {
    if (isDrawingSpawnPoint) {
      setisDrawingSpawnPoint(false);
    } else {
      setisDrawingSpawnPoint(true);
      setIsDrawingLine(false);
    }
  }, [isDrawingSpawnPoint]);

  const deleteLine = (index: number) => {
    setLines((prevLines) => prevLines.filter((_, i) => i !== index));
  };

  const deleteSpawnPoint = (index: number) => {
    setSpawnPoints((prevSpawnPoints) =>
      prevSpawnPoints.filter((_, i) => i !== index)
    );
  };

  const flipLine = (index: number) => {
    setLines((prevLines) =>
      prevLines.map((line, i) => (i === index ? line.slice().reverse() : line))
    );
  };

  const undoLastPoint = useCallback(() => {
    if (isDrawingLine && currentLine.length > 0) {
      setCurrentLine((prev) => prev.slice(0, -1));
    }
  }, [isDrawingLine, currentLine]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDrawingLine && !isDrawingSpawnPoint) {
        if (event.key === " ") {
          event.preventDefault();
          drawLineButton();
        } else if (event.key === "s") {
          event.preventDefault();
          drawSpawnPointButton();
        }
      } else if (isDrawingLine) {
        if (event.key === "Enter") {
          drawLineButton();
        } else if (event.key === "Escape" || event.key === " ") {
          event.preventDefault();
          setIsDrawingLine(false);
          setCurrentLine([]);
        } else if (event.key === "z") {
          undoLastPoint();
        }
      } else if (isDrawingSpawnPoint) {
        if (event.key === "Escape" || event.key === "s") {
          event.preventDefault();
          setisDrawingSpawnPoint(false);
        }
      }

      if (event.key === "[") {
        decrementWallColliderWidth();
      } else if (event.key === "]") {
        incrementWallColliderWidth();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        setIsSidebarOpen((prev) => !prev);
        if (enableAudio) {
          const audio = new Audio(hamburger);
          audio.play();
        }
      }

      if (event.key === "m") {
        setMirrorAllQuadrants((prev) => !prev);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (isDrawingLine) {
        setIsDrawingLine(false);
        setCurrentLine([]);
      }
      if (isDrawingSpawnPoint) {
        setisDrawingSpawnPoint(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [
    decrementWallColliderWidth,
    drawLineButton,
    incrementWallColliderWidth,
    isDrawingLine,
    undoLastPoint,
    enableAudio,
    isDrawingSpawnPoint,
    drawSpawnPointButton,
  ]);

  const getMirroredLinesAllQuadrants = () => {
    const mirroredLines: THREE.Vector3[][] = [];

    lines.forEach((line) => {
      const mirroredLineX = line
        .map((point) => new THREE.Vector3(-point.x, point.y, point.z))
        .reverse();
      const mirroredLineY = line
        .map((point) => new THREE.Vector3(point.x, -point.y, point.z))
        .reverse();
      const mirroredLineXY = line.map(
        (point) => new THREE.Vector3(-point.x, -point.y, point.z)
      );

      mirroredLines.push(line, mirroredLineX, mirroredLineY, mirroredLineXY);
    });

    return mirroredLines;
  };

  const getMirroredSpawnPointsAllQuadrants = () => {
    const mirroredSpawnPoints: THREE.Vector3[] = [];

    spawnPoints.forEach((point) => {
      const mirroredX = new THREE.Vector3(-point.x, point.y, point.z);
      const mirroredY = new THREE.Vector3(point.x, -point.y, point.z);
      const mirroredXY = new THREE.Vector3(-point.x, -point.y, point.z);

      mirroredSpawnPoints.push(point, mirroredX, mirroredY, mirroredXY);
    });

    return mirroredSpawnPoints;
  };

  const addSpawnPoint = (point: THREE.Vector3) => {
    setSpawnPoints((prevSpawnPoints) => [...prevSpawnPoints, point]);
  };

  return (
    <div className="app-layout">
      <button
        className="hamburger-button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      <div className={`main-container ${isSidebarOpen ? "open" : ""}`}>
        <div className="hamburger-header"></div>
        <div className="lines-container">
          <button className="button" onClick={drawLineButton}>
            {isDrawingLine ? "[Enter] Complete Line" : "[Space] Start New Line"}
          </button>
          {lines.map((_line, index) => (
            <div
              key={index}
              className="row"
              onMouseEnter={() => setHoveredLineIndex(index)}
              onMouseLeave={() => setHoveredLineIndex(null)}
            >
              <span>Line {index + 1}</span>
              <button className="flip-button" onClick={() => flipLine(index)}>
                Flip
              </button>
              <button
                className="delete-button"
                onClick={() => deleteLine(index)}
              >
                Delete
              </button>
            </div>
          ))}
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={mirrorAllQuadrants}
                onChange={() => setMirrorAllQuadrants(!mirrorAllQuadrants)}
              />
              [m]irror
            </label>
          </div>
        </div>

        <div className="lines-container">
          <button className="button" onClick={drawSpawnPointButton}>
            {isDrawingSpawnPoint ? "[Escape] Cancel" : "[s] Place Spawn Points"}
          </button>
          {spawnPoints.map((_line, index) => (
            <div
              key={index}
              className="row"
              onMouseEnter={() => setHoveredSpawnPointIndex(index)}
              onMouseLeave={() => setHoveredSpawnPointIndex(null)}
            >
              <span>Spawn Point {index + 1}</span>
              <button
                className="delete-button"
                onClick={() => deleteSpawnPoint(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="general-container">
          <label className="cube-width-label">Wall Collider Width (all):</label>
          <div className="cube-width-container">
            <button
              className="arrow-button"
              onClick={decrementWallColliderWidth}
            >
              [
            </button>
            <div className="cube-width-box">{wallColliderWidth.toFixed(1)}</div>
            <button
              className="arrow-button"
              onClick={incrementWallColliderWidth}
            >
              ]
            </button>
          </div>
        </div>
        <div className="general-container">
          <label className="cube-width-label">Spawn Circle:</label>
          <input
            type="number"
            value={radius}
            step="10"
            onChange={handleRadiusChange}
            className="radius-input"
          />
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={radius}
            onChange={handleRadiusChange}
            className="radius-slider"
          />
        </div>
        <div className="export-container">
          <label className="cube-width-label">Export to Playerchain Demo</label>
          <ExportLevel
            lines={mirrorAllQuadrants ? getMirroredLinesAllQuadrants() : lines}
            thickness={wallColliderWidth}
            models={models}
            spawnPoints={
              mirrorAllQuadrants
                ? getMirroredSpawnPointsAllQuadrants()
                : spawnPoints
            }
            spawnRadius={radius}
          />
        </div>
        <div className="import-export-container">
          <ImportExportLines lines={lines} setLines={setLines} />
        </div>
        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={enableAudio}
              onChange={() => setEnableAudio(!enableAudio)}
            />
            Enable Audio
          </label>
        </div>
      </div>

      <div className="canvas-container">
        <Canvas>
          <Camera />
          <GuideLines />
          {isDrawingLine && (
            <PointerMovePlane
              setMouseWorldPos={setMouseWorldPos}
              addPointToCurrentLine={(point) =>
                setCurrentLine((prev) => [...prev, point])
              }
              addSpawnPoint={addSpawnPoint}
              currentLine={currentLine}
              isDrawingSpawnPoint={isDrawingSpawnPoint}
            />
          )}
          {isDrawingSpawnPoint && (
            <PointerMovePlane
              setMouseWorldPos={setMouseWorldPos}
              addPointToCurrentLine={(point) =>
                setCurrentLine((prev) => [...prev, point])
              }
              addSpawnPoint={addSpawnPoint}
              currentLine={currentLine}
              isDrawingSpawnPoint={isDrawingSpawnPoint}
            />
          )}
          <ReferenceSphere
            isEnabled={isDrawingLine}
            position={mouseWorldPos}
            thickness={wallColliderWidth}
            useSphere={false}
            color={"grey"}
          />
          <ReferenceSphere
            isEnabled={isDrawingSpawnPoint}
            position={mouseWorldPos}
            thickness={4}
            useSphere={true}
            color={"grey"}
          />
          {lines.map((linePoints, index) => (
            <LineRenderer
              key={index}
              points={linePoints}
              color={hoveredLineIndex === index ? "yellow" : "white"}
              width={hoveredLineIndex === index ? 20 : 5}
            />
          ))}
          {mirrorAllQuadrants
            ? getMirroredSpawnPointsAllQuadrants().map((pos, index) => (
                <ReferenceSphere
                  key={`spawn-mirror-${index}`}
                  isEnabled={true}
                  position={[pos.x, pos.y, pos.z]}
                  thickness={4}
                  useSphere={true}
                  color={hoveredSpawnPointIndex === index ? "yellow" : "purple"}
                />
              ))
            : spawnPoints.map((pos, index) => (
                <ReferenceSphere
                  key={index}
                  isEnabled={true}
                  position={[pos.x, pos.y, pos.z]}
                  thickness={4}
                  useSphere={true}
                  color={hoveredSpawnPointIndex === index ? "yellow" : "purple"}
                />
              ))}

          {mirrorAllQuadrants &&
            getMirroredLinesAllQuadrants().map((linePoints, index) => (
              <LineRenderer
                key={`mirror-${index}`}
                points={linePoints}
                color={
                  index % 4 === 0
                    ? "white"
                    : index % 4 === 1
                    ? "red"
                    : index % 4 === 2
                    ? "green"
                    : "blue"
                }
                width={hoveredLineIndex === index && index % 4 === 0 ? 10 : 5}
              />
            ))}
          {isDrawingLine && currentLine.length > 0 && (
            <LineRenderer
              points={[...currentLine, new THREE.Vector3(...mouseWorldPos)]}
              color="grey"
              width={5}
            />
          )}
          <ReferenceShip />
          <SpawnRadius radius={radius} />
          <CalcWallModels
            lines={mirrorAllQuadrants ? getMirroredLinesAllQuadrants() : lines}
            setModels={setModels}
          />
        </Canvas>
        <Overlay
          mouseWorldPos={mouseWorldPos}
          isDrawingLine={isDrawingLine}
          currentLinePoints={currentLine.length}
        />
      </div>
    </div>
  );
}

type SetMouseWorldPosType = React.Dispatch<
  React.SetStateAction<[number, number, number]>
>;

function PointerMovePlane({
  setMouseWorldPos,
  addPointToCurrentLine,
  addSpawnPoint,
  currentLine,
  isDrawingSpawnPoint,
}: {
  setMouseWorldPos: SetMouseWorldPosType;
  addPointToCurrentLine: (point: THREE.Vector3) => void;
  addSpawnPoint: (point: THREE.Vector3) => void;
  currentLine: THREE.Vector3[];
  isDrawingSpawnPoint: boolean;
}) {
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const point = event.point;

    let x = Math.round(point.x / 10) * 10;
    let y = Math.round(point.y / 10) * 10;

    if (currentLine.length > 0 && !isDrawingSpawnPoint) {
      const lastPoint = currentLine[currentLine.length - 1];
      const dx = x - lastPoint.x;
      const dy = y - lastPoint.y;
      const angle = Math.atan2(dy, dx);
      const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      const distance = Math.sqrt(dx * dx + dy * dy);
      x = lastPoint.x + distance * Math.cos(snappedAngle);
      y = lastPoint.y + distance * Math.sin(snappedAngle);

      // Snap to grid
      x = Math.round(x / 10) * 10;
      y = Math.round(y / 10) * 10;
    }

    setMouseWorldPos([x, y, 0]);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (event.button === 2 || event.shiftKey) return;
    event.stopPropagation();
    const point = event.point;

    const x = Math.round(point.x / 10) * 10;
    const y = Math.round(point.y / 10) * 10;

    const newPoint = new THREE.Vector3(x, y, 0);

    if (isDrawingSpawnPoint) {
      addSpawnPoint(newPoint);
    } else if (currentLine.length > 0) {
      const lastPoint = currentLine[currentLine.length - 1];
      const dx = newPoint.x - lastPoint.x;
      const dy = newPoint.y - lastPoint.y;
      const angle = Math.atan2(dy, dx);
      const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      const distance = Math.sqrt(dx * dx + dy * dy);
      newPoint.x = lastPoint.x + distance * Math.cos(snappedAngle);
      newPoint.y = lastPoint.y + distance * Math.sin(snappedAngle);

      // Snap to grid
      newPoint.x = Math.round(newPoint.x / 10) * 10;
      newPoint.y = Math.round(newPoint.y / 10) * 10;
    }

    if (!isDrawingSpawnPoint) {
      addPointToCurrentLine(newPoint);
    }
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
