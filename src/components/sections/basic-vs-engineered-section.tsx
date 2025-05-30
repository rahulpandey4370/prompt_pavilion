
"use client";

import { SectionContainer as BasicVsEngineeredSectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { liveAIResponseDemo, type LiveAIResponseDemoInput }  from "@/ai/flows/live-ai-response-demo";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2, Lightbulb, UtensilsCrossed, BookOpen, Bot, FileText, BarChartBig, HelpCircle } from "lucide-react";

interface PlaygroundScenario {
  id: string;
  name: string;
  icon: LucideIcon;
  userInput: string;
  engineeredSystemPrompt: string;
}

const playgroundScenarios: PlaygroundScenario[] = [
  {
    id: "study-buddy",
    name: "Study Buddy - History",
    icon: BookOpen,
    userInput: "Tell me about World War 2.",
    engineeredSystemPrompt: `System: You are an expert history tutor AI for high school students. Your primary function is to provide structured summaries of historical events.
When asked about a broad topic like 'World War 2', you MUST structure your response as follows:
1.  **Overview (Paragraph):** A summary of the event, including start and end dates.
2.  **Key Causes (Bulleted list, provide key points):** The primary reasons the event occurred.
3.  **Major Theaters/Fronts (Bulleted list, provide key points):** Main geographical areas of conflict.
4.  **Primary Outcome (Sentence):** The most important consequence.`,
  },
  {
    id: "restaurant-assistant",
    name: "Restaurant Assistant",
    icon: UtensilsCrossed,
    userInput: "Suggest a good Italian restaurant nearby.",
    engineeredSystemPrompt: `System: You are 'LocalEats AI', a helpful guide for restaurant recommendations. Your primary goal is to provide specific, actionable, and highly relevant suggestions based on all stated criteria.
If the user's request is too vague to provide concrete suggestions (missing critical details like exact current city/neighborhood, budget range, or specific occasion), your FIRST response MUST be to politely ask for these missing details.
Once sufficient details are provided (either initially or after your clarifying questions), you must then provide 2-3 distinct restaurant suggestions. For each restaurant, include: Name, a brief description (1-2 sentences), and specifically how it meets the user's stated preferences (e.g., Cuisine, Location, Occasion, Time, Dietary Needs, Quality, Budget if provided by user). Present the suggestions in a numbered list.`
  },
  {
    id: "code-explainer",
    name: "Code Explainer - Python",
    icon: Bot,
    userInput: "What does this Python code do: `print('Hello')`?",
    engineeredSystemPrompt: `System: You are an expert Python programming assistant AI. Your main function is to provide clear, line-by-line explanations for Python code snippets.
For any code provided by the user, you MUST:
1.  Analyze the code thoroughly.
2.  Explain its overall purpose and what each significant line or block of code does.
3.  State the expected output if the code were to be run.
4.  Offer any relevant notes, alternative approaches, or best practices suitable for beginner to intermediate developers.
Use the following strict Markdown format for your response:
### Code Snippet
\`\`\`python
# [User's code will be here]
\`\`\`
### Explanation
- [Detailed line-by-line explanation]
- [Overall purpose of the snippet]
### Expected Output
\`\`\`
# [Exact output if run]
\`\`\`
### Notes / Best Practices
- [Relevant notes, alternatives, or best practices]`
  },
  {
    id: "erp-feature-explanation",
    name: "ERP Module Feature Explanation",
    icon: FileText,
    userInput: "Explain the inventory management module.",
    engineeredSystemPrompt: `System: You are 'InnovateERP Helper', an AI training assistant for a comprehensive ERP system. Your role is to explain ERP module features to new users who may not be familiar with ERP jargon. Use simple language and provide a tangible real-world benefit for each feature mentioned.
When a user asks to "Explain the inventory management module", you MUST:
1.  Provide a concise (1-2 sentences) overview of the Inventory Management module's purpose.
2.  Then, explain the following key functionalities in detail:
    a.  Real-time Stock Level Tracking
    b.  Automated Reorder Point (ROP) Calculations
    c.  Batch and Serial Number Traceability
    d.  Kitting and Assembly Management
3.  For each of these four functionalities, clearly state:
    i.  What it is (1-2 sentences).
    ii. Its primary benefit for warehouse operations or business efficiency.
4.  Structure your entire response using Markdown, with each of the four functionalities under its own H3 heading. Do not ask clarifying questions for this specific request; proceed with the detailed explanation of these four features.`
  },
];

