
import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card";
import { Lightbulb, Zap, BarChart, Target, Brain } from "lucide-react"; // Added Target and Brain icons

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
          <GlassCardContent className="space-y-3">
            <GlassCardDescription className="text-base leading-relaxed">
              Prompt engineering is the art and science of designing effective inputs (prompts) to guide Large Language Models (LLMs) and other AI systems toward desired outputs. Think of it as giving an AI a perfectly clear and comprehensive set of instructions.
            </GlassCardDescription>
            <GlassCardDescription className="text-base leading-relaxed">
              The better the instructions—the more specific, contextual, and well-structured—the better the AI's performance, leading to more accurate, relevant, and creative results. It's about communicating your intent to the AI with precision.
            </GlassCardDescription>
          </GlassCardContent>
        </GlassCard>
        <GlassCard data-ai-hint="technology impact">
          <GlassCardHeader>
            <GlassCardTitle>
              <Zap className="inline-block mr-2 text-accent" />
              Why It Matters
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-3">
            <GlassCardDescription className="text-base leading-relaxed">
              In a world increasingly reliant on AI, the ability to communicate effectively with these systems is paramount. Well-engineered prompts can dramatically improve AI's creativity, problem-solving capabilities, and factual accuracy.
            </GlassCardDescription>
            <GlassCardDescription className="text-base leading-relaxed">
              It transforms AI from a generic tool into a specialized, powerful partner capable of tackling complex tasks, generating nuanced content, and providing insightful analysis. Mastering prompt engineering unlocks new levels of productivity and innovation.
            </GlassCardDescription>
          </GlassCardContent>
        </GlassCard>
        <GlassCard data-ai-hint="data chart">
          <GlassCardHeader>
            <GlassCardTitle>
              <BarChart className="inline-block mr-2 text-accent" />
              The Tangible Impact
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-3 text-base leading-relaxed">
            <p className="text-foreground/80"> {/* Using p directly here, or could be another GlassCardDescription without the className prop for default styles */}
              The difference between a basic prompt and a well-engineered one can be astounding. Studies and practical applications consistently show significant improvements:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-foreground/90">
              <li><strong className="text-primary">Increased Accuracy:</strong> Up to 50-70% improvement in task success rates.</li>
              <li><strong className="text-primary">Enhanced Relevance:</strong> More focused and contextually appropriate outputs.</li>
              <li><strong className="text-primary">Reduced Bias:</strong> Better control over guiding AI away from unwanted biases.</li>
              <li><strong className="text-primary">Greater Efficiency:</strong> Fewer iterations needed to achieve the desired result.</li>
            </ul>
            <p className="text-foreground/80">
              This studio is designed to help you learn and apply these techniques to achieve similar results.
            </p>
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
