import { RepeatWrapping } from "three";
import { useTexture } from "@react-three/drei";
import gridImage from "./assets/grid.png";

export function BackgroundGrid() {
  const gridTex = useTexture(gridImage);
  gridTex.wrapS = RepeatWrapping;
  gridTex.wrapT = RepeatWrapping;
  gridTex.repeat.set(100, 100);
  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[1000, 1000, 100, 100]} />
      <meshStandardMaterial
        map={gridTex}
        wireframe={false}
        color={0x888888}
        opacity={1}
        transparent={true}
      />
    </mesh>
  );
}
