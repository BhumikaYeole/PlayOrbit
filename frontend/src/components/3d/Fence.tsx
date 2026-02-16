import { useRef } from "react";
import * as THREE from "three";

interface FenceProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
}

/** Simple stadium fence made of posts and rails */
const Fence = ({ position, rotation = [0, 0, 0], length = 14 }: FenceProps) => {
  const postCount = Math.floor(length / 1.5);
  const spacing = length / postCount;
  const startZ = -length / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Posts */}
      {[...Array(postCount + 1)].map((_, i) => (
        <mesh key={`post-${i}`} position={[0, 0.8, startZ + i * spacing]} castShadow>
          <boxGeometry args={[0.08, 1.6, 0.08]} />
          <meshStandardMaterial color="#3a3a4a" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* Top rail */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.06, 0.06, length]} />
        <meshStandardMaterial color="#4a4a5a" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Middle rail */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.06, 0.06, length]} />
        <meshStandardMaterial color="#4a4a5a" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Neon accent strip along top */}
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[0.04, 0.02, length]} />
        <meshStandardMaterial
          color="#22b8cf"
          emissive="#22b8cf"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

export default Fence;
