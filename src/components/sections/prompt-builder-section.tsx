
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard, type PromptComponentType } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Added Switch import
import { 
  Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Trash2, Loader2, Sparkles, Settings2,
  Dumbbell, ChefHat, MapPin, Gamepad2, Languages, Briefcase // Scenario specific icons
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, type DragEvent, useEffect, type ReactNode } from "react"; // Added ReactNode
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
    id: "personal-fitness-trainer",
    name: "Personal Fitness Trainer",
    icon: Dumbbell,
    availableComponents: [
      {
        id: "pft-system", type: "system", title: "System: Personal Fitness Coach",
        description: "You are an enthusiastic personal trainer AI who creates customized workout plans. Always maintain an encouraging, motivational tone.",
        icon: Settings2
      },
      {
        id: "pft-user", type: "user", title: "User: Weekly Workout Request",
        description: "Create a 4-day workout routine that I can do at home with minimal equipment.",
        icon: Puzzle
      },
      {
        id: "pft-rag", type: "rag", title: "RAG: User Profile Details (Optional)",
        description: "Context: User is a beginner, works from home, has 30-45 minutes available per session, owns resistance bands and dumbbells.",
        icon: ListChecks
      },
      {
        id: "pft-examples", type: "examples", title: "Examples: Sample Workout Format",
        description: 'Example Style: "Monday - Upper Body: 3 sets of push-ups (8-12 reps), 3 sets of dumbbell rows (10-15 reps)..." Keep it structured and time-efficient.',
        icon: Eye
      },
      {
        id: "pft-constraints", type: "constraints", title: "Constraints: Safety & Duration",
        description: "Keep workouts under 45 minutes. Include proper warm-up and cool-down. Emphasize correct form over intensity.",
        icon: SlidersHorizontal
      },
      {
        id: "pft-guardrails", type: "guardrails", title: "Guardrails: Health & Safety",
        description: "Never recommend exercises that could cause injury. Always suggest consulting a doctor before starting new routines.",
        icon: ShieldCheck
      },
    ]
  },
  {
    id: "creative-recipe-developer",
    name: "Creative Recipe Developer",
    icon: ChefHat,
    availableComponents: [
      {
        id: "crd-system", type: "system", title: "System: Culinary Creative Assistant",
        description: "You are a innovative chef AI who loves experimenting with fusion cuisines and creative ingredient combinations.",
        icon: Settings2
      },
      {
        id: "crd-user", type: "user", title: "User: Fusion Recipe Challenge",
        description: "Create a unique fusion recipe combining Italian and Asian flavors using chicken as the main protein.",
        icon: Puzzle
      },
      {
        id: "crd-rag", type: "rag", title: "RAG: Dietary Preferences (Optional)",
        description: "Context: User prefers moderate spice levels, has access to standard kitchen equipment, cooking for 2-4 people.",
        icon: ListChecks
      },
      {
        id: "crd-tools", type: "tools", title: "Tools: Nutrition Calculator & Recipe Scaler",
        description: "Tool Hint (for AI internal conceptualization):\n- calculateNutrition(ingredients, servings)\n- scaleRecipe(originalServings, targetServings)",
        icon: Wrench
      },
      {
        id: "crd-examples-structure", type: "examples", title: "Examples: Recipe Structure Style",
        description: 'Format Example: "Prep: 15 min | Cook: 25 min | Serves: 4" followed by ingredients list, then step-by-step instructions with cooking tips.',
        icon: Eye
      },
      {
        id: "crd-examples-sample", type: "examples", title: "Examples: Sample Recipe Format",
        description: 'Complete Recipe Example: "Asian-Italian Chicken Teriyaki Parmigiana: Chicken breast + teriyaki glaze + mozzarella + panko breadcrumbs. Cooking method: Pan-sear, then bake at 375°F for 20 minutes..."',
        icon: Eye
      },
      {
        id: "crd-constraints", type: "constraints", title: "Constraints: Time & Accessibility",
        description: "Recipes should take under 60 minutes total. Use ingredients available in most grocery stores.",
        icon: SlidersHorizontal
      },
      {
        id: "crd-guardrails", type: "guardrails", title: "Guardrails: Food Safety",
        description: "Always include proper cooking temperatures and food safety guidelines. Warn about common allergens.",
        icon: ShieldCheck
      },
    ]
  },
  {
    id: "travel-adventure-planner",
    name: "Travel Adventure Planner",
    icon: MapPin,
    availableComponents: [
      {
        id: "tap-system", type: "system", title: "System: Adventure Travel Expert",
        description: "You are an experienced travel guide specializing in off-the-beaten-path destinations and unique cultural experiences.",
        icon: Settings2
      },
      {
        id: "tap-user", type: "user", title: "User: Weekend Adventure Request",
        description: "Plan a weekend adventure trip within 200 miles of Chicago that includes outdoor activities and local culture.",
        icon: Puzzle
      },
      {
        id: "tap-rag", type: "rag", title: "RAG: Travel Preferences (Optional)",
        description: "Context: Mid-level hiking experience, interested in photography, budget-conscious, has a car, prefers small towns over cities.",
        icon: ListChecks
      },
      {
        id: "tap-examples", type: "examples", title: "Examples: Itinerary Format",
        description: 'Sample Day: "Saturday 9 AM - Starved Rock State Park (hiking trail), 1 PM - Local farm-to-table lunch, 4 PM - Historic downtown exploration"',
        icon: Eye
      },
      {
        id: "tap-constraints", type: "constraints", title: "Constraints: Budget & Distance",
        description: "Stay within 200-mile radius. Keep total cost under $300 for two people. Focus on weekend-friendly timing.",
        icon: SlidersHorizontal
      },
      {
        id: "tap-guardrails", type: "guardrails", title: "Guardrails: Safety & Responsibility",
        description: "Include weather considerations and safety tips. Respect local communities and environmental guidelines.",
        icon: ShieldCheck
      },
    ]
  },
  {
    id: "game-master-storyteller",
    name: "Game Master Storyteller",
    icon: Gamepad2,
    availableComponents: [
      {
        id: "gms-system", type: "system", title: "System: Interactive Story Game Master",
        description: "You are a creative dungeon master who crafts engaging interactive fantasy adventures with meaningful choices and consequences.",
        icon: Settings2
      },
      {
        id: "gms-user", type: "user", title: "User: Fantasy Adventure Start",
        description: "Begin a fantasy adventure where I'm a merchant who discovers a mysterious map in my grandfather's attic.",
        icon: Puzzle
      },
      {
        id: "gms-rag", type: "rag", title: "RAG: Player Preferences (Optional)",
        description: "Context: Enjoys puzzle-solving over combat, prefers medieval fantasy settings, likes character development and moral dilemmas.",
        icon: ListChecks
      },
      {
        id: "gms-examples", type: "examples", title: "Examples: Story Interaction Style",
        description: 'Choice Format: Present 3-4 meaningful options at story decision points: "A) Examine the map more closely, B) Search for more hidden items, C) Research the map\'s symbols"',
        icon: Eye
      },
      {
        id: "gms-constraints", type: "constraints", title: "Constraints: Pacing & Engagement",
        description: "Keep story segments to 3-4 paragraphs. Always end with a clear choice or action prompt. Maintain family-friendly content.",
        icon: SlidersHorizontal
      },
      {
        id: "gms-guardrails", type: "guardrails", title: "Guardrails: Content Appropriateness",
        description: "Avoid graphic violence or inappropriate content. Focus on adventure, mystery, and character growth.",
        icon: ShieldCheck
      },
    ]
  },
  {
    id: "language-learning-companion",
    name: "Language Learning Companion",
    icon: Languages,
    availableComponents: [
      {
        id: "llc-system", type: "system", title: "System: Friendly Language Tutor",
        description: "You are a patient, encouraging language teacher who makes learning fun through practical conversations and cultural insights.",
        icon: Settings2
      },
      {
        id: "llc-user", type: "user", title: "User: Spanish Conversation Practice",
        description: "Help me practice ordering food at a Spanish restaurant. I'm at beginner level but want to sound natural.",
        icon: Puzzle
      },
      {
        id: "llc-rag", type: "rag", title: "RAG: Learning Progress (Optional)",
        description: "Context: Knows basic greetings and numbers, struggles with verb conjugations, learns best through repetition and real-world scenarios.",
        icon: ListChecks
      },
      {
        id: "llc-examples", type: "examples", title: "Examples: Conversation Structure",
        description: "Practice Format: Present the Spanish phrase, provide pronunciation guide (phonetic), explain cultural context, then practice variations.",
        icon: Eye
      },
      {
        id: "llc-constraints", type: "constraints", title: "Constraints: Level Appropriateness",
        description: "Use beginner-friendly vocabulary. Provide pronunciation help. Focus on practical, commonly-used phrases.",
        icon: SlidersHorizontal
      },
      {
        id: "llc-guardrails", type: "guardrails", title: "Guardrails: Cultural Sensitivity",
        description: "Ensure cultural accuracy and respect. Avoid stereotypes. Focus on authentic, practical language use.",
        icon: ShieldCheck
      },
    ]
  },
  {
    id: "epicor-erp-consultant",
    name: "Epicor ERP Implementation Consultant",
    icon: Briefcase,
    availableComponents: [
      {
        id: "erp-system", type: "system", title: "System: Senior Epicor ERP Consultant",
        description: "You are an experienced Epicor ERP implementation specialist with 15+ years in manufacturing and supply chain optimization.",
        icon: Settings2
      },
      {
        id: "erp-user", type: "user", title: "User: Production Planning Setup Query",
        description: "Walk me through setting up finite capacity scheduling in Epicor for our sheet metal fabrication shop with 12 work centers.",
        icon: Puzzle
      },
      {
        id: "erp-rag", type: "rag", title: "RAG: Company Operations Data (Optional)",
        description: "Context: 150-employee shop, mix of custom and repeat orders, current lead times 2-3 weeks, using Epicor 10.2.700, struggling with accurate delivery dates.",
        icon: ListChecks
      },
      {
        id: "erp-tools", type: "tools", title: "Tools: Epicor Data Query & Configuration Helper",
        description: "Tool Hint (for AI internal conceptualization):\n- queryEpiCorWorkCenters()\n- validateCapacitySettings()\n- generateImplementationChecklist()",
        icon: Wrench
      },
      {
        id: "erp-examples-steps", type: "examples", title: "Examples: Configuration Steps Format",
        description: 'Step Example: "Navigate to Production Management > Capacity Planning > Resource Groups. Define each work center with: 1) Daily capacity hours, 2) Efficiency factors, 3) Queue time parameters"',
        icon: Eye
      },
      {
        id: "erp-examples-walkthrough", type: "examples", title: "Examples: Capacity Planning Walkthrough",
        description: 'Complete Setup Example: "Work Center WC001-Laser Cutting: Daily Hours=16, Efficiency=85%, Queue Time=4hrs, Setup Time=30min. Then configure finite scheduling parameters in Global Scheduling Workbench..."',
        icon: Eye
      },
      {
        id: "erp-constraints", type: "constraints", title: "Constraints: Version & Practicality",
        description: "Focus on Epicor 10.2.x functionality. Provide actionable steps that can be implemented within 2-3 weeks. Consider typical fabrication shop workflows.",
        icon: SlidersHorizontal
      },
      {
        id: "erp-guardrails", type: "guardrails", title: "Guardrails: Data Security & Compliance",
        description: "Never request sensitive company data. Emphasize proper backup procedures before configuration changes. Follow Epicor best practices for system modifications.",
        icon: ShieldCheck
      },
    ]
  }
];


