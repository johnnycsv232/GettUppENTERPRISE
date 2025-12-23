/**
 * @file PortfolioPreview.tsx
 * @description Stunning portfolio/gallery preview with hover effects
 */

"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Eye, Play } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { NightlifeImage } from "@/components/ui/NightlifeImage";

const portfolioItems = [
	{
		id: 1,
		title: "Last Call Saturdays",
		category: "Club Night",
		image: "/images/portfolio/last-call.jpg",
		views: "12.4K",
	},
	{
		id: 2,
		title: "DJ YS Live Set",
		category: "DJ Event",
		image: "/images/portfolio/dj-ys.jpg",
		views: "8.7K",
	},
	{
		id: 3,
		title: "VIP Section",
		category: "Bottle Service",
		image: "/images/portfolio/vip.jpg",
		views: "15.2K",
	},
	{
		id: 4,
		title: "Friday Vibes",
		category: "Weekly Event",
		image: "/images/portfolio/friday.jpg",
		views: "9.1K",
	},
	{
		id: 5,
		title: "Grand Opening",
		category: "Special Event",
		image: "/images/portfolio/opening.jpg",
		views: "22.8K",
	},
	{
		id: 6,
		title: "Artist Night",
		category: "Concert",
		image: "/images/portfolio/artist.jpg",
		views: "18.3K",
	},
];

export function PortfolioPreview() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const [hoveredId, setHoveredId] = useState<number | null>(null);

	return (
		<section
			ref={ref}
			className="py-32 px-6 bg-gradient-to-b from-[#0B0B0D] via-[#111113] to-[#0B0B0D] relative overflow-hidden"
		>
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					className="text-center mb-16"
				>
					<span className="inline-block px-4 py-2 rounded-full bg-[#FF3C93]/10 border border-[#FF3C93]/30 text-[#FF3C93] text-sm font-medium mb-6">
						OUR WORK
					</span>
					<h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
						SEE THE
						<span className="text-[#D9AE43]"> ENERGY</span>
					</h2>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Real nights. Real venues. Real results. This is what GettUpp looks
						like.
					</p>
				</motion.div>

				{/* Portfolio Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					{portfolioItems.map((item, i) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 50 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.1, duration: 0.6 }}
							onMouseEnter={() => setHoveredId(item.id)}
							onMouseLeave={() => setHoveredId(null)}
							className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-[#1a1a1d]"
						>
							{/* Premium Image Component */}
							<NightlifeImage
								src={item.image}
								alt={item.title}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-110"
							/>

							{/* Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

							{/* Content */}
							<div className="absolute inset-0 p-6 flex flex-col justify-between">
								{/* Top badges */}
								<div className="flex justify-between items-start">
									<span className="px-3 py-1 bg-[#D9AE43]/20 backdrop-blur-sm border border-[#D9AE43]/30 rounded-full text-[#D9AE43] text-xs font-medium">
										{item.category}
									</span>
									<div className="flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs">
										<Eye className="w-3 h-3" />
										{item.views}
									</div>
								</div>

								{/* Bottom content */}
								<div>
									<h3 className="font-heading text-2xl font-bold text-white mb-2 group-hover:text-[#D9AE43] transition-colors translate-y-2 group-hover:translate-y-0 duration-300">
										{item.title}
									</h3>

									{/* Play button */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={
											hoveredId === item.id
												? { opacity: 1, y: 0 }
												: { opacity: 0, y: 20 }
										}
										className="flex items-center gap-2 text-[#D9AE43]"
									>
										<div className="w-10 h-10 rounded-full bg-[#D9AE43] flex items-center justify-center">
											<Play className="w-5 h-5 text-[#0B0B0D] fill-current ml-0.5" />
										</div>
										<span className="text-sm font-medium">View Gallery</span>
									</motion.div>
								</div>
							</div>

							{/* Hover border */}
							<div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D9AE43]/50 rounded-2xl transition-colors pointer-events-none" />
						</motion.div>
					))}
				</div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.8 }}
					className="text-center"
				>
					<Link href="/gallery">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
							className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#D9AE43] text-[#D9AE43] font-bold rounded-full hover:bg-[#D9AE43] hover:text-[#0B0B0D] transition-all"
						>
							VIEW FULL PORTFOLIO
							<ArrowRight className="w-5 h-5" />
						</motion.button>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

export default PortfolioPreview;
