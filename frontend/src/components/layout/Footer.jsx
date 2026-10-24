import { NavLink } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Recommendations', href: '/#recommendations' },
    { label: 'Pricing', href: '/pricing' },
  ],
  support: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Feedback', href: '/feedback' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  project: [
    { label: 'KRISHISETU Platform', href: 'https://krishisetu.example.com' },
    { label: 'GitHub Repository', href: 'https://github.com/janmejayy-gif/CU-PROJECT' },
    { label: 'API Documentation', href: '/api-docs' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-deep-navy text-white" role="contentinfo">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <NavLink to="/" className="flex items-center gap-2 mb-4" aria-label="JALRAKSHAK Home">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="white" />
                <path d="M8 20L16 12L24 20" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <path d="M16 12V20" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" />
              </svg>
              <span className="font-bold text-xl">JALRAKSHAK</span>
            </NavLink>
            <p className="text-sm text-muted-text max-w-xs">
              AI-assisted Smart Irrigation Decision Support System for farmers. Part of the KRISHISETU platform.
            </p>
          </div>

          <nav aria-label="Product links">
            <h3 className="font-semibold text-base mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.href}
                    className="text-sm text-muted-text hover:text-white transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support links">
            <h3 className="font-semibold text-base mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.href}
                    className="text-sm text-muted-text hover:text-white transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h3 className="font-semibold text-base mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.href}
                    className="text-sm text-muted-text hover:text-white transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Project links">
            <h3 className="font-semibold text-base mb-4">Project</h3>
            <ul className="space-y-2">
              {footerLinks.project.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-text hover:text-white transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-dark-blue pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-text">
              © {CURRENT_YEAR} JALRAKSHAK. All rights reserved.
            </p>
            <p className="text-sm text-muted-text">
              Built for farmers. Final irrigation decisions always remain with the farmer.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/janmejayy-gif/CU-PROJECT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-text hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;