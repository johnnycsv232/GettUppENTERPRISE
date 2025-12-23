/**
 * @file admin/cms/page.tsx
 * @description Content Management System for landing page and marketing content
 * @module app/admin/cms
 */

"use client";

import {
	Eye,
	FileText,
	Image,
	RefreshCw,
	Save,
	Terminal,
	Video,
} from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Body, H2 } from "@/components/ui/Typography";

interface ContentBlock {
	id: string;
	type: "hero" | "pricing" | "testimonial" | "gallery" | "cta";
	title: string;
	content: Record<string, string>;
	lastUpdated: string;
}

const CONTENT_BLOCKS: ContentBlock[] = [
	{
		id: "hero",
		type: "hero",
		title: "Hero Section",
		content: {
			headline: "OWN THE NIGHT. PACK YOUR VENUE.",
			subheadline: "24–72h delivery. Real ROI. Zero excuses.",
			ctaPrimary: "Start Your Pilot ($345)",
			ctaSecondary: "See Real Nights",
		},
		lastUpdated: "2024-12-01",
	},
	{
		id: "trust",
		type: "hero",
		title: "Trust Signals",
		content: {
			stat1: "24–72h delivery guaranteed",
			stat2: "2.3-minute edit pipeline",
			stat3: "350+ Minneapolis events",
		},
		lastUpdated: "2024-12-01",
	},
	{
		id: "pricing-header",
		type: "pricing",
		title: "Pricing Section Header",
		content: {
			headline: "WHEN YOU'RE READY TO LOCK IT IN.",
			subheadline:
				"Pilot night proves it works. These are the subscription engines that keep your weekends heavy.",
		},
		lastUpdated: "2024-12-01",
	},
	{
		id: "final-cta",
		type: "cta",
		title: "Final CTA Section",
		content: {
			headline: "THIS WEEKEND DOESN'T HAVE TO LOOK LIKE LAST WEEKEND.",
			subheadline:
				"Lock in a pilot night and see what happens when your content finally matches the energy inside your venue.",
			buttonText: "BOOK YOUR PILOT NIGHT",
		},
		lastUpdated: "2024-12-01",
	},
];

