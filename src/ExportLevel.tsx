import React, { useState } from "react";
import * as THREE from "three";

interface Wall {
  position: { x: number; y: number };
  width: number;
  rotation: number;
}

interface ExportLevelProps {
  lines: THREE.Vector3[][];
  spawnPoints: THREE.Vector3[];
  thickness: number;
  models: { name: string; position: THREE.Vector3; rotation: number }[];
  spawnRadius: number;
}

const ExportLevel: React.FC<ExportLevelProps> = ({
  lines,
  spawnPoints,
  thickness,
  models,
  spawnRadius,
}) => {
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

        // Calculate rotation (angle between points)
        const rotation = Math.atan2(end.y - start.y, end.x - start.x);

        walls.push({ position, width, rotation });
      }
    });

    const formattedModels = models
      .map(
        (model) => `{
      name: "${model.name}",
      position: { x: ${model.position.x}, y: ${model.position.y} },
      rotation: ${model.rotation}
    }`
      )
      .join(",\n    ");

    const formattedOutput = `export default {
  walls: [
    ${walls
      .map(
        (wall) => `{
      position: { x: ${wall.position.x}, y: ${wall.position.y} },
      width: ${wall.width},
      rotation: ${wall.rotation}
    }`
      )
      .join(",\n    ")}
  ],
  models: [
    ${formattedModels}
  ],
  spawnPoints: [
    ${spawnPoints
      .map(
        (point) => `{
      x: ${point.x},
      y: ${point.y}
    }`
      )
      .join(",\n    ")}
  ],
  spawnRadius: ${spawnRadius},
  wallColliderWidth: ${thickness}
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
