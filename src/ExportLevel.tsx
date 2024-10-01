import React, { useState } from "react";
import * as THREE from "three";

interface Wall {
  position: { x: number; y: number };
  width: number;
  height: number;
  rotation: number;
}

interface ExportLevelProps {
  lines: THREE.Vector3[][];
  thickness: number;
}

const ExportLevel: React.FC<ExportLevelProps> = ({ lines, thickness }) => {
  const [output, setOutput] = useState("");

  const calculateWalls = () => {
    const walls: Wall[] = [];

    lines.forEach((line) => {
      for (let i = 0; i < line.length - 1; i++) {
        const start = line[i];
        const end = line[i + 1];

        // Calculate position (midpoint)
        const position = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2,
        };

        // Calculate width (distance between points)
        const width = start.distanceTo(end);

        // Fixed height
        const height = thickness;

        // Calculate rotation (angle between points)
        const rotation = Math.atan2(end.y - start.y, end.x - start.x);

        walls.push({ position, width, height, rotation });
      }
    });

    const formattedOutput = `export default {
  walls: [
    ${walls
      .map(
        (wall) => `{
      position: { x: ${wall.position.x}, y: ${wall.position.y} },
      width: ${wall.width},
      height: ${wall.height},
      rotation: ${wall.rotation}
    }`
      )
      .join(",\n    ")}
 ]
};`;

    setOutput(formattedOutput);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="export-container">
      <button className="button" onClick={calculateWalls}>
        Export Level
      </button>
      <textarea className="output-textarea" value={output} readOnly rows={10} />
      <button className="button" onClick={copyToClipboard}>
        Copy
      </button>
    </div>
  );
};

export default ExportLevel;