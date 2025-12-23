/**
 * @file GlassCard.tsx
 * @description Glassmorphism card component with frosted glass effect
 * @module components/ui/GlassCard
 */

import { ReactNode } from "react";

interface GlassCardProps {
	/** Card content */
	children: ReactNode;
	/** Additional CSS classes */
	className?: string;
	/** Padding size */
	padding?: "sm" | "md" | "lg";
	/** Border accent color */
	accent?: "gold" | "pink" | "none";
}

/**
 * GlassCard - Premium frosted glass container
 * Uses backdrop-blur for glassmorphism effect
 */
export function GlassCard({
	children,
	className = "",
	padding = "md",
	accent = "gold",
}: GlassCardProps) {
	const paddingStyles = {
		sm: "p-4",
		md: "p-6",
		lg: "p-8",
	};

	const accentStyles = {
		gold: "border-[var(--brand-gold)]/20",
		pink: "border-[var(--brand-pink)]/20",
		none: "border-white/10",
	};

	return (
		<div
			className={`
        backdrop-blur-md 
        bg-[var(--brand-ink)]/50 
        border 
        ${accentStyles[accent]}
        rounded-xl 
        ${paddingStyles[padding]}
        ${className}
      `}
		>
			{children}
		</div>
	);
}

export default GlassCard;
