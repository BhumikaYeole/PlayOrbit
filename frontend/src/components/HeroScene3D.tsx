import { useRef, useCallback, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FootballField from "./3d/FootballField";
import Fence from "./3d/Fence";
import SoccerBall from "./3d/SoccerBall";
import StadiumLights from "./3d/StadiumLights";
import MatchmakingLines from "./3d/MatchmakingLines";

/** Camera controller driven by scroll progress */
const CameraController = ({ scrollProgress }: { scrollProgress: number }) => {
  const { camera } = useThree();

  useFrame(() => {
    // Phase 0: Wide overview - slight isometric
    // Phase 1: Push forward
    // Phase 2-3: Follow action

    const t = scrollProgress;

    // Camera position interpolation
    const startPos = new THREE.Vector3(0, 10, 16);
    const midPos = new THREE.Vector3(0, 7, 12);
    const endPos = new THREE.Vector3(3, 5, 10);

    let targetPos: THREE.Vector3;
    let lookAt: THREE.Vector3;

    if (t < 0.33) {
      const p = t / 0.33;
      targetPos = startPos.clone().lerp(midPos, p);
      lookAt = new THREE.Vector3(0, 0, 0);
    } else if (t < 0.7) {
      const p = (t - 0.33) / 0.37;
      targetPos = midPos.clone().lerp(endPos, p);
      // Follow ball roughly
      const ballX = -9 + 18 * p;
      lookAt = new THREE.Vector3(ballX * 0.3, 1, 0);
    } else {
      targetPos = endPos.clone();
      lookAt = new THREE.Vector3(3, 0.5, 0);
    }

    camera.position.lerp(targetPos, 0.08);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    camera.lookAt(lookAt);
  });

  return null;
};

/** The ground plane extending beyond the field */
const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
    <planeGeometry args={[60, 60]} />
    <meshStandardMaterial color="#0a0f1a" roughness={1} />
  </mesh>
);

/** Crowd silhouettes - simple shapes behind fences */
const CrowdSilhouettes = () => {
  const positions = [];
  for (let i = 0; i < 30; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    positions.push({
      x: side * (11.5 + Math.random() * 2),
      z: -6 + Math.random() * 12,
      scale: 0.5 + Math.random() * 0.3,
    });
  }

  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.scale * 0.5, p.z]}>
          <capsuleGeometry args={[0.15 * p.scale, 0.4 * p.scale, 4, 8]} />
          <meshStandardMaterial color="#1a1a2e" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

interface HeroScene3DProps {
  scrollProgress: number;
}

const HeroScene3D = ({ scrollProgress }: HeroScene3DProps) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 16], fov: 45, near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={["#080c18", 20, 50]} />

      <CameraController scrollProgress={scrollProgress} />
      <StadiumLights />
      <Ground />
      <FootballField />

      {/* Fences on both sides */}
      <Fence position={[-10.5, 0, 0]} length={14} />
      <Fence position={[10.5, 0, 0]} length={14} />

      <CrowdSilhouettes />
      <SoccerBall scrollProgress={scrollProgress} />
      <MatchmakingLines scrollProgress={scrollProgress} />
    </Canvas>
  );
};

export default HeroScene3D;
