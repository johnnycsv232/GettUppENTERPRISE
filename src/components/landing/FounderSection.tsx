/**
 * @file FounderSection.tsx
 * @description Johnny Cage founder story section
 * @module components/landing/FounderSection
 */

"use client";

import { motion } from "framer-motion";
import { Calendar, Camera, Target } from "lucide-react";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

const stats = [
	{ icon: <Camera className="w-5 h-5" />, value: "350+", label: "Events Shot" },
	{ icon: <Calendar className="w-5 h-5" />, value: "10+", label: "Venues" },
	{
		icon: <Target className="w-5 h-5" />,
		value: "95%",
		label: "On-Time Delivery",
	},
];

export function FounderSection() {
	return (
		<section className="py-24 px-6 bg-gradient-to-b from-[var(--brand-ink)] to-black">
			<div className="max-w-6xl mx-auto">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Image/Avatar */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="relative"
					>
						<div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-[var(--brand-gold)]/20 to-[var(--brand-pink)]/20 border border-[var(--brand-gold)]/30 overflow-hidden">
							{/* Placeholder for actual photo */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center">
									<div className="w-32 h-32 rounded-full bg-[var(--brand-gold)]/30 mx-auto mb-4 flex items-center justify-center">
										<Camera className="w-16 h-16 text-[var(--brand-gold)]" />
									</div>
									<p className="text-[var(--brand-gold)] font-bold text-xl">
										JOHNNY CAGE
									</p>
									<p className="text-gray-400 text-sm">
										Founder & Lead Photographer
									</p>
								</div>
							</div>
						</div>

						{/* Floating badge */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className="absolute -bottom-4 -right-4 bg-[var(--brand-gold)] text-[var(--brand-ink)] px-4 py-2 rounded-lg font-bold text-sm"
						>
							Official Last Call Photographer
						</motion.div>
					</motion.div>

					{/* Content */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<p className="text-sm uppercase tracking-[0.3em] text-[var(--brand-gold)] mb-4">
							The Man Behind The Lens
						</p>

						<h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
							MEET JOHNNY CAGE.
						</h2>

						<p className="text-lg text-gray-300 leading-relaxed mb-6">
							Johnny Cage is the lens behind 350+ Minneapolis nights this year
							and the name venues recognize before they see the camera. Official
							photographer for Last Call and a fixture at DJ YS sets, he turned
							"pull up with the homies" access into a system that delivers
							nightclub-grade content on a 24-72h clock.
						</p>

						<p className="text-lg text-gray-300 leading-relaxed mb-8">
							<span className="text-[var(--brand-gold)] font-semibold">
								GettUpp ENT
							</span>{" "}
							is that system—built by the guy who's already in the room, then
							hardened with an enterprise playbook so your content hits on
							schedule every time.
						</p>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 mb-8">
							{stats.map((stat, idx) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.4 + idx * 0.1 }}
									className="text-center p-4 rounded-lg bg-white/5 border border-white/10"
								>
									<div className="text-[var(--brand-gold)] mb-2 flex justify-center">
										{stat.icon}
									</div>
									<div className="text-2xl font-bold text-white">
										{stat.value}
									</div>
									<div className="text-xs text-gray-400">{stat.label}</div>
								</motion.div>
							))}
						</div>

						<Link href="/pilot-intake">
							<MagneticButton size="lg">WORK WITH JOHNNY'S TEAM</MagneticButton>
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

export default FounderSection;
