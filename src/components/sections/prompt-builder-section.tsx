"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard, type PromptComponentType } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Trash2, Loader2, Sparkles, BarChartHorizontalBig } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, type DragEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  generateFromAssembledPrompt,
  type GenerateFromAssembledPromptInput,
} from '@/ai/flows/generate-from-assembled-prompt';
import {
  ratePromptQuality,
  type RatePromptQualityInput,
  type RatePromptQualityOutput,
} from '@/ai/flows/rate-prompt-quality';


interface AvailableComponent {
  type: PromptComponentType;
  title: string;
  description: string;
  icon: LucideIcon;
}

const availableComponents: AvailableComponent[] = [
  {
    type: "system",
    title: "System: AI Creative Writing Assistant",
    description: "You are 'Narrativa', an advanced AI creative writing assistant. Your expertise lies in generating compelling story hooks, character backstories, and vivid world-building descriptions. You have a slightly formal but highly imaginative tone. You avoid cliches and aim for originality. You should be able to adapt to various genres like fantasy, sci-fi, and mystery. When asked for multiple items, provide them as a numbered list.",
    icon: Bot
  },
  {
    type: "user",
    title: "User: Request for Sci-Fi Story Ideas",
    description: "I'm writing a new science fiction novel set in a dystopian future where water is a scarce and controlled commodity. I need three distinct story hooks that explore different facets of this world. Each hook should hint at a central conflict and a potential protagonist. I'm also looking for a brief (2-3 sentences) description of the main antagonist, 'The Aqua Baron', who controls the largest water reserve.",
    icon: Puzzle
  },
  {
    type: "rag",
    title: "RAG: World-Building Details",
    description: "Contextual Information for Narrativa:\n- The year is 2242.\n- Earth's atmosphere is heavily polluted, making natural rainfall acidic and unusable.\n- 'Hydro-corps' are mega-corporations controlling purified water distribution.\n- Underground 'Aquifer' communities exist, attempting to live off-grid, often in conflict with Hydro-corps.\n- Technology for personal water purification is either banned or prohibitively expensive.\n- The average citizen receives daily water rations barely enough for survival.",
    icon: ListChecks
  },
  {
    type: "constraints",
    title: "Constraints: Output Format & Style",
    description: "Output Constraints:\n1. Story hooks must be 1-2 paragraphs each.\n2. The Aqua Baron's description should be concise and impactful.\n3. Maintain a serious and slightly ominous tone, fitting the dystopian theme.\n4. Format the response in Markdown.\n5. Ensure character names are unique and fitting for a sci-fi setting.",
    icon: SlidersHorizontal
  },
  {
    type: "guardrails",
    title: "Guardrails: Content & Safety",
    description: "Guardrails:\n- Avoid overly graphic violence or mature themes unsuitable for a general audience.\n- Ensure that suggested conflicts, while dystopian, do not promote real-world harmful ideologies.\n- Do not generate content that could be interpreted as political commentary on current events.\n- The AI should not express personal opinions or beliefs.",
    icon: ShieldCheck
  },
  {
    type: "tools",
    title: "Tools: Conceptual (Internal)",
    description: "Tool Hint (for AI's internal process, not direct output):\n- `generateCharacterName(genre: 'sci-fi', role: 'protagonist' | 'antagonist')`: Used to ensure unique names.\n- `checkOriginality(text_snippet)`: To help avoid cliches for story hooks.\n- `worldConsistencyCheck(details_array)`: Ensures generated content aligns with established RAG context (e.g., water scarcity).",
    icon: Wrench
  },
  {
    type: "examples",
    title: "Examples: Input/Output Snippet",
    description: "Example of Expected Output for one Story Hook:\n\n**Hook 1: The Last Free Spring**\n\nElara, a young scavenger from the parched Outlands, stumbles upon an ancient map hinting at an unrecorded, naturally purified spring hidden deep within the Aqua Baron's forbidden territories. Pursued by Hydro-corp enforcers and haunted by the dehydration sickness claiming her community, Elara must decipher the map's cryptic clues and navigate the treacherous, resource-stripped landscape. Her journey becomes a desperate race against time, not just for survival, but to bring back a symbol of hope – a source of water free from corporate control. The central conflict revolves around Elara's quest versus the Baron's oppressive regime and the moral dilemmas she faces in protecting her discovery.",
    icon: Eye
  },
];

