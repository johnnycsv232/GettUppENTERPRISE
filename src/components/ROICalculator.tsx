/**
 * @file ROICalculator.tsx
 * @description Interactive ROI calculator with NaN protection
 * @module components/ROICalculator
 */

"use client";

import { Calculator, DollarSign, Image, TrendingUp } from "lucide-react";
import { useState } from "react";
import { PRICING_TIERS, TierId } from "@/lib/constants/pricing";
import { GlassCard } from "./ui/GlassCard";

export function ROICalculator() {
	const [currentMetric, setCurrentMetric] = useState(1000);
	const [tier, setTier] = useState<TierId>("t2");

	const tierData = PRICING_TIERS[tier];

	// NaN-safe calculations
	const costPerPost =
		tierData.photos > 0 ? tierData.price / tierData.photos : 0;

	const _costPerShoot =
		tierData.shoots > 0 ? tierData.price / tierData.shoots : 0;

	const projectedLift =
		!isNaN(currentMetric) && currentMetric > 0
			? Math.round(currentMetric * 0.32)
			: 0;

	const projectedTotal = !isNaN(currentMetric)
		? currentMetric + projectedLift
		: 0;

	// Calculate breakeven (assuming $350 avg customer value)
	const avgCustomerValue = 350;
	const customersNeeded =
		tierData.price > 0 ? Math.ceil(tierData.price / avgCustomerValue) : 0;

	return (
		<GlassCard className="max-w-md">
			<div className="flex items-center gap-2 mb-6">
				<Calculator className="w-5 h-5 text-brand-gold" />
				<h3 className="text-brand-gold font-bold text-xl">ROI Calculator</h3>
			</div>

			<div className="space-y-5">
				{/* Current Profile Visits Input */}
				<div>
					<label
						htmlFor="currentMonthlyProfileVisits"
						className="block text-gray-300 text-sm mb-2"
					>
						Current Monthly Profile Visits
					</label>
					<input
						type="number"
						id="currentMonthlyProfileVisits"
						value={currentMetric}
						onChange={(e) => setCurrentMetric(Number(e.target.value) || 0)}
						min={0}
						placeholder="e.g. 1000"
						className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
					/>
				</div>

				{/* Package Selection */}
				<div>
					<label
						htmlFor="packageTier"
						className="block text-gray-300 text-sm mb-2"
					>
						Package
					</label>
					<select
						id="packageTier"
						value={tier}
						onChange={(e) => setTier(e.target.value as TierId)}
						className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
					>
						<option value="pilot">Pilot - $345 (one-time)</option>
						<option value="t1">Tier 1: Friday Nights - $445/mo</option>
						<option value="t2">Tier 2: Weekend Warrior - $695/mo</option>
						<option value="vip">Tier 3: VIP Partner - $995/mo</option>
					</select>
				</div>

				{/* Results */}
				<div className="pt-5 border-t border-white/10 space-y-4">
					{/* Cost Breakdown */}
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-white/5 rounded-lg p-3 text-center">
							<DollarSign className="w-4 h-4 text-brand-gold mx-auto mb-1" />
							<div className="text-xl font-bold text-white">
								${costPerPost.toFixed(2)}
							</div>
							<div className="text-xs text-gray-400">per photo</div>
						</div>
						<div className="bg-white/5 rounded-lg p-3 text-center">
							<Image className="w-4 h-4 text-brand-gold mx-auto mb-1" />
							<div className="text-xl font-bold text-white">
								{tierData.photos}
							</div>
							<div className="text-xs text-gray-400">photos/month</div>
						</div>
					</div>

					{/* Projected Growth */}
					<div className="bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp className="w-4 h-4 text-brand-gold" />
							<span className="text-sm text-brand-gold font-semibold">
								Projected 32% Lift
							</span>
						</div>
						<div className="flex items-baseline gap-2">
							<span className="text-3xl font-bold text-white">
								{projectedTotal.toLocaleString()}
							</span>
							<span className="text-gray-400">monthly visits</span>
						</div>
						<div className="text-sm text-green-400 mt-1">
							+{projectedLift.toLocaleString()} new profile visits
						</div>
					</div>

					{/* Breakeven */}
					<div className="text-center text-sm text-gray-400">
						<span className="text-brand-gold font-semibold">
							{customersNeeded} new regulars
						</span>{" "}
						pays for this tier
					</div>
				</div>
			</div>
		</GlassCard>
	);
}

export default ROICalculator;