export function BasicVsEngineeredSection() {
  const { toast } = useToast();
  const defaultScenario = playgroundScenarios.find(s => s.id === "study-buddy") || playgroundScenarios[0];
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(defaultScenario.id);

  const currentScenario = playgroundScenarios.find(s => s.id === selectedScenarioId) || defaultScenario;

  const [basicPromptText, setBasicPromptText] = useState(currentScenario.userInput);
  const [fullEngineeredPromptText, setFullEngineeredPromptText] = useState(
    `${currentScenario.engineeredSystemPrompt}\n\nUser: ${currentScenario.userInput}`
  );

  const [basicResponse, setBasicResponse] = useState("");
  const [engineeredResponse, setEngineeredResponse] = useState("");

  useEffect(() => {
    const scenario = playgroundScenarios.find(s => s.id === selectedScenarioId);
    if (scenario) {
      setBasicPromptText(scenario.userInput);
      setFullEngineeredPromptText(`${scenario.engineeredSystemPrompt}\n\nUser: ${scenario.userInput}`);
      setBasicResponse("");
      setEngineeredResponse("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenarioId]);

  const mutation = useMutation({
    mutationFn: (data: LiveAIResponseDemoInput) => liveAIResponseDemo(data),
    onSuccess: (data) => {
      if (data && data.basicResponse && data.engineeredResponse) {
        setBasicResponse(data.basicResponse);
        setEngineeredResponse(data.engineeredResponse);
        toast({ title: "AI Responses Ready!", description: "Comparison loaded." });
      } else {
        setBasicResponse(data.basicResponse || "AI did not return a valid basic response.");
        setEngineeredResponse(data.engineeredResponse || "AI did not return a valid engineered response.");
        toast({ variant: "destructive", title: "Response Error", description: "One or both AI responses were incomplete." });
      }
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
      setBasicResponse(`Error: ${error.message}`);
      setEngineeredResponse(`Error: ${error.message}`);
    }
  });

  const handleCompare = () => {
    if (!basicPromptText.trim() || !fullEngineeredPromptText.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Basic prompt and engineered prompt must be available." });
      return;
    }
    mutation.mutate({ basicUserInput: basicPromptText, fullEngineeredPrompt: fullEngineeredPromptText });
  };

  const CurrentDisplayIcon = currentScenario.icon || HelpCircle;

  const basicResponseQuality = basicResponse ? Math.min(100, (basicResponse.length / 200) * 40 + 10) : 10;
  const engineeredResponseQuality = engineeredResponse ? Math.min(100, (engineeredResponse.length / 500) * 80 + 20) : 85;


  return (
    <BasicVsEngineeredSectionContainer
      id="comparison"
      title="Basic vs. Engineered: A Live Comparison"
      subtitle="See the difference! Compare AI responses from basic vs. engineered prompts in real-time."
      isContainedCard={true}
      className="!py-12 md:!py-16"
    >
      <div className="bg-card p-0.5 yellow-glowing-box rounded-lg">
        <div className="bg-card rounded-md p-6 space-y-6">
          <GlassCard className="h-full !p-0 !shadow-none !border-none !bg-transparent">
            <GlassCardHeader className="pt-0 px-0">
              <GlassCardTitle className="text-neon-yellow flex items-center text-xl md:text-2xl">
                <CurrentDisplayIcon className="inline-block mr-3 h-6 w-6" />
                Scenario: {currentScenario.name}
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-6 px-0 pb-0">
              <div>
                <label htmlFor="scenario-select-comparison" className="block text-sm font-medium text-neon-yellow mb-1">Select Scenario:</label>
                <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                  <SelectTrigger id="scenario-select-comparison" className="w-full md:w-1/2 bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground">
                    <SelectValue placeholder="Choose a scenario" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-neon-yellow text-foreground">
                    {playgroundScenarios.map(scenario => (
                      <SelectItem key={scenario.id} value={scenario.id} className="focus:bg-neon-yellow/20">
                        <div className="flex items-center">
                          <scenario.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {scenario.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="basicPrompt" className="block text-sm font-medium text-neon-yellow mb-1">Basic Prompt</label>
                  <Textarea
                    id="basicPrompt"
                    value={basicPromptText}
                    onChange={(e) => setBasicPromptText(e.target.value)}
                    placeholder="Enter your basic query here..."
                    rows={18}
                    className="bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground/90 custom-scrollbar"
                  />
                </div>
                <div>
                  <label htmlFor="engineeredPromptFull" className="block text-sm font-medium text-neon-yellow mb-1">Engineered Prompt</label>
                  <Textarea
                    id="engineeredPromptFull"
                    value={fullEngineeredPromptText}
                    onChange={(e) => setFullEngineeredPromptText(e.target.value)}
                    placeholder="Compose your full engineered prompt here..."
                    rows={18}
                    className="bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground/90 custom-scrollbar"
                  />
                </div>
              </div>

              <div className="text-center">
                <Button onClick={handleCompare} disabled={mutation.isPending} className="bg-neon-yellow hover:bg-neon-yellow/90 text-neon-yellow-foreground px-6 py-3 text-base">
                  {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />} Compare AI Responses
                </Button>
              </div>

              {(mutation.isSuccess || mutation.isError || basicResponse || engineeredResponse) && (
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Basic Prompt Response</label>
                    <Textarea
                      readOnly
                      value={basicResponse}
                      className="h-56 bg-card/50 border-0 resize-none text-foreground/90 custom-scrollbar"
                      placeholder="AI response to basic prompt..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Engineered Prompt Response</label>
                    <Textarea
                      readOnly
                      value={engineeredResponse}
                      className="h-56 bg-card/50 border-0 resize-none text-foreground/90 custom-scrollbar"
                      placeholder="AI response to engineered prompt..."
                    />
                  </div>
                </div>
              )}

              {(mutation.isSuccess || mutation.isError || basicResponse || engineeredResponse) && (
                <GlassCard className="mt-8">
                    <GlassCardHeader>
                        <GlassCardTitle className="text-neon-yellow flex items-center">
                            <BarChartBig className="mr-2 h-5 w-5"/> Response Quality Meter
                        </GlassCardTitle>
                    </GlassCardHeader>
                    <GlassCardContent className="flex flex-col md:flex-row items-stretch md:items-center justify-center md:justify-around p-6 gap-6 md:gap-4">
                        <div className="text-center w-full">
                            <p className="text-sm text-muted-foreground mb-1">Basic Prompt</p>
                            <div className="w-full h-6 bg-destructive/30 rounded-lg overflow-hidden relative">
                                <div
                                    className="h-full bg-destructive transition-all duration-500 ease-out"
                                    style={{ width: `${Math.max(5, Math.min(100, basicResponseQuality))}%` }}
                                />
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-destructive-foreground">
                                    {`${Math.round(Math.max(5, Math.min(100, basicResponseQuality)))}%`}
                                </span>
                            </div>
                            <p className="text-xs mt-1 text-destructive">Low Quality</p>
                        </div>
                        <div className="text-center w-full">
                            <p className="text-sm text-muted-foreground mb-1">Engineered Prompt</p>
                            <div className="w-full h-6 bg-[hsl(var(--neon-lime-raw))]/30 rounded-lg overflow-hidden relative">
                                <div
                                    className="h-full bg-[hsl(var(--neon-lime-raw))] transition-all duration-500 ease-out"
                                    style={{ width: `${Math.max(5, Math.min(100, engineeredResponseQuality))}%` }}
                                />
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                                  {`${Math.round(Math.max(5, Math.min(100, engineeredResponseQuality)))}%`}
                                </span>
                            </div>
                            <p className="text-xs mt-1 text-green-400">High Quality</p>
                        </div>
                    </GlassCardContent>
                </GlassCard>
              )}
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </BasicVsEngineeredSectionContainer>
  );
}