interface DroppedItem extends AvailableComponent {}

const PLACEHOLDER_PROMPT_TEXT = "Your assembled prompt will appear here... Drag components from the left to build it!";

// Basic Markdown Preview Component (simplified)
function BasicMarkdownPreview({ markdown }: { markdown: string | null }) {
  if (!markdown) return null;

  const elements: ReactNode[] = [];
  const lines = markdown.split('\n');

  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let listItems: JSX.Element[] = [];

  const formatInline = (text: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    // Regex for **bold** or __bold__ and *italic* or _italic_
    // It's a simplified regex, might not cover all edge cases like nested styles perfectly.
    const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
    let match;
    let count = 0;
    while ((match = regex.exec(text)) !== null) {
      if (lastIndex < match.index) {
        parts.push(text.substring(lastIndex, match.index));
      }
      if (match[1]) { // Bold
        parts.push(<strong key={`${keyPrefix}-strong-${count++}`}>{match[2]}</strong>);
      } else if (match[3]) { // Italic
        // Avoid matching internal underscores in words by checking surrounding characters or simple length.
        // This is a very basic check; a real parser would be more robust.
        if (match[4].length > 0 && (!match[4].includes(' ') || match[4].trim() === match[4])) {
             parts.push(<em key={`${keyPrefix}-italic-${count++}`}>{match[4]}</em>);
        } else {
            parts.push(match[0]); // Not valid italic, push original
        }
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };
  
  const flushList = (keySuffix: string) => {
    if (listItems.length > 0 && listType) {
      if (listType === 'ul') {
        elements.push(<ul key={`ul-${keySuffix}`} className="list-disc pl-6 my-2 space-y-1">{listItems}</ul>);
      } else {
        elements.push(<ol key={`ol-${keySuffix}`} className="list-decimal pl-6 my-2 space-y-1">{listItems}</ol>);
      }
    }
    listItems = [];
    inList = false;
    listType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineKey = `line-${i}`;

    if (line.startsWith('### ')) {
      flushList(`${lineKey}-prev`);
      elements.push(<h3 key={lineKey} className="text-xl font-semibold mt-3 mb-1">{formatInline(line.substring(4), lineKey)}</h3>);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList(`${lineKey}-prev`);
      elements.push(<h2 key={lineKey} className="text-2xl font-semibold mt-4 mb-2">{formatInline(line.substring(3), lineKey)}</h2>);
      continue;
    }
    if (line.startsWith('# ')) {
      flushList(`${lineKey}-prev`);
      elements.push(<h1 key={lineKey} className="text-3xl font-semibold mt-5 mb-3">{formatInline(line.substring(2), lineKey)}</h1>);
      continue;
    }
    if (line.match(/^(\-\-\-|\*\*\*|___)\s*$/)) {
      flushList(`${lineKey}-prev`);
      elements.push(<hr key={lineKey} className="my-4 border-border" />);
      continue;
    }

    const ulMatch = line.match(/^(\*|-|\+)\s+(.*)/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList(`${lineKey}-prev-ul`);
        inList = true;
        listType = 'ul';
      }
      listItems.push(<li key={`${lineKey}-li`}>{formatInline(ulMatch[2], `${lineKey}-li-text`)}</li>);
      if (i === lines.length - 1) flushList(`${lineKey}-last`); // Flush if last line is a list item
      continue;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList(`${lineKey}-prev-ol`);
        inList = true;
        listType = 'ol';
      }
      listItems.push(<li key={`${lineKey}-li`}>{formatInline(olMatch[2], `${lineKey}-li-text`)}</li>);
      if (i === lines.length - 1) flushList(`${lineKey}-last`); // Flush if last line is a list item
      continue;
    }
    
    flushList(`${lineKey}-prev-p`); // End any list if current line is not a list item
    if (line.trim() !== '') {
      elements.push(<p key={lineKey} className="my-2">{formatInline(line, lineKey)}</p>);
    } else if (elements.length > 0 && !elements[elements.length -1]?.key?.toString().includes('-br-')) {
      // Add a visual break for empty lines if the previous wasn't already a break
      elements.push(<br key={`${lineKey}-br-${i}`} />);
    }
  }
  flushList(`final`); // Final flush for any remaining list items

  // Using basic Tailwind classes for styling instead of prose
  return <div className="text-foreground/90 p-1">{elements}</div>;
}


