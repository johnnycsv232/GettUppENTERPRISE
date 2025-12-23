/**
 * @file GLTFModel.tsx
 * @description Dynamic GLTF model loader with animation and effects
 */

"use client";

import { Float, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface GLTFModelProps {
	url: string;
	position?: [number, number, number];
	scale?: number | [number, number, number];
	rotation?: [number, number, number];
	autoRotate?: boolean;
	floatSpeed?: number;
	floatIntensity?: number;
	emissiveColor?: string;
	emissiveIntensity?: number;
}

export function GLTFModel({
	url,
	position = [0, 0, 0],
	scale = 1,
	rotation = [0, 0, 0],
	autoRotate = true,
	floatSpeed = 1,
	floatIntensity = 1,
	emissiveColor = "#D9AE43",
	emissiveIntensity = 0.3,
}: GLTFModelProps) {
	const groupRef = useRef<THREE.Group>(null);
	const { scene } = useGLTF(url);
	const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);

	useEffect(() => {
		if (scene) {
			const clone = scene.clone();

			// Apply emissive effect to all meshes
			clone.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					if (child.material instanceof THREE.MeshStandardMaterial) {
						child.material = child.material.clone();
						child.material.emissive = new THREE.Color(emissiveColor);
						child.material.emissiveIntensity = emissiveIntensity;
						child.material.metalness = 0.8;
						child.material.roughness = 0.2;
						child.material.envMapIntensity = 2;
					}
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

			setClonedScene(clone);
		}
	}, [scene, emissiveColor, emissiveIntensity]);

	useFrame((state) => {
		if (!groupRef.current || !autoRotate) return;
		const t = state.clock.getElapsedTime();
		groupRef.current.rotation.y = t * 0.2;
	});

	if (!clonedScene) return null;

	const scaleArray: [number, number, number] = Array.isArray(scale)
		? scale
		: [scale, scale, scale];

	return (
		<Float speed={floatSpeed} floatIntensity={floatIntensity}>
			<group
				ref={groupRef}
				position={position}
				rotation={rotation}
				scale={scaleArray}
			>
				<primitive object={clonedScene} />
			</group>
		</Float>
	);
}

// Preload models
export function preloadModels() {
	const models = [
		"/models/component.gltf",
		"/models/generated-model.gltf",
		"/models/model.gltf",
	];
	models.forEach((url) => {
		try {
			useGLTF.preload(url);
		} catch {
			console.warn(`Failed to preload: ${url}`);
		}
	});
}

export default GLTFModel;
