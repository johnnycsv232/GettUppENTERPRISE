"use client";

import React from "react";
import RAGInterface from "@/components/admin/rag/RAGInterface";
import { GlassCard } from "@/components/ui/GlassCard";

export default function KnowledgePage() {
	return (
		<div className="space-y-8">
			<div className="flex justify-between items-end">
				<div>
					<h1 className="text-4xl font-bold text-white mb-2">
						Evidence Locker
					</h1>
					<p className="text-gray-400">
						Operational intelligence and procedure search.
					</p>
				</div>
				{/* Future: Upload button for indexing */}
			</div>

			<RAGInterface />

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
				<GlassCard accent="none" className="p-6">
					<h3 className="text-[var(--brand-gold)] font-semibold mb-2">
						Capabilities
					</h3>
					<ul className="text-sm text-gray-400 space-y-2">
						<li>• Venue operational details</li>
						<li>• Standard operating procedures</li>
						<li>• Business analytics queries</li>
					</ul>
				</GlassCard>
				<GlassCard accent="none" className="p-6">
					<h3 className="text-[var(--brand-gold)] font-semibold mb-2">
						Coverage
					</h3>
					<p className="text-sm text-gray-400">
						Indexing 150+ operational documents including venue guides,
						contracts, and training manuals.
					</p>
				</GlassCard>
				<GlassCard accent="none" className="p-6">
					<h3 className="text-[var(--brand-gold)] font-semibold mb-2">
						Status
					</h3>
					<div className="flex items-center gap-2 text-sm text-green-400">
						<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
						System Active
					</div>
					<p className="text-xs text-gray-500 mt-1">Gemini Pro 1.5 Connected</p>
				</GlassCard>
			</div>
		</div>
	);
}
