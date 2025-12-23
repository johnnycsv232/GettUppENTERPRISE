"use client";

/**
 * Smart Photo Uploader Component
 * God Mode 2.0 - On-Device AI Photo Culling
 *
 * Automatically scores and filters photos BEFORE upload.
 * Saves bandwidth and eliminates need for Aftershoot ($120/year).
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSmolVLM } from "@/lib/ai/smolvlm-client";
import { isBrowserSupported } from "@/lib/ai/transformers-browser";

type PhotoAnalysis = {
	file: File;
	preview: string;
	qualityScore: number;
	faceCount: number;
	tags: string[];
	recommendation: string;
	shouldUpload: boolean;
	isAnalyzing: boolean;
	error?: string;
};

type SmartPhotoUploaderProps = {
	shootId: string;
	onUploadComplete: (uploadedCount: number) => void;
	minQualityThreshold?: number; // Default: 7.0
};

export default function SmartPhotoUploader({
	shootId,
	onUploadComplete,
}: SmartPhotoUploaderProps) {
	// minQualityThreshold removed as it was unused
	const [photos, setPhotos] = useState<PhotoAnalysis[]>([]);
	const [isInitializing, setIsInitializing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [browserSupported, setBrowserSupported] = useState(true);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Check browser support on mount
	useEffect(() => {
		setBrowserSupported(isBrowserSupported());
	}, []);

	// Initialize SmolVLM on component mount
	useEffect(() => {
		const initializeAI = async () => {
			if (!browserSupported) return;

			setIsInitializing(true);
			try {
				await getSmolVLM();
				console.log("✅ AI models ready");
			} catch (error) {
				console.error("Failed to initialize AI:", error);
			} finally {
				setIsInitializing(false);
			}
		};

		initializeAI();
	}, [browserSupported]);

	/**
	 * Handle file selection
	 */
	const handleFileSelect = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(event.target.files || []);
			if (files.length === 0) return;

			// Create initial photo entries
			const newPhotos: PhotoAnalysis[] = files.map((file) => ({
				file,
				preview: URL.createObjectURL(file),
				qualityScore: 0,
				faceCount: 0,
				tags: [],
				recommendation: "",
				shouldUpload: false,
				isAnalyzing: true,
			}));

			setPhotos((prev) => [...prev, ...newPhotos]);

			// Analyze each photo
			const smolvlm = await getSmolVLM();

			for (let i = 0; i < newPhotos.length; i++) {
				try {
					const analysis = await smolvlm.analyzePhoto(newPhotos[i].preview);

					setPhotos((prev) =>
						prev.map((p) =>
							p.file === newPhotos[i].file
								? {
									...p,
									qualityScore: analysis.quality.score,
									faceCount: analysis.faces.count,
									tags: analysis.tags.tags,
									recommendation: analysis.recommendation,
									shouldUpload: smolvlm.shouldUpload(
										analysis.quality.score,
										analysis.faces.count,
									),
									isAnalyzing: false,
								}
								: p,
						),
					);
				} catch (error) {
					console.error("Analysis failed for photo:", error);

					setPhotos((prev) =>
						prev.map((p) =>
							p.file === newPhotos[i].file
								? {
									...p,
									isAnalyzing: false,
									error: "Analysis failed. Will upload anyway.",
									shouldUpload: true, // Upload if analysis fails
								}
								: p,
						),
					);
				}
			}
		},
		[],
	);

	/**
	 * Upload selected photos
	 */
	const handleUpload = async () => {
		const photosToUpload = photos.filter((p) => p.shouldUpload);

		if (photosToUpload.length === 0) {
			alert(
				"No photos to upload. Adjust quality threshold or select manually.",
			);
			return;
		}

		setIsUploading(true);

		try {
			// Upload to UploadThing or your photo storage
			// This is a placeholder - implement your actual upload logic
			for (const photo of photosToUpload) {
				const formData = new FormData();
				formData.append("file", photo.file);
				formData.append("shootId", shootId);
				formData.append("qualityScore", photo.qualityScore.toString());
				formData.append("faceCount", photo.faceCount.toString());
				formData.append("tags", JSON.stringify(photo.tags));

				await fetch("/api/photos/upload", {
					method: "POST",
					body: formData,
				});
			}

			onUploadComplete(photosToUpload.length);
			setPhotos([]); // Clear after upload
		} catch (error) {
			console.error("Upload failed:", error);
			alert("Upload failed. Please try again.");
		} finally {
			setIsUploading(false);
		}
	};

	/**
	 * Toggle photo selection
	 */
	const togglePhoto = (file: File) => {
		setPhotos((prev) =>
			prev.map((p) =>
				p.file === file ? { ...p, shouldUpload: !p.shouldUpload } : p,
			),
		);
	};

	const selectedCount = photos.filter((p) => p.shouldUpload).length;
	const analyzingCount = photos.filter((p) => p.isAnalyzing).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Smart Photo Upload</h2>
					<p className="text-gray-600">
						AI scores photos automatically. Only the best are uploaded.
					</p>
				</div>

				{!browserSupported && (
					<div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
						⚠️ Browser doesn&apos;t support WebAssembly. AI features disabled.
					</div>
				)}
			</div>

			{/* Upload Input */}
			<div className="flex gap-4">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					multiple
					onChange={handleFileSelect}
					className="hidden"
					title="Select photos for analysis"
					aria-label="Select photos for analysis"
				/>

				<button
					onClick={() => fileInputRef.current?.click()}
					disabled={isInitializing}
					className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{isInitializing ? "Initializing AI..." : "Select Photos"}
				</button>

				{photos.length > 0 && (
					<button
						onClick={handleUpload}
						disabled={isUploading || selectedCount === 0 || analyzingCount > 0}
						className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
					>
						{isUploading
							? "Uploading..."
							: `Upload ${selectedCount} Photo${selectedCount !== 1 ? "s" : ""}`}
					</button>
				)}
			</div>

			{/* Stats */}
			{photos.length > 0 && (
				<div className="grid grid-cols-4 gap-4">
					<div className="rounded-lg bg-gray-100 p-4">
						<div className="text-2xl font-bold">{photos.length}</div>
						<div className="text-sm text-gray-600">Total Analyzed</div>
					</div>
					<div className="rounded-lg bg-green-100 p-4">
						<div className="text-2xl font-bold text-green-700">
							{selectedCount}
						</div>
						<div className="text-sm text-gray-600">Will Upload</div>
					</div>
					<div className="rounded-lg bg-red-100 p-4">
						<div className="text-2xl font-bold text-red-700">
							{photos.length - selectedCount}
						</div>
						<div className="text-sm text-gray-600">Culled</div>
					</div>
					<div className="rounded-lg bg-blue-100 p-4">
						<div className="text-2xl font-bold text-blue-700">
							{analyzingCount}
						</div>
						<div className="text-sm text-gray-600">Analyzing</div>
					</div>
				</div>
			)}

			{/* Photo Grid */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
				{photos.map((photo, idx) => (
					<div
						key={idx}
						className={`relative overflow-hidden rounded-lg border-2 transition-all ${photo.shouldUpload
								? "border-green-500 ring-2 ring-green-200"
								: "border-gray-300"
							}`}
						onClick={() => !photo.isAnalyzing && togglePhoto(photo.file)}
					>
						<div className="relative h-48 w-full overflow-hidden">
							<Image
								src={photo.preview}
								alt={`Photo ${idx + 1}`}
								fill
								className="object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						</div>

						{photo.isAnalyzing ? (
							<div className="absolute inset-0 flex items-center justify-center bg-black/50">
								<div className="text-center text-white">
									<div className="mb-2 animate-spin text-3xl">⚙️</div>
									<div className="text-sm">Analyzing...</div>
								</div>
							</div>
						) : (
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
								<div className="flex items-center justify-between text-xs">
									<span>Score: {photo.qualityScore}/10</span>
									<span>👤 {photo.faceCount}</span>
								</div>
								<div className="mt-1 text-xs opacity-90">
									{photo.recommendation}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
