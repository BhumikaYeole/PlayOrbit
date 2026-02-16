import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** The green football turf with field lines */
const FootballField = () => {
  const fieldRef = useRef<THREE.Group>(null);

  // Field dimensions
  const fieldW = 20;
  const fieldH = 14;

  // Build line geometry
  const lines = useMemo(() => {
    const pts: [number, number, number, number, number, number][] = [];
    const hw = fieldW / 2;
    const hh = fieldH / 2;

    // Outer boundary
    pts.push([-hw, 0.01, -hh, hw, 0.01, -hh]);
    pts.push([hw, 0.01, -hh, hw, 0.01, hh]);
    pts.push([hw, 0.01, hh, -hw, 0.01, hh]);
    pts.push([-hw, 0.01, hh, -hw, 0.01, -hh]);

    // Center line
    pts.push([0, 0.01, -hh, 0, 0.01, hh]);

    return pts;
  }, []);

  return (
    <group ref={fieldRef}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[fieldW, fieldH]} />
        <meshStandardMaterial color="#1a5c2a" roughness={0.8} />
      </mesh>

      {/* Turf stripes - alternating slightly different greens */}
      {[...Array(10)].map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.002, -fieldH / 2 + (i * fieldH) / 10 + fieldH / 20]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[fieldW, fieldH / 10]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#1e6b30" : "#1a5c2a"}
            roughness={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Field lines */}
      {lines.map((l, i) => {
        const start = new THREE.Vector3(l[0], l[1], l[2]);
        const end = new THREE.Vector3(l[3], l[4], l[5]);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const len = start.distanceTo(end);
        const angle = Math.atan2(end.x - start.x, end.z - start.z);

        return (
          <mesh key={i} position={mid} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.06, 0.005, len]} />
            <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
          </mesh>
        );
      })}

      {/* Center circle */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.26, 48]} />
        <meshStandardMaterial color="#ffffff" opacity={0.7} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Center dot */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
      </mesh>
    </group>
  );
};

export default FootballField;
