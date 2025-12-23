/**
 * @file PricingCard.tsx
 * @description Premium credit-card style pricing card
 * @module components/ui/PricingCard
 */

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { PricingTier } from "@/lib/constants/pricing";
import { MagneticButton } from "./MagneticButton";

interface PricingCardProps {
	tier: PricingTier;
	delay?: number;
}

export function PricingCard({ tier, delay = 0 }: PricingCardProps) {
	const isVip = tier.id === "vip";
	const isPopular = tier.popular;

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay }}
			className="relative group h-full"
		>
			{/* Glow effect on hover */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

			{/* Popular Badge */}
			{isPopular && (
				<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
					<div className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[var(--brand-ink)] text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
						MOST POPULAR
					</div>
				</div>
			)}

			{/* Card */}
			<div
				className={`
          relative h-full flex flex-col
          bg-gradient-to-br from-[#1a1a1c] to-[#0B0B0D]
          border-2 rounded-2xl overflow-hidden
          transition-all duration-300
          ${
						isVip || isPopular
							? "border-[var(--brand-gold)] shadow-2xl shadow-[var(--brand-gold)]/10"
							: "border-gray-800 hover:border-[var(--brand-gold)]/50"
					}
        `}
			>
				{/* Metallic gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--brand-gold)]/5 to-transparent opacity-50 pointer-events-none" />

				{/* Scarcity Badge (Pilot only) */}
				{tier.scarcity && (
					<div className="absolute top-4 right-4 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
						LIMITED
					</div>
				)}

				<div className="relative p-8 flex flex-col flex-grow">
					{/* Tier Label */}
					<div className="text-[var(--brand-gold)] text-sm font-bold uppercase tracking-wider mb-2">
						{tier.id === "pilot"
							? "INVITE ONLY"
							: tier.displayName.toUpperCase()}
					</div>

					{/* Name */}
					<h3 className="text-2xl font-black text-white mb-2">{tier.name}</h3>
					<p className="text-sm text-gray-400 mb-6">{tier.tagline}</p>

					{/* Price */}
					<div className="mb-6">
						<span className="text-5xl font-black bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
							{tier.priceDisplay}
						</span>
						<span className="text-gray-400 text-lg">
							{tier.interval === "monthly" ? "/mo" : ""}
						</span>
					</div>

					{/* VIP Breakeven Badge */}
					{isVip && tier.breakeven && (
						<div className="bg-gradient-to-r from-[#BF953F] to-[#B38728] text-[var(--brand-ink)] text-xs font-bold px-4 py-2 rounded-lg inline-block mb-6 self-start">
							BREAKEVEN: {tier.breakeven} CUSTOMERS
						</div>
					)}

					{/* Key Stats */}
					<div className="grid grid-cols-3 gap-2 mb-6 text-center">
						<div className="bg-white/5 rounded-lg py-2">
							<div className="text-lg font-bold text-white">{tier.shoots}</div>
							<div className="text-xs text-gray-500">Shoots</div>
						</div>
						<div className="bg-white/5 rounded-lg py-2">
							<div className="text-lg font-bold text-white">{tier.photos}</div>
							<div className="text-xs text-gray-500">Photos</div>
						</div>
						<div className="bg-white/5 rounded-lg py-2">
							<div className="text-lg font-bold text-white">
								{tier.delivery}
							</div>
							<div className="text-xs text-gray-500">Delivery</div>
						</div>
					</div>

					{/* Features */}
					<ul className="space-y-3 mb-8 flex-grow">
						{tier.features.map((feature) => (
							<li
								key={feature}
								className="flex items-start gap-3 text-sm text-gray-300"
							>
								<Check className="w-4 h-4 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
								<span>{feature}</span>
							</li>
						))}
					</ul>

					{/* CTA Button */}
					<Link
						href={
							tier.id === "pilot"
								? "/pilot-intake"
								: `/checkout?tier=${tier.id}`
						}
					>
						<MagneticButton
							variant={isVip || isPopular ? "gold" : "outline"}
							className="w-full"
						>
							{tier.id === "pilot" ? "CLAIM ACCESS" : "GET STARTED"}
						</MagneticButton>
					</Link>
				</div>
			</div>
		</motion.div>
	);
}

export default PricingCard;
