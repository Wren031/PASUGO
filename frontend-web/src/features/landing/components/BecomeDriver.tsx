import type { IconType } from 'react-icons';
import { FiCalendar, FiClock, FiPercent, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Benefit {
  icon: IconType;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  { icon: FiClock, title: 'Flexible Schedule', description: 'Drive when you want. Set your own hours.' },
  { icon: FiTrendingUp, title: 'Daily Earnings', description: 'Earn ₱1,500+ a day and get paid weekly.' },
  { icon: FiCalendar, title: 'Weekly Incentives', description: 'Bonuses for consistent rides and ratings.' },
  { icon: FiPercent, title: 'Low Commission', description: 'Keep more of what you earn with 20% platform fee.' },
];

export default function BecomeDriver() {
  return (
    <section id="become-a-driver" className="bg-slate-900 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400">Become a Driver</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Turn Your Motorcycle Into <span className="text-primary-400">Daily Income</span>
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-slate-400">
            Join thousands of HatodGo riders earning a steady income with complete freedom over their schedule.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <li key={benefit.title} className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 text-primary-400">
                    <Icon size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{benefit.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{benefit.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-9">
            <a
              href="#become-a-driver"
              className="inline-flex items-center rounded-full bg-primary-500 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-400"
            >
              Apply as Driver
            </a>
            <p className="mt-3 text-xs text-slate-500">Requirements: valid license, OR/CR, NBI clearance, and motorcycle.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Average weekly earnings</p>
              <p className="mt-1 text-4xl font-extrabold text-white">₱9,800</p>
            </div>
            <span className="rounded-xl bg-green-500/15 px-3 py-1.5 text-xs font-bold text-green-400">↑ 12% this week</span>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-700 pt-6 text-center">
            <div>
              <p className="text-2xl font-extrabold text-primary-400">3,200+</p>
              <p className="mt-1 text-[11px] text-slate-400">Active drivers</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary-400">₱1,500</p>
              <p className="mt-1 text-[11px] text-slate-400">Avg. daily earnings</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary-400">4.9★</p>
              <p className="mt-1 text-[11px] text-slate-400">Driver rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
