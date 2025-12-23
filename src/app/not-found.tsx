/**
 * @file not-found.tsx
 * @description Custom 404 page
 */

import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0B0B0D] px-6">
			<div className="text-center max-w-md">
				{/* 404 Display */}
				<h1 className="text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#D9AE43] to-[#8B7320] leading-none font-heading">
					404
				</h1>

				<h2 className="text-2xl font-bold text-white mb-4 font-heading">
					Page Not Found
				</h2>

				<p className="text-gray-400 mb-8">
					The page you're looking for doesn't exist or has been moved.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/"
						className="px-6 py-3 bg-[#D9AE43] hover:bg-[#F4D03F] text-[#0B0B0D] font-bold rounded-lg transition-colors"
					>
						Go Home
					</Link>

					<Link
						href="/pilot-intake"
						className="px-6 py-3 border border-[#D9AE43]/30 hover:border-[#D9AE43] text-[#D9AE43] font-bold rounded-lg transition-colors"
					>
						Book a Pilot
					</Link>
				</div>
			</div>
		</div>
	);
}
