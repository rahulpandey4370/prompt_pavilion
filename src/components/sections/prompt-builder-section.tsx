
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard, type PromptComponentType } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Trash2, Loader2, Sparkles, BookHeart, MessagesSquare, UtensilsCrossed } from "lucide-react";
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
  id: string; // Unique ID for each component within a scenario
}

interface Scenario {
  id: string;
  name: string;
  availableComponents: AvailableComponent[];
}

const scenarios: Scenario[] = [
  {
    id: "creative-writing-sf",
    name: "Creative Writing: Sci-Fi",
    availableComponents: [
      {
        id: "sf-system",
        type: "system",
        title: "System: AI Sci-Fi World Builder",
        description: "You are 'CosmoChronicler', an AI specializing in generating vivid science fiction settings, alien species, and futuristic technologies. Your tone is imaginative and detailed, inspiring authors with unique concepts. You excel at creating plausible yet fantastical elements. When asked for multiple items, provide them as a numbered list using Markdown.",
        icon: BookHeart
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
    name: "Customer Support: E-commerce",
    availableComponents: [
      {
        id: "cs-system",
        type: "system",
        title: "System: AI E-commerce Assistant",
        description: "You are 'AssistBot', a friendly and efficient AI customer support agent for 'UrbanThreads.com', an online fashion retailer. Your primary goal is to resolve customer queries regarding orders, returns, and product information. Maintain a polite, empathetic, and helpful tone. Always thank the customer for their patience or for reaching out.",
        icon: MessagesSquare
      },
      {
        id: "cs-user",
        type: "user",
        title: "User: Inquiry about Return Policy",
        description: "Hi, I received my order #ORD123456 yesterday, but the jacket (SKU: JT007-M) doesn't fit. I'd like to know how I can return it and if I can get a refund or an exchange for a different size.",
        icon: Puzzle
      },
      {
        id: "cs-rag",
        type: "rag",
        title: "RAG: UrbanThreads Return Policy Snippet",
        description: "Context: UrbanThreads Return Policy (Excerpt)\n- Returns accepted within 30 days of delivery.\n- Items must be unworn, unwashed, with original tags attached.\n- Refunds issued to original payment method within 5-7 business days after receiving return.\n- Exchanges processed upon availability; customer covers return shipping for exchanges, UrbanThreads covers shipping of new item.\n- Final sale items are non-refundable.\n- Full policy: [urbanthreads.com/returns](https://urbanthreads.com/returns)",
        icon: ListChecks
      },
      {
        id: "cs-constraints",
        type: "constraints",
        title: "Constraints: Information & Action Limits",
        description: "Output Constraints:\n1. Clearly state the return window and conditions.\n2. Explain options for refund and exchange.\n3. Provide a direct link to the full return policy page.\n4. Do not ask for sensitive personal information (e.g., credit card details) in the chat.\n5. If an item is final sale (check against order details if possible via tool), state that clearly and politely.",
        icon: SlidersHorizontal
      },
      {
        id: "cs-guardrails",
        type: "guardrails",
        title: "Guardrails: Tone & Scope",
        description: "Guardrails:\n- Do not make promises outside of the stated policy.\n- Avoid accusatory language if a customer is frustrated.\n- Do not attempt to process the return/exchange directly; guide the user to the self-service portal or next steps.\n- Do not provide fashion advice unless explicitly asked and relevant.",
        icon: ShieldCheck
      },
      {
        id: "cs-tools",
        type: "tools",
        title: "Tools: Order & Policy Lookup",
        description: "Tool Hint (for AI internal process):\n- `getOrderDetails(orderId: string)`: Returns items, purchase date, sale status.\n- `getPolicySection(topic: 'returns' | 'shipping' | 'payment')`: Fetches relevant policy text.\n- `checkStock(sku: string, size: string)`: For exchange availability.",
        icon: Wrench
      },
      {
        id: "cs-examples",
        type: "examples",
        title: "Examples: Return Inquiry Response",
        description: "Example of Expected Output:\n\n\"Thank you for reaching out about order #ORD123456, and I'm sorry to hear the jacket didn't fit! You can certainly return it. Our policy allows returns within 30 days of delivery, provided the item is unworn, unwashed, and has original tags.\n\nFor jacket JT007-M, you have two options:\n1.  **Refund:** We can refund the purchase price to your original payment method once we receive the item back.\n2.  **Exchange:** If you'd like a different size, we can process an exchange, subject to availability. You would cover the return shipping, and we'd ship the new size to you at no extra shipping cost.\n\nYou can find more details and initiate a return via our portal here: [urbanthreads.com/returns](https://urbanthreads.com/returns). Please let me know if you have any other questions!\"",
        icon: Eye
      },
    ]
  },
  {
    id: "recipe-generator-healthy",
    name: "Recipe Generator: Healthy Meals",
    availableComponents: [
      {
        id: "rg-system",
        type: "system",
        title: "System: AI Nutritionist & Chef 'NutriChef'",
        description: "You are 'NutriChef', an AI culinary expert specializing in generating healthy, delicious, and easy-to-follow recipes. You prioritize whole foods, balanced macronutrients, and clear instructions. Your tone is encouraging, informative, and creative. You adapt to dietary restrictions and preferences.",
        icon: UtensilsCrossed
      },
      {
        id: "rg-user",
        type: "user",
        title: "User: Request for Quick Vegan Dinner",
        description: "I need a healthy vegan dinner recipe for two people. It should be low-carb and ready in under 30 minutes. I have bell peppers, tofu, and spinach on hand. I'm open to other common pantry staples. I'd prefer something savory.",
        icon: Puzzle
      },
      {
        id: "rg-rag",
        type: "rag",
        title: "RAG: Low-Carb Vegan Ingredients & Techniques",
        description: "Contextual Data:\n- Low-Carb Vegan Proteins: Tofu, tempeh, seitan (check carb content), edamame, protein powders.\n- Low-Carb Vegetables: Leafy greens (spinach, kale), bell peppers, broccoli, cauliflower, zucchini, mushrooms, asparagus.\n- Healthy Fats: Avocado, nuts, seeds, olive oil, coconut oil.\n- Flavor Enhancers: Herbs, spices, nutritional yeast, tamari/soy sauce, lemon juice, garlic, onion.\n- Quick Cooking Methods: Stir-frying, pan-searing, quick roasting (thinly sliced veggies).",
        icon: ListChecks
      },
      {
        id: "rg-constraints",
        type: "constraints",
        title: "Constraints: Recipe Format & Details",
        description: "Output Constraints:\n1. Recipe title must be appealing.\n2. List ingredients clearly with quantities for 2 servings.\n3. Provide step-by-step instructions.\n4. Include estimated prep time and cook time (total under 30 mins).\n5. Optionally, provide a rough calorie/macro estimate per serving if calculable.\n6. Ensure the recipe uses the user-specified ingredients (bell peppers, tofu, spinach).",
        icon: SlidersHorizontal
      },
      {
        id: "rg-guardrails",
        type: "guardrails",
        title: "Guardrails: Health & Safety",
        description: "Guardrails:\n- Do not suggest ingredients known as common severe allergens without noting alternatives (e.g., peanuts, soy if user has specified allergy).\n- Avoid promoting extreme or fad diets; focus on balanced, sustainable healthy eating.\n- Ensure cooking instructions are safe (e.g., warnings about hot oil).\n- Do not make unsubstantiated health claims.",
        icon: ShieldCheck
      },
      {
        id: "rg-tools",
        type: "tools",
        title: "Tools: Nutritional Info & Substitutions",
        description: "Tool Hint (for AI internal process):\n- `calculateNutritionalInfo(ingredient_list, serving_size)`: Provides calorie and macronutrient estimates.\n- `findIngredientSubstitute(original_ingredient, dietary_restriction, category='vegetable'|'protein')`.\n- `checkPantryStaples(ingredient_name)`: Verifies if an ingredient is a common pantry item.",
        icon: Wrench
      },
      {
        id: "rg-examples",
        type: "examples",
        title: "Examples: Recipe Output Snippet",
        description: "Example of Expected Output:\n\n**Quick Tofu & Bell Pepper Stir-fry with Spinach**\n\nServes: 2 | Prep time: 10 mins | Cook time: 15 mins\n\n**Ingredients:**\n*   1 block (14oz) firm tofu, pressed and cubed\n*   2 bell peppers (any color), sliced\n*   4 cups fresh spinach\n*   2 cloves garlic, minced\n*   1 tbsp soy sauce (or tamari for gluten-free)\n*   1 tsp sesame oil\n*   1 tbsp olive oil\n*   Optional: Red pepper flakes to taste, sesame seeds for garnish\n\n**Instructions:**\n1.  Heat olive oil in a large skillet or wok over medium-high heat.\n2.  Add tofu cubes and cook until golden brown on all sides (about 5-7 minutes). Remove and set aside.\n3.  Add bell peppers to the skillet, cook for 3-4 minutes until slightly tender-crisp.\n4.  Add minced garlic and cook for another minute until fragrant.\n5.  Return tofu to the skillet. Add spinach, soy sauce, and sesame oil. Stir until spinach is wilted (about 2-3 minutes).\n6.  Serve immediately, garnished with red pepper flakes and sesame seeds if desired.",
        icon: Eye
      },
    ]
  }
];


interface DroppedItem extends AvailableComponent {
  // id is already in AvailableComponent, but if we needed a truly unique ID for the dropped instance:
  // droppedId: string; 
}

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
      // Reset workspace when scenario changes
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
    const componentIdToDrop = event.dataTransfer.getData("promptComponentId");
    
    const originalComponent = currentAvailableComponents.find(c => c.id === componentIdToDrop);

    if (originalComponent) {
      const isSingletonType = originalComponent.type === 'system' || originalComponent.type === 'user';
      const alreadyExists = isSingletonType && droppedItems.some(item => item.type === originalComponent.type);

      if (isSingletonType && alreadyExists) {
        toast({ variant: "destructive", title: "Component Limit", description: `Component of type "${originalComponent.type}" can only be added once.`});
        return; 
      }
      // Add the full component object, which now includes its unique ID from the scenario
      setDroppedItems(prev => [...prev, { ...originalComponent }]);
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

  return (
    <SectionContainer
      id="workshop"
      title="PromptCraft Workshop"
      subtitle="Select a scenario, then assemble your AI prompts like building blocks. Drag pre-filled components from the left to the assembly area below."
      className="bg-background"
    >
      <div className="grid lg:grid-cols-3 gap-8 min-h-[70vh]">
        {/* Component Library Sidebar */}
        <GlassCard className="lg:col-span-1 h-full flex flex-col">
          <GlassCardHeader>
            <div className="flex flex-col space-y-3">
                <GlassCardTitle className="text-accent flex items-center">
                <Wand2 className="inline-block mr-2" />
                Prompt Component Examples
                </GlassCardTitle>
                <div>
                    <Label htmlFor="scenario-select" className="text-sm font-medium text-primary mb-1">Select Scenario:</Label>
                    <Select value={currentScenarioId} onValueChange={handleScenarioChange}>
                        <SelectTrigger id="scenario-select" className="w-full bg-foreground/5 border-border focus:ring-accent">
                            <SelectValue placeholder="Select a scenario" />
                        </SelectTrigger>
                        <SelectContent>
                            {scenarios.map(scenario => (
                            <SelectItem key={scenario.id} value={scenario.id}>
                                {scenario.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </GlassCardHeader>
          <GlassCardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-3">
                {currentAvailableComponents.map((comp) => (
                  <PromptComponentCard
                    key={comp.id} // Use unique component ID for key
                    type={comp.type}
                    title={comp.title}
                    description={comp.description}
                    icon={comp.icon}
                    // Pass comp.id in drag data
                    data-component-id={comp.id} 
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
                droppedItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="relative group"> 
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
                      onClick={() => handleRemoveItem(item.id)} // Pass component ID to remove
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
        <GlassCard className="mt-8 w-full">
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
