import {
  Navbar,
  HeroSection,
  AlertTicker,
  TrustedBySection,
  StatsSection,
  SampleAlertSection,
  HowItWorksSection,
  FeaturesSection,
  PricingSection,
  CTASection,
} from "@/components/landing";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />
      <HeroSection />
      <AlertTicker />
      <TrustedBySection />
      <SampleAlertSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
