import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GpuCapability } from '../../hooks/useWebGPU';

interface FittingRoomCanvasProps {
  gpu: GpuCapability;
  avatarHeightCm?: number;
  cameraPreset?: 'front' | 'side' | 'back' | 'perspective';
  garmentCategory?: 'tshirt' | 'jacket';
  showClothSimulation?: boolean;
}

/**
 * Procedural humanoid avatar geometry for FITTARA 3D Fitting Room
 * Designed with restrained fashion-tech material aesthetic on a minimal luxury studio floor.
 */
function ParametricHumanBody({
  heightCm = 178,
  garmentCategory = 'tshirt',
  showCloth = true,
}: {
  heightCm?: number;
  garmentCategory?: 'tshirt' | 'jacket';
  showCloth?: boolean;
}) {
  const scale = heightCm / 178;

  return (
    <group position={[0, -0.9, 0]} scale={[scale, scale, scale]}>
      {/* Studio circular stage - Minimal charcoal */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.95, 0.98, 0.03, 64]} />
        <meshStandardMaterial
          color="#0c0d12"
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Subtle hairline floor accent ring */}
      <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 0.93, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>

      {/* Torso & Core */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.45, 16, 32]} />
        <meshStandardMaterial
          color="#1c1d24"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Head & Neck */}
      <mesh position={[0, 1.68, 0]} castShadow>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial
          color="#20222a"
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Left Arm & Shoulder */}
      <mesh position={[-0.26, 1.22, 0]} rotation={[0, 0, 0.12]} castShadow>
        <capsuleGeometry args={[0.065, 0.55, 16, 32]} />
        <meshStandardMaterial color="#1c1d24" roughness={0.6} />
      </mesh>

      {/* Right Arm & Shoulder */}
      <mesh position={[0.26, 1.22, 0]} rotation={[0, 0, -0.12]} castShadow>
        <capsuleGeometry args={[0.065, 0.55, 16, 32]} />
        <meshStandardMaterial color="#1c1d24" roughness={0.6} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.12, 0.58, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.72, 16, 32]} />
        <meshStandardMaterial color="#16171f" roughness={0.7} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.12, 0.58, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.72, 16, 32]} />
        <meshStandardMaterial color="#16171f" roughness={0.7} />
      </mesh>

      {/* Cloth Simulation Drape Mesh */}
      {showCloth && (
        <group>
          {garmentCategory === 'tshirt' ? (
            /* Premium Cotton T-Shirt Fit Drape */
            <mesh position={[0, 1.28, 0]} castShadow>
              <capsuleGeometry args={[0.192, 0.44, 24, 36]} />
              <meshStandardMaterial
                color="#e5e5ea"
                roughness={0.75}
                metalness={0.05}
              />
            </mesh>
          ) : (
            /* Structured Tailored Jacket Fit Drape */
            <mesh position={[0, 1.27, 0]} castShadow>
              <capsuleGeometry args={[0.205, 0.48, 24, 36]} />
              <meshStandardMaterial
                color="#282a36"
                roughness={0.5}
                metalness={0.15}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}

export const FittingRoomCanvas: React.FC<FittingRoomCanvasProps> = ({
  gpu,
  avatarHeightCm = 178,
  cameraPreset = 'perspective',
  garmentCategory = 'tshirt',
  showClothSimulation = true,
}) => {
  const controlsRef = useRef<any>(null);

  // Position coordinates for presets
  let camPos: [number, number, number] = [0, 0.6, 2.7];
  if (cameraPreset === 'front') camPos = [0, 0.5, 2.4];
  if (cameraPreset === 'side') camPos = [2.4, 0.5, 0];
  if (cameraPreset === 'back') camPos = [0, 0.5, -2.4];

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-sm overflow-hidden bg-[#0a0b0f] border border-zinc-800/80 shadow-2xl">
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
          maxDistance={4.2}
          maxPolarAngle={Math.PI / 2 + 0.05}
          dampingFactor={0.05}
        />

        {/* Cinematic Studio Lighting Rig */}
        <ambientLight intensity={0.45} />
        {/* Key Light - Pure off-white high key */}
        <directionalLight
          position={[2.5, 4, 2.5]}
          intensity={1.25}
          castShadow
          shadow-mapSize={1024}
        />
        {/* Soft Fill Light */}
        <directionalLight position={[-2.5, 2.5, -1.5]} intensity={0.45} />
        {/* Hairline Rim Light - Off-white accent */}
        <pointLight position={[0, 2.6, -1.8]} intensity={1.2} color="#f5f5f7" />

        <Suspense fallback={null}>
          <ParametricHumanBody
            heightCm={avatarHeightCm}
            garmentCategory={garmentCategory}
            showCloth={showClothSimulation}
          />
        </Suspense>
      </Canvas>

      {/* Minimal luxury studio watermark / stage title */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1">
        <span className="text-[10px] font-mono tracking-editorial text-zinc-400 font-semibold uppercase">
          FITTARA STUDIO
        </span>
        <span className="text-[9px] text-zinc-400 font-mono">
          3D SIMULATION · {gpu.tier.toUpperCase()}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <span className="text-[9px] text-zinc-400 font-mono bg-[#08080a]/80 px-2 py-1 rounded-sm border border-zinc-800">
          ORBIT · PINCH / SCROLL TO ZOOM
        </span>
      </div>
    </div>
  );
};
