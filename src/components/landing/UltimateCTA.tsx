/**
 * @file UltimateCTA.tsx
 * @description Final call-to-action section with stunning visuals
 */

"use client";

import { motion, useInView } from "framer-motion";
import {
	ArrowRight,
	Clock,
	MessageCircle,
	Shield,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function UltimateCTA() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section
			ref={ref}
			className="py-32 px-6 bg-[#0B0B0D] relative overflow-hidden"
		>
			{/* Background effects */}
			<div className="absolute inset-0">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D9AE43]/10 rounded-full blur-[200px]" />
				<div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#FF3C93]/10 rounded-full blur-[150px]" />
			</div>

			{/* Animated lines */}
			<div className="absolute inset-0 overflow-hidden">
				{[...Array(5)].map((_, i) => (
					<motion.div
						key={i}
						initial={{ x: "-100%", opacity: 0.1 }}
						animate={{ x: "200%", opacity: [0.1, 0.3, 0.1] }}
						transition={{
							duration: 8,
							delay: i * 1.5,
							repeat: Infinity,
							ease: "linear",
						}}
						className="absolute h-px bg-gradient-to-r from-transparent via-[#D9AE43] to-transparent"
						style={{ top: `${20 + i * 15}%`, width: "50%" }}
					/>
				))}
			</div>

			<div className="max-w-5xl mx-auto relative">
				{/* Main content */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					className="text-center"
				>
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={isInView ? { opacity: 1, scale: 1 } : {}}
						transition={{ delay: 0.2 }}
						className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D9AE43]/10 border border-[#D9AE43]/30 rounded-full mb-8"
					>
						<Sparkles className="w-4 h-4 text-[#D9AE43]" />
						<span className="text-[#D9AE43] font-medium">
							Only 3 pilot slots per month
						</span>
					</motion.div>

					{/* Headline */}
					<h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
						THIS WEEKEND DOESN'T
						<br />
						HAVE TO LOOK LIKE
						<br />
						<span className="bg-gradient-to-r from-[#D9AE43] via-[#f4d03f] to-[#D9AE43] bg-clip-text text-transparent">
							LAST WEEKEND.
						</span>
					</h2>

					{/* Subheadline */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : {}}
						transition={{ delay: 0.3 }}
						className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
					>
						Lock in a pilot night and see what happens when your content finally
						matches the energy inside your venue.
					</motion.p>

					{/* CTAs */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={isInView ? { opacity: 1, y: 0 } : {}}
						transition={{ delay: 0.4 }}
						className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
					>
						<Link href="/pilot-intake">
							<motion.button
								whileHover={{
									scale: 1.05,
									boxShadow: "0 0 60px rgba(217,174,67,0.4)",
								}}
								whileTap={{ scale: 0.98 }}
								className="group relative px-12 py-6 bg-gradient-to-r from-[#D9AE43] to-[#f4d03f] text-[#0B0B0D] font-bold text-xl rounded-full overflow-hidden"
							>
								<span className="relative z-10 flex items-center gap-3">
									BOOK YOUR PILOT — $345
									<ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
								</span>
								<motion.div
									className="absolute inset-0 bg-white/30"
									initial={{ x: "-100%" }}
									whileHover={{ x: "100%" }}
									transition={{ duration: 0.5 }}
								/>
							</motion.button>
						</Link>

						<Link href="/contact">
							<motion.button
								whileHover={{ scale: 1.05, borderColor: "#D9AE43" }}
								whileTap={{ scale: 0.98 }}
								className="px-12 py-6 border-2 border-white/30 text-white font-bold text-xl rounded-full backdrop-blur-sm hover:bg-white/5 transition-all flex items-center gap-3"
							>
								<MessageCircle className="w-6 h-6" />
								TALK TO US FIRST
							</motion.button>
						</Link>
					</motion.div>

					{/* Trust indicators */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : {}}
						transition={{ delay: 0.5 }}
						className="flex flex-wrap justify-center gap-8 text-sm text-gray-400"
					>
						<div className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-green-400" />
							<span>60-Day Guarantee</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-5 h-5 text-[#D9AE43]" />
							<span>72h Delivery</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
							<span>Stripe Secured</span>
						</div>
					</motion.div>
				</motion.div>

				{/* Bottom quote */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.6 }}
					className="mt-20 pt-12 border-t border-white/10 text-center"
				>
					<p className="text-2xl text-white italic mb-4">
						"We don't just post—we pack venues."
					</p>
					<p className="text-[#D9AE43] font-semibold">— Johnny Cage, Founder</p>
				</motion.div>
			</div>
		</section>
	);
}

export default UltimateCTA;
