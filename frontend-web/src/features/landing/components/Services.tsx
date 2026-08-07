import type { IconType } from 'react-icons';
import { FiClock, FiMapPin, FiShoppingCart, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { services } from '../mock/data';

const iconMap: Record<string, IconType> = {
  bike: FiMapPin,
  parcel: FiTruck,
  cart: FiShoppingCart,
  truck: FiTruck,
};

export default function Services() {
  return (
    <section id="services" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Our Services</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Move Anything, <span className="text-primary-500">Anywhere</span>
          </h2>
          <p className="mt-4 text-slate-600">From quick rides to parcel delivery, HatodGo has you covered.</p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] ?? FiClock;
            const comingSoon = service.status === 'coming-soon';
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  comingSoon ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-200 bg-white hover:border-primary-300'
                }`}
              >
                {comingSoon && (
                  <span className="absolute right-4 top-4">
                    <Badge tone="amber">Coming Soon</Badge>
                  </span>
                )}
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    comingSoon ? 'bg-slate-200 text-slate-500' : 'bg-primary-50 text-primary-600'
                  }`}
                >
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-base font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.description}</p>
                {!comingSoon && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> Available now
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
