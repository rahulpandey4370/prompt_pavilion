
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard, type PromptComponentType } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Trash2, Loader2, Sparkles, BookHeart, MessagesSquare, Users, Brain, Settings2 } from "lucide-react";
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
    id: "erp-sales-summary", // Updated ID for default
    name: "ERP: Monthly Sales Summary", // Renamed
    icon: Brain,
    availableComponents: [
      {
        id: "erp-sales-system",
        type: "system",
        title: "System: AI Business Analyst for ERP Data",
        description: "You are 'AnalyticaAI', an expert AI business analyst specializing in interpreting and summarizing sales data from ERP systems. Your goal is to provide concise, actionable monthly sales performance summaries for sales managers. Focus on key trends, significant variances, and potential opportunities or concerns. Always use professional business language and structure your summary logically with clear headings for different sections (e.g., Overall Performance, Top Performing Products/Services, Regional Analysis, Key Variances, Strategic Recommendations). Ensure all monetary figures are presented with appropriate currency symbols if provided in context, otherwise use generic indicators.",
        icon: Settings2
      },
      {
        id: "erp-sales-user",
        type: "user",
        title: "User: Request for Monthly Sales Performance Report",
        description: "Please generate the sales performance summary for the last completed month (e.g., May 2024 if today is in June 2024). Focus on comparing this month's performance against the previous month and the same month last year. Highlight any product categories, service lines, or regions that showed exceptional growth or decline (over +/- 15% variance). Identify key contributing factors if inferable from data. I need this summary for our upcoming quarterly business review meeting.",
        icon: Puzzle
      },
      {
        id: "erp-sales-rag",
        type: "rag",
        title: "RAG: Sample ERP Sales Data Extract (Last Month)",
        description: "Context: Extracted ERP Sales Data (Example - May 2024)\n- Total Revenue (May 2024): 1.25M (vs. Apr 2024: 1.1M, vs. May 2023: 1.05M)\n- Gross Profit Margin (May 2024): 45% (vs. Apr 2024: 43%, vs. May 2023: 42%)\n- Top Product Category (May 2024): 'Enterprise Software Licenses' - 450K (Up 18% MoM, Up 25% YoY)\n- Lowest Performing Product Category (May 2024): 'Legacy System Maintenance' - 80K (Down 12% MoM, Down 8% YoY)\n- Regional Performance (South Asia): 600K (Up 10% MoM, Up 20% YoY - driven by new major client in India)\n- Regional Performance (Western Europe): 400K (Up 5% MoM, Stable YoY)\n- Regional Performance (North America): 250K (Down 5% MoM - attributed to increased competitor activity & delayed Q2 product launch)\n- Key Customer Segment (Manufacturing): 900K (Up 15% MoM)\n- Average Deal Size: 15,500 (vs. 14,000 in April)\n- New Customer Acquisition: 25 (vs. 22 in April; 40% from India)\n- Sales Cycle Length: 55 days (vs. 60 days in April)",
        icon: ListChecks
      },
      {
        id: "erp-sales-constraints",
        type: "constraints",
        title: "Constraints: Report Format & Content Depth",
        description: "Output Constraints:\n1. The summary must be a maximum of 400 words.\n2. Start with an executive summary (3-4 sentences) covering overall performance and key takeaways.\n3. Use bullet points for specific metrics, comparisons, and recommendations.\n4. Include sections: Overall Performance (Total Revenue, GP Margin), Product/Service Category Highlights (Top & Lowest), Regional Analysis, Key Variances (vs. previous month & previous year with % change), and 3-4 Actionable Strategic Recommendations.\n5. Quantify changes using percentages and absolute values where provided in context.\n6. Do not include raw data tables in the summary; only the narrative, key figures, and insights.",
        icon: SlidersHorizontal
      },
      {
        id: "erp-sales-guardrails",
        type: "guardrails",
        title: "Guardrails: Professionalism & Data Interpretation",
        description: "Guardrails:\n- Maintain an objective, data-driven, and professional tone suitable for executive review.\n- If information is missing to make a full assessment on a point, state it as a limitation or an area for further manual investigation.\n- Ensure all financial figures are presented clearly and consistently.\n- Avoid overly speculative language; base insights on provided data or clearly state assumptions if making extrapolations for recommendations.",
        icon: ShieldCheck
      },
      {
        id: "erp-sales-tools",
        type: "tools",
        title: "Tools: Conceptual - Data Query & Analysis",
        description: "Tool Hint (for AI internal process):\n- `queryERPSales(period: 'YYYY-MM', dimensions: string[], metrics: string[])`: Simulates fetching structured data from ERP views or Business Activity Queries (BAQs).\n- `calculateVariance(current_value, previous_value, type: 'abs'|'perc')`: For MoM/YoY absolute and percentage changes.\n- `identifyTrends(data_series, period_description)`: To spot significant patterns or anomalies.",
        icon: Wrench
      },
      {
        id: "erp-sales-examples",
        type: "examples",
        title: "Examples: Snippet of Regional Analysis Section",
        description: "Example Snippet (Regional Analysis Section):\n\n'**Regional Analysis:**\n*   *South Asia* emerged as the top-performing region, contributing 600K in revenue, an impressive 10% increase month-over-month (MoM) and a 20% rise year-over-year (YoY). This growth was significantly boosted by the acquisition of a major new client in India during the period.\n*   *Western Europe* showed steady growth with 400K in revenue, up 5% MoM and stable YoY, indicating consistent market penetration.\n*   *North America* experienced a slight downturn, with revenues of 250K, down 5% MoM. This is likely due to intensified competitor marketing campaigns and a minor delay in our Q2 product refresh for this market. Further analysis of competitor strategies in NA is recommended.'\n",
        icon: Eye
      },
    ]
  },
  {
    id: "creative-writing-sf",
    name: "Creative Writing: Sci-Fi (Generic)",
    icon: BookHeart,
    availableComponents: [
      {
        id: "sf-system",
        type: "system",
        title: "System: AI Sci-Fi World Builder",
        description: "You are 'CosmoChronicler', an AI specializing in generating vivid science fiction settings, alien species, and futuristic technologies. Your tone is imaginative and detailed, inspiring authors with unique concepts. You excel at creating plausible yet fantastical elements. When asked for multiple items, provide them as a numbered list using Markdown.",
        icon: Settings2
      },
      {
        id: "sf-user",
        type: "user",
        title: "User: Request for Alien Planet Concepts",
        description: "I'm writing a space opera and need three distinct concepts for habitable alien planets. Each concept should include: a unique environmental feature, the dominant sentient species' primary characteristic, and a hint of a societal conflict or mystery. Ensure the planet names are evocative and unique.",
        icon: Puzzle
      },
      {
        id: "sf-rag",
        type: "rag",
        title: "RAG: Astro-Physics & Exobiology Notes",
        description: "Contextual Data:\n- Common Habitable Zone (HZ) star types: G-type (like Sol), K-type, M-type (red dwarfs, often tidally locked planets).\n- Consider planets with unusual orbital mechanics (e.g., binary suns, rogue planets captured by stars).\n- Sentient Species Ideas: Silicon-based life, energy beings, hive minds, species that communicate via bioluminescence.\n- Societal Conflicts: Resource scarcity, ideological schisms, ancient precursor technology, external threats.",
        icon: ListChecks
      },
      {
        id: "sf-constraints",
        type: "constraints",
        title: "Constraints: Originality & Format",
        description: "Output Constraints:\n1. Each planet concept must be 2-3 paragraphs.\n2. Avoid common sci-fi tropes (e.g., desert planets exactly like Tatooine, warrior races exactly like Klingons) unless given a unique twist.\n3. Format the response in Markdown, using bold for planet names.\n4. Ensure species characteristics are biologically plausible for their described environment.",
        icon: SlidersHorizontal
      },
      {
        id: "sf-guardrails",
        type: "guardrails",
        title: "Guardrails: Thematic & Content Safety",
        description: "Guardrails:\n- No depiction of gratuitous violence or suffering of sentient species.\n- Concepts should be suitable for a broad young adult to adult audience.\n- Avoid generating content that mirrors or critiques specific real-world cultures or political situations too directly.\n- The AI should not express personal preferences for any generated concept.",
        icon: ShieldCheck
      },
      {
        id: "sf-tools",
        type: "tools",
        title: "Tools: Conceptual (Internal)",
        description: "Tool Hint (for AI internal process):\n- `generateUniqueName(category: 'planet' | 'species', seed_keywords_array)`: For creating evocative names.\n- `checkSciFiTropes(concept_details)`: To flag overuse of common tropes.\n- `verifyPlausibility(environment_details, species_characteristics)`: Cross-references RAG data for basic scientific consistency.",
        icon: Wrench
      },
      {
        id: "sf-examples",
        type: "examples",
        title: "Examples: Planet Concept Snippet",
        description: "Example of Expected Output for one Planet Concept:\n\n**Planet Xylos:**\nXylos is a world perpetually shrouded in a shimmering, aurora-like nebula that filters its parent star's radiation into a spectrum favoring silicon-based flora. Towering crystalline forests dominate its landscape, pulsing with a soft internal light. The dominant sentient species, the Silicates, are slow-moving, crystalline beings who communicate through complex light patterns emitted from their bodies. A societal mystery looms: ancient, perfectly spherical voids are appearing in the crystalline forests, and no Silicate will speak of their origin.",
        icon: Eye
      },
    ]
  },
  {
    id: "customer-support-ecommerce",
    name: "Customer Support: E-commerce (Business)",
    icon: MessagesSquare,
    availableComponents: [
      {
        id: "cs-system",
        type: "system",
        title: "System: AI E-commerce Assistant 'AssistBot'",
        description: "You are 'AssistBot', a friendly and efficient AI customer support agent for 'UrbanThreads.com', an online fashion retailer. Your primary goal is to resolve customer queries regarding orders, returns, and product information. Maintain a polite, empathetic, and helpful tone. Always thank the customer for their patience or for reaching out. Refer to specific policy details if applicable. If handling Indian customers, use appropriate salutations and be mindful of local customer service expectations.",
        icon: Settings2
      },
      {
        id: "cs-user",
        type: "user",
        title: "User: Inquiry about Return Policy & Defective Item",
        description: "Hi, I received my order #ORD123456 yesterday. The jacket (SKU: JT007-M) doesn't fit. Also, the t-shirt (SKU: TS002-S) arrived with a small tear on the sleeve. I'd like to know how I can return both, if I can get a refund for the t-shirt, and an exchange for the jacket for a size L. I am based in Mumbai, India.",
        icon: Puzzle
      },
      {
        id: "cs-rag",
        type: "rag",
        title: "RAG: UrbanThreads Policy (Returns & Defectives)",
        description: "Context: UrbanThreads Policy Excerpts (Global, with India-specific notes if applicable)\n- Standard Returns: Accepted within 30 days of delivery. Items must be unworn, unwashed, with original tags. Refunds to original payment method (5-7 business days processing). Exchanges subject to availability; customer covers return shipping for exchanges, UrbanThreads covers new item shipping.\n- Defective Items: Report within 7 days of delivery with photo proof. Full refund or exchange (if available) offered. UrbanThreads covers all shipping for defective item returns/exchanges.\n- India Specifics: Returns from India may have an extended processing window of 7-10 business days due to local logistics. Pickup for returns can be arranged in major metro cities.\n- Order Lookup: Order #ORD123456 - Jacket JT007-M (not final sale), T-shirt TS002-S (not final sale). Purchased [Date]. Shipping address: Mumbai, India.",
        icon: ListChecks
      },
      {
        id: "cs-constraints",
        type: "constraints",
        title: "Constraints: Information Hierarchy & Action Limits",
        description: "Output Constraints:\n1. Address both issues (fit and defect) clearly and separately.\n2. For the jacket: Explain return/exchange options per standard policy, mentioning specific return shipping details if different for India.\n3. For the t-shirt: Explain defective item policy, request photo if not implicitly provided, and outline resolution (refund/exchange).\n4. Provide a direct link to the main return policy page and a contact for defective item claims (e.g., support.in@urbanthreads.com or a specific Indian support number if available from RAG).\n5. Do not ask for PII beyond order number confirmation, unless required for return pickup arrangement (e.g., confirm pickup address if different from delivery).",
        icon: SlidersHorizontal
      },
      {
        id: "cs-guardrails",
        type: "guardrails",
        title: "Guardrails: Empathy & Policy Adherence",
        description: "Guardrails:\n- Express empathy for the inconvenience, especially regarding the defective item.\n- Do not make promises outside of stated policy (e.g., instant refunds, free expedited exchange shipping for non-defective items if not standard).\n- Guide user to self-service portal for standard returns but offer direct assistance pathway for defectives.\n- If providing contact details, ensure they are appropriate for the customer's region if specified (e.g., India-specific support if user mentions it and data is available).\n- Maintain professional and brand-aligned tone.",
        icon: ShieldCheck
      },
      {
        id: "cs-tools",
        type: "tools",
        title: "Tools: Order Lookup & Stock Check",
        description: "Tool Hint (for AI internal process):\n- `getOrderDetails(orderId: string)`: Returns items, purchase date, sale status, defect flags, shipping region.\n- `checkStock(sku: string, size: string, region?: string)`: For exchange availability of JT007-L.\n- `initiateDefectiveItemProcess(orderId: string, sku: string, issue_description: string, photo_urls_array?, region?: string)`.\n- `getRegionalSupportInfo(region: string)`: To fetch region-specific contact details or return procedures.",
        icon: Wrench
      },
      {
        id: "cs-examples",
        type: "examples",
        title: "Examples: Handling Multi-Issue Inquiry (India context)",
        description: "Example Snippet of Expected Output (addressing one issue for brevity, India context):\n\n\"I'm truly sorry to hear about the tear on your t-shirt (TS002-S) from your order #ORD123456 – that's definitely not the quality we aim for! For defective items like this, we can offer you a full refund or an exchange for a new one, and we'll cover all associated shipping costs. To proceed, could you please reply with a photo of the damage? You can also email it directly to support.in@urbanthreads.com with your order number. Since you are in Mumbai, we can also explore return pickup options once the defect is verified.\"",
        icon: Eye
      },
    ]
  },
];


interface DroppedItem extends AvailableComponent {}

const PLACEHOLDER_PROMPT_TEXT = "Your assembled prompt will appear here... Drag components from the left to build it!";


export function PromptBuilderSection() {
  const [currentScenarioId, setCurrentScenarioId] = useState<string>(scenarios[0].id); // Default to the first scenario
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

      if (isSingletonType && alreadyExists) {
        toast({ variant: "destructive", title: "Component Limit", description: `Component of type "${originalComponent.type}" can only be added once.`});
        return; 
      }

      const newDroppedItemId = `${originalComponent.id}-${Date.now()}`; // Ensure unique ID for dropped items
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
                        key={comp.id} // Use component's original ID for key in library
                        type={comp.type}
                        title={comp.title}
                        description={comp.description}
                        icon={comp.icon}
                        data-component-id={comp.id} // This ID is used for drag-and-drop
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
                    droppedItems.map((item) => ( // item.id here is the unique ID for the dropped instance
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
            className="bg-neon-yellow hover:bg-neon-yellow/90 text-neon-yellow-foreground"
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
