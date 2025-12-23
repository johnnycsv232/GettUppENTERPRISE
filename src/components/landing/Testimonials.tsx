/**
 * @file Testimonials.tsx
 * @description Social proof testimonials with stunning cards
 */

"use client";

import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useRef, useState } from "react";

const testimonials = [
	{
		id: 1,
		name: "Marcus T.",
		role: "Owner, Last Call",
		avatar: "MT",
		content:
			"Johnny and his team have completely transformed our social presence. We went from getting maybe 50 likes to consistent 500+ engagement on every post. More importantly—weekends are packed now.",
		rating: 5,
		metric: "+340% engagement",
	},
	{
		id: 2,
		name: "DJ YS",
		role: "Professional DJ",
		avatar: "YS",
		content:
			"I've worked with a lot of photographers but GettUpp is different. They understand the energy, they deliver on time, and the content actually builds my brand. No more chasing freelancers.",
		rating: 5,
		metric: "2x booking inquiries",
	},
	{
		id: 3,
		name: "Sarah K.",
		role: "Marketing Director, The Vault",
		avatar: "SK",
		content:
			"The 24-hour delivery promise isn't marketing BS—they actually deliver. We post while the night is still fresh in people's minds and the engagement reflects it.",
		rating: 5,
		metric: "24h avg delivery",
	},
	{
		id: 4,
		name: "Bdiffrent",
		role: "Producer/DJ",
		avatar: "BD",
		content:
			"Real talk—GettUpp made my last show look like a festival. Professional content that matches the energy we put into our performances. Worth every dollar.",
		rating: 5,
		metric: "15K post reach",
	},
];

export function Testimonials() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const [activeIndex, setActiveIndex] = useState(0);

	const next = () => setActiveIndex((i) => (i + 1) % testimonials.length);
	const prev = () =>
		setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

	return (
		<section
			ref={ref}
			className="py-32 px-6 bg-[#0B0B0D] relative overflow-hidden"
		>
			{/* Background accents */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D9AE43]/5 rounded-full blur-[200px]" />

			<div className="max-w-6xl mx-auto relative">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					className="text-center mb-16"
				>
					<span className="inline-block px-4 py-2 rounded-full bg-[#D9AE43]/10 border border-[#D9AE43]/30 text-[#D9AE43] text-sm font-medium mb-6">
						TESTIMONIALS
					</span>
					<h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
						WHAT THEY
						<span className="text-[#D9AE43]"> SAY</span>
					</h2>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Don't take our word for it—hear from venues and artists we've worked
						with.
					</p>
				</motion.div>

				{/* Featured Testimonial */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={isInView ? { opacity: 1, scale: 1 } : {}}
					transition={{ delay: 0.2 }}
					className="relative mb-12"
				>
					<div className="absolute -inset-1 bg-gradient-to-r from-[#D9AE43]/20 via-[#FF3C93]/20 to-[#D9AE43]/20 rounded-3xl blur-xl" />
					<div className="relative bg-gradient-to-br from-[#1a1a1d] to-[#0B0B0D] border border-white/10 rounded-3xl p-8 md:p-12">
						{/* Quote icon */}
						<div className="absolute top-8 right-8 text-[#D9AE43]/20">
							<Quote className="w-20 h-20" />
						</div>

						{/* Content */}
						<div className="relative">
							{/* Stars */}
							<div className="flex gap-1 mb-6">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-6 h-6 text-[#D9AE43] fill-[#D9AE43]"
									/>
								))}
							</div>

							{/* Testimonial text */}
							<motion.p
								key={activeIndex}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-xl md:text-2xl text-white leading-relaxed mb-8"
							>
								"{testimonials[activeIndex].content}"
							</motion.p>

							{/* Author */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D9AE43] to-[#FF3C93] flex items-center justify-center text-[#0B0B0D] font-bold text-lg">
										{testimonials[activeIndex].avatar}
									</div>
									<div>
										<h4 className="font-bold text-white text-lg">
											{testimonials[activeIndex].name}
										</h4>
										<p className="text-gray-400">
											{testimonials[activeIndex].role}
										</p>
									</div>
								</div>
								<div className="px-4 py-2 bg-[#D9AE43]/20 border border-[#D9AE43]/30 rounded-full">
									<span className="text-[#D9AE43] font-bold">
										{testimonials[activeIndex].metric}
									</span>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Navigation */}
				<div className="flex items-center justify-center gap-4">
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={prev}
						className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D9AE43] hover:text-[#D9AE43] transition-colors"
					>
						<ChevronLeft className="w-6 h-6" />
					</motion.button>

					{/* Dots */}
					<div className="flex gap-2">
						{testimonials.map((_, i) => (
							<button
								key={i}
								onClick={() => setActiveIndex(i)}
								className={`w-3 h-3 rounded-full transition-all ${
									i === activeIndex
										? "bg-[#D9AE43] w-8"
										: "bg-white/20 hover:bg-white/40"
								}`}
							/>
						))}
					</div>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={next}
						className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D9AE43] hover:text-[#D9AE43] transition-colors"
					>
						<ChevronRight className="w-6 h-6" />
					</motion.button>
				</div>
			</div>
		</section>
	);
}

export default Testimonials;