interface DroppedItem extends AvailableComponent {
  id: string;
}

const PLACEHOLDER_PROMPT_TEXT = "Your assembled prompt will appear here... Drag components from the left to build it!";

export function PromptBuilderSection() {
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [draggedOver, setDraggedOver] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [promptAnalysis, setPromptAnalysis] = useState<RatePromptQualityOutput | null>(null);
  const { toast } = useToast();

  const livePreviewText = droppedItems.length > 0
    ? droppedItems.map(item => `## ${item.title} (Component Type: ${item.type.toUpperCase()})\n\n${item.description}\n\n---\n`).join('\n')
    : PLACEHOLDER_PROMPT_TEXT;

  const generateResponseMutation = useMutation({
    mutationFn: (input: GenerateFromAssembledPromptInput) => generateFromAssembledPrompt(input),
    onSuccess: (data) => {
      if (data && data.response) {
        setAiResponse(data.response);
        toast({ title: "AI Response Received!", description: "The AI has responded to your assembled prompt." });
      } else {
        const errorMessage = "AI did not return a valid response.";
        setAiResponse(errorMessage);
        toast({ variant: "destructive", title: "Response Error", description: errorMessage });
      }
    },
    onError: (error: Error) => {
      const errorMessage = `Error: ${error.message}`;
      setAiResponse(errorMessage);
      toast({ variant: "destructive", title: "Generation Error", description: error.message });
    }
  });

  const ratePromptMutation = useMutation({
    mutationFn: (input: RatePromptQualityInput) => ratePromptQuality(input),
    onSuccess: (data) => {
      if (data && data.rating && data.feedback && data.overallAssessment) {
        setPromptAnalysis(data);
        toast({ title: "Prompt Analysis Complete!", description: "Rating and feedback are now available." });
      } else {
        setPromptAnalysis({
          rating: "N/A",
          feedback: ["AI did not return valid analysis or all fields were not populated."],
          overallAssessment: "Analysis unavailable."
        });
        toast({ variant: "destructive", title: "Analysis Error", description: "Could not get complete prompt rating and feedback." });
      }
    },
    onError: (error: Error) => {
      setPromptAnalysis({
          rating: "Error",
          feedback: [`Analysis Error: ${error.message}`],
          overallAssessment: "Analysis failed."
      });
      toast({ variant: "destructive", title: "Analysis Error", description: error.message });
    }
  });


  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    setDraggedOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggedOver(false);
    const type = event.dataTransfer.getData("promptComponentType") as PromptComponentType;
    
    const originalComponent = availableComponents.find(c => c.type === type);
    if (originalComponent) {
      const isSingletonType = type === 'system' || type === 'user';
      const alreadyExists = isSingletonType && droppedItems.some(item => item.type === type);

      if (isSingletonType && alreadyExists) {
        toast({ variant: "destructive", title: "Component Limit", description: `Component of type "${type}" can only be added once.`});
        return; 
      }
      setDroppedItems(prev => [...prev, { ...originalComponent, id: Date.now().toString() }]);
    }
  };

  const handleRemoveItem = (idToRemove: string) => {
    setDroppedItems(prev => prev.filter(item => item.id !== idToRemove));
  };
  
  const handleTestPrompt = () => {
    if (droppedItems.length === 0 || livePreviewText === PLACEHOLDER_PROMPT_TEXT) {
      toast({ variant: "destructive", title: "Empty Prompt", description: "Please assemble a prompt before testing." });
      return;
    }
    setAiResponse(null); 
    setPromptAnalysis(null);

    toast({ title: "Processing...", description: "Generating AI response and analyzing prompt quality..." });
    
    generateResponseMutation.mutate({ assembledPrompt: livePreviewText });
    ratePromptMutation.mutate({ assembledPrompt: livePreviewText });
  };

  return (
    <SectionContainer
      id="workshop"
      title="PromptCraft Workshop"
      subtitle="Assemble your AI prompts like building blocks. Drag pre-filled components from the left to the assembly area below."
      className="bg-background"
    >
      <div className="grid lg:grid-cols-3 gap-8 min-h-[70vh] max-h-[800px]">
        {/* Component Library Sidebar */}
        <GlassCard className="lg:col-span-1 h-full flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent">
              <Wand2 className="inline-block mr-2" />
              Prompt Component Examples
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-3">
                {availableComponents.map((comp) => (
                  <PromptComponentCard
                    key={comp.type}
                    type={comp.type}
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
              Your Engineered Prompt & Live Preview
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex-grow grid grid-rows-2 gap-4 overflow-hidden">
            {/* Drop Zone */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
              className={cn(
                "bg-foreground/5 p-4 rounded-md border-2 border-dashed border-border row-span-1 overflow-y-auto space-y-2 custom-scrollbar",
                draggedOver ? "border-primary ring-2 ring-primary" : "border-border",
                droppedItems.length === 0 ? "flex items-center justify-center" : "block"
              )}
            >
              {droppedItems.length === 0 ? (
                <p className="text-muted-foreground text-center">Drag & Drop Prompt Components Here</p>
              ) : (
                droppedItems.map(item => (
                  <div key={item.id} className="relative group">
                    <PromptComponentCard
                      type={item.type}
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                      isDraggable={false} 
                      className="opacity-95 group-hover:opacity-100 cursor-default"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1 right-1 h-7 w-7 text-red-500 hover:text-red-400 opacity-60 group-hover:opacity-100 z-10"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Remove component"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            {/* Real-time Preview */}
            <div className="row-span-1 flex flex-col">
              <h4 className="text-lg font-semibold text-primary mb-2">Live Prompt Preview (Raw Text):</h4>
              <Textarea
                readOnly
                placeholder={PLACEHOLDER_PROMPT_TEXT}
                className="flex-grow bg-foreground/5 text-foreground/90 resize-none glass-card-content !p-3 !border-primary/30 custom-scrollbar" 
                value={livePreviewText}
              />
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
      <div className="w-full flex justify-center mt-8">
        <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleTestPrompt}
            disabled={generateResponseMutation.isPending || ratePromptMutation.isPending || droppedItems.length === 0}
          >
            { (generateResponseMutation.isPending || ratePromptMutation.isPending) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            Test Assembled Prompt with AI
          </Button>
      </div>


        { (generateResponseMutation.isPending || aiResponse) && (
        <GlassCard className="mt-8 w-full"> {/* Added w-full for consistency */}
            <GlassCardHeader>
            <GlassCardTitle className="text-primary flex items-center">
                <Sparkles className="mr-2 h-5 w-5" /> AI Response
            </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
            {generateResponseMutation.isPending && !aiResponse ? (
                <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-3 text-foreground/80">Generating response...</p>
                </div>
            ) : (
                <Textarea
                readOnly
                value={aiResponse || ""}
                placeholder="AI response will appear here..."
                className="h-64 bg-foreground/5 text-foreground/90 resize-none glass-card-content !p-3 !border-primary/30 custom-scrollbar"
                />
            )}
            </GlassCardContent>
        </GlassCard>
        )}

        {/* Prompt Quality Analysis Card */}
        { (ratePromptMutation.isPending || promptAnalysis) && (
          <GlassCard className="mt-8 w-full"> {/* Added w-full for consistency */}
            <GlassCardHeader>
              <GlassCardTitle className="text-primary flex items-center">
                <BarChartHorizontalBig className="mr-2 h-5 w-5" /> Prompt Quality Analysis
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              {ratePromptMutation.isPending && !promptAnalysis ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-3 text-foreground/80">Analyzing prompt quality...</p>
                </div>
              ) : promptAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-accent">Overall Assessment:</h4>
                    <p className="text-foreground/80">{promptAnalysis.overallAssessment}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent">Quality Rating:</h4>
                    <p className="text-2xl font-bold text-primary">{typeof promptAnalysis.rating === 'number' ? `${promptAnalysis.rating}/10` : promptAnalysis.rating}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent">Feedback & Missing Things:</h4>
                    {promptAnalysis.feedback && promptAnalysis.feedback.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-foreground/80 pl-4">
                        {promptAnalysis.feedback.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-foreground/80">No specific feedback items provided.</p>
                    )}
                  </div>
                </div>
              ) : null}
            </GlassCardContent>
          </GlassCard>
        )}
    </SectionContainer>
  );
}

