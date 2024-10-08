export function ReferenceSphere({
  isEnabled,
  position,
  thickness,
  useSphere,
  color,
}: {
  isEnabled: boolean;
  position: [number, number, number];
  thickness: number;
  useSphere: boolean;
  color: string;
}) {
  return (
    <>
      {isEnabled && (
        <mesh position={position}>
          {useSphere ? (
            <sphereGeometry args={[thickness / 2, 32, 32]} />
          ) : (
            <boxGeometry args={[thickness, thickness, thickness]} />
          )}
          <meshBasicMaterial color={color} />
        </mesh>
      )}
    </>
  );
}
