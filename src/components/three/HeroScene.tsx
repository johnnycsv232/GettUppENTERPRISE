/**
 * @file HeroScene.tsx
 * @description 3D hero scene with floating camera/cube using React Three Fiber
 * @module components/three/HeroScene
 */

'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Floating 3D camera-inspired geometric shape
 */
function FloatingCamera() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#D9AE43"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

/**
 * Ambient particles floating in background
 */
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#D9AE43"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Fallback component while 3D loads
 */
function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[var(--brand-gold)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Main 3D Hero Scene component
 * Renders a floating geometric shape with particles
 */
export function HeroScene() {
  return (
    <div className="absolute inset-0 opacity-60 pointer-events-none">
      <Suspense fallback={<Fallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#D9AE43" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF3C93" />
          
          <FloatingCamera />
          <Particles />
          
          <Environment preset="city" />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default HeroScene;
