import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import PhoneMockup from './PhoneMockup';
import QrCodePlaceholder from './QrCodePlaceholder';

export default function DownloadApp() {
  return (
    <section id="download" className="overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary-200">HatodGo App</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Download HatodGo Today
          </h2>
          <p className="mt-4 max-w-md text-primary-100">
            Ride anywhere, anytime with just a few taps. Get the app on your favorite store now.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href="#download"
              className="flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 transition-opacity hover:opacity-90"
            >
              <FaGooglePlay size={22} className="text-white" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] text-slate-400">GET IT ON</span>
                <span className="block text-sm font-bold text-white">Google Play</span>
              </span>
            </a>
            <a
              href="#download"
              className="flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 transition-opacity hover:opacity-90"
            >
              <FaApple size={24} className="text-white" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] text-slate-400">Download on the</span>
                <span className="block text-sm font-bold text-white">App Store</span>
              </span>
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <QrCodePlaceholder className="h-24 w-24" />
            </div>
            <p className="max-w-[180px] text-xs leading-relaxed text-primary-100">
              Scan the QR code to download the HatodGo app instantly.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="justify-self-center"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}
