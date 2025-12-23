/**
 * @file NightlifeImage.tsx
 * @description Premium image component with abstract light-leak fallback
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface NightlifeImageProps {
	src: string;
	alt: string;
	className?: string;
	fill?: boolean;
	width?: number;
	height?: number;
	priority?: boolean;
}

export function NightlifeImage({
	src,
	alt,
	className = "",
	...props
}: NightlifeImageProps) {
	const [error, setError] = useState(false);

	if (error) {
		return (
			<div
				className={`relative overflow-hidden bg-[#0B0B0D] ${className}`}
				style={
					props.fill
						? { width: "100%", height: "100%" }
						: { width: props.width, height: props.height }
				}
			>
				{/* Abstract Light Leak Pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0D] via-[#1a1a1d] to-[#0B0B0D]" />
				<div
					className="absolute top-0 right-0 w-full h-full opacity-30"
					style={{
						backgroundImage:
							"radial-gradient(circle at 80% 20%, rgba(217, 174, 67, 0.4) 0%, transparent 50%)",
					}}
				/>
				<div
					className="absolute bottom-0 left-0 w-full h-full opacity-20"
					style={{
						backgroundImage:
							"radial-gradient(circle at 20% 80%, rgba(255, 60, 147, 0.4) 0%, transparent 50%)",
					}}
				/>
				<div className="absolute inset-0 flex items-center justify-center opacity-10">
					<span className="font-heading text-4xl font-bold text-white tracking-widest uppercase">
						GettUpp
					</span>
				</div>
			</div>
		);
	}

	return (
		<Image
			src={src}
			alt={alt}
			className={className}
			onError={() => setError(true)}
			{...props}
		/>
	);
}
