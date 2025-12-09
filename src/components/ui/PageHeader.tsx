/**
 * @file PageHeader.tsx
 * @description Reusable page header component
 * @module components/ui/PageHeader
 */

interface PageHeaderProps {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
}

export function PageHeader({ badge, title, subtitle }: PageHeaderProps) {
  return (
    <section className="pt-32 pb-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-brand-gold/30 rounded-full">
          <span className="text-brand-gold font-semibold">{badge}</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-8">{title}</h1>
        <p className="text-xl text-gray-400">{subtitle}</p>
      </div>
    </section>
  );
}
