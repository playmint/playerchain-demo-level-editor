import React from "react";

interface OverlayProps {
  mouseWorldPos: [number, number, number];
  isDrawingLine: boolean;
  currentLinePoints: number;
}

const Overlay: React.FC<OverlayProps> = ({
  mouseWorldPos,
  isDrawingLine,
  currentLinePoints,
}) => {
  return (
    <div className={`overlay ${isDrawingLine ? "visible" : ""}`}>
      <div className="overlay-content">
        <div>X: {mouseWorldPos[0]}</div>
        <div>Y: {mouseWorldPos[1]}</div>
        <div>Current Points: {currentLinePoints}</div>
      </div>
    </div>
  );
};

export default Overlay;
