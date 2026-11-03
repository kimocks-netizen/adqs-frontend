import Hero from '@/components/landing/Hero';
import ServicesOverview from '@/components/landing/ServicesOverview';
import AboutStrip from '@/components/landing/AboutStrip';
import FounderSection from '@/components/landing/FounderSection';
import LatestInsights from '@/components/landing/LatestInsights';
import ContactCTA from '@/components/landing/ContactCTA';

export default function HomePage() {
  return (
    <>
      {/* Hero sticks while ServicesOverview + AboutStrip scroll over it */}
      <div className="sticky top-0 z-0">
        <Hero />
      </div>
      <div className="relative z-10 bg-white">
        <ServicesOverview />
        <AboutStrip />
      </div>

      {/* LatestInsights sticks while FounderSection + ContactCTA scroll over it */}
      <div className="sticky top-0 z-0">
        <LatestInsights />
      </div>
      <div className="relative z-10 bg-white">
        <FounderSection />
        <ContactCTA />
      </div>
    </>
  );
}
