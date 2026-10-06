import Link from 'next/link';
import Image from 'next/image';
import { Camera, Globe, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t border-slate-200/80 dark:border-slate-800">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="HairHub India"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="font-bold text-xl text-slate-900 dark:text-white">
                HairHub <span className="text-blue-600">India</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              India&apos;s Trusted Human Hair Marketplace. Connect directly with verified sellers
              and find authentic human hair at the best prices.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Camera, href: '#', label: 'Instagram' },
                { Icon: Globe, href: '#', label: 'Website' },
                { Icon: MessageCircle, href: '#', label: 'Facebook' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all duration-200 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-xs uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse Listings', href: '/listings' },
                { label: 'Sell Your Hair', href: '/listings/create' },
                { label: 'How It Works', href: '/#how-it-works' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-xs uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <span>India &mdash; Serving all states</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                <a href="mailto:support@hairhubindia.com" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  support@hairhubindia.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <a href="tel:+919999999999" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  +91 99999 99999
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {year} HairHub India. All rights reserved.
          </p>
          <p id="admin-link" className="text-slate-500 text-xs">
            Made with ❤️ for India
          </p>
          <Link href="/admin/login" className="text-slate-500 hover:text-blue-600 text-xs transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
