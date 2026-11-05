import Hero from '@/components/landing/Hero';
import ServicesOverview from '@/components/landing/ServicesOverview';
import AboutStrip from '@/components/landing/AboutStrip';
import FounderSection from '@/components/landing/FounderSection';
import LatestInsights from '@/components/landing/LatestInsights';
import ContactCTA from '@/components/landing/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <AboutStrip />
      <LatestInsights />
      <FounderSection />
      <ContactCTA />
    </>
  );
}
