import { HeroSection } from "@/components/sections/hero-section";
import { IntroductionSection } from "@/components/sections/introduction-section";
import { PromptAnatomyLabSection } from "@/components/sections/prompt-anatomy-lab-section";
import { PromptBuilderSection } from "@/components/sections/prompt-builder-section";
import { BasicVsEngineeredSection } from "@/components/sections/basic-vs-engineered-section";
import { AdvancedTechniquesSection } from "@/components/sections/advanced-techniques-section";
import { PromptDNAAnalyzerSection } from "@/components/sections/prompt-dna-analyzer-section";
import { ArticlesSection } from "@/components/sections/articles-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroductionSection />
      <PromptAnatomyLabSection />
      <PromptBuilderSection />
      <BasicVsEngineeredSection />
      <PromptDNAAnalyzerSection />
      <AdvancedTechniquesSection />
      <ArticlesSection />
      {/* The 50vh spacer div previously here has been removed */}
    </>
  );
}
