import { HeroSection } from "@/components/sections/hero-section";
import { IntroductionSection } from "@/components/sections/introduction-section";
import { PromptBuilderSection } from "@/components/sections/prompt-builder-section";
import { LiveAIDemoSection } from "@/components/sections/live-ai-demo-section";
import { LearningSections } from "@/components/sections/learning-sections";
import { AdvancedTechniquesSection } from "@/components/sections/advanced-techniques-section";
import { PromptDNAAnalyzerSection } from "@/components/sections/prompt-dna-analyzer-section";
// Placeholder sections - can be fleshed out later
// import { BestPracticesSection } from "@/components/sections/best-practices-section";
// import { InteractiveChallengesSection } from "@/components/sections/interactive-challenges-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroductionSection />
      <PromptBuilderSection />
      <LiveAIDemoSection />
      <LearningSections />
      <AdvancedTechniquesSection />
      <PromptDNAAnalyzerSection />
      {/* 
      <BestPracticesSection />
      <InteractiveChallengesSection /> 
      */}
      {/* Dummy section to ensure scrolling for all nav links */}
      <div id="final-spacer" style={{ height: '50vh' }} className="bg-background"></div>
    </>
  );
}
