
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard, type PromptComponentType } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Trash2, Loader2, Sparkles, BookHeart, MessagesSquare, UtensilsCrossed, FileText, Users, Brain, Settings2 } from "lucide-react";
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
        description: "You are 'AssistBot', a friendly and efficient AI customer support agent for 'UrbanThreads.com', an online fashion retailer. Your primary goal is to resolve customer queries regarding orders, returns, and product information. Maintain a polite, empathetic, and helpful tone. Always thank the customer for their patience or for reaching out. Refer to specific policy details if applicable.",
        icon: Settings2
      },
      {
        id: "cs-user",
        type: "user",
        title: "User: Inquiry about Return Policy & Defective Item",
        description: "Hi, I received my order #ORD123456 yesterday. The jacket (SKU: JT007-M) doesn't fit. Also, the t-shirt (SKU: TS002-S) arrived with a small tear on the sleeve. I'd like to know how I can return both, if I can get a refund for the t-shirt, and an exchange for the jacket for a size L.",
        icon: Puzzle
      },
      {
        id: "cs-rag",
        type: "rag",
        title: "RAG: UrbanThreads Policy (Returns & Defectives)",
        description: "Context: UrbanThreads Policy Excerpts\n- Standard Returns: Accepted within 30 days of delivery. Items must be unworn, unwashed, with original tags. Refunds to original payment method (5-7 business days processing). Exchanges subject to availability; customer covers return shipping for exchanges, UrbanThreads covers new item shipping.\n- Defective Items: Report within 7 days of delivery with photo proof. Full refund or exchange (if available) offered. UrbanThreads covers all shipping for defective item returns/exchanges.\n- Final Sale: Non-refundable/exchangeable unless defective.\n- Order Lookup: Order #ORD123456 - Jacket JT007-M (not final sale), T-shirt TS002-S (not final sale). Purchased [Date].",
        icon: ListChecks
      },
      {
        id: "cs-constraints",
        type: "constraints",
        title: "Constraints: Information Hierarchy & Action Limits",
        description: "Output Constraints:\n1. Address both issues (fit and defect) clearly and separately.\n2. For the jacket: Explain return/exchange options per standard policy.\n3. For the t-shirt: Explain defective item policy, request photo if not implicitly provided, and outline resolution.\n4. Provide a direct link to the main return policy page and a contact for defective item claims (returns@urbanthreads.com).\n5. Do not ask for PII beyond order number confirmation.",
        icon: SlidersHorizontal
      },
      {
        id: "cs-guardrails",
        type: "guardrails",
        title: "Guardrails: Empathy & Policy Adherence",
        description: "Guardrails:\n- Express empathy for the inconvenience, especially regarding the defective item.\n- Do not make promises outside of stated policy (e.g., instant refunds, free expedited exchange shipping for non-defective items).\n- Guide user to self-service portal for standard returns but offer direct assistance pathway for defectives.\n- Maintain professional and brand-aligned tone.",
        icon: ShieldCheck
      },
      {
        id: "cs-tools",
        type: "tools",
        title: "Tools: Order Lookup & Stock Check",
        description: "Tool Hint (for AI internal process):\n- `getOrderDetails(orderId: string)`: Returns items, purchase date, sale status, defect flags.\n- `checkStock(sku: string, size: string)`: For exchange availability of JT007-L.\n- `initiateDefectiveItemProcess(orderId: string, sku: string, issue_description: string, photo_urls_array?)`.",
        icon: Wrench
      },
      {
        id: "cs-examples",
        type: "examples",
        title: "Examples: Handling Multi-Issue Inquiry",
        description: "Example Snippet of Expected Output (addressing one issue for brevity):\n\n\"I'm truly sorry to hear about the tear on your t-shirt (TS002-S) – that's definitely not the quality we aim for! For defective items like this, we can offer you a full refund or an exchange for a new one, and we'll cover all associated shipping costs. To proceed, could you please reply with a photo of the damage? You can also email it directly to returns@urbanthreads.com with your order number.\"",
        icon: Eye
      },
    ]
  },
  {
    id: "erp-comm-plan",
    name: "ERP: System Update Communication (Business)",
    icon: Users,
    availableComponents: [
      {
        id: "erp-comm-plan-system",
        type: "system",
        title: "System: AI ERP Change Management Communicator 'ERPUpdaterAI'",
        description: "You are 'ERPUpdaterAI', an AI specializing in drafting comprehensive communication plans for ERP system updates at 'InnovateGlobal Corp'. Your plans must be clear, cover all stakeholder groups (End-Users, Department Heads, IT Support, Executives), and outline pre-update, during-update, and post-update communication strategies. Focus on minimizing disruption and maximizing adoption. All communications should be formally addressed.",
        icon: Settings2
      },
      {
        id: "erp-comm-plan-user",
        type: "user",
        title: "User: Request for Comm Plan - New Finance Module Rollout",
        description: "InnovateGlobal Corp is rolling out a new 'Advanced Financial Analytics' module in our ERP system. This is a major enhancement. The rollout is scheduled for six weeks from now. The module primarily impacts the Finance department (approx. 50 users), but Executives (approx. 10 users) will use its reporting features. IT Support (5 users) needs to be prepared. Draft a multi-stage communication plan covering all stakeholder groups. Key module benefits: Real-time P&L dashboards, predictive cash flow forecasting, and customizable compliance reports. Mandatory training sessions will be held for Finance staff.",
        icon: Puzzle
      },
      {
        id: "erp-comm-plan-rag",
        type: "rag",
        title: "RAG: Company Comms Policy & ERP Module Details",
        description: "Contextual Data:\n- InnovateGlobal Communications Policy: Major system changes require minimum 4-week notification to Department Heads via email, followed by Intranet announcements. All-staff emails for critical updates must be approved by IT Director. Training announcements require 2-week notice.\n- 'Advanced Financial Analytics' Module: Version 3.0. Key features: Real-time P&L, cash flow projection (12-month rolling), predictive sales forecasting (using historical data), customizable compliance report templates (SOX, IFRS). Integration points: General Ledger, Sales Orders, Procurement. Expected learning curve for Finance users: 2-3 days with training.\n- Target Go-Live Date: [Assume a specific future date, e.g., Monday, October 28th, 2024].",
        icon: ListChecks
      },
      {
        id: "erp-comm-plan-constraints",
        type: "constraints",
        title: "Constraints: Plan Structure, Channels, & Key Elements",
        description: "Output Constraints:\n1. Structure the plan in distinct phases: Phase 1 (Initial Announcement & Awareness, 6-4 weeks out), Phase 2 (Detailed Info & Training Signup, 4-1 weeks out), Phase 3 (Go-Live Week Communications), Phase 4 (Post-Go-Live Support & Feedback, 1-4 weeks post-launch).\n2. For each phase, specify: Target Audience(s), Key Message(s) for each audience, Primary Communication Channel(s) (Email, Intranet, Meetings), Secondary Channel(s), Responsible Party (e.g., 'Project Team', 'IT Comms', 'Dept. Heads').\n3. Include at least one example subject line for a key email in each phase.\n4. The plan must detail how training will be communicated and managed.\n5. Address potential user concerns (e.g., impact on current workflows, data accuracy during transition).",
        icon: SlidersHorizontal
      },
      {
        id: "erp-comm-plan-guardrails",
        type: "guardrails",
        title: "Guardrails: Tone, Scope, & Approvals",
        description: "Guardrails:\n- Maintain a professional, confident, and supportive tone.\n- Avoid technical jargon in communications to non-technical audiences (Executives, general End-Users).\n- Explicitly mention the need for IT Director approval for all-staff emails.\n- Do not commit to specific training dates in the initial plan; state they will be 'announced separately' or 'coordinated with Department Heads'.\n- Do not over-promise on module benefits beyond what's stated and verifiable.",
        icon: ShieldCheck
      },
      {
        id: "erp-comm-plan-tools",
        type: "tools",
        title: "Tools: Conceptual - Calendar, Stakeholder DB",
        description: "Tool Hint (for AI internal process):\n- `getCompanyStakeholderList(department_array, role_array)`: To identify specific recipient groups.\n- `getProjectMilestoneDate(milestone_name: 'GoLive' | 'TrainingBlockStart')`: To fetch dynamic dates if available.\n- `generateCommunicationTemplate(type: 'email' | 'intranet_post', audience: string, key_message: string)`: Conceptual.",
        icon: Wrench
      },
      {
        id: "erp-comm-plan-examples",
        type: "examples",
        title: "Examples: Snippet of Phase 1 Email to Dept Heads",
        description: "Example of a Phase 1 Email Subject Line for Department Heads:\nSubject: IMPORTANT: Upcoming ERP Enhancement - New Advanced Financial Analytics Module for Your Teams\n\nExample Key Message for Executives (Phase 1):\n'A new Advanced Financial Analytics module is being introduced to provide enhanced real-time financial insights and forecasting capabilities, supporting strategic decision-making.'",
        icon: Eye
      },
    ]
  },
  {
    id: "erp-sales-summary-epicor",
    name: "ERP: Monthly Sales Summary (Epicor-Focused)",
    icon: Brain,
    availableComponents: [
      {
        id: "epicor-sales-system",
        type: "system",
        title: "System: AI Business Analyst for Epicor ERP",
        description: "You are 'AnalyticaAI', an expert AI business analyst specializing in interpreting and summarizing sales data from Epicor ERP systems. Your goal is to provide concise, actionable monthly sales performance summaries for sales managers. Focus on key trends, significant variances, and potential opportunities or concerns. Always use professional business language and structure your summary logically with clear headings for different sections (e.g., Overall Performance, Top Performing Products, Regional Analysis, Key Variances, Recommendations).",
        icon: Settings2
      },
      {
        id: "epicor-sales-user",
        type: "user",
        title: "User: Request for May Sales Summary",
        description: "Please generate the sales performance summary for May 2024. Focus on comparing May's performance against April 2024 and May 2023. Highlight any product categories or regions that showed exceptional growth or decline. I need this for our upcoming sales strategy meeting.",
        icon: Puzzle
      },
      {
        id: "epicor-sales-rag",
        type: "rag",
        title: "RAG: Epicor Sales Data Extract (May 2024)",
        description: "Context: Extracted Epicor Sales Data (May 2024)\n- Total Sales (May 2024): $1.25M (vs. Apr 2024: $1.1M, vs. May 2023: $1.05M)\n- Top Product Category (May 2024): 'Custom Machinery Parts' - $450K (Up 15% MoM, Up 20% YoY)\n- Lowest Product Category (May 2024): 'Standard Fittings' - $80K (Down 10% MoM, Down 5% YoY)\n- Regional Performance (North America): $600K (Up 8% MoM)\n- Regional Performance (Europe): $400K (Up 5% MoM)\n- Regional Performance (Asia-Pacific): $250K (Down 3% MoM - attributed to new competitor activity)\n- Key Customer Segment (Manufacturing): $900K (Up 12% MoM)\n- Average Deal Size: $15,500 (vs. $14,000 in April)\n- New Customer Acquisition: 25 (vs. 22 in April)",
        icon: ListChecks
      },
      {
        id: "epicor-sales-constraints",
        type: "constraints",
        title: "Constraints: Summary Format & Length",
        description: "Output Constraints:\n1. The summary must be a maximum of 300 words.\n2. Start with an executive summary (2-3 sentences).\n3. Use bullet points for specific metrics and comparisons.\n4. Include sections: Overall Performance, Product Category Highlights, Regional Analysis, Key Variances (vs. previous month & previous year), and 2-3 Actionable Recommendations.\n5. Quantify changes using percentages where possible.\n6. Do not include raw data tables in the summary; only the narrative and key figures.",
        icon: SlidersHorizontal
      },
      {
        id: "epicor-sales-guardrails",
        type: "guardrails",
        title: "Guardrails: Professional Tone & Data Integrity",
        description: "Guardrails:\n- Maintain an objective and data-driven tone.\n- Do not speculate beyond the provided data; if information is missing to make a full assessment, state it as a limitation or an area for further investigation.\n- Ensure all financial figures are presented clearly (e.g., using '$' and 'M' for millions, 'K' for thousands).\n- Avoid overly casual language or sales jargon not suitable for a management report.",
        icon: ShieldCheck
      },
      {
        id: "epicor-sales-tools",
        type: "tools",
        title: "Tools: Conceptual - Epicor Data Query & Charting",
        description: "Tool Hint (for AI internal process):\n- `queryEpicorSalesData(period: 'YYYY-MM', dimensions: string[], metrics: string[])`: Simulates fetching data directly from Epicor views or BAQs.\n- `calculateVariance(currentValue, previousValue, period_description)`: For MoM/YoY percentage changes.\n- `generateTrendChartURL(data_series, time_period, chart_type: 'bar' | 'line')`: Conceptual tool to link to a visual chart if the platform supported it.",
        icon: Wrench
      },
      {
        id: "epicor-sales-examples",
        type: "examples",
        title: "Examples: Snippet of Sales Summary Section",
        description: "Example Snippet (Product Category Highlights Section):\n\n'**Product Category Highlights:**\n*   *Custom Machinery Parts* continued its strong performance, with sales reaching $450K, a 15% increase month-over-month (MoM) and a 20% increase year-over-year (YoY), driven by strong demand in the OEM sector.\n*   Conversely, *Standard Fittings* saw a decline, with sales at $80K, down 10% MoM. This warrants further investigation into market factors or competitive pressures affecting this category.'\n",
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

      if (isSingletonType && alreadyExists) {
        toast({ variant: "destructive", title: "Component Limit", description: `Component of type "${originalComponent.type}" can only be added once.`});
        return; 
      }

      const newDroppedItemId = `${originalComponent.id}-${Date.now()}`;
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
      title="PromptCraft Workshop"
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
                        key={comp.id}
                        type={comp.type}
                        title={comp.title}
                        description={comp.description}
                        icon={comp.icon}
                        data-component-id={comp.id} 
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
                  {currentScenarioForIcon?.icon && <currentScenarioForIcon.icon className="inline-block mr-2" />}
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

