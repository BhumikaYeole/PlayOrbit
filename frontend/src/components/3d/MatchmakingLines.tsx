import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface MatchmakingLinesProps {
  scrollProgress: number;
}

/** Glowing neural-network-style lines that appear during ball pass */
const MatchmakingLines = ({ scrollProgress }: MatchmakingLinesProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const visible = scrollProgress > 0.35 && scrollProgress < 0.75;
  const opacity = visible
    ? Math.min(1, (scrollProgress - 0.35) / 0.1) * Math.min(1, (0.75 - scrollProgress) / 0.1)
    : 0;

  const lines = useMemo(() => {
    // Connection points representing "players" on the field
    const points: [number, number, number][] = [
      [-6, 0.5, -3],
      [-4, 0.5, 4],
      [-2, 0.5, -2],
      [2, 0.5, 3],
      [4, 0.5, -4],
      [6, 0.5, 2],
      [7, 0.5, -1],
      [-5, 0.5, 1],
    ];

    // Connections between points
    const connections: [number, number][] = [
      [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [0, 7], [1, 2], [3, 4], [5, 6],
    ];

    return { points, connections };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Subtle pulsing
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.opacity = opacity * (0.3 + 0.2 * Math.sin(state.clock.elapsedTime * 2 + i));
      }
    });
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {/* Player nodes */}
      {lines.points.map((p, i) => (
        <mesh key={`node-${i}`} position={p}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color="#22b8cf"
            emissive="#22b8cf"
            emissiveIntensity={1.5}
            transparent
            opacity={opacity * 0.7}
          />
        </mesh>
      ))}

      {/* Connection lines */}
      {lines.connections.map(([a, b], i) => {
        const start = new THREE.Vector3(...lines.points[a]);
        const end = new THREE.Vector3(...lines.points[b]);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const len = start.distanceTo(end);
        const dir = end.clone().sub(start);
        const angle = Math.atan2(dir.x, dir.z);

        return (
          <mesh key={`line-${i}`} position={mid} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.03, 0.03, len]} />
            <meshStandardMaterial
              color="#7c3aed"
              emissive="#7c3aed"
              emissiveIntensity={1}
              transparent
              opacity={opacity * 0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default MatchmakingLines;
