export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LandingService {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'coming-soon';
}

export interface LandingStat {
  label: string;
  value: string;
}
