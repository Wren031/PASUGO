import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import Logo from '@/components/common/Logo';
import { APP } from '@/constants/app';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Become a Driver', href: '#become-a-driver' },
  { label: 'Contact', href: '#contact' },
];

const legalLinks = ['Privacy Policy', 'Terms & Conditions', 'Support'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size="sm" />
              <span className="text-lg font-extrabold tracking-tight text-white">
                HatodGo<span className="text-primary-500">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Your fast, safe, and affordable ride across the city. Moving Metro Manila, one ride at a time.
            </p>
            <div className="mt-5 flex gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-primary-500 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebookF size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-primary-500 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram size={15} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-primary-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((label) => (
                <li key={label}>
                  <a href="#home" className="text-sm text-slate-400 transition-colors hover:text-primary-400">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Get in Touch</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>{APP.address}</li>
              <li>{APP.phone}</li>
              <li>{APP.email}</li>
            </ul>
            <Link
              to="/register"
              className="mt-5 inline-flex rounded-full bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-400"
            >
              Book a Ride
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">© 2026 HatodGo. All Rights Reserved.</p>
          <p className="text-xs text-slate-500">
            Admin login{' '}
            <Link to="/login" className="font-semibold text-primary-400 hover:underline">
              here
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
