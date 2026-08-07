import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyChoose from '../components/WhyChoose';
import HowItWorks from '../components/HowItWorks';
import Services from '../components/Services';
import DownloadApp from '../components/DownloadApp';
import BecomeDriver from '../components/BecomeDriver';
import Testimonials from '../components/Testimonials';
import Faq from '../components/Faq';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <WhyChoose />
        <HowItWorks />
        <Services />
        <DownloadApp />
        <BecomeDriver />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
