import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Zap, Share2, Briefcase } from "lucide-react";
import Image from "next/image";

export function AdvancedTechniquesSection() {
  return (
    <SectionContainer
      id="advanced"
      title="Advanced Techniques Showcase"
      subtitle="Dive deeper into sophisticated prompt engineering methods."
    >
      <div className="grid md:grid-cols-3 gap-8">
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent"><Zap className="inline-block mr-2" />Chain-of-Thought</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-foreground/80 mb-4">Visualize how AI reasons step-by-step. (Animated flowchart demo pending)</p>
            <Image src="https://placehold.co/600x400.png" alt="Chain of Thought Visualization" width={600} height={400} className="rounded-md" data-ai-hint="flowchart diagram" />
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent"><Share2 className="inline-block mr-2" />RAG Integration</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-foreground/80 mb-4">See how Retrieval Augmented Generation enhances AI knowledge. (Visual demo pending)</p>
            <Image src="https://placehold.co/600x400.png" alt="RAG Integration Demo" width={600} height={400} className="rounded-md" data-ai-hint="database network" />
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent"><Briefcase className="inline-block mr-2" />Agentic AI</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-foreground/80 mb-4">Workshop on multi-step task completion and tool selection. (Interactive tool pending)</p>
            <Image src="https://placehold.co/600x400.png" alt="Agentic AI Workshop" width={600} height={400} className="rounded-md" data-ai-hint="gears process" />
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
