/**
 * @file NightlifeScene.tsx
 * @description MAXIMUM COMPUTE 3D scene - 500x visual intensity
 * Liquid glass, volumetric lighting, particle systems, post-processing
 */

'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshTransmissionMaterial, 
  Environment, 
  PerspectiveCamera, 
  Preload,
  Sparkles,
  MeshDistortMaterial,
  Trail,
  useTexture,
  Stars,
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ============================================
// CENTERPIECE: Massive Glass Diamond
// ============================================
function MegaDiamond() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.2;
      innerRef.current.rotation.y = -t * 0.25;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.3} floatIntensity={1}>
      <group position={[0, 0, -3]}>
        {/* Outer glass shell */}
        <mesh ref={meshRef} scale={3.5}>
          <octahedronGeometry args={[1, 2]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={0.8}
            chromaticAberration={1}
            anisotropy={0.5}
            distortion={0.3}
            distortionScale={0.8}
            temporalDistortion={0.2}
            iridescence={1}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[100, 1400]}
            transmission={0.98}
            roughness={0}
            ior={2.4}
            color="#D9AE43"
          />
        </mesh>
        
        {/* Inner glowing core */}
        <mesh ref={innerRef} scale={1.2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#FF3C93"
            emissive="#FF3C93"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}

// ============================================
// FLOATING SHARDS: Crystal field
// ============================================
function CrystalField({ count = 50 }: { count?: number }) {
  const shards = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20 - 10,
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.8,
      rotationOffset: Math.random() * Math.PI * 2,
      isGold: Math.random() > 0.3,
    }));
  }, [count]);

  return (
    <group>
      {shards.map((shard, i) => (
        <FloatingShard key={i} {...shard} />
      ))}
    </group>
  );
}

function FloatingShard({ 
  position, 
  scale, 
  speed, 
  rotationOffset,
  isGold 
}: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number;
  rotationOffset: number;
  isGold: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = (t + rotationOffset) * speed * 0.3;
    meshRef.current.rotation.y = (t + rotationOffset) * speed * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(t * speed + rotationOffset) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={isGold ? "#D9AE43" : "#FF3C93"}
        metalness={1}
        roughness={0.1}
        emissive={isGold ? "#D9AE43" : "#FF3C93"}
        emissiveIntensity={0.3}
        envMapIntensity={2}
      />
    </mesh>
  );
}

// ============================================
// GOLD CHAIN RINGS: Interlocking luxury
// ============================================
function ChainRings() {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const group3Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group1Ref.current) {
      group1Ref.current.rotation.x = t * 0.15;
      group1Ref.current.rotation.y = t * 0.1;
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.x = -t * 0.12;
      group2Ref.current.rotation.z = t * 0.08;
    }
    if (group3Ref.current) {
      group3Ref.current.rotation.y = t * 0.2;
      group3Ref.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <Float speed={0.3} floatIntensity={0.5}>
      <group position={[-6, 2, -8]}>
        <group ref={group1Ref}>
          <mesh>
            <torusGeometry args={[2, 0.15, 16, 64]} />
            <meshStandardMaterial color="#D9AE43" metalness={1} roughness={0.05} envMapIntensity={4} />
          </mesh>
        </group>
        <group ref={group2Ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.2, 0.12, 16, 64]} />
            <meshStandardMaterial color="#D9AE43" metalness={1} roughness={0.05} envMapIntensity={4} />
          </mesh>
        </group>
        <group ref={group3Ref}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.8, 0.1, 16, 64]} />
            <meshStandardMaterial color="#D9AE43" metalness={1} roughness={0.05} envMapIntensity={4} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

// ============================================
// MORPHING BLOB: Liquid metal
// ============================================
function LiquidMetalBlob({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
  });

  return (
    <Float speed={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          metalness={1}
          roughness={0}
          distort={0.4}
          speed={2}
          envMapIntensity={3}
        />
      </mesh>
    </Float>
  );
}

