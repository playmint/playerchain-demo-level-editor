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
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial color="white" />
        </mesh>
      )}
    </>
  );
}