export default function CMSPage() {
	const [blocks, setBlocks] = useState<ContentBlock[]>(CONTENT_BLOCKS);
	const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
	const [editedContent, setEditedContent] = useState<Record<string, string>>(
		{},
	);
	const [saving, setSaving] = useState(false);
	const [lastSync, setLastSync] = useState<string | null>(null);

	const handleSelectBlock = (block: ContentBlock) => {
		setSelectedBlock(block);
		setEditedContent(block.content);
	};

	const handleSave = async () => {
		if (!selectedBlock) return;

		setSaving(true);
		try {
			// In production, save to Firestore
			// await fetch('/api/cms/update', { method: 'POST', body: JSON.stringify({ id: selectedBlock.id, content: editedContent }) });

			setBlocks((prev) =>
				prev.map((b) =>
					b.id === selectedBlock.id
						? {
								...b,
								content: editedContent,
								lastUpdated: new Date().toISOString().split("T")[0],
							}
						: b,
				),
			);

			setLastSync(new Date().toLocaleTimeString());
			console.log("✅ Content saved:", selectedBlock.id);
		} catch (error) {
			console.error("Save error:", error);
		} finally {
			setSaving(false);
		}
	};

	const handleDeploy = async () => {
		// Trigger Vercel deployment
		console.log("🚀 Triggering deployment via Vercel CLI...");
		alert("Run in terminal: vercel --prod");
	};

	return (
		<main className="min-h-screen bg-[var(--brand-ink)] text-white py-8 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<H2>Content Management</H2>
						<Body className="text-gray-400 mt-1">
							Edit landing page content and marketing copy
						</Body>
					</div>
					<div className="flex gap-3">
						<MagneticButton variant="outline" onClick={handleDeploy}>
							<RefreshCw className="w-4 h-4 mr-2 inline" />
							Deploy
						</MagneticButton>
						<a href="/" target="_blank" rel="noopener noreferrer">
							<MagneticButton variant="outline">
								<Eye className="w-4 h-4 mr-2 inline" />
								Preview
							</MagneticButton>
						</a>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-6">
					{/* Content Blocks List */}
					<div className="space-y-3">
						<h3 className="text-lg font-semibold text-white mb-4">
							Content Blocks
						</h3>
						{blocks.map((block) => (
							<button
								key={block.id}
								onClick={() => handleSelectBlock(block)}
								className={`w-full text-left p-4 rounded-lg border transition-all ${
									selectedBlock?.id === block.id
										? "bg-[var(--brand-gold)]/20 border-[var(--brand-gold)]/50"
										: "bg-white/5 border-white/10 hover:border-white/30"
								}`}
							>
								<div className="flex items-center gap-3">
									<FileText className="w-5 h-5 text-[var(--brand-gold)]" />
									<div>
										<h4 className="font-medium text-white">{block.title}</h4>
										<p className="text-xs text-gray-400">
											Updated: {block.lastUpdated}
										</p>
									</div>
								</div>
							</button>
						))}

						{/* Media Library */}
						<div className="mt-6 pt-6 border-t border-white/10">
							<h3 className="text-lg font-semibold text-white mb-4">
								Media Library
							</h3>
							<div className="grid grid-cols-2 gap-2">
								<button className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all">
									<Image className="w-6 h-6 text-gray-400 mx-auto mb-2" />
									<span className="text-xs text-gray-400">Images</span>
								</button>
								<button className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all">
									<Video className="w-6 h-6 text-gray-400 mx-auto mb-2" />
									<span className="text-xs text-gray-400">Videos</span>
								</button>
							</div>
						</div>
					</div>

					{/* Editor */}
					<div className="lg:col-span-2">
						{selectedBlock ? (
							<GlassCard>
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-xl font-bold text-white">
										{selectedBlock.title}
									</h3>
									<MagneticButton onClick={handleSave} disabled={saving}>
										<Save className="w-4 h-4 mr-2 inline" />
										{saving ? "Saving..." : "Save Changes"}
									</MagneticButton>
								</div>

								<div className="space-y-4">
									{Object.entries(editedContent).map(([key, value]) => (
										<div key={key}>
											<label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}
											</label>
											{value.length > 100 ? (
												<textarea
													value={value}
													onChange={(e) =>
														setEditedContent((prev) => ({
															...prev,
															[key]: e.target.value,
														}))
													}
													rows={4}
													className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] resize-none"
												/>
											) : (
												<input
													type="text"
													value={value}
													onChange={(e) =>
														setEditedContent((prev) => ({
															...prev,
															[key]: e.target.value,
														}))
													}
													className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
												/>
											)}
										</div>
									))}
								</div>

								{lastSync && (
									<p className="text-sm text-green-400 mt-4">
										✅ Last saved: {lastSync}
									</p>
								)}
							</GlassCard>
						) : (
							<GlassCard className="flex flex-col items-center justify-center py-20">
								<FileText className="w-12 h-12 text-gray-500 mb-4" />
								<p className="text-gray-400">Select a content block to edit</p>
							</GlassCard>
						)}
					</div>
				</div>

				{/* CLI Commands */}
				<GlassCard className="mt-8">
					<div className="flex items-center gap-2 mb-4">
						<Terminal className="w-5 h-5 text-[var(--brand-gold)]" />
						<h3 className="text-lg font-semibold text-white">CLI Commands</h3>
					</div>
					<div className="grid md:grid-cols-3 gap-4 text-sm font-mono">
						<div className="p-3 bg-black/30 rounded-lg">
							<p className="text-gray-400 mb-1"># Push content to Firestore</p>
							<code className="text-[var(--brand-gold)]">
								firebase deploy --only firestore
							</code>
						</div>
						<div className="p-3 bg-black/30 rounded-lg">
							<p className="text-gray-400 mb-1"># Deploy to production</p>
							<code className="text-[var(--brand-gold)]">vercel --prod</code>
						</div>
						<div className="p-3 bg-black/30 rounded-lg">
							<p className="text-gray-400 mb-1"># Preview deployment</p>
							<code className="text-[var(--brand-gold)]">vercel</code>
						</div>
					</div>
				</GlassCard>
			</div>
		</main>
	);
}
