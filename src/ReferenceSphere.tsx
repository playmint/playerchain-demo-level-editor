export function ReferenceSphere({
  isEnabled,
  position,
  thickness,
}: {
  isEnabled: boolean;
  position: [number, number, number];
  thickness: number;
}) {
  return (
    <>
      {isEnabled && (
        <mesh position={position}>
          <boxGeometry args={[thickness, thickness, thickness]} />
          <meshBasicMaterial color="white" />
        </mesh>
      )}
    </>
  );
}
