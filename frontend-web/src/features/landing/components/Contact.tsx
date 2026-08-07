import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { APP } from '@/constants/app';
import MapPlaceholder from '@/components/common/MapPlaceholder';

const contactItems = [
  { icon: FiMapPin, label: 'Company Address', value: APP.address },
  { icon: FiPhone, label: 'Phone Number', value: APP.phone },
  { icon: FiMail, label: 'Email', value: APP.email },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Contact Us</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            We're Here to <span className="text-primary-500">Help</span>
          </h2>
          <p className="mt-4 text-slate-600">Reach out to our team — we respond within 24 hours.</p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-4"
          >
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FaFacebookF size={17} />
                </span>
                <span className="text-sm font-semibold text-slate-800">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-pink-300 hover:bg-pink-50/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                  <FaInstagram size={17} />
                </span>
                <span className="text-sm font-semibold text-slate-800">Instagram</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-4"
          >
            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
              <MapPlaceholder
                pickup="Ortigas Center"
                dropoff="HatodGo HQ"
                driverLabel=""
                className="h-72"
              />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              <p className="font-bold text-slate-900">Head Office Hours</p>
              <p className="mt-2">Monday – Saturday: 8:00 AM – 8:00 PM</p>
              <p>Sunday & Holidays: 9:00 AM – 6:00 PM</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
