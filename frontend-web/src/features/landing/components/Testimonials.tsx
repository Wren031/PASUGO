import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import Avatar from '@/components/ui/Avatar';
import RatingStars from '@/components/ui/RatingStars';
import { useTestimonials } from '../hooks/useTestimonials';
import Skeleton from '@/components/loading/Skeleton';

export default function Testimonials() {
  const { data: items, isLoading } = useTestimonials();

  return (
    <section id="testimonials" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Testimonials</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Loved by <span className="text-primary-500">Thousands of Riders</span>
          </h2>
          <p className="mt-4 text-slate-600">Real stories from passengers who ride with HatodGo every day.</p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
                <div className="mt-6 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-1.5 h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          {items?.map((testimonial, index) => (
            <motion.figure
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
              className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-primary-200"
            >
              <FaQuoteLeft size={22} className="text-primary-100" />
              <RatingStars value={testimonial.rating} className="mt-4" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                “{testimonial.comment}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <Avatar name={testimonial.name} size="md" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.location}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
