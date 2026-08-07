import type { IconType } from 'react-icons';
import { FiArrowRight, FiCheckCircle, FiMapPin, FiSmartphone, FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Step {
  icon: IconType;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: FiUserPlus,
    title: 'Create an Account',
    description: 'Sign up in minutes with your mobile number.',
  },
  {
    icon: FiSmartphone,
    title: 'Book Your Ride',
    description: 'Set your pickup and destination, then confirm.',
  },
  {
    icon: FiCheckCircle,
    title: 'Driver Accepts',
    description: 'A verified rider nearby accepts your booking.',
  },
  {
    icon: FiMapPin,
    title: 'Arrive Safely',
    description: 'Track your trip live and reach your destination.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">How It Works</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ride in <span className="text-primary-500">4 Simple Steps</span>
          </h2>
          <p className="mt-4 text-slate-600">From booking to arrival — it only takes a few taps.</p>
        </motion.div>

        <div className="relative mt-14">
          <div className="absolute left-[10%] right-[10%] top-7 hidden border-t-2 border-dashed border-slate-300 lg:block" aria-hidden />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary-200 bg-white text-primary-600">
                    <Icon size={24} />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-[11px] font-bold text-white">
                      {index + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 max-w-[220px] text-sm text-slate-600">{step.description}</p>
                  {index < steps.length - 1 && (
                    <FiArrowRight size={18} className="absolute -right-4 top-6 hidden text-slate-300 lg:block" />
                  )}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
