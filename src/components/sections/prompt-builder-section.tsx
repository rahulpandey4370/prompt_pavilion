
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard, type PromptComponentType } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Trash2, Loader2, Sparkles } from "lucide-react";
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


interface AvailableComponent {
  type: PromptComponentType;
  title: string;
  description: string; 
  icon: LucideIcon;
}

const availableComponents: AvailableComponent[] = [
  {
    type: "system",
    title: "Expert System Role",
    description: "You are a seasoned travel expert with 20 years of experience planning bespoke itineraries for adventurous globetrotters. Your tone is enthusiastic, knowledgeable, and slightly witty. You always provide practical tips and cultural insights.",
    icon: Bot
  },
  {
    type: "user",
    title: "Specific User Goal",
    description: "I'm planning a 10-day solo trip to Italy in late September. I'm interested in history, art, delicious food (especially pasta and gelato!), and scenic landscapes. I'd like to visit Rome, Florence, and Cinque Terre. My budget is moderate, around $200-250 per day excluding flights.",
    icon: Puzzle
  },
  {
    type: "rag",
    title: "Relevant Context (RAG)",
    description: "Context: Late September in Italy offers pleasant weather, typically sunny with average temperatures between 15-25°C (59-77°F). It's after the peak tourist season, so crowds are smaller. Key festivals: None major, but local food/wine sagre (festivals) might be happening.",
    icon: ListChecks
  },
  {
    type: "constraints",
    title: "Output Constraints",
    description: "Constraints: The itinerary should be detailed day-by-day. Include suggestions for 1-2 activities per day, and 2-3 food recommendations (mix of restaurants and casual spots). Suggest one 'splurge' activity or meal. Format the output as a markdown document with clear headings for each day and city.",
    icon: SlidersHorizontal
  },
  {
    type: "guardrails",
    title: "Safety & Tone Guardrails",
    description: "Guardrails: Ensure all activity suggestions are safe and suitable for a solo female traveler. Prioritize well-lit and centrally located accommodation options. Maintain an encouraging and respectful tone. Do not suggest activities that are extremely physically demanding unless offering alternatives.",
    icon: ShieldCheck
  },
  {
    type: "tools",
    title: "Hypothetical Tool Usage Example",
    description: "Tool Hint: To provide real-time suggestions, you might internally consult a 'LocalEventsAPI(city, date)' for festivals or a 'RestaurantBookingAPI(city, cuisine, price_range)' for dinner reservations. (This is a conceptual note for the AI).",
    icon: Wrench
  },
  {
    type: "examples",
    title: "Input/Output Formatting Example",
    description: "Example Snippet of Expected Output:\n**Day 1: Rome - Ancient Wonders**\n*   Morning: Colosseum & Roman Forum (Book tickets online to save time!)\n*   Lunch: Pizza al taglio near the Forum.\n*   Afternoon: Palatine Hill & Trevi Fountain (Don't forget to toss a coin!).\n*   Dinner: Trattoria Da Enzo al 29 (authentic Roman pasta).",
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
    generateResponseMutation.mutate({ assembledPrompt: livePreviewText });
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
       <Button 
          variant="outline" 
          size="lg" 
          className="mt-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          onClick={handleTestPrompt}
          disabled={generateResponseMutation.isPending || droppedItems.length === 0}
        >
          {generateResponseMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          Test Assembled Prompt with AI
        </Button>

        { (generateResponseMutation.isPending || aiResponse) && (
        <GlassCard className="mt-8">
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
    </SectionContainer>
  );
}
