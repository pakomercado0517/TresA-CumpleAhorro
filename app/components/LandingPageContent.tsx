"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { CTASection } from "./CTASection";
import { LandingFooter } from "./LandingFooter";

export function LandingPageContent(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}

