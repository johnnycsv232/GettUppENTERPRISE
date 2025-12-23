/**
 * @file ProblemSolution.tsx
 * @description Editorial style contrast section (No Boxes)
 */

"use client";

import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import { useRef } from "react";

const problems = [
	"Posts go up days late—momentum dead.",
	"Freelancers ghost on busy weekends.",
	"Generic content that looks like everyone else.",
	"Zero ROI tracking—just 'vibes' and hope.",
];

const solutions = [
	"24-72h delivery guaranteed. Every time.",
	"Dedicated team with backup systems.",
	"Signature 'GettUpp Look' builds your brand.",
	"ShotClock ROI tracking from post to door.",
];

export function ProblemSolution() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section
			ref={ref}
			className="py-0 relative overflow-hidden flex flex-col md:flex-row"
		>
			{/* Left: The Problem (Dark & Gritty) */}
			<div className="w-full md:w-1/2 bg-[#050505] py-24 px-8 md:px-16 relative border-r border-white/5">
				<div className="max-w-lg ml-auto">
					<motion.span
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : {}}
						className="text-[#FF3C93] font-bold tracking-widest text-sm uppercase mb-8 block"
					>
						The Old Way
					</motion.span>

					<h3 className="font-heading text-4xl font-bold text-white mb-12">
						TIRED OF CONTENT THAT{" "}
						<span className="text-[#FF3C93] line-through decoration-2">
							GHOSTS YOU?
						</span>
					</h3>

					<ul className="space-y-8">
						{problems.map((item, i) => (
							<motion.li
								key={i}
								initial={{ opacity: 0, x: -20 }}
								animate={isInView ? { opacity: 1, x: 0 } : {}}
								transition={{ delay: i * 0.1 }}
								className="flex items-start gap-6 group"
							>
								<X className="w-6 h-6 text-gray-600 group-hover:text-[#FF3C93] transition-colors flex-shrink-0 mt-1" />
								<span className="text-xl text-gray-500 font-medium group-hover:text-gray-300 transition-colors">
									{item}
								</span>
							</motion.li>
						))}
					</ul>
				</div>
			</div>

			{/* Right: The Solution (Gold & Premium) */}
			<div className="w-full md:w-1/2 bg-[#0B0B0D] py-24 px-8 md:px-16 relative">
				<div className="absolute inset-0 bg-[#D9AE43]/5" />

				<div className="max-w-lg mr-auto relative">
					<motion.span
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : {}}
						className="text-[#D9AE43] font-bold tracking-widest text-sm uppercase mb-8 block"
					>
						The GettUpp Standard
					</motion.span>

					<h3 className="font-heading text-4xl font-bold text-white mb-12">
						A SYSTEM THAT <span className="text-[#D9AE43]">PACKS VENUES.</span>
					</h3>

					<ul className="space-y-8">
						{solutions.map((item, i) => (
							<motion.li
								key={i}
								initial={{ opacity: 0, x: 20 }}
								animate={isInView ? { opacity: 1, x: 0 } : {}}
								transition={{ delay: 0.2 + i * 0.1 }}
								className="flex items-start gap-6"
							>
								<div className="w-6 h-6 rounded-full bg-[#D9AE43] flex items-center justify-center flex-shrink-0 mt-1">
									<Check className="w-4 h-4 text-black stroke-[3]" />
								</div>
								<span className="text-xl text-white font-medium">{item}</span>
							</motion.li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}

export default ProblemSolution;
