import { useQuery } from '@tanstack/react-query';
import { landingService } from '../services/landingService';

export function useTestimonials() {
  return useQuery({
    queryKey: ['landing', 'testimonials'],
    queryFn: landingService.getTestimonials,
  });
}
