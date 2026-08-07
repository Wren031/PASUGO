import { mockDelay } from '@/utils/mock';
import type { FaqItem, Testimonial } from '../types';
import { faqs, testimonials } from '../mock/data';

export const landingService = {
  async getTestimonials(): Promise<Testimonial[]> {
    await mockDelay(200);
    return [...testimonials];
  },
  async getFaqs(): Promise<FaqItem[]> {
    await mockDelay(200);
    return [...faqs];
  },
};
