import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

// Brand fonts
const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
	display: "swap",
	weight: ["500", "600", "700"],
});

// SEO Metadata
export const metadata: Metadata = {
	title: {
		default: "GettUpp ENT | Minneapolis Nightlife Photography",
		template: "%s | GettUpp ENT",
	},
	description:
		"Premium nightlife photography and content creation for Minneapolis venues. 24-hour delivery, real ROI tracking. The uniform of the Minneapolis night.",
	keywords: [
		"nightlife photography",
		"Minneapolis",
		"venue marketing",
		"club photography",
		"event content",
		"social media content",
	],
	authors: [{ name: "GettUpp ENT" }],
	creator: "GettUpp ENT",
	publisher: "GettUpp ENT",
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_APP_URL || "https://gettupp.com",
	),
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: "GettUpp ENT",
		title: "GettUpp ENT | Minneapolis Nightlife Photography",
		description:
			"Premium nightlife photography and content creation. We don't just post. We pack venues.",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "GettUpp ENT - The Uniform of the Minneapolis Night",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "GettUpp ENT | Minneapolis Nightlife Photography",
		description:
			"Premium nightlife photography and content creation. We don't just post. We pack venues.",
		images: ["/og-image.jpg"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
};

export const viewport: Viewport = {
	themeColor: "#0B0B0D",
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${oswald.variable}`}>
			<body
				className="font-sans antialiased bg-brand-ink text-white min-h-screen"
				suppressHydrationWarning
			>
				{children}
			</body>
		</html>
	);
}
