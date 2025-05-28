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
            <Image src="https://images.unsplash.com/photo-1605841561924-926295c558fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmbG93Y2hhcnQlMjBkaWFncmFtfGVufDB8fHx8MTc0ODQyMzU2N3ww&ixlib=rb-4.1.0&q=80&w=1080" alt="Chain of Thought Visualization" width={600} height={400} className="rounded-md aspect-video object-cover" />
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent"><Share2 className="inline-block mr-2" />RAG Integration</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-foreground/80 mb-4">See how Retrieval Augmented Generation enhances AI knowledge. (Visual demo pending)</p>
            <Image src="https://images.unsplash.com/photo-1631864032976-cef7f00fea43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxkYXRhYmFzZSUyMG5ldHdvcmt8ZW58MHx8fHwxNzQ4NDIzNTY3fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="RAG Integration Demo" width={600} height={400} className="rounded-md aspect-video object-cover" />
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="text-accent"><Briefcase className="inline-block mr-2" />Agentic AI</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-foreground/80 mb-4">Workshop on multi-step task completion and tool selection. (Interactive tool pending)</p>
            <Image src="https://images.unsplash.com/photo-1553007837-057e28298e01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxnZWFycyUyMHByb2Nlc3N8ZW58MHx8fHwxNzQ4NDIzNTY3fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Agentic AI Workshop" width={600} height={400} className="rounded-md aspect-video object-cover" />
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
