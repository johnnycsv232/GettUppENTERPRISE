export default function Loading() {
	return (
		<div className="flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="flex flex-col items-center space-y-4">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white"></div>
				<p className="text-sm font-medium text-white/50">
					Loading Knowledge Base...
				</p>
			</div>
		</div>
	);
}
