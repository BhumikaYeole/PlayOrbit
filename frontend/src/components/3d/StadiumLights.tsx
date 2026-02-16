/** Stadium lighting rig for the 3D scene */
const StadiumLights = () => {
  return (
    <group>
      {/* Ambient fill */}
      <ambientLight intensity={0.15} color="#a0c4ff" />

      {/* Main overhead */}
      <directionalLight
        position={[5, 12, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Back light */}
      <directionalLight position={[-5, 8, -8]} intensity={0.4} color="#d0e8ff" />

      {/* Stadium spotlights - corners */}
      <pointLight position={[-10, 6, -7]} intensity={0.8} color="#22b8cf" distance={25} decay={2} />
      <pointLight position={[10, 6, -7]} intensity={0.8} color="#22b8cf" distance={25} decay={2} />
      <pointLight position={[-10, 6, 7]} intensity={0.5} color="#7c3aed" distance={25} decay={2} />
      <pointLight position={[10, 6, 7]} intensity={0.5} color="#7c3aed" distance={25} decay={2} />

      {/* Light pole meshes (visual only) */}
      {[
        [-11, 0, -8],
        [11, 0, -8],
        [-11, 0, 8],
        [11, 0, 8],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Pole */}
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 6, 8]} />
            <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Light head */}
          <mesh position={[0, 6.2, 0]}>
            <boxGeometry args={[0.5, 0.15, 0.3]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={i < 2 ? "#22b8cf" : "#7c3aed"}
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default StadiumLights;
