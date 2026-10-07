import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { GpuCapability } from '../../hooks/useWebGPU';

interface FittingRoomCanvasProps {
  gpu: GpuCapability;
  avatarHeightCm?: number;
  cameraPreset?: 'front' | 'side' | 'back' | 'perspective';
  onResetCamera?: () => void;
}

/**
 * Procedural mannequin geometry for Phase 0 foundation validation
 * Represents a proportional parametric human standing pose on a studio pedestal.
 */
function ParametricHumanMannequin({ heightCm = 178 }: { heightCm?: number }) {
  const scale = heightCm / 178;

  return (
    <group position={[0, -0.9, 0]} scale={[scale, scale, scale]}>
      {/* Studio circular pedestal */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 0.95, 0.05, 64]} />
        <meshStandardMaterial
          color="#121318"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Ring indicator on pedestal */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.82, 0.84, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>

      {/* Torso & Chest */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.45, 16, 32]} />
        <meshStandardMaterial
          color="#222530"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Head & Neck */}
      <mesh position={[0, 1.68, 0]} castShadow>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial
          color="#262a36"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Left Arm & Shoulder */}
      <mesh position={[-0.26, 1.22, 0]} rotation={[0, 0, 0.15]} castShadow>
        <capsuleGeometry args={[0.065, 0.55, 16, 32]} />
        <meshStandardMaterial color="#222530" roughness={0.4} />
      </mesh>

      {/* Right Arm & Shoulder */}
      <mesh position={[0.26, 1.22, 0]} rotation={[0, 0, -0.15]} castShadow>
        <capsuleGeometry args={[0.065, 0.55, 16, 32]} />
        <meshStandardMaterial color="#222530" roughness={0.4} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.12, 0.58, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.72, 16, 32]} />
        <meshStandardMaterial color="#1d202a" roughness={0.5} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.12, 0.58, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.72, 16, 32]} />
        <meshStandardMaterial color="#1d202a" roughness={0.5} />
      </mesh>

      {/* Phase 0 Prototype T-Shirt drape overlay */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <capsuleGeometry args={[0.195, 0.44, 16, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.65}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>
    </group>
  );
}

export const FittingRoomCanvas: React.FC<FittingRoomCanvasProps> = ({
  gpu,
  avatarHeightCm = 178,
  cameraPreset = 'perspective',
}) => {
  const controlsRef = useRef<any>(null);

  // Determine camera coordinate based on preset
  let camPos: [number, number, number] = [0, 0.6, 2.8];
  if (cameraPreset === 'front') camPos = [0, 0.5, 2.5];
  if (cameraPreset === 'side') camPos = [2.5, 0.5, 0];
  if (cameraPreset === 'back') camPos = [0, 0.5, -2.5];

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-xl overflow-hidden bg-radial from-zinc-900/60 to-black border border-zinc-800/80 shadow-2xl">
      {/* 3D Canvas */}
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={camPos} fov={45} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={1.2}
          maxDistance={4.5}
          maxPolarAngle={Math.PI / 2 + 0.05} // prevent going below stage floor
          dampingFactor={0.05}
        />

        {/* Studio Lighting Rig */}
        <ambientLight intensity={0.5} />
        {/* Key Light */}
        <directionalLight
          position={[3, 4, 3]}
          intensity={1.2}
          castShadow
          shadow-mapSize={1024}
        />
        {/* Fill Light */}
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        {/* Rim Light (Fashion Tech Blue Accent) */}
        <pointLight position={[0, 2.5, -2]} intensity={1.8} color="#38bdf8" />

        {/* Ground grid */}
        <Grid
          position={[0, -0.92, 0]}
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#27272a"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#3f3f46"
          fadeDistance={6}
          infiniteGrid
        />

        <Suspense fallback={null}>
          <ParametricHumanMannequin heightCm={avatarHeightCm} />
        </Suspense>
      </Canvas>

      {/* Viewport Overlay HUD */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1">
        <span className="text-[11px] font-mono tracking-wider text-sky-400 font-semibold uppercase">
          STAGE: 3D HERO VIEWPORT
        </span>
        <span className="text-[10px] text-zinc-400 font-mono">
          Engine: Three.js R{THREE.REVISION} | Tier: {gpu.tier.toUpperCase()}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <span className="text-[10px] text-zinc-400 font-mono bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800/80 backdrop-blur-sm">
          DRAG: ROTATE | SCROLL: ZOOM
        </span>
      </div>
    </div>
  );
};
