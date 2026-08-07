import type { IconType } from 'react-icons';
import { FiClock, FiDollarSign, FiMapPin, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FiZap,
    title: 'Fast Booking',
    description: 'Get a rider assigned in seconds with our smart dispatch system and minimal wait times.',
  },
  {
    icon: FiDollarSign,
    title: 'Affordable Fares',
    description: 'Transparent pricing with no hidden charges. See your exact fare before you book.',
  },
  {
    icon: FiMapPin,
    title: 'Live Tracking',
    description: 'Follow your driver in real time from pickup to drop-off with GPS tracking.',
  },
  {
    icon: FiClock,
    title: 'Always on Time',
    description: 'Dependable pickups, quickest routes, and arrival estimates you can trust.',
  },
];

export default function WhyChoose() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Why HatodGo</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why Choose <span className="text-primary-500">HatodGo</span>
          </h2>
          <p className="mt-4 text-slate-600">
            Everything you need for a dependable ride — built for the way Metro Manila moves.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-primary-300 hover:bg-primary-50/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-base font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
