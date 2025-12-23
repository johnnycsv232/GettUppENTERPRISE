"use client";

import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-center text-white">
			<h2 className="text-2xl font-bold text-red-400">Something went wrong!</h2>
			<p className="max-w-md text-gray-400">
				We encountered an error while loading the Knowledge Base. This might be
				a temporary connectivity issue.
			</p>
			<button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
				className="rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
			>
				Try again
			</button>
		</div>
	);
}
