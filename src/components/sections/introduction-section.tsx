import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card";
import { Lightbulb, Zap, BarChart } from "lucide-react";
import Image from "next/image";

export function IntroductionSection() {
  return (
    <SectionContainer
      id="intro"
      title="What is Prompt Engineering?"
      subtitle="Unlock the full potential of AI by mastering the art and science of crafting effective prompts."
    >
      <div className="grid md:grid-cols-3 gap-8">
        <GlassCard data-ai-hint="concept idea">
          <GlassCardHeader>
            <GlassCardTitle>
              <Lightbulb className="inline-block mr-2 text-accent" />
              The Core Idea
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <GlassCardDescription>
              Prompt engineering is like giving an AI a perfect set of instructions. The better the instructions, the better the AI's performance and the more accurate and relevant its output.
            </GlassCardDescription>
            <Image src="https://placehold.co/600x400.png" alt="Abstract representation of an idea" width={600} height={400} className="mt-4 rounded-md" data-ai-hint="abstract idea" />
          </GlassCardContent>
        </GlassCard>
        <GlassCard data-ai-hint="technology impact">
          <GlassCardHeader>
            <GlassCardTitle>
              <Zap className="inline-block mr-2 text-accent" />
              Why It Matters
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <GlassCardDescription>
              Effective prompts can dramatically improve AI's creativity, problem-solving, and accuracy. It's the key to transforming AI from a tool into a powerful partner.
            </GlassCardDescription>
             <Image src="https://placehold.co/600x400.png" alt="Visual of AI impact" width={600} height={400} className="mt-4 rounded-md" data-ai-hint="technology network" />
          </GlassCardContent>
        </GlassCard>
        <GlassCard data-ai-hint="data chart">
          <GlassCardHeader>
            <GlassCardTitle>
              <BarChart className="inline-block mr-2 text-accent" />
              The Impact
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <GlassCardDescription>
              Studies show well-engineered prompts can boost AI task success rates by over 50%. This studio helps you learn how. (Placeholder for animated counter/chart)
            </GlassCardDescription>
             <Image src="https://placehold.co/600x400.png" alt="Chart showing improvement" width={600} height={400} className="mt-4 rounded-md" data-ai-hint="statistics graph" />
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
