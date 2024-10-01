import React from "react";

interface OverlayProps {
  mouseWorldPos: [number, number, number];
  isDrawingLine: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ mouseWorldPos, isDrawingLine }) => {
  return (
    <div className={`overlay ${isDrawingLine ? "visible" : ""}`}>
      <div className="overlay-content">
        <div>X: {mouseWorldPos[0]}</div>
        <div>Y: {mouseWorldPos[1]}</div>
      </div>
    </div>
  );
};

export default Overlay;
