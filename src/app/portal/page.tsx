/**
 * @file page.tsx
 * @description Client Portal - Dashboard for authenticated users
 * @module app/portal
 */

"use client";

import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
	AlertCircle,
	Calendar,
	Camera,
	CheckCircle,
	Clock,
	CreditCard,
	Image,
	LogOut,
	Plus,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Body,
	GlassCard,
	H1,
	H2,
	MagneticButton,
	Small,
} from "@/components/ui";
import { auth } from "@/lib/firebase";

// Mock data - replace with Firestore
const MOCK_STATS = {
	totalShoots: 0,
	upcoming: 0,
	photosDelivered: 0,
};

const MOCK_SESSIONS: Session[] = [];

interface Session {
	id: string;
	date: string;
	venue: string;
	status: "scheduled" | "in_progress" | "editing" | "delivered";
	photoCount: number;
}

export default function PortalPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setUser(currentUser);
			} else {
				router.push("/login?redirect=/portal");
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [router]);

	const handleSignOut = async () => {
		await signOut(auth);
		document.cookie =
			"auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		router.push("/");
	};

	if (loading) {
		return (
			<main className="min-h-screen bg-brand-ink flex items-center justify-center">
				<Body>Loading...</Body>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-brand-ink">
			{/* Header */}
			<header className="border-b border-white/10 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link href="/">
						<span className="text-xl font-bold text-brand-gold">GettUpp</span>
					</Link>
					<div className="flex items-center gap-4">
						<Small className="text-gray-400">{user?.email}</Small>
						<button
							onClick={handleSignOut}
							className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
						>
							<LogOut className="w-4 h-4" />
							Sign Out
						</button>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-6 py-12">
				{/* Welcome */}
				<div className="mb-8">
					<H1 className="text-3xl mb-2">Welcome back!</H1>
					<Body className="text-gray-400">
						Manage your shoots and view your content.
					</Body>
				</div>

				{/* Stats Grid */}
				<div className="grid md:grid-cols-3 gap-6 mb-12">
					<StatCard
						icon={<Camera className="w-6 h-6" />}
						label="Total Shoots"
						value={MOCK_STATS.totalShoots}
					/>
					<StatCard
						icon={<Calendar className="w-6 h-6" />}
						label="Upcoming"
						value={MOCK_STATS.upcoming}
					/>
					<StatCard
						icon={<Image className="w-6 h-6" />}
						label="Photos Delivered"
						value={MOCK_STATS.photosDelivered}
					/>
				</div>

				{/* Main Content Grid */}
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Sessions */}
					<div className="lg:col-span-2">
						<GlassCard>
							<div className="flex items-center justify-between mb-6">
								<H2 className="text-xl">Your Sessions</H2>
								<Link href="/pilot-intake">
									<MagneticButton variant="gold" size="sm">
										<Plus className="w-4 h-4 mr-2" />
										Book New
									</MagneticButton>
								</Link>
							</div>

							{MOCK_SESSIONS.length === 0 ? (
								<div className="text-center py-12">
									<Camera className="w-12 h-12 text-gray-600 mx-auto mb-4" />
									<Body className="text-gray-400 mb-4">No sessions yet</Body>
									<Link href="/pilot-intake">
										<MagneticButton variant="outline">
											Book Your First Shoot
										</MagneticButton>
									</Link>
								</div>
							) : (
								<div className="space-y-4">
									{MOCK_SESSIONS.map((session) => (
										<SessionRow key={session.id} session={session} />
									))}
								</div>
							)}
						</GlassCard>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Quick Actions */}
						<GlassCard>
							<h3 className="font-semibold text-white mb-4">Quick Actions</h3>
							<div className="space-y-3">
								<QuickAction
									icon={<Calendar className="w-5 h-5" />}
									label="Book New Session"
									href="/pilot-intake"
								/>
								<QuickAction
									icon={<Image className="w-5 h-5" />}
									label="View Gallery"
									href="/portal/gallery"
								/>
								<QuickAction
									icon={<CreditCard className="w-5 h-5" />}
									label="Billing & Payments"
									href="/portal/billing"
								/>
								<QuickAction
									icon={<Settings className="w-5 h-5" />}
									label="Account Settings"
									href="/portal/settings"
								/>
							</div>
						</GlassCard>

						{/* Support */}
						<GlassCard padding="sm">
							<h3 className="font-semibold text-white mb-2">Need Help?</h3>
							<Small className="text-gray-400 block mb-3">
								Our team is here to help you get the most out of GettUpp.
							</Small>
							<a
								href="mailto:support@gettuppent.com"
								className="text-sm text-brand-gold hover:underline"
							>
								support@gettuppent.com
							</a>
						</GlassCard>
					</div>
				</div>
			</div>
		</main>
	);
}

// Sub-components

function StatCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: number;
}) {
	return (
		<GlassCard className="flex items-center gap-4">
			<div className="p-3 bg-brand-gold/10 rounded-lg text-brand-gold">
				{icon}
			</div>
			<div>
				<div className="text-3xl font-bold text-white">{value}</div>
				<Small className="text-gray-400">{label}</Small>
			</div>
		</GlassCard>
	);
}

function SessionRow({ session }: { session: Session }) {
	const statusConfig = {
		scheduled: { icon: Clock, color: "text-blue-400", label: "Scheduled" },
		in_progress: {
			icon: Camera,
			color: "text-yellow-400",
			label: "In Progress",
		},
		editing: { icon: Image, color: "text-purple-400", label: "Editing" },
		delivered: {
			icon: CheckCircle,
			color: "text-green-400",
			label: "Delivered",
		},
	};

	const config = statusConfig[session.status];
	const StatusIcon = config.icon;

	return (
		<div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
			<div className="flex items-center gap-4">
				<div className={`${config.color}`}>
					<StatusIcon className="w-5 h-5" />
				</div>
				<div>
					<div className="font-medium text-white">{session.venue}</div>
					<Small className="text-gray-400">{session.date}</Small>
				</div>
			</div>
			<div className="text-right">
				<div className={`text-sm ${config.color}`}>{config.label}</div>
				<Small className="text-gray-500">{session.photoCount} photos</Small>
			</div>
		</div>
	);
}

function QuickAction({
	icon,
	label,
	href,
}: {
	icon: React.ReactNode;
	label: string;
	href: string;
}) {
	return (
		<Link
			href={href}
			className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
		>
			<span className="text-brand-gold">{icon}</span>
			<span className="text-sm text-white">{label}</span>
		</Link>
	);
}
