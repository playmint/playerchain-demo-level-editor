export function ReferenceSphere({ isEnabled }: { isEnabled: boolean }) {
  return (
    <>
      {isEnabled && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color="white" />
        </mesh>
      )}
    </>
  );
}
