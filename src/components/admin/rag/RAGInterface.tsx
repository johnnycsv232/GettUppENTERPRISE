"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { auth } from "@/lib/firebase";
import { QueryResult } from "@/lib/rag/types";

interface QueryHistoryItem {
	query: string;
	answer: string;
	timestamp: Date;
}

export default function RAGInterface() {
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<QueryResult | null>(null);
	const [history, setHistory] = useState<QueryHistoryItem[]>([]);
	const [error, setError] = useState<string | null>(null);

	const handleQuery = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setIsLoading(true);
		setError(null);

		try {
			const token = await auth.currentUser?.getIdToken();
			if (!token) {
				throw new Error("Not authenticated. Please log in as an admin.");
			}

			const res = await fetch("/api/rag/query", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ query, limit: 5 }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Query failed");
			}

			const data: QueryResult = await res.json();
			setResult(data);

			// Add to history
			setHistory((prev) => [
				{
					query,
					answer: data.answer,
					timestamp: new Date(),
				},
				...prev,
			]);
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Query Section */}
			<GlassCard className="space-y-4" accent="gold">
				<h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-gold)] to-white">
					Operations Intelligence
				</h2>
				<p className="text-gray-400 text-sm">
					Ask questions about venue operations, procedures, or business
					knowledge.
				</p>

				<form onSubmit={handleQuery} className="flex gap-4">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="e.g., What is the dress code for Legacy?"
						className="flex-1 bg-[var(--brand-ink)] border border-[var(--brand-gold)]/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[var(--brand-gold)] focus:outline-none placeholder-gray-500"
						disabled={isLoading}
					/>
					<MagneticButton
						type="submit"
						disabled={isLoading || !query.trim()}
						variant="gold"
					>
						{isLoading ? "Analyzing..." : "Ask AI"}
					</MagneticButton>
				</form>

				{error && (
					<div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
						{error}
					</div>
				)}
			</GlassCard>

			{/* Results Section */}
			{result && (
				<GlassCard
					accent="pink"
					className="animate-in fade-in slide-in-from-bottom-4 duration-500"
				>
					<div className="space-y-4">
						<div className="flex justify-between items-start">
							<h3 className="text-lg font-semibold text-[var(--brand-gold)]">
								Answer
							</h3>
							<span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
								{result.responseTimeMs.toFixed(0)}ms •{" "}
								{result.cached ? "Cached" : "Live"}
							</span>
						</div>

						<div className="prose prose-invert max-w-none text-gray-200">
							<p className="whitespace-pre-wrap">{result.answer}</p>
						</div>

						{result.sources.length > 0 && (
							<div className="pt-4 border-t border-white/10">
								<h4 className="text-sm font-medium text-gray-400 mb-2">
									Sources
								</h4>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									{result.sources.map((source, idx) => (
										<div
											key={idx}
											className="p-3 bg-white/5 rounded border border-white/10 text-xs text-gray-300"
										>
											<div className="font-semibold truncate">
												{source.filename}
											</div>
											<div className="mt-1 opacity-75 truncate">
												{source.snippet}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</GlassCard>
			)}

			{/* History Section */}
			{history.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-400">
						Recent Queries
					</h3>
					{history.map((item, idx) => (
						<div
							key={idx}
							className="bg-white/5 rounded-lg p-4 border border-white/5 hover:bg-white/10 transition-colors"
						>
							<p className="text-sm text-[var(--brand-gold)] font-medium mb-1">
								{item.query}
							</p>
							<p className="text-xs text-gray-400 line-clamp-2">
								{item.answer}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
