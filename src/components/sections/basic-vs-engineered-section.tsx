
"use client";

import { SectionContainer } from "@/components/shared/section-container";
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
  basicPrompt: string;
  engineeredPrompt: string;
}

const playgroundScenarios: PlaygroundScenario[] = [
  {
    id: "restaurant-assistant",
    name: "Restaurant Assistant",
    icon: UtensilsCrossed,
    basicPrompt: "Suggest a good Italian restaurant nearby.",
    engineeredPrompt: `System: You are a helpful local guide AI. Your primary goal is to provide specific, actionable, and highly relevant restaurant recommendations.
When processing a user's query, meticulously consider all details provided in the 'User Query' and any 'Additional Context & Instructions for this request'.
Your output MUST be a numbered list of 2-3 distinct suggestions.
For each restaurant, provide: Name, full address, and a clear explanation of how it meets EACH of the specified criteria.

User: Suggest a good Italian restaurant nearby.

Additional Context & Instructions for this request:
- Cuisine: Italian
- Location: Downtown San Francisco
- Occasion: Family-friendly dinner
- Time: Around 7 PM tonight
- Dietary Needs: Vegetarian options absolutely essential
- Quality: Average rating of at least 4 stars
- Budget: Moderate ($$-$$$)
- For each suggestion, explicitly state how it meets each of the above criteria.`,
  },
  {
    id: "study-buddy",
    name: "Study Buddy - History",
    icon: BookOpen,
    basicPrompt: "Tell me about World War 2.",
    engineeredPrompt: `System: You are an expert history tutor AI. Your role is to explain complex historical events to high school students in a clear, engaging, and structured manner.
When responding to a user's query, focus on the 'Key Areas of Explanation' provided.
Your output should be approximately 3-4 paragraphs, using language appropriate for a high school student, and ensure a logical flow.

User: Tell me about World War 2.

Key Areas of Explanation for this request:
1. The main causes of World War 2.
2. Specifically elaborate on: The Treaty of Versailles and its impact, the rise of fascism in Europe (Germany, Italy), and the failure of the League of Nations.
3. Include key dates for major events.`,
  },
  {
    id: "code-explainer",
    name: "Code Explainer - Python",
    icon: Bot, 
    basicPrompt: "What does this Python code do: `print('Hello')`?",
    engineeredPrompt: `System: You are an expert Python programming assistant AI. Your main function is to provide clear, line-by-line explanations for Python code snippets.
When a user provides a code snippet, you MUST:
1.  Analyze the code.
2.  Explain its purpose and what each significant line or block does.
3.  State the expected output if the code were run.
4.  Offer any relevant notes, alternatives, or best practices for beginner/intermediate developers.
Use the following strict Markdown format for your response:
### Code Snippet
\`\`\`python
# [User's code snippet will be here]
\`\`\`
### Explanation
- [Detailed line-by-line explanation]
- [Overall purpose of the snippet]
### Expected Output
\`\`\`
# [Exact output if run]
\`\`\`
### Notes / Best Practices
- [Relevant notes, alternatives, or best practices]

User: What does this Python code do: \`print('Hello')\`?
`,
  },
  {
    id: "erp-feature-explanation",
    name: "ERP Module Feature Explanation",
    icon: FileText,
    basicPrompt: "Explain the inventory management module.",
    engineeredPrompt: `System: You are 'InnovateERP Helper', an AI training assistant for a comprehensive ERP system. Your role is to explain ERP module features to new users who may not be familiar with ERP jargon.
Use simple language and provide a tangible real-world benefit for each feature mentioned. Structure your response clearly.
Address the explanation to the specific role mentioned in the 'User Role Context'.

User: Explain the inventory management module.

User Role Context & Specific Features for this request:
- User Role: Newly hired warehouse supervisor.
- Module: Inventory Management
- Features to explain:
    1. Real-time Stock Level Tracking.
    2. Automated Reorder Point (ROP) Calculations.
    3. Batch and Serial Number Traceability.
    4. Kitting and Assembly Management.

Output Requirements:
- For each feature, provide:
    a. A brief (1-2 sentences) explanation of what it is.
    b. Its primary benefit to a warehouse supervisor in managing the warehouse efficiently.
- Format your response using Markdown, with each functionality as an H3 heading.`,
  },
];

export function BasicVsEngineeredSection() {
  const { toast } = useToast();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(playgroundScenarios[0].id);
  
  const currentScenario = playgroundScenarios.find(s => s.id === selectedScenarioId) || playgroundScenarios[0];

  const [basicPrompt, setBasicPrompt] = useState(currentScenario.basicPrompt);
  const [engineeredPrompt, setEngineeredPrompt] = useState(currentScenario.engineeredPrompt);
  
  const [basicResponse, setBasicResponse] = useState("");
  const [engineeredResponse, setEngineeredResponse] = useState("");

  useEffect(() => {
    const scenario = playgroundScenarios.find(s => s.id === selectedScenarioId);
    if (scenario) {
      setBasicPrompt(scenario.basicPrompt);
      setEngineeredPrompt(scenario.engineeredPrompt);
      setBasicResponse(""); 
      setEngineeredResponse("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenarioId]);

  const mutation = useMutation({
    mutationFn: (input: LiveAIResponseDemoInput) => liveAIResponseDemo(input),
    onSuccess: (data) => {
      if (data && data.basicResponse && data.engineeredResponse) {
        setBasicResponse(data.basicResponse);
        setEngineeredResponse(data.engineeredResponse);
        toast({ title: "AI Responses Ready!", description: "Comparison loaded." });
      } else {
        setBasicResponse("AI did not return a valid basic response.");
        setEngineeredResponse("AI did not return a valid engineered response.");
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
    if (!basicPrompt.trim() || !engineeredPrompt.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Both prompts must be filled." });
      return;
    }
    mutation.mutate({ basicPrompt, engineeredPrompt });
  };

  const CurrentDisplayIcon = currentScenario.icon || HelpCircle;
  
  const basicResponseQuality = mutation.data?.basicResponse ? Math.min(100, (mutation.data.basicResponse.length / 500) * 60 + 10) : 10;
  const engineeredResponseQuality = mutation.data?.engineeredResponse ? Math.min(100, (mutation.data.engineeredResponse.length / 500) * 80 + 20) : 85;


  return (
    <SectionContainer
      id="comparison"
      title="Basic vs. Engineered: A Live Comparison"
      subtitle="See the difference! Compare AI responses from basic vs. engineered prompts in real-time using Gemini."
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
                  <label htmlFor="comparisonBasicPrompt" className="block text-sm font-medium text-neon-yellow mb-1">Basic Prompt</label>
                  <Textarea
                    id="comparisonBasicPrompt"
                    value={basicPrompt}
                    onChange={(e) => setBasicPrompt(e.target.value)}
                    placeholder="Enter a basic prompt..."
                    rows={12} 
                    className="bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground/90 custom-scrollbar"
                  />
                </div>
                <div>
                  <label htmlFor="comparisonEngineeredPrompt" className="block text-sm font-medium text-neon-yellow mb-1">Engineered Prompt</label>
                  <Textarea
                    id="comparisonEngineeredPrompt"
                    value={engineeredPrompt}
                    onChange={(e) => setEngineeredPrompt(e.target.value)}
                    placeholder="Enter an engineered prompt..."
                    rows={12} 
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
    </SectionContainer>
  );
}

    