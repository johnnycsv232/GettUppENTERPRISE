/**
 * @file admin/analytics/page.tsx
 * @description Business analytics dashboard with revenue, conversions, and engagement metrics
 * @module app/admin/analytics
 */

"use client";

import {
	ArrowUpRight,
	Calendar,
	Camera,
	DollarSign,
	Eye,
	RefreshCw,
	Terminal,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Body, H2 } from "@/components/ui/Typography";

interface MetricCard {
	label: string;
	value: string;
	change: number;
	changeLabel: string;
	icon: React.ReactNode;
}

interface RevenueData {
	month: string;
	mrr: number;
	pilots: number;
}

const METRICS: MetricCard[] = [
	{
		label: "Monthly Recurring Revenue",
		value: "$4,485",
		change: 12.5,
		changeLabel: "vs last month",
		icon: <DollarSign className="w-6 h-6" />,
	},
	{
		label: "Active Subscriptions",
		value: "6",
		change: 2,
		changeLabel: "new this month",
		icon: <Users className="w-6 h-6" />,
	},
	{
		label: "Shoots Completed",
		value: "23",
		change: 15,
		changeLabel: "vs last month",
		icon: <Camera className="w-6 h-6" />,
	},
	{
		label: "Gallery Views",
		value: "79.7K",
		change: 34,
		changeLabel: "90-day total",
		icon: <Eye className="w-6 h-6" />,
	},
];

const REVENUE_DATA: RevenueData[] = [
	{ month: "Jul", mrr: 1890, pilots: 3 },
	{ month: "Aug", mrr: 2335, pilots: 4 },
	{ month: "Sep", mrr: 2780, pilots: 2 },
	{ month: "Oct", mrr: 3225, pilots: 5 },
	{ month: "Nov", mrr: 3985, pilots: 4 },
	{ month: "Dec", mrr: 4485, pilots: 3 },
];

const CONVERSION_FUNNEL = [
	{ stage: "Website Visits", count: 1250, color: "bg-blue-500" },
	{ stage: "Pilot Intake Started", count: 89, color: "bg-purple-500" },
	{ stage: "Checkout Initiated", count: 52, color: "bg-yellow-500" },
	{ stage: "Pilot Completed", count: 38, color: "bg-green-500" },
	{
		stage: "Converted to Retainer",
		count: 24,
		color: "bg-[var(--brand-gold)]",
	},
];

const TOP_VENUES = [
	{ name: "Skybar", tier: "T2", mrr: 695, shoots: 8 },
	{ name: "Noir Club", tier: "VIP", mrr: 995, shoots: 12 },
	{ name: "The Loft", tier: "T1", mrr: 445, shoots: 4 },
	{ name: "Electric Lounge", tier: "T2", mrr: 695, shoots: 6 },
	{ name: "Uptown Social", tier: "T1", mrr: 445, shoots: 3 },
];

export default function AnalyticsPage() {
	const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">(
		"30d",
	);
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = async () => {
		setRefreshing(true);
		// In production, fetch fresh data from Firebase Analytics / Stripe
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setRefreshing(false);
	};

	const maxMrr = Math.max(...REVENUE_DATA.map((d) => d.mrr));

	return (
		<main className="min-h-screen bg-[var(--brand-ink)] text-white py-8 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<H2>Analytics Dashboard</H2>
						<Body className="text-gray-400 mt-1">
							Track revenue, conversions, and engagement
						</Body>
					</div>
					<div className="flex gap-3">
						{/* Date Range Selector */}
						<div className="flex bg-white/5 rounded-lg p-1">
							{(["7d", "30d", "90d", "all"] as const).map((range) => (
								<button
									key={range}
									onClick={() => setDateRange(range)}
									className={`px-3 py-1 rounded text-sm transition-all ${
										dateRange === range
											? "bg-[var(--brand-gold)] text-[var(--brand-ink)]"
											: "text-gray-400 hover:text-white"
									}`}
								>
									{range === "all" ? "All" : range}
								</button>
							))}
						</div>
						<MagneticButton
							variant="outline"
							onClick={handleRefresh}
							disabled={refreshing}
						>
							<RefreshCw
								className={`w-4 h-4 mr-2 inline ${refreshing ? "animate-spin" : ""}`}
							/>
							Refresh
						</MagneticButton>
					</div>
				</div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					{METRICS.map((metric) => (
						<GlassCard key={metric.label}>
							<div className="flex items-start justify-between">
								<div className="p-2 rounded-lg bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]">
									{metric.icon}
								</div>
								<div
									className={`flex items-center gap-1 text-sm ${metric.change >= 0 ? "text-green-400" : "text-red-400"}`}
								>
									{metric.change >= 0 ? (
										<TrendingUp className="w-4 h-4" />
									) : (
										<TrendingDown className="w-4 h-4" />
									)}
									{metric.change > 0 ? "+" : ""}
									{metric.change}%
								</div>
							</div>
							<div className="mt-4">
								<p className="text-3xl font-bold text-white">{metric.value}</p>
								<p className="text-sm text-gray-400 mt-1">{metric.label}</p>
							</div>
						</GlassCard>
					))}
				</div>

				<div className="grid lg:grid-cols-3 gap-6">
					{/* Revenue Chart */}
					<div className="lg:col-span-2">
						<GlassCard>
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-semibold text-white">
									Revenue Growth
								</h3>
								<span className="text-sm text-gray-400">Last 6 months</span>
							</div>

							{/* Simple Bar Chart */}
							<div className="flex items-end justify-between gap-2 h-48">
								{REVENUE_DATA.map((data) => (
									<div
										key={data.month}
										className="flex-1 flex flex-col items-center"
									>
										<div className="w-full flex flex-col items-center">
											<span className="text-xs text-gray-400 mb-1">
												${data.mrr}
											</span>
											<div
												className="w-full bg-[var(--brand-gold)] rounded-t-lg transition-all"
												style={{ height: `${(data.mrr / maxMrr) * 150}px` }}
											/>
										</div>
										<span className="text-xs text-gray-400 mt-2">
											{data.month}
										</span>
									</div>
								))}
							</div>
						</GlassCard>
					</div>

					{/* Conversion Funnel */}
					<div>
						<GlassCard>
							<h3 className="text-lg font-semibold text-white mb-6">
								Conversion Funnel
							</h3>
							<div className="space-y-4">
								{CONVERSION_FUNNEL.map((stage, idx) => {
									const width =
										(stage.count / CONVERSION_FUNNEL[0].count) * 100;
									return (
										<div key={stage.stage}>
											<div className="flex items-center justify-between text-sm mb-1">
												<span className="text-gray-300">{stage.stage}</span>
												<span className="text-white font-medium">
													{stage.count}
												</span>
											</div>
											<div className="h-2 bg-white/10 rounded-full overflow-hidden">
												<div
													className={`h-full ${stage.color} rounded-full transition-all`}
													style={{ width: `${width}%` }}
												/>
											</div>
											{idx < CONVERSION_FUNNEL.length - 1 && (
												<div className="flex justify-end mt-1">
													<span className="text-xs text-gray-500">
														{(
															(CONVERSION_FUNNEL[idx + 1].count / stage.count) *
															100
														).toFixed(1)}
														% →
													</span>
												</div>
											)}
										</div>
									);
								})}
							</div>
						</GlassCard>
					</div>
				</div>

				{/* Top Venues Table */}
				<GlassCard className="mt-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-white">
							Top Performing Venues
						</h3>
						<a
							href="/admin/clients"
							className="text-sm text-[var(--brand-gold)] hover:underline flex items-center gap-1"
						>
							View all <ArrowUpRight className="w-3 h-3" />
						</a>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="text-left text-sm text-gray-400 border-b border-white/10">
									<th className="pb-3">Venue</th>
									<th className="pb-3">Tier</th>
									<th className="pb-3">MRR</th>
									<th className="pb-3">Shoots</th>
									<th className="pb-3">Status</th>
								</tr>
							</thead>
							<tbody className="text-sm">
								{TOP_VENUES.map((venue) => (
									<tr key={venue.name} className="border-b border-white/5">
										<td className="py-3 font-medium text-white">
											{venue.name}
										</td>
										<td className="py-3">
											<span className="px-2 py-1 rounded text-xs bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]">
												{venue.tier}
											</span>
										</td>
										<td className="py-3 text-green-400">${venue.mrr}/mo</td>
										<td className="py-3 text-gray-300">{venue.shoots}</td>
										<td className="py-3">
											<span className="flex items-center gap-1 text-green-400">
												<span className="w-2 h-2 bg-green-400 rounded-full" />
												Active
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</GlassCard>

				{/* CLI Commands */}
				<GlassCard className="mt-6">
					<div className="flex items-center gap-2 mb-4">
						<Terminal className="w-5 h-5 text-[var(--brand-gold)]" />
						<h3 className="text-lg font-semibold text-white">
							Analytics CLI Commands
						</h3>
					</div>
					<div className="grid md:grid-cols-3 gap-4 text-sm font-mono">
						<div className="p-3 bg-black/30 rounded-lg">
							<p className="text-gray-400 mb-1"># Stripe revenue report</p>
							<code className="text-[var(--brand-gold)]">
								stripe balance retrieve
							</code>
						</div>
						<div className="p-3 bg-black/30 rounded-lg">
							<p className="text-gray-400 mb-1"># List recent payments</p>
							<code className="text-[var(--brand-gold)]">
								stripe payments list --limit 10
							</code>
						</div>
						<div className="p-3 bg-black/30 rounded-lg">
							<p className="text-gray-400 mb-1"># Firebase analytics export</p>
							<code className="text-[var(--brand-gold)]">
								firebase analytics:export
							</code>
						</div>
					</div>
				</GlassCard>
			</div>
		</main>
	);
}
