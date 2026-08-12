import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { appScreenshots } from '@/assets/app';

export default function PhoneMockup() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % appScreenshots.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-[290px]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-b from-primary-200/60 to-transparent" />
      <div className="overflow-hidden rounded-[2.4rem] border-[10px] border-slate-900 bg-slate-900">
        <div className="relative aspect-[9/19] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={appScreenshots[index].src}
              alt={appScreenshots[index].alt}
              className="absolute inset-0 h-full w-full object-cover object-top"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-900/70 px-2.5 py-1.5 backdrop-blur">
              {appScreenshots.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-4 bg-primary-400' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
