/**
 * @file UltimateHero.tsx
 * @description Liquid Glass Luxury Hero - Trump Tower x Apple x Gothic Nightlife x Rap Culture
 */

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Crown, Eye, Play, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatedBackground } from "./AnimatedBackground";

const NightlifeScene = dynamic(
	() => import("@/components/three/NightlifeScene"),
	{
		ssr: false,
		loading: () => (
			<div className="absolute inset-0 z-0 flex items-center justify-center">
				<div className="w-16 h-16 border-2 border-[#D9AE43]/30 border-t-[#D9AE43] rounded-full animate-spin" />
			</div>
		),
	},
);

// Staggered text reveal with gothic easing
const textReveal = {
	hidden: { y: 120, opacity: 0, rotateX: -40 },
	visible: (i: number) => ({
		y: 0,
		opacity: 1,
		rotateX: 0,
		transition: {
			delay: 0.8 + i * 0.12,
			duration: 1,
			ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
		},
	}),
};

const glassReveal = {
	hidden: { opacity: 0, scale: 0.9, y: 40 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			delay: 1.8,
			duration: 1.2,
			ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
		},
	},
};

export function UltimateHero() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [show3D, setShow3D] = useState(false);
	const [hoveredCard, setHoveredCard] = useState<number | null>(null);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	});

	const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
	const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

	useEffect(() => {
		const timer = setTimeout(() => setShow3D(true), 800);
		return () => clearTimeout(timer);
	}, []);

	return (
		<section
			ref={containerRef}
			className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-ink"
		>
			{/* Background Layers */}
			<AnimatedBackground />
			{show3D && <NightlifeScene />}

			{/* Main Content */}
			<motion.div
				style={{ y: parallaxY, opacity: opacityFade }}
				className="relative z-20 w-full max-w-7xl mx-auto px-6 py-20"
			>
				{/* Crown Badge - Rap Culture Flex */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.8 }}
					className="flex justify-center mb-8"
				>
					<div className="flex items-center gap-3 px-6 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 backdrop-blur-xl shadow-[0_0_30px_rgba(217,174,67,0.1)]">
						<Crown className="w-4 h-4 text-brand-gold" />
						<span className="text-brand-gold font-medium text-sm tracking-[0.2em] uppercase font-heading">
							Minneapolis Royalty
						</span>
						<Crown className="w-4 h-4 text-brand-gold" />
					</div>
				</motion.div>

				{/* Main Brand Mark */}
				<div className="text-center mb-12" style={{ perspective: "1000px" }}>
					<motion.h1
						className="font-heading font-black tracking-tight"
						style={{ transformStyle: "preserve-3d" }}
					>
						{/* GETTUPP */}
						<motion.div
							custom={0}
							variants={textReveal}
							initial="hidden"
							animate="visible"
							className="text-[12vw] md:text-[10vw] leading-[0.85] text-transparent bg-clip-text drop-shadow-[0_0_80px_rgba(217,174,67,0.4)]"
							style={{
								backgroundImage:
									"linear-gradient(180deg, #FFFFFF 0%, #D9AE43 60%, #8B5CF6 100%)", // White -> Gold -> AI Violet
								WebkitBackgroundClip: "text",
							}}
						>
							GETTUPP
						</motion.div>

						{/* ENT - with gold underline */}
						<motion.div
							custom={1}
							variants={textReveal}
							initial="hidden"
							animate="visible"
							className="relative inline-block"
						>
							<span
								className="text-[8vw] md:text-[6vw] leading-none text-transparent bg-clip-text tracking-[0.3em]"
								style={{
									backgroundImage:
										"linear-gradient(90deg, #8B5CF6 0%, #D9AE43 50%, #8B5CF6 100%)", // Violet -> Gold -> Violet
									WebkitBackgroundClip: "text",
								}}
							>
								ENT
							</span>
							{/* Gold underline flourish */}
							<motion.div
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{
									delay: 1.5,
									duration: 1,
									ease: [0.16, 1, 0.3, 1],
								}}
								className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent origin-center shadow-[0_0_20px_rgba(217,174,67,0.8)]"
							/>
						</motion.div>
					</motion.h1>
				</div>

				{/* Tagline - Apple-level clean */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.4, duration: 1 }}
					className="text-center text-xl md:text-2xl text-white/60 font-light tracking-wide max-w-2xl mx-auto mb-16"
				>
					The uniform of the Minneapolis night.
					<br />
					<span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
						Premium content. Real ROI. Zero excuses.
					</span>
				</motion.p>

				{/* Liquid Glass CTA Cards */}
				<motion.div
					variants={glassReveal}
					initial="hidden"
					animate="visible"
					className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16"
				>
					{/* Primary CTA - Gold Glass */}
					<Link href="/pilot-intake" aria-label="Start your $345 pilot program">
						<motion.div
							onHoverStart={() => setHoveredCard(1)}
							onHoverEnd={() => setHoveredCard(null)}
							whileHover={{ scale: 1.02, y: -4 }}
							whileTap={{ scale: 0.98 }}
							className="group relative cursor-pointer"
						>
							<div
								className="relative px-10 py-6 rounded-2xl overflow-hidden bg-brand-surface/80"
								style={{
									backdropFilter: "blur(20px)",
									border: "1px solid rgba(217, 174, 67, 0.3)",
									boxShadow:
										hoveredCard === 1
											? "0 20px 60px rgba(217, 174, 67, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
											: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
								}}
							>
								{/* Animated shine on hover */}
								<div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden">
									<motion.div
										className="absolute inset-0"
										style={{
											background:
												"linear-gradient(105deg, transparent 20%, rgba(217, 174, 67, 0.2) 50%, transparent 80%)",
										}}
										initial={{ x: "-100%" }}
										whileHover={{ x: "200%" }}
										transition={{ duration: 0.8, ease: "easeOut" }}
									/>
								</div>

								<div className="relative flex items-center gap-4">
									<Sparkles className="w-5 h-5 text-brand-gold animate-pulse-gold" />
									<div>
										<div className="text-brand-gold font-bold text-lg tracking-wide font-heading">
											START $345 PILOT
										</div>
										<div className="text-white/50 text-sm font-body">
											One event. Full experience.
										</div>
									</div>
									<ArrowRight className="w-5 h-5 text-brand-gold group-hover:translate-x-1 transition-transform" />
								</div>
							</div>
						</motion.div>
					</Link>

					{/* Secondary CTA - AI Violet Glass */}
					<Link href="/gallery" aria-label="View our portfolio gallery">
						<motion.div
							onHoverStart={() => setHoveredCard(2)}
							onHoverEnd={() => setHoveredCard(null)}
							whileHover={{ scale: 1.02, y: -4 }}
							whileTap={{ scale: 0.98 }}
							className="group relative cursor-pointer"
						>
							<div
								className="relative px-10 py-6 rounded-2xl overflow-hidden bg-brand-surface/80"
								style={{
									backdropFilter: "blur(20px)",
									border: "1px solid rgba(139, 92, 246, 0.3)", // AI Violet border
									boxShadow:
										hoveredCard === 2
											? "0 20px 60px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
											: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
								}}
							>
								<div className="relative flex items-center gap-4">
									<Play className="w-5 h-5 text-brand-ai fill-brand-ai" />
									<div>
										<div className="text-white font-bold text-lg tracking-wide font-heading">
											VIEW THE WORK
										</div>
										<div className="text-white/50 text-sm font-body">
											350+ events. Real results.
										</div>
									</div>
									<Eye className="w-5 h-5 text-brand-ai group-hover:scale-110 transition-transform" />
								</div>
							</div>
						</motion.div>
					</Link>
				</motion.div>

				{/* Trust Bar - Luxury Flex */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 2.2, duration: 1 }}
					className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm"
				>
					<TrustItem label="Views (90d)" value="79.7K" />
					<TrustItem label="Delivery" value="24HR" />
					<TrustItem label="Events Shot" value="350+" />
					<TrustItem label="Guarantee" value="60 DAY" />
				</motion.div>
			</motion.div>

			{/* Bottom fade */}
			<div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-ink via-brand-ink/50 to-transparent z-10 pointer-events-none" />

			{/* Scroll Indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 3 }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
			>
				<motion.div
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
					className="w-6 h-10 rounded-full border border-brand-gold/30 flex items-start justify-center p-2 shadow-[0_0_15px_rgba(217,174,67,0.2)]"
				>
					<motion.div
						animate={{ opacity: [1, 0.3, 1], y: [0, 12, 0] }}
						transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						className="w-1 h-2 bg-brand-gold rounded-full"
					/>
				</motion.div>
			</motion.div>
		</section>
	);
}

function TrustItem({ label, value }: { label: string; value: string }) {
	return (
		<motion.div
			className="flex flex-col items-center gap-1"
			whileHover={{ scale: 1.05, y: -2 }}
			transition={{ type: "spring", stiffness: 400, damping: 17 }}
		>
			<span className="text-2xl md:text-3xl font-bold text-white font-heading">
				{value}
			</span>
			<span className="text-white/40 text-xs tracking-[0.15em] uppercase">
				{label}
			</span>
		</motion.div>
	);
}

export default UltimateHero;