// ============================================
// ORBITING PARTICLES: Energy trails
// ============================================
function OrbitalParticle({ radius, speed, offset, color }: { radius: number; speed: number; offset: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.y = Math.sin(t * 0.7) * (radius * 0.5);
    meshRef.current.position.z = Math.sin(t) * radius - 5;
  });

  return (
    <Trail
      width={0.5}
      length={8}
      color={color}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} scale={0.15}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </Trail>
  );
}

function OrbitalSystem() {
  return (
    <group>
      <OrbitalParticle radius={8} speed={0.5} offset={0} color="#D9AE43" />
      <OrbitalParticle radius={10} speed={0.3} offset={Math.PI} color="#FF3C93" />
      <OrbitalParticle radius={6} speed={0.7} offset={Math.PI / 2} color="#D9AE43" />
      <OrbitalParticle radius={12} speed={0.2} offset={Math.PI * 1.5} color="#FF3C93" />
    </group>
  );
}

// ============================================
// VOLUMETRIC LIGHTS
// ============================================
function VolumetricLights() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.3) * 15;
      light1Ref.current.position.y = Math.cos(t * 0.2) * 10;
      light1Ref.current.intensity = 8 + Math.sin(t * 2) * 2;
    }
    
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.4) * 12;
      light2Ref.current.position.z = Math.sin(t * 0.3) * 10;
      light2Ref.current.intensity = 6 + Math.cos(t * 1.5) * 2;
    }
    
    if (light3Ref.current) {
      light3Ref.current.position.x = Math.sin(t * 0.2) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight ref={light1Ref} position={[5, 5, 5]} color="#FF3C93" intensity={8} distance={50} decay={2} />
      <pointLight ref={light2Ref} position={[-5, 3, -5]} color="#D9AE43" intensity={6} distance={45} decay={2} />
      <spotLight 
        ref={light3Ref}
        position={[0, 25, 0]} 
        angle={0.4} 
        penumbra={1} 
        color="#ffffff" 
        intensity={3}
        castShadow
      />
      {/* Rim lights */}
      <pointLight position={[-15, 0, -10]} color="#00ffff" intensity={2} distance={30} />
      <pointLight position={[15, 0, -10]} color="#ff00ff" intensity={2} distance={30} />
    </>
  );
}

// ============================================
// CAMERA RIG: Subtle movement
// ============================================
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.1) * 0.5;
    state.camera.position.y = Math.cos(t * 0.08) * 0.3;
    state.camera.lookAt(0, 0, -3);
  });
  
  return null;
}

// ============================================
// POST-PROCESSING: Maximum visual impact
// ============================================
function PostEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.002, 0.002)}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

// ============================================
// MAIN SCENE CONTENT
// ============================================
function SceneContent() {
  return (
    <>
      <VolumetricLights />
      <CameraRig />
      
      {/* Centerpiece */}
      <MegaDiamond />
      
      {/* Crystal field - 50 floating shards */}
      <CrystalField count={60} />
      
      {/* Gold chain rings */}
      <ChainRings />
      
      {/* Liquid metal blobs */}
      <LiquidMetalBlob position={[7, -2, -6]} color="#D9AE43" />
      <LiquidMetalBlob position={[-5, 3, -8]} color="#FF3C93" />
      
      {/* Orbital particle system */}
      <OrbitalSystem />
      
      {/* Background sparkles */}
      <Sparkles
        count={200}
        scale={30}
        size={2}
        speed={0.3}
        color="#D9AE43"
        opacity={0.5}
      />
      
      <Sparkles
        count={100}
        scale={25}
        size={1.5}
        speed={0.5}
        color="#FF3C93"
        opacity={0.3}
      />
      
      {/* Deep space stars */}
      <Stars
        radius={100}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0B0B0D', 10, 50]} />
      
      {/* Post-processing */}
      <PostEffects />
      
      <Preload all />
    </>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export function NightlifeScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping, 
          toneMappingExposure: 1.0,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 15], fov: 50 }}
        shadows
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default NightlifeScene;
