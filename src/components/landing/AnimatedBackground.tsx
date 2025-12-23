/**
 * @file AnimatedBackground.tsx
 * @description MAXIMUM COMPUTE background - liquid glass, particle storms, energy waves
 */

"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// Seeded random for consistent particle positions
function seededRandom(seed: number): number {
	const x = Math.sin(seed * 9999) * 10000;
	return x - Math.floor(x);
}

// Generate particle data
interface Particle {
	id: number;
	left: number;
	top: number;
	size: number;
	duration: number;
	delay: number;
	distance: number;
	color: string;
	blur: number;
}

export function AnimatedBackground() {
	const [mounted, setMounted] = useState(false);

	// 100 particles for maximum density
	const particles: Particle[] = useMemo(() => {
		return Array.from({ length: 100 }).map((_, i) => ({
			id: i,
			left: seededRandom(i * 1.1) * 100,
			top: seededRandom(i * 2.2) * 100,
			size: 1 + seededRandom(i * 3.3) * 4,
			duration: 4 + seededRandom(i * 4.4) * 12,
			delay: seededRandom(i * 5.5) * 8,
			distance: 50 + seededRandom(i * 6.6) * 200,
			color: i % 5 === 0 ? "#FF3C93" : i % 3 === 0 ? "#00ffff" : "#D9AE43",
			blur: seededRandom(i * 7.7) * 3,
		}));
	}, []);

	// Energy wave positions
	const waves = useMemo(() => {
		return Array.from({ length: 5 }).map((_, i) => ({
			id: i,
			delay: i * 2,
			duration: 8 + i * 2,
		}));
	}, []);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="absolute inset-0 z-0 overflow-hidden bg-[#0B0B0D]">
			{/* Deep gradient base */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `
            radial-gradient(ellipse at 30% 20%, rgba(217, 174, 67, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(255, 60, 147, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, #0B0B0D 0%, #0a0a12 50%, #0B0B0D 100%)
          `,
				}}
			/>

			{/* Animated gold veins - SVG paths */}
			<svg
				className="absolute inset-0 w-full h-full opacity-20"
				preserveAspectRatio="none"
				viewBox="0 0 1920 1080"
			>
				<defs>
					<linearGradient id="vein1" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#D9AE43" stopOpacity="0" />
						<stop offset="30%" stopColor="#D9AE43" stopOpacity="1" />
						<stop offset="70%" stopColor="#FF3C93" stopOpacity="1" />
						<stop offset="100%" stopColor="#FF3C93" stopOpacity="0" />
					</linearGradient>
					<linearGradient id="vein2" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#FF3C93" stopOpacity="0" />
						<stop offset="50%" stopColor="#D9AE43" stopOpacity="1" />
						<stop offset="100%" stopColor="#D9AE43" stopOpacity="0" />
					</linearGradient>
					<filter id="glow">
						<feGaussianBlur stdDeviation="3" result="coloredBlur" />
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* Animated paths */}
				<motion.path
					d="M-100,200 Q300,100 600,300 T1200,150 T1800,350 T2100,200"
					stroke="url(#vein1)"
					strokeWidth="2"
					fill="none"
					filter="url(#glow)"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{
						duration: 4,
						ease: "easeInOut",
						repeat: Infinity,
						repeatType: "loop",
						repeatDelay: 2,
					}}
				/>
				<motion.path
					d="M-100,500 Q400,350 800,550 T1400,400 T2100,600"
					stroke="url(#vein2)"
					strokeWidth="1.5"
					fill="none"
					filter="url(#glow)"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{
						duration: 5,
						delay: 1,
						ease: "easeInOut",
						repeat: Infinity,
						repeatType: "loop",
						repeatDelay: 3,
					}}
				/>
				<motion.path
					d="M-100,800 Q500,650 1000,850 T1600,700 T2100,900"
					stroke="url(#vein1)"
					strokeWidth="1"
					fill="none"
					filter="url(#glow)"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{
						duration: 6,
						delay: 2,
						ease: "easeInOut",
						repeat: Infinity,
						repeatType: "loop",
						repeatDelay: 4,
					}}
				/>
			</svg>

			{/* Morphing liquid glass orbs */}
			<motion.div
				animate={{
					scale: [1, 1.4, 1],
					x: [0, 50, 0],
					y: [0, -30, 0],
					borderRadius: [
						"30% 70% 70% 30% / 30% 30% 70% 70%",
						"70% 30% 30% 70% / 70% 70% 30% 30%",
						"30% 70% 70% 30% / 30% 30% 70% 70%",
					],
				}}
				transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-1/4 left-1/4 w-[700px] h-[700px]"
				style={{
					background:
						"linear-gradient(135deg, rgba(217, 174, 67, 0.12) 0%, rgba(217, 174, 67, 0.02) 100%)",
					backdropFilter: "blur(80px)",
					border: "1px solid rgba(217, 174, 67, 0.08)",
				}}
			/>

			<motion.div
				animate={{
					scale: [1.3, 1, 1.3],
					x: [0, -60, 0],
					y: [0, 40, 0],
					borderRadius: [
						"70% 30% 30% 70% / 70% 70% 30% 30%",
						"30% 70% 70% 30% / 30% 30% 70% 70%",
						"70% 30% 30% 70% / 70% 70% 30% 30%",
					],
				}}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px]"
				style={{
					background:
						"linear-gradient(135deg, rgba(255, 60, 147, 0.1) 0%, rgba(255, 60, 147, 0.01) 100%)",
					backdropFilter: "blur(60px)",
					border: "1px solid rgba(255, 60, 147, 0.06)",
				}}
			/>

			{/* Center spotlight pulse */}
			<motion.div
				animate={{
					opacity: [0.2, 0.6, 0.2],
					scale: [1, 1.2, 1],
				}}
				transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
				style={{
					background:
						"radial-gradient(circle, rgba(217, 174, 67, 0.15) 0%, transparent 50%)",
				}}
			/>

			{/* Energy waves - expanding rings */}
			{mounted &&
				waves.map((wave) => (
					<motion.div
						key={wave.id}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9AE43]/20"
						initial={{ width: 0, height: 0, opacity: 0.5 }}
						animate={{
							width: [0, 1500],
							height: [0, 1500],
							opacity: [0.5, 0],
						}}
						transition={{
							duration: wave.duration,
							delay: wave.delay,
							repeat: Infinity,
							ease: "linear",
						}}
					/>
				))}

			{/* Particle storm */}
			{mounted && (
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{particles.map((p) => (
						<motion.div
							key={p.id}
							className="absolute rounded-full"
							style={{
								left: `${p.left}%`,
								top: `${p.top}%`,
								width: p.size,
								height: p.size,
								background: p.color,
								boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
								filter: `blur(${p.blur}px)`,
							}}
							animate={{
								y: [0, -p.distance],
								x: [0, (seededRandom(p.id * 10) - 0.5) * 50],
								opacity: [0, 0.9, 0],
								scale: [0.3, 1.2, 0.5],
							}}
							transition={{
								duration: p.duration,
								repeat: Infinity,
								delay: p.delay,
								ease: "easeOut",
							}}
						/>
					))}
				</div>
			)}

			{/* Noise texture overlay */}
			<div
				className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Gothic vignette - deeper */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0B0B0D_65%)]" />

			{/* Edge glow lines */}
			<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D9AE43]/40 to-transparent" />
			<div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3C93]/30 to-transparent" />
			<div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D9AE43]/20 to-transparent" />
			<div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF3C93]/20 to-transparent" />
		</div>
	);
}

export default AnimatedBackground;
