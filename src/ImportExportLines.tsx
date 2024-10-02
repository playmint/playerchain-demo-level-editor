import React, { useState } from "react";
import * as THREE from "three";

interface ImportExportLinesProps {
  lines: THREE.Vector3[][];
  setLines: React.Dispatch<React.SetStateAction<THREE.Vector3[][]>>;
}

const ImportExportLines: React.FC<ImportExportLinesProps> = ({
  lines,
  setLines,
}) => {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const exportLines = () => {
    // Convert lines to plain arrays for JSON serialization
    const linesData = lines.map((line) =>
      line.map((point) => [point.x, point.y, point.z])
    );
    setOutput(JSON.stringify(linesData, null, 2));
  };

  const importLines = () => {
    try {
      const linesData = JSON.parse(input);
      const importedLines = linesData.map((line: number[][]) =>
        line.map((point) => new THREE.Vector3(point[0], point[1], point[2]))
      );
      setLines(importedLines);
    } catch {
      alert("Invalid JSON format.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="export-container">
      <label className="cube-width-label">Export/Import Lines</label>
      <div className="export-container">
        <button className="button" onClick={exportLines}>
          Export Lines
        </button>
        <textarea
          className="output-textarea"
          value={output}
          readOnly
          rows={10}
        />
        <button className="button" onClick={copyToClipboard}>
          Copy
        </button>
        <textarea
          className="output-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste lines JSON here"
          rows={10}
        />
        <button className="button" onClick={importLines}>
          Import Lines
        </button>
      </div>
    </div>
  );
};

export default ImportExportLines;
