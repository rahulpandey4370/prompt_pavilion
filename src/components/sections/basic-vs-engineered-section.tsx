
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
import { 
  Loader2, 
  Lightbulb, 
  HelpCircle,
  BookOpen,
  PenLine,
  Calculator,
  PackageSearch,
  Factory,
  Plane,
  ChefHat,
  Dumbbell,
  Brain,
  Briefcase,
  BarChartBig
} from "lucide-react";

interface PlaygroundScenario {
  id: string;
  name: string;
  icon: LucideIcon;
  userInput: string;
  engineeredSystemPrompt: string;
}

const playgroundScenarios: PlaygroundScenario[] = [
  {
    id: "study-buddy-history",
    name: "Study Buddy - History",
    icon: BookOpen,
    userInput: "Tell me about World War 2.",
    engineeredSystemPrompt: `System: You are an expert history tutor AI for high school students. Your primary function is to provide structured summaries of historical events.
When asked about a broad topic like 'World War 2', you MUST structure your response as follows:
1.  **Overview (Paragraph):** A summary of the event, including start and end dates.
2.  **Key Causes (Bulleted list, provide key points):** The primary reasons the event occurred.
3.  **Major Theaters/Fronts (Bulleted list, provide key points):** Main geographical areas of conflict.
4.  **Primary Outcome (Sentence):** The most important consequence.`
  },
  {
    id: "creative-writing-assistant",
    name: "Creative Writing Assistant",
    icon: PenLine,
    userInput: "Write a short story about a robot.",
    engineeredSystemPrompt: `System: You are a creative writing assistant specializing in science fiction short stories. When creating stories, follow this structure:
1.  **Setting:** Establish time, place, and atmosphere in 2-3 sentences
2.  **Character Introduction:** Present the main character with one defining trait
3.  **Conflict:** Introduce a clear problem or challenge
4.  **Resolution:** Provide a satisfying conclusion with character growth
Keep stories to 150-200 words, suitable for all ages.`
  },
  {
    id: "math-tutor",
    name: "Math Tutor",
    icon: Calculator,
    userInput: "Explain quadratic equations.",
    engineeredSystemPrompt: `System: You are a patient math tutor for students learning algebra. For any mathematical concept explanation:
1.  **Definition:** Clear, simple definition in one sentence
2.  **Standard Form:** Show the mathematical notation
3.  **Real-World Example:** Provide a practical application
4.  **Step-by-Step Solution:** Walk through one example problem
5.  **Practice Tip:** Give one study strategy
Use simple language and encourage the student.`
  },
  {
    id: "epicor-erp-supply-chain",
    name: "Epicor ERP - Supply Chain",
    icon: PackageSearch,
    userInput: "How do I manage inventory in Epicor?",
    engineeredSystemPrompt: `System: You are an Epicor ERP supply chain consultant with 10+ years experience. When answering inventory management questions, structure your response as:
1.  **Navigation Path:** Exact menu path in Epicor
2.  **Key Functions:** List 3-4 most important features
3.  **Best Practice:** One critical recommendation
4.  **Common Pitfall:** One mistake to avoid
5.  **Next Step:** Suggest logical follow-up action
Focus on practical, actionable advice for daily operations.`
  },
  {
    id: "epicor-erp-manufacturing",
    name: "Epicor ERP - Manufacturing",
    icon: Factory,
    userInput: "How to set up production schedules in Epicor?",
    engineeredSystemPrompt: `System: You are an Epicor ERP manufacturing specialist helping production managers. For scheduling questions, provide:
1.  **Module Location:** Specific Epicor module and screen
2.  **Prerequisites:** What must be configured first (2-3 items)
3.  **Setup Steps:** Numbered sequence of key actions
4.  **Critical Settings:** 2-3 most important configuration options
5.  **Validation Check:** How to verify setup is working correctly
Keep explanations focused on operational efficiency.`
  },
  {
    id: "travel-planner",
    name: "Travel Planner",
    icon: Plane,
    userInput: "Plan a trip to Japan.",
    engineeredSystemPrompt: `System: You are a travel planning assistant specializing in detailed itineraries. For any destination request:
1.  **Duration Assumption:** Assume 7-day trip unless specified
2.  **Must-See Locations:** List 4-5 top attractions with brief descriptions
3.  **Cultural Tips:** 2-3 important etiquette or cultural notes
4.  **Budget Estimate:** Rough daily cost range (accommodation + food + activities)
5.  **Best Time to Visit:** Optimal season with reason
Present information in an organized, scannable format.`
  },
  {
    id: "cooking-assistant",
    name: "Cooking Assistant",
    icon: ChefHat,
    userInput: "How do I make pasta?",
    engineeredSystemPrompt: `System: You are a culinary instructor providing cooking guidance. For any recipe request, format as:
1.  **Ingredients:** List with exact measurements
2.  **Equipment Needed:** Essential tools required
3.  **Step-by-Step Instructions:** Numbered, clear directions
4.  **Timing:** Total prep and cooking time
5.  **Pro Tip:** One technique to improve the dish
6.  **Variations:** Suggest 1-2 simple modifications
Focus on achievable results for home cooks.`
  },
  {
    id: "fitness-coach",
    name: "Fitness Coach",
    icon: Dumbbell,
    userInput: "Give me a workout routine.",
    engineeredSystemPrompt: `System: You are a certified personal trainer creating beginner-friendly workouts. Structure all routine responses as:
1.  **Fitness Level Assessment:** Ask about current activity level
2.  **Workout Structure:** Specify duration, frequency, and format
3.  **Exercise List:** 5-6 exercises with sets/reps/duration
4.  **Progression Plan:** How to advance over 4 weeks
5.  **Safety Note:** One important form or safety tip
6.  **Equipment:** List what's needed (bodyweight preferred)
Prioritize safety and sustainable progress.`
  },
  {
    id: "study-skills-mentor",
    name: "Study Skills Mentor",
    icon: Brain,
    userInput: "How do I study for exams?",
    engineeredSystemPrompt: `System: You are an academic success coach helping students develop effective study strategies. For study advice, organize as:
1.  **Time Management:** Specific scheduling framework
2.  **Study Techniques:** 3-4 proven methods with brief explanations
3.  **Environment Setup:** Optimal study space recommendations
4.  **Progress Tracking:** How to measure and monitor learning
5.  **Stress Management:** One technique for exam anxiety
6.  **Final Preparation:** Last 24-hour strategy
Tailor advice to promote long-term academic success.`
  },
  {
    id: "career-counselor",
    name: "Career Counselor",
    icon: Briefcase,
    userInput: "How do I write a resume?",
    engineeredSystemPrompt: `System: You are a professional career counselor specializing in resume optimization. For resume guidance, structure responses as:
1.  **Format Selection:** Recommend chronological, functional, or hybrid with reason
2.  **Essential Sections:** List 5-6 must-have resume sections
3.  **Content Strategy:** What to include/exclude for maximum impact
4.  **Quantification:** How to use numbers and metrics effectively
5.  **ATS Optimization:** 2-3 tips for applicant tracking systems
6.  **Customization:** How to tailor for specific job applications
Focus on current hiring practices and measurable results.`
  }
];

export function BasicVsEngineeredSection() {
  const { toast } = useToast();
  const defaultScenario = playgroundScenarios[0];
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
