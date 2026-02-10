import {
  Navbar,
  HeroSection,
  AlertTicker,
  StatsSection,
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
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
