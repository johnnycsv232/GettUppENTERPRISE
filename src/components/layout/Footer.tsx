/**
 * @file Footer.tsx
 * @description Site footer with navigation and legal links
 * @module components/layout/Footer
 */

import Link from 'next/link';

const FOOTER_LINKS = {
  services: [
    { label: 'Pilot Night ($345)', href: '/pilot-intake' },
    { label: 'Retainer Plans', href: '/#pricing' },
    { label: 'Editing Only', href: '/editing' },
    { label: 'Our Work', href: '/gallery' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cancellation Policy', href: '/cancellation' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h4 className="font-heading text-xl font-bold text-[var(--brand-gold)] mb-4">
              GETTUPP ENT
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium nightlife photography for Minneapolis venues that want to own the night.
              24-72h delivery guaranteed.
            </p>
            <div className="mt-4 flex gap-4">
              <a 
                href="https://instagram.com/gettuppent" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--brand-gold)] transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--brand-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--brand-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--brand-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} GettUpp ENT. Minneapolis, MN. We don't just post—we pack venues.
          </p>
          <p className="text-xs text-gray-600">
            Built with 🔥 for the nightlife industry
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
