/**
 * @file FAQ.tsx
 * @description Animated FAQ accordion section
 */

"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";

const faqs = [
	{
		question: "What's included in the $345 Pilot Night?",
		answer:
			"One premium on-site shoot with 30 club-ready photo edits, delivered within 72 hours. You also get the full GettUpp color treatment and a 7-10 day posting plan to maximize engagement. It's our way of proving the system works before you commit to a subscription.",
	},
	{
		question: "How fast do you actually deliver?",
		answer:
			"Pilot Night: 72 hours max. Tier 1: 72 hours. Tier 2: 48 hours. VIP: 24 hours. We've hit 99.2% on-time delivery across 350+ events. If we miss the deadline, you get a free shoot.",
	},
	{
		question: "Do I own the photos?",
		answer:
			"You get a non-exclusive license to use all photos for your marketing—social media, website, print, ads, everything. We retain the right to use them in our portfolio. Full buyout licensing is available for an additional fee.",
	},
	{
		question: "What if I need to reschedule?",
		answer:
			"Life happens. Reschedule with 48+ hours notice and we'll move your shoot, no questions asked. Less than 48 hours and there's a $75 rebooking fee. No-shows forfeit the shoot.",
	},
	{
		question: "Do you only work in Minneapolis?",
		answer:
			"Minneapolis is our home base and where we do our best work—we know the venues, the DJs, the energy. We can travel for special events (festivals, tours, etc.) with additional travel fees.",
	},
	{
		question: "What's the ShotClock ROI tracking?",
		answer:
			"ShotClock is our proprietary system that tracks your content from 'post is live' to 'line at the door.' We measure engagement, click-throughs, and correlate with your actual attendance data. VIP tier gets full access; other tiers get summary reports.",
	},
	{
		question: "Can I cancel anytime?",
		answer:
			"Yes. No contracts, no cancellation fees. If you're on a subscription, just let us know before your next billing cycle. We're confident enough in our work that we don't need to lock you in.",
	},
	{
		question: "What's the 60-day guarantee?",
		answer:
			"If we don't move the needle on your covers within 60 days of your pilot, you get a full refund AND an extra shoot on us. We've never had to honor this guarantee—but it's there because we stand behind our work.",
	},
];

export function FAQ() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section
			ref={ref}
			className="py-32 px-6 bg-gradient-to-b from-[#0B0B0D] via-[#111113] to-[#0B0B0D] relative overflow-hidden"
		>
			<div className="max-w-4xl mx-auto relative">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					className="text-center mb-16"
				>
					<span className="inline-block px-4 py-2 rounded-full bg-[#D9AE43]/10 border border-[#D9AE43]/30 text-[#D9AE43] text-sm font-medium mb-6">
						FAQ
					</span>
					<h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
						GOT <span className="text-[#D9AE43]">QUESTIONS?</span>
					</h2>
					<p className="text-xl text-gray-400">
						Everything you need to know before booking.
					</p>
				</motion.div>

				{/* FAQ Items */}
				<div className="space-y-4">
					{faqs.map((faq, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.05 }}
						>
							<motion.button
								onClick={() => setOpenIndex(openIndex === i ? null : i)}
								className={`w-full text-left p-6 rounded-2xl border transition-all ${
									openIndex === i
										? "bg-[#D9AE43]/10 border-[#D9AE43]/30"
										: "bg-white/5 border-white/10 hover:border-[#D9AE43]/30"
								}`}
							>
								<div className="flex items-center justify-between gap-4">
									<h3 className="font-semibold text-lg text-white pr-8">
										{faq.question}
									</h3>
									<motion.div
										animate={{ rotate: openIndex === i ? 180 : 0 }}
										className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
											openIndex === i
												? "bg-[#D9AE43] text-[#0B0B0D]"
												: "bg-white/10 text-white"
										}`}
									>
										{openIndex === i ? (
											<Minus className="w-4 h-4" />
										) : (
											<Plus className="w-4 h-4" />
										)}
									</motion.div>
								</div>

								<AnimatePresence>
									{openIndex === i && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="overflow-hidden"
										>
											<p className="text-gray-400 mt-4 leading-relaxed">
												{faq.answer}
											</p>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.button>
						</motion.div>
					))}
				</div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.5 }}
					className="text-center mt-12"
				>
					<p className="text-gray-400 mb-4">Still have questions?</p>
					<a
						href="mailto:hello@gettuppent.com"
						className="text-[#D9AE43] font-semibold hover:underline"
					>
						hello@gettuppent.com
					</a>
				</motion.div>
			</div>
		</section>
	);
}

export default FAQ;
