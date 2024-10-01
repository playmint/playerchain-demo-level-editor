export function ReferenceSphere({
  isEnabled,
  position,
}: {
  isEnabled: boolean;
  position: [number, number, number];
}) {
  return (
    <>
      {isEnabled && (
        <mesh position={position}>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="white" />
        </mesh>
      )}
    </>
  );
}
