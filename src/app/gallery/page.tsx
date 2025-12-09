/**
 * @file page.tsx
 * @description Gallery page with portfolio grid
 * @module app/gallery/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function GalleryPage() {
  const recentShoots = [
    { venue: 'The Warehouse', date: 'Nov 14' },
    { venue: 'Vanquish', date: 'Nov 12' },
    { venue: 'Rabbit Hole', date: 'Nov 10' },
    { venue: 'Club Nova', date: 'Nov 08' },
    { venue: 'Rooftop', date: 'Nov 07' },
    { venue: 'Skyline', date: 'Nov 05' },
    { venue: 'First Avenue', date: 'Nov 04' },
    { venue: 'The Loft', date: 'Nov 01' },
  ];

  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="PHOTO GALLERY"
        title={
          <>
            YOUR PHOTOS, <span className="text-purple-400">DELIVERED</span>
          </>
        }
        subtitle="Access your event photos within 24-72 hours. Download high-resolution files ready for social media."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          {/* Filter Bar Placeholder */}
          <div className="text-center mb-12">
            <p className="text-gray-400">Filter Bar Placeholder</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentShoots.map((shoot, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group"
              >
                {/* Placeholder for image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">{shoot.venue}</p>
                </div>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <p className="font-bold text-white">{shoot.venue}</p>
                    <p className="text-xs text-gray-300">{shoot.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