export function PromptBuilderSection() {
  const [currentScenarioId, setCurrentScenarioId] = useState<string>(scenarios[0].id);
  const [currentAvailableComponents, setCurrentAvailableComponents] = useState<AvailableComponent[]>(scenarios[0].availableComponents);

  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [draggedOver, setDraggedOver] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false); // State for Markdown preview
  const { toast } = useToast();

  useEffect(() => {
    const selectedScenario = scenarios.find(s => s.id === currentScenarioId);
    if (selectedScenario) {
      setCurrentAvailableComponents(selectedScenario.availableComponents);
      setDroppedItems([]); 
      setAiResponse(null);
      setIsPreviewMode(false); // Reset preview mode on scenario change
    }
  }, [currentScenarioId]);

  const livePreviewText = droppedItems.length > 0
    ? droppedItems.map(item => `## ${item.title} (Type: ${item.type.toUpperCase()})\n${item.description}\n\n---\n`).join('\n')
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
         toast({ variant: "destructive", title: "Component Limit", description: `A component of type "${originalComponent.type.toUpperCase()}" already exists. Only one of each is allowed.`});
        return;
      }
      
      const newDroppedItemId = isSingletonType ? originalComponent.id : `${originalComponent.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
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
    setIsPreviewMode(false); // Default to raw view for new responses
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
              <div className="flex justify-between items-center">
                <GlassCardTitle className="text-neon-yellow flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" /> AI Response
                </GlassCardTitle>
                {aiResponse && !generateResponseMutation.isPending && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="markdown-preview-switch" className="text-sm text-neon-yellow/80">Raw</Label>
                    <Switch
                      id="markdown-preview-switch"
                      checked={isPreviewMode}
                      onCheckedChange={setIsPreviewMode}
                      disabled={!aiResponse || generateResponseMutation.isPending}
                    />
                    <Label htmlFor="markdown-preview-switch" className="text-sm text-neon-yellow/80">Preview</Label>
                  </div>
                )}
              </div>
            </GlassCardHeader>
            <GlassCardContent>
            {generateResponseMutation.isPending && !aiResponse ? (
                <div className="flex items-center justify-center p-8 min-h-[256px] bg-background/30 rounded-md border border-neon-yellow/50">
                  <Loader2 className="h-8 w-8 animate-spin text-neon-yellow" />
                  <p className="ml-3 text-foreground/80">Generating response...</p>
                </div>
            ) : isPreviewMode && aiResponse ? (
                <div className="h-auto min-h-[256px] max-h-[500px] overflow-y-auto bg-background/30 text-foreground/90 resize-none !p-4 !border-neon-yellow/50 custom-scrollbar rounded-md border">
                  <BasicMarkdownPreview markdown={aiResponse} />
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

    