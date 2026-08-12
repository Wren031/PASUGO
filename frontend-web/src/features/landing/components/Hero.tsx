import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiSmartphone, FiStar } from 'react-icons/fi';
import PhoneMockup from './PhoneMockup';
import MotorcycleIllustration from './MotorcycleIllustration';
import { landingStats } from '../mock/data';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-orange-50/60 to-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-200/40" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 rounded-full bg-primary-100/50" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-xs font-semibold text-primary-700">
            <FiStar className="fill-primary-500 text-primary-500" size={12} />
            Rated 4.9/5 by 50,000+ riders
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
            Your Fast, Safe, and{' '}
            <span className="relative text-primary-500">
              Affordable
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 9" fill="none" aria-hidden>
                <path d="M2 7C60 2 140 2 198 6" stroke="  #FDBA74" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>{' '}
            Ride Across the City
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
            Book motorcycle rides in seconds. Track your driver in real time, enjoy transparent fares, and reach your
            destination safely.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary-500 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
            >
              <FiSmartphone size={17} /> Book a Ride
            </Link>
            <Link
              to="/register?role=driver"
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-slate-900 bg-white px-7 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
            >
              <FiMapPin size={17} /> Become a Driver
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {landingStats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-primary-200 pl-3">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{stat.label}</dt>
                <dd className="mt-0.5 text-lg font-extrabold text-slate-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -bottom-10 -left-6 w-3/4 rounded-[2rem] border border-orange-100 bg-white/70 p-2">
            <MotorcycleIllustration />
          </div>
          <div className="relative z-10 mx-auto w-fit rotate-2 transition-transform hover:rotate-0">
            <PhoneMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
