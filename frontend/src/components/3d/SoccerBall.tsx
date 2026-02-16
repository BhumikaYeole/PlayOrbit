import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SoccerBallProps {
  scrollProgress: number; // 0 to 1
}

/**
 * A soccer ball that animates from left fence to right fence
 * based on scroll progress.
 * 
 * Phase 0-0.33: Ball appears near left fence
 * Phase 0.33-0.66: Ball passes across the field (curved trajectory)
 * Phase 0.66-1: Ball lands near right fence
 */
const SoccerBall = ({ scrollProgress }: SoccerBallProps) => {
  const ballRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Ball visibility
  const visible = scrollProgress > 0.15;

  // Compute ball position based on scroll
  const ballState = useMemo(() => {
    // Phase 1: appear (0.15-0.33)
    // Phase 2: pass (0.33-0.66)
    // Phase 3: land (0.66-1)
    const leftX = -9;
    const rightX = 9;
    const z = 0;

    if (scrollProgress < 0.15) {
      return { x: leftX, y: -1, z, phase: "hidden", passProgress: 0 };
    }

    if (scrollProgress < 0.33) {
      // Appear phase - ball rises from ground near left fence
      const t = (scrollProgress - 0.15) / 0.18;
      return { x: leftX, y: 0.3 + t * 0.1, z, phase: "appear", passProgress: 0 };
    }

    if (scrollProgress < 0.7) {
      // Pass phase - ball flies from left to right in arc
      const t = (scrollProgress - 0.33) / 0.37;
      const x = leftX + (rightX - leftX) * t;
      // Parabolic arc: peaks at midpoint
      const arcHeight = 3.5;
      const y = 0.3 + arcHeight * 4 * t * (1 - t);
      // Slight curve in z
      const zOffset = Math.sin(t * Math.PI) * 1.5;
      return { x, y, z: z + zOffset, phase: "pass", passProgress: t };
    }

    // Land phase
    const t = Math.min((scrollProgress - 0.7) / 0.15, 1);
    const bounceY = 0.3 + 0.4 * Math.sin(t * Math.PI) * (1 - t);
    return { x: rightX, y: bounceY, z, phase: "land", passProgress: 1 };
  }, [scrollProgress]);

  // Trail particles
  const trailPositions = useMemo(() => {
    const positions = new Float32Array(60 * 3);
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!ballRef.current) return;

    // Position
    ballRef.current.position.set(ballState.x, ballState.y, ballState.z);

    // Spin
    if (ballState.phase === "pass") {
      ballRef.current.rotation.x += delta * 8;
      ballRef.current.rotation.z += delta * 4;
    }

    // Glow
    if (glowRef.current) {
      glowRef.current.position.set(ballState.x, ballState.y, ballState.z);
      glowRef.current.intensity = ballState.phase === "pass" ? 2 : 0.5;
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Ball */}
      <mesh ref={ballRef} castShadow>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color="#f0f0f0"
          roughness={0.4}
          metalness={0.1}
          emissive="#22b8cf"
          emissiveIntensity={ballState.phase === "pass" ? 0.3 : 0.08}
        />
      </mesh>

      {/* Ball glow light */}
      <pointLight
        ref={glowRef}
        color="#22b8cf"
        intensity={0.5}
        distance={5}
        decay={2}
      />

      {/* Trail - glowing line during pass */}
      {ballState.phase === "pass" && (
        <mesh position={[ballState.x - 1, ballState.y, ballState.z]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color="#22b8cf"
            emissive="#22b8cf"
            emissiveIntensity={1}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {/* Shadow on ground */}
      <mesh
        position={[ballState.x, 0.005, ballState.z]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.3 + ballState.y * 0.05, 16]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={Math.max(0, 0.3 - ballState.y * 0.05)}
        />
      </mesh>
    </group>
  );
};

export default SoccerBall;
