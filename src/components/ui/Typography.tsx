/**
 * @file Typography.tsx
 * @description Consistent typography components for GettUpp brand
 * @module components/ui/Typography
 */

import { ReactNode } from "react";

interface TypographyProps {
	/** Text content */
	children: ReactNode;
	/** Additional CSS classes */
	className?: string;
}

/**
 * H1 - Primary page heading
 * Oswald font, gold accent, extra large
 */
export function H1({ children, className = "" }: TypographyProps) {
	return (
		<h1
			className={`font-heading text-5xl font-bold text-brand-gold ${className}`}
		>
			{children}
		</h1>
	);
}

/**
 * H2 - Section heading
 * Oswald font, white, large
 */
export function H2({ children, className = "" }: TypographyProps) {
	return (
		<h2 className={`font-heading text-3xl font-bold text-white ${className}`}>
			{children}
		</h2>
	);
}

/**
 * H3 - Subsection heading
 * Oswald font, gold accent, medium
 */
export function H3({ children, className = "" }: TypographyProps) {
	return (
		<h3
			className={`font-heading text-xl font-semibold text-brand-gold ${className}`}
		>
			{children}
		</h3>
	);
}

/**
 * H4 - Minor heading
 * Inter font, white, small
 */
export function H4({ children, className = "" }: TypographyProps) {
	return (
		<h4 className={`text-lg font-semibold text-white ${className}`}>
			{children}
		</h4>
	);
}

/**
 * Body - Standard paragraph text
 * Inter font, light gray, readable
 */
export function Body({ children, className = "" }: TypographyProps) {
	return (
		<p className={`text-lg text-gray-200 leading-relaxed ${className}`}>
			{children}
		</p>
	);
}

/**
 * Small - Secondary/helper text
 * Inter font, muted gray, compact
 */
export function Small({ children, className = "" }: TypographyProps) {
	return (
		<span className={`text-sm text-gray-400 ${className}`}>{children}</span>
	);
}

/**
 * Label - Form labels and captions
 * Inter font, uppercase, tracking wide
 */
export function Label({ children, className = "" }: TypographyProps) {
	return (
		<span
			className={`text-xs font-medium uppercase tracking-wider text-gray-400 ${className}`}
		>
			{children}
		</span>
	);
}

/**
 * Accent - Highlighted text
 * Gold color for emphasis
 */
export function Accent({ children, className = "" }: TypographyProps) {
	return (
		<span className={`text-brand-gold font-semibold ${className}`}>
			{children}
		</span>
	);
}
