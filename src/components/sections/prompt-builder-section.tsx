
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard, type PromptComponentType } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Trash2, Loader2, Sparkles, Settings2, Gift, ChefHat, MapPin, TrendingUp, Brain } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, type DragEvent, useEffect } from "react";
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
  id: string;
}

interface Scenario {
  id: string;
  name: string;
  icon: LucideIcon;
  availableComponents: AvailableComponent[];
}

const scenarios: Scenario[] = [
  {
    id: "festival-greeting",
    name: "Festival Greeting Card Message",
    icon: Gift,
    availableComponents: [
      {
        id: "fest-greet-system",
        type: "system",
        title: "System: Friendly Greeting Helper",
        description: "You are a friendly AI assistant for writing short, warm festival greetings (e.g., for Diwali, Eid, Christmas).",
        icon: Settings2
      },
      {
        id: "fest-greet-user",
        type: "user",
        title: "User: Festival Greeting Request",
        description: "Write a joyful message for Diwali to send to my friend, Priya.",
        icon: Puzzle
      },
      {
        id: "fest-greet-rag",
        type: "rag",
        title: "RAG: Recipient Details (Optional)",
        description: "Context: Priya and I share many childhood memories and a love for traditional sweets.",
        icon: ListChecks
      },
      {
        id: "fest-greet-examples",
        type: "examples",
        title: "Examples: Sample Greeting Style",
        description: "Example Style: 'Wishing you a Diwali filled with light and laughter, dear Priya! Hope it's as sweet as our favorite jalebis!'",
        icon: Eye
      },
      {
        id: "fest-greet-constraints",
        type: "constraints",
        title: "Constraints: Brevity & Tone",
        description: "Keep the message under 40 words. Ensure the tone is warm, personal, and respectful of the festival.",
        icon: SlidersHorizontal
      },
      {
        id: "fest-greet-guardrails",
        type: "guardrails",
        title: "Guardrails: Cultural Sensitivity",
        description: "Ensure the message is culturally appropriate and universally positive.",
        icon: ShieldCheck
      },
    ]
  },
  {
    id: "quick-snack-recipe",
    name: "Quick Recipe - Snack",
    icon: ChefHat,
    availableComponents: [
      {
        id: "recipe-system",
        type: "system",
        title: "System: Concise Recipe Assistant",
        description: "You are a recipe assistant. Provide clear, simple, and concise recipes for easy snacks.",
        icon: Settings2
      },
      {
        id: "recipe-user",
        type: "user",
        title: "User: Quick Snack Recipe Request",
        description: "Give me a very simple recipe for 'vegetable pakora' that a beginner can make quickly (under 20 minutes prep & cook).",
        icon: Puzzle
      },
      {
        id: "recipe-rag",
        type: "rag",
        title: "RAG: Common Pakora Ingredients",
        description: "Context: Basic pakora ingredients usually include gram flour (besan), onion, potato, spinach, and common Indian spices (turmeric, chili powder, coriander).",
        icon: ListChecks
      },
      {
        id: "recipe-examples",
        type: "examples",
        title: "Examples: Output Structure",
        description: "Example Format:\n**Ingredients:**\n- Item 1 (qty)\n- Item 2 (qty)\n**Instructions (Max 5 steps):**\n1. Brief step 1.\n2. Brief step 2.",
        icon: Eye
      },
      {
        id: "recipe-constraints",
        type: "constraints",
        title: "Constraints: Simplicity & Clarity",
        description: "List ingredients first, then provide step-by-step instructions (max 5 steps). Use simple language. Specify quantities for 2 servings.",
        icon: SlidersHorizontal
      },
      {
        id: "recipe-guardrails",
        type: "guardrails",
        title: "Guardrails: Cooking Safety Note",
        description: "If deep frying is involved, include a brief, clear safety reminder about handling hot oil.",
        icon: ShieldCheck
      },
    ]
  },
  {
    id: "weekend-getaway",
    name: "Weekend Getaway Idea",
    icon: MapPin,
    availableComponents: [
      {
        id: "travel-system",
        type: "system",
        title: "System: Weekend Trip Planner",
        description: "You are a travel planner specializing in suggesting short (2-day) weekend getaways from major Indian cities.",
        icon: Settings2
      },
      {
        id: "travel-user",
        type: "user",
        title: "User: Trip Idea from Bangalore",
        description: "Suggest a 2-day weekend trip from Bangalore for someone who enjoys nature and historical sites. Budget is moderate (approx. ₹5000-₹8000 per person, excluding travel to destination).",
        icon: Puzzle
      },
      {
        id: "travel-rag",
        type: "rag",
        title: "RAG: User Preferences (Optional)",
        description: "Contextual Info: User prefers less crowded places, enjoys local cuisine, and is comfortable with public transport or budget taxi services.",
        icon: ListChecks
      },
      {
        id: "travel-examples",
        type: "examples",
        title: "Examples: Sample Itinerary Snippet",
        description: "Example Output Snippet:\n**Destination:** Mysore (Approx. 3-4 hours from Bangalore)\n**Day 1:** Mysore Palace, Local Market for silk sarees, Chamundeshwari Temple (evening)\n**Day 2:** Brindavan Gardens, St. Philomena's Church",
        icon: Eye
      },
      {
        id: "travel-constraints",
        type: "constraints",
        title: "Constraints: Output Details",
        description: "Suggest one main destination. Include 2-3 key activities per day. Mention estimated travel time from Bangalore. Briefly state why it fits the 'nature' and 'historical' criteria.",
        icon: SlidersHorizontal
      },
      {
        id: "travel-guardrails",
        type: "guardrails",
        title: "Guardrails: Practicality & Safety",
        description: "Ensure suggestions are generally feasible within a 2-day trip and are safe for solo travelers or small groups. Mention typical best times to visit if relevant (e.g., avoid monsoon peaks for outdoor sites).",
        icon: ShieldCheck
      },
    ]
  },
  {
    id: "erp-sales-analysis",
    name: "ERP: Sales Performance & Anomaly Report",
    icon: TrendingUp,
    availableComponents: [
      {
        id: "erp-analysis-system",
        type: "system",
        title: "System: AI ERP Business Intelligence Analyst",
        description: "You are 'AnalyticaPro', an advanced AI business intelligence analyst. Your primary function is to generate insightful reports on sales performance from ERP data, identify anomalies, and provide actionable recommendations for sales managers. Use precise business terminology and structure reports logically.",
        icon: Settings2
      },
      {
        id: "erp-analysis-user",
        type: "user",
        title: "User: Quarterly Sales Analysis Request",
        description: "Generate a sales performance report for the last completed quarter (e.g., Q3 2024) for the 'Engineered Products' division. Specifically, I need to understand:\n1. Overall revenue trend vs. previous quarter and vs. same quarter last year.\n2. Top 3 performing product lines and their growth drivers.\n3. Any significant sales anomalies (e.g., a product line with a >20% unexpected drop or surge in a specific region like 'APAC' or 'EMEA'). For each anomaly, suggest two potential causes.\n4. Three strategic recommendations based on this data for improving next quarter's sales.",
        icon: Puzzle
      },
      {
        id: "erp-analysis-rag",
        type: "rag",
        title: "RAG: Sample ERP Sales Data Extract (Quarterly)",
        description: "Context: ERP Q3 2024 Sales Data Extract (Engineered Products Division):\n- Total Revenue (Q3 2024): $2.75M (vs. Q2 2024: $2.5M, vs. Q3 2023: $2.3M)\n- Gross Profit Margin (Q3 2024): 38% (vs. Q2 2024: 39%)\n- Product Line 'Custom Turbines': $1.2M (Up 15% QoQ, driven by new contracts in EMEA)\n- Product Line 'Precision Gears': $0.8M (Stable QoQ)\n- Product Line 'Actuator Assemblies': $0.4M (Down 25% QoQ - APAC region showed a 50% drop, EMEA stable, NA up 5%)\n- Regional Performance (APAC - Actuators): $50K (vs $200K in Q2) - Note: New competitor launched aggressive pricing in APAC for similar actuators in August.\n- Key Customer Segment (Aerospace): $1.5M (Up 10% QoQ)",
        icon: ListChecks
      },
      {
        id: "erp-analysis-constraints",
        type: "constraints",
        title: "Constraints: Report Structure & Depth",
        description: "Output a concise report (maximum 500 words). Use Markdown formatting. Start with an Executive Summary (3-4 sentences). Clearly label each requested section (Overall Trend, Top Products, Anomalies, Recommendations). For anomalies, explicitly state the data points and then list potential causes.",
        icon: SlidersHorizontal
      },
      {
        id: "erp-analysis-guardrails",
        type: "guardrails",
        title: "Guardrails: Scope and Professionalism",
        description: "Focus only on the 'Engineered Products' division data provided. Do not speculate on causes for anomalies beyond what can be reasonably inferred from the context or what is typical in the manufacturing sector (e.g., supply chain issues, competitor actions, market demand shifts). Avoid making definitive financial investment advice.",
        icon: ShieldCheck
      },
      {
        id: "erp-analysis-tools",
        type: "tools",
        title: "Tools: Conceptual - Data Query & Analysis Functions",
        description: "Tool Hint (for AI internal conceptualization):\n- `queryERPSalesData(division, quarter_year, metrics_array)`\n- `calculateVariance(current_value, previous_value, type: 'abs'|'perc')`\n- `identifySalesAnomalies(dataset, threshold_percentage, dimensions_array)`",
        icon: Wrench
      },
      {
        id: "erp-analysis-examples",
        type: "examples",
        title: "Examples: Snippet of Anomaly Section Format",
        description: "Example of Anomaly Section Format:\n\n**Sales Anomaly: Product Line 'X' - Region 'Y'**\n- Data: Q3 Sales $Value vs. Q2 Sales $Value (Percentage% decrease/increase).\n- Potential Causes:\n  1.  [Plausible Cause 1 based on context or general knowledge]\n  2.  [Plausible Cause 2 based on context or general knowledge]",
        icon: Eye
      },
    ]
  },
];


