import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const availableComponents = [
  { type: "system", title: "System Role", description: "Define AI's personality.", icon: Bot },
  { type: "user", title: "User Input", description: "What you want to ask.", icon: Puzzle },
  { type: "rag", title: "RAG Context", description: "Add external knowledge.", icon: ListChecks },
  { type: "constraints", title: "Constraints", description: "Set rules & limits.", icon: SlidersHorizontal },
  { type: "guardrails", title: "Guardrails", description: "Safety measures.", icon: ShieldCheck },
  { type: "tools", title: "Tools/Functions", description: "Define AI capabilities.", icon: Wrench },
  { type: "examples", title: "Examples", description: "Show sample I/O.", icon: Eye },
];

export function PromptBuilderSection() {
  return (
    <SectionContainer
      id="workshop"
      title="PromptCraft Workshop"
      subtitle="Assemble your AI prompts like building blocks and see the magic happen."
      className="bg-background"
    >
      <div className="grid lg:grid-cols-3 gap-8 h-[70vh] max-h-[800px]">
        {/* Component Library Sidebar */}
        <GlassCard className="lg:col-span-1 h-full flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent">
              <Wand2 className="inline-block mr-2" />
              Prompt Components
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-3">
                {availableComponents.map((comp) => (
                  <PromptComponentCard
                    key={comp.type}
                    type={comp.type as any}
                    title={comp.title}
                    description={comp.description}
                    icon={comp.icon}
                  />
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </GlassCardContent>
        </GlassCard>

        {/* Prompt Assembly Area & Preview */}
        <GlassCard className="lg:col-span-2 h-full flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent">
              <Puzzle className="inline-block mr-2" />
              Assembly & Preview
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex-grow grid grid-rows-2 gap-4 overflow-hidden">
            {/* Drop Zone - Placeholder */}
            <div className="bg-foreground/5 p-4 rounded-md border-2 border-dashed border-border flex items-center justify-center row-span-1">
              <p className="text-muted-foreground">Drag & Drop Prompt Components Here</p>
            </div>
            
            {/* Real-time Preview */}
            <div className="row-span-1 flex flex-col">
              <h4 className="text-lg font-semibold text-primary mb-2">Live Prompt Preview:</h4>
              <Textarea
                readOnly
                placeholder="Your assembled prompt will appear here..."
                className="flex-grow bg-foreground/5 text-foreground/90 resize-none glass-card-content !p-3 !border-primary/30" 
                value={"// Example assembled prompt:\n// System: You are a helpful assistant.\n// User: Tell me a joke."}
              />
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
       <Button variant="outline" size="lg" className="mt-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          Test Prompt with AI
        </Button>
    </SectionContainer>
  );
}
