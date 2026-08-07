import type { FaqItem, LandingService, LandingStat, Testimonial } from '../types';

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Maria Santos',
    location: 'Quezon City',
    rating: 5,
    comment: 'Booking was quick and the driver arrived in just five minutes. The fare was exactly what the app estimated.',
  },
  {
    id: 't2',
    name: 'Juan Dela Cruz',
    location: 'Makati',
    rating: 5,
    comment: 'Affordable fares and friendly drivers. I use HatodGo every day to get to work in EDSA traffic.',
  },
  {
    id: 't3',
    name: 'Angela Reyes',
    location: 'Pasig',
    rating: 5,
    comment: 'The live tracking gave me peace of mind, especially on late-night trips home from the office.',
  },
  {
    id: 't4',
    name: 'Paolo Mendoza',
    location: 'Taguig',
    rating: 4,
    comment: 'Never had a bad ride. Clean helmets, smooth booking, and drivers always take the fastest route.',
  },
  {
    id: 't5',
    name: 'Katrina Villanueva',
    location: 'Manila',
    rating: 5,
    comment: 'My go-to app for parcel delivery to my shop. Fast pickup and reliable tracking throughout.',
  },
  {
    id: 't6',
    name: 'Miguel Tan',
    location: 'Mandaluyong',
    rating: 5,
    comment: 'Fares are transparent and the first-ride discount made me switch from other apps for good.',
  },
];

export const faqs: FaqItem[] = [
  {
    id: 'f1',
    question: 'How do I book a ride?',
    answer:
      'Open the HatodGo app, enter your pickup and drop-off locations, choose a ride type, and tap "Book a Ride". A nearby driver will accept your booking within seconds and you can track their arrival in real time.',
  },
  {
    id: 'f2',
    question: 'How is the fare calculated?',
    answer:
      'Fares are computed based on distance and time using a transparent formula: a base fare, plus a per-kilometer rate and a per-minute rate. A small booking fee applies. You will always see the estimated fare before confirming your ride.',
  },
  {
    id: 'f3',
    question: 'Is HatodGo available in my city?',
    answer:
      'HatodGo currently operates across Metro Manila, including Quezon City, Makati, Taguig, Pasig, Mandaluyong, Pasay, Parañaque, Marikina, and more. We are expanding to new cities every quarter.',
  },
  {
    id: 'f4',
    question: 'How can I become a driver?',
    answer:
      'Simply tap "Become a Driver" and complete the online application. You will need a valid driver\u2019s license, OR/CR, NBI clearance, and your motorcycle. Applications are typically reviewed within 2\u20133 business days.',
  },
  {
    id: 'f5',
    question: 'Can I pay with cash or GCash?',
    answer:
      'Yes. HatodGo supports cash, GCash, credit/debit cards, and HatodGo Wallet. You can choose your preferred payment method before booking.',
  },
  {
    id: 'f6',
    question: 'What safety measures are in place?',
    answer:
      'Every driver is background-checked and required to complete safety training. Rides are GPS-tracked in real time, and passengers can share their trip details with family and friends.',
  },
];

export const services: LandingService[] = [
  {
    id: 's1',
    title: 'Motorcycle Ride',
    description: 'Beat the traffic with a fast, safe, and affordable motorcycle ride anywhere in the city.',
    icon: 'bike',
    status: 'active',
  },
  {
    id: 's2',
    title: 'Parcel Delivery',
    description: 'Send documents and packages across town quickly with our trusted rider network.',
    icon: 'parcel',
    status: 'active',
  },
  {
    id: 's3',
    title: 'Grocery Pickup',
    description: 'Have your groceries picked up and delivered to your doorstep in under an hour.',
    icon: 'cart',
    status: 'coming-soon',
  },
  {
    id: 's4',
    title: 'Courier Service',
    description: 'Same-day and express courier solutions for businesses of every size.',
    icon: 'truck',
    status: 'coming-soon',
  },
];

export const landingStats: LandingStat[] = [
  { label: 'Rides Completed', value: '2.5M+' },
  { label: 'Active Drivers', value: '3,200+' },
  { label: 'Cities Covered', value: '12' },
  { label: 'Average Rating', value: '4.9' },
];