interface DroppedItem extends AvailableComponent {}

const PLACEHOLDER_PROMPT_TEXT = "Your assembled prompt will appear here... Drag components from the left to build it!";


export function PromptBuilderSection() {
  const [currentScenarioId, setCurrentScenarioId] = useState<string>(scenarios[0].id);
  const [currentAvailableComponents, setCurrentAvailableComponents] = useState<AvailableComponent[]>(scenarios[0].availableComponents);

  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [draggedOver, setDraggedOver] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const selectedScenario = scenarios.find(s => s.id === currentScenarioId);
    if (selectedScenario) {
      setCurrentAvailableComponents(selectedScenario.availableComponents);
      setDroppedItems([]);
      setAiResponse(null);
    }
  }, [currentScenarioId]);

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
        const errorMessage = data?.response || "AI did not return a valid response.";
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
    const componentIdToDrop = event.dataTransfer.getData("promptComponentId");

    const originalComponent = currentAvailableComponents.find(c => c.id === componentIdToDrop);

    if (originalComponent) {
      const isSingletonType = originalComponent.type === 'system' || originalComponent.type === 'user';
      const alreadyExists = isSingletonType && droppedItems.some(item => item.type === originalComponent.type);

      if (alreadyExists) {
         toast({ variant: "destructive", title: "Component Limit", description: `A component of type "${originalComponent.type.toUpperCase()}" already exists. Only one is allowed.`});
        return;
      }

      const newDroppedItemId = `${originalComponent.id}-${Date.now()}-${Math.random()}`;
      setDroppedItems(prev => [...prev, { ...originalComponent, id: newDroppedItemId }]);
    }
  };

  const handleRemoveItem = (idToRemove: string) => {
     setDroppedItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
  };

  const handleTestPrompt = () => {
    if (droppedItems.length === 0 || livePreviewText === PLACEHOLDER_PROMPT_TEXT) {
      toast({ variant: "destructive", title: "Empty Prompt", description: "Please assemble a prompt before testing." });
      return;
    }
    setAiResponse(null);
    toast({ title: "Processing...", description: "Generating AI response..." });
    generateResponseMutation.mutate({ assembledPrompt: livePreviewText });
  };

  const handleScenarioChange = (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
  };

  const currentScenarioForIcon = scenarios.find(s => s.id === currentScenarioId);


  return (
    <SectionContainer
      id="workshop"
      title="The Prompt Canvas"
      subtitle="Select a scenario, then assemble your AI prompts like building blocks. Drag pre-filled components from the left to the assembly area below."
      isContainedCard={true}
      className="!py-12 md:!py-16"
    >
      <div className="bg-card p-0.5 yellow-glowing-box rounded-lg">
        <div className="bg-card rounded-md p-6">
          <div className="grid lg:grid-cols-3 gap-8 min-h-[70vh]">
            <GlassCard className="lg:col-span-1 h-full flex flex-col !shadow-none !border-none !bg-transparent !p-0">
              <GlassCardHeader className="pb-3">
                <div className="flex flex-col space-y-3">
                    <GlassCardTitle className="text-neon-yellow flex items-center">
                    <Wand2 className="inline-block mr-2" />
                    Prompt Component Examples
                    </GlassCardTitle>
                    <div>
                        <Label htmlFor="scenario-select" className="text-sm font-medium text-neon-yellow mb-1">Select Scenario:</Label>
                        <Select value={currentScenarioId} onValueChange={handleScenarioChange}>
                            <SelectTrigger id="scenario-select" className="w-full bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground">
                                <SelectValue placeholder="Select a scenario" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-neon-yellow text-foreground">
                                {scenarios.map(scenario => (
                                <SelectItem key={scenario.id} value={scenario.id} className="focus:bg-neon-yellow/20">
                                    <div className="flex items-center">
                                        {scenario.icon && <scenario.icon className="mr-2 h-4 w-4 text-muted-foreground"/>}
                                        {scenario.name}
                                    </div>
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              </GlassCardHeader>
              <GlassCardContent className="flex-grow overflow-hidden pr-0">
                <ScrollArea className="h-full pr-3">
                  <div className="space-y-3">
                    {currentAvailableComponents.map((comp) => (
                      <PromptComponentCard
                        key={comp.id}
                        type={comp.type}
                        title={comp.title}
                        description={comp.description}
                        icon={comp.icon}
                        data-component-id={comp.id}
                        className="card-neon-animated-border" 
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="lg:col-span-2 h-full flex flex-col !shadow-none !border-none !bg-transparent !p-0">
              <GlassCardHeader className="pb-3">
                <GlassCardTitle className="text-neon-yellow flex items-center">
                  {currentScenarioForIcon?.icon && <currentScenarioForIcon.icon className="inline-block mr-2 h-5 w-5" />}
                  Your Engineered Prompt: {currentScenarioForIcon?.name}
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="flex-grow grid grid-rows-2 gap-4 overflow-hidden">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    "bg-background/30 p-4 rounded-md border-2 border-dashed border-neon-yellow/50 row-span-1 overflow-y-auto space-y-2 custom-scrollbar",
                    draggedOver ? "border-neon-yellow ring-2 ring-neon-yellow" : "border-neon-yellow/50",
                    droppedItems.length === 0 ? "flex items-center justify-center" : "block"
                  )}
                >
                  {droppedItems.length === 0 ? (
                    <p className="text-muted-foreground text-center">Drag & Drop Prompt Components Here</p>
                  ) : (
                    droppedItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <PromptComponentCard
                          type={item.type}
                          title={item.title}
                          description={item.description}
                          icon={item.icon}
                          isDraggable={false}
                          className="opacity-95 group-hover:opacity-100 cursor-default card-neon-animated-border" 
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

                <div className="row-span-1 flex flex-col">
                  <h4 className="text-lg font-semibold text-neon-yellow mb-2">Live Prompt Preview (Raw Text):</h4>
                  <Textarea
                    readOnly
                    placeholder={PLACEHOLDER_PROMPT_TEXT}
                    className="flex-grow bg-background/30 text-foreground/90 resize-none !p-3 !border-neon-yellow/50 custom-scrollbar"
                    value={livePreviewText}
                  />
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-8">
        <Button
            size="lg"
            className="bg-neon-yellow hover:bg-neon-yellow/90 text-neon-yellow-foreground px-6 py-3 text-base"
            onClick={handleTestPrompt}
            disabled={generateResponseMutation.isPending || droppedItems.length === 0}
          >
            {generateResponseMutation.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Bot className="mr-2 h-5 w-5" />
            )}
            Test Assembled Prompt with AI
          </Button>
      </div>

        {(generateResponseMutation.isPending || aiResponse) && (
        <GlassCard className="mt-8 w-full !shadow-none !border-none !bg-transparent !p-0">
            <GlassCardHeader className="pb-3">
            <GlassCardTitle className="text-neon-yellow flex items-center">
                <Sparkles className="mr-2 h-5 w-5" /> AI Response
            </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
            {generateResponseMutation.isPending && !aiResponse ? (
                <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-neon-yellow" />
                <p className="ml-3 text-foreground/80">Generating response...</p>
                </div>
            ) : (
                <Textarea
                readOnly
                value={aiResponse || ""}
                placeholder="AI response will appear here..."
                className="h-64 bg-background/30 text-foreground/90 resize-none !p-3 !border-neon-yellow/50 custom-scrollbar"
                />
            )}
            </GlassCardContent>
        </GlassCard>
        )}
    </SectionContainer>
  );
}

