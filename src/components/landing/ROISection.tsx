/**
 * @file ROISection.tsx
 * @description ROI math section with animated counting numbers
 * @module components/landing/ROISection
 */

"use client";

import { motion, useInView } from "framer-motion";
import { BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Animated counter hook
 */
function useCounter(end: number, duration: number = 2000, inView: boolean) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!inView) return;

		let startTime: number;
		let animationFrame: number;

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			setCount(Math.floor(progress * end));

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrame);
	}, [end, duration, inView]);

	return count;
}

const ROI_DATA = [
	{
		icon: <Users className="w-6 h-6" />,
		value: 3,
		suffix: "",
		label: "New Regulars Needed",
		description: "to cover VIP tier cost",
	},
	{
		icon: <DollarSign className="w-6 h-6" />,
		value: 350,
		suffix: "",
		label: "Lifetime Value Each",
		description: "average regular customer",
	},
	{
		icon: <TrendingUp className="w-6 h-6" />,
		value: 1050,
		suffix: "",
		prefix: "$",
		label: "Revenue Generated",
		description: "from 3 new regulars",
	},
	{
		icon: <BarChart3 className="w-6 h-6" />,
		value: 11,
		suffix: "",
		prefix: "$",
		label: "Cost Per Photo",
		description: "Pilot breaks down to",
	},
];

export function ROISection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

	return (
		<section ref={sectionRef} className="py-24 px-6 bg-[var(--brand-ink)]">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<p className="text-sm uppercase tracking-[0.3em] text-[var(--brand-gold)] mb-4">
						The Math That Matters
					</p>
					<h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
						TRACKED RSVPs. NOT HOPIUM.
					</h2>
					<p className="text-lg text-gray-300 max-w-3xl mx-auto">
						Your nights aren't judged on likes—they're judged on doors, covers,
						and who comes back next week. The GettUpp ShotClock system tracks
						campaigns from "post is live" to "line at the door," so you can see
						exactly which content pulls its weight.
					</p>
				</motion.div>

				{/* ROI Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
					{ROI_DATA.map((item, idx) => (
						<ROICard
							key={item.label}
							{...item}
							delay={idx * 0.1}
							inView={isInView}
						/>
					))}
				</div>

				{/* Break-even visualization */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="bg-gradient-to-r from-[var(--brand-gold)]/10 to-[var(--brand-pink)]/10 rounded-2xl p-8 border border-[var(--brand-gold)]/20"
				>
					<div className="grid md:grid-cols-2 gap-8 items-center">
						<div>
							<h3 className="font-heading text-2xl font-bold text-white mb-4">
								THE BREAK-EVEN MATH
							</h3>
							<ul className="space-y-3 text-gray-300">
								<li className="flex items-center gap-3">
									<span className="w-2 h-2 bg-[var(--brand-gold)] rounded-full" />
									3 new regulars at $350 lifetime value ={" "}
									<span className="text-[var(--brand-gold)] font-bold">
										$1,050
									</span>
								</li>
								<li className="flex items-center gap-3">
									<span className="w-2 h-2 bg-[var(--brand-gold)] rounded-full" />
									Covers $995 VIP tier for{" "}
									<span className="text-[var(--brand-gold)] font-bold">
										one month
									</span>
								</li>
								<li className="flex items-center gap-3">
									<span className="w-2 h-2 bg-[var(--brand-gold)] rounded-full" />
									One VIP table night (~$3K) covers{" "}
									<span className="text-[var(--brand-gold)] font-bold">
										~3 months
									</span>
								</li>
								<li className="flex items-center gap-3">
									<span className="w-2 h-2 bg-[var(--brand-gold)] rounded-full" />
									Pilot breaks down to{" "}
									<span className="text-[var(--brand-gold)] font-bold">
										~$11/photo
									</span>
								</li>
							</ul>
						</div>

						{/* Progress bar visualization */}
						<div>
							<div className="mb-4">
								<div className="flex justify-between text-sm mb-2">
									<span className="text-gray-400">Investment</span>
									<span className="text-[var(--brand-gold)] font-bold">
										$995/mo
									</span>
								</div>
								<div className="h-3 bg-white/10 rounded-full overflow-hidden">
									<motion.div
										className="h-full bg-[var(--brand-gold)] rounded-full"
										initial={{ width: 0 }}
										whileInView={{ width: "100%" }}
										viewport={{ once: true }}
										transition={{ duration: 1, delay: 0.5 }}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between text-sm mb-2">
									<span className="text-gray-400">Return (3 regulars)</span>
									<span className="text-green-400 font-bold">$1,050</span>
								</div>
								<div className="h-3 bg-white/10 rounded-full overflow-hidden">
									<motion.div
										className="h-full bg-green-500 rounded-full"
										initial={{ width: 0 }}
										whileInView={{ width: "105%" }}
										viewport={{ once: true }}
										transition={{ duration: 1.2, delay: 0.7 }}
									/>
								</div>
							</div>
							<p className="text-center mt-4 text-green-400 font-bold">
								✓ ROI Positive with just 3 new regulars
							</p>
						</div>
					</div>
				</motion.div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<Link href="/services#shotclock">
						<MagneticButton variant="outline" size="lg">
							SEE HOW THE SHOTCLOCK WORKS
						</MagneticButton>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

interface ROICardProps {
	icon: React.ReactNode;
	value: number;
	suffix?: string;
	prefix?: string;
	label: string;
	description: string;
	delay: number;
	inView: boolean;
}

function ROICard({
	icon,
	value,
	suffix = "",
	prefix = "",
	label,
	description,
	delay,
	inView,
}: ROICardProps) {
	const count = useCounter(value, 2000, inView);

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay }}
			className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-[var(--brand-gold)]/50 transition-colors"
		>
			<div className="w-12 h-12 rounded-full bg-[var(--brand-gold)]/20 flex items-center justify-center mx-auto mb-4 text-[var(--brand-gold)]">
				{icon}
			</div>
			<div className="text-4xl font-bold text-white mb-2">
				{prefix}
				{count}
				{suffix}
			</div>
			<div className="text-[var(--brand-gold)] font-semibold mb-1">{label}</div>
			<div className="text-sm text-gray-400">{description}</div>
		</motion.div>
	);
}

export default ROISection;
