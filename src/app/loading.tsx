/**
 * @file loading.tsx
 * @description Global loading state for the application
 */

export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0B0B0D]">
			<div className="flex flex-col items-center gap-6">
				{/* Animated logo placeholder */}
				<div className="relative">
					{/* Outer ring */}
					<div className="w-16 h-16 border-2 border-[#D9AE43]/20 rounded-full" />

					{/* Spinning ring */}
					<div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-[#D9AE43] rounded-full animate-spin" />

					{/* Inner glow */}
					<div className="absolute inset-2 w-12 h-12 bg-[#D9AE43]/10 rounded-full animate-pulse" />
				</div>

				{/* Brand text */}
				<div className="text-center">
					<h2 className="text-xl font-bold text-white font-heading tracking-wide">
						GETTUPP
					</h2>
					<p className="text-sm text-[#D9AE43] tracking-[0.3em]">ENT</p>
				</div>

				{/* Loading dots */}
				<div className="flex gap-1">
					<span
						className="w-2 h-2 bg-[#D9AE43] rounded-full animate-bounce"
						style={{ animationDelay: "0ms" }}
					/>
					<span
						className="w-2 h-2 bg-[#D9AE43] rounded-full animate-bounce"
						style={{ animationDelay: "150ms" }}
					/>
					<span
						className="w-2 h-2 bg-[#D9AE43] rounded-full animate-bounce"
						style={{ animationDelay: "300ms" }}
					/>
				</div>
			</div>
		</div>
	);
}
