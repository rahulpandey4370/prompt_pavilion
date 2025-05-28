"use client"; // This directive should be at the top

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microscope, BookOpen, Target, Loader2, Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Settings2, Lightbulb, HelpCircle, UtensilsCrossed } from "lucide-react"; // Added UtensilsCrossed
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { improvePromptSuggestions, type ImprovePromptSuggestionsInput } from "@/ai/flows/improve-prompt-suggestions";
import { liveAIResponseDemo, type LiveAIResponseDemoInput }  from "@/ai/flows/live-ai-response-demo";
import { useMutation } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const anatomyParts = [
  {
    id: "system",
    name: "System Prompt / Role",
    description: "Defines the AI's persona, context, and high-level instructions. Sets the stage for the entire interaction. Example: 'You are a helpful assistant that translates English to French.'",
    icon: Settings2,
    colorClass: "bg-prompt-system",
    textColorClass: "text-purple-100",
  },
  {
    id: "user",
    name: "User Input / Task",
    description: "The specific question, instruction, or task the user wants the AI to perform. Should be clear and unambiguous. Example: 'Translate the following sentence: Hello, how are you?'",
    icon: Puzzle,
    colorClass: "bg-prompt-user",
    textColorClass: "text-blue-100",
  },
  {
    id: "rag",
    name: "Context / RAG",
    description: "External information or data provided to the AI to inform its response. Crucial for grounding the AI in specific facts or documents. Example: 'Context: [Article about French grammar rules]'",
    icon: ListChecks,
    colorClass: "bg-prompt-rag",
    textColorClass: "text-green-100",
  },
  {
    id: "examples",
    name: "Examples (Few-shot)",
    description: "Illustrative input-output pairs that demonstrate the desired format, style, or type of response. Helps the AI understand complex tasks. Example: 'English: good morning -> French: bonjour. English: thank you -> French: merci.'",
    icon: Eye,
    colorClass: "bg-prompt-examples",
    textColorClass: "text-teal-100",
  },
  {
    id: "constraints",
    name: "Constraints / Rules",
    description: "Specific rules or limitations the AI must adhere to, like response length, format, or topics to avoid. Example: 'Keep the translation under 10 words. Do not use informal language.'",
    icon: SlidersHorizontal,
    colorClass: "bg-prompt-constraints",
    textColorClass: "text-orange-100",
  },
  {
    id: "guardrails",
    name: "Guardrails / Safety",
    description: "Instructions to ensure the AI's output is safe, ethical, and aligned with policies. Prevents harmful or inappropriate content. Example: 'Do not generate offensive content. Ensure the tone is respectful.'",
    icon: ShieldCheck,
    colorClass: "bg-prompt-guardrails",
    textColorClass: "text-red-100",
  },
  {
    id: "tools",
    name: "Tools / Functions",
    description: "Defines capabilities or functions the AI can use to perform actions or retrieve information, enabling more complex, agentic behavior. Example: 'Tool: getCurrentWeather(location: string)' (The AI decides if/when to use it).",
    icon: Wrench,
    colorClass: "bg-prompt-tools",
    textColorClass: "text-yellow-100",
  },
  {
    id: "output_format",
    name: "Output Format Indicator",
    description: "Specifies the desired structure of the AI's response, such as JSON, Markdown, or a numbered list. Example: 'Respond in JSON format with keys \"original\" and \"translated\".'",
    icon: Wand2,
    colorClass: "bg-pink-500/80 border-pink-400", // Custom color, ensure it's in theme or add to globals/tailwind
    textColorClass: "text-pink-100",
  },
];

const PromptAnatomyLab = () => (
  <GlassCard className="h-full">
    <GlassCardHeader>
      <GlassCardTitle className="text-accent">
        <Microscope className="inline-block mr-2" />
        The Prompt Anatomy Lab
      </GlassCardTitle>
    </GlassCardHeader>
    <GlassCardContent>
      <p className="text-foreground/80 mb-6">
        A well-crafted prompt is made of several key components. Hover over each block below to understand its role in guiding the AI.
      </p>
      <div className="space-y-3">
        {anatomyParts.map((part) => (
          <TooltipProvider key={part.id} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "p-4 rounded-lg shadow-md transition-all duration-150 ease-in-out hover:shadow-lg relative overflow-hidden border-2",
                    part.colorClass,
                    part.textColorClass,
                    "cursor-help"
                  )}
                >
                  <div className="flex items-center">
                    <part.icon className="w-5 h-5 mr-3 shrink-0" />
                    <h4 className="font-semibold text-md">{part.name}</h4>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs bg-background border-primary text-foreground p-3">
                <p>{part.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
       <p className="text-foreground/70 mt-6 text-sm">
        Note: Not all components are needed for every prompt. The complexity and combination depend on the task.
      </p>
    </GlassCardContent>
  </GlassCard>
);


const playgroundScenarios = [
  {
    id: "restaurant-assistant",
    name: "Restaurant Assistant",
    basicPrompt: "Suggest a good Italian restaurant nearby.",
    engineeredPrompt: "System: You are a helpful local guide AI. User: I'm looking for a family-friendly Italian restaurant in downtown San Francisco that's open for dinner around 7 PM tonight, has vegetarian options, and an average rating of at least 4 stars. My budget is moderate ($$-$$$). Please provide 2-3 suggestions with a brief description, address, and why it fits my criteria. Format as a numbered list.",
    icon: UtensilsCrossed,
  },
  {
    id: "study-buddy",
    name: "Study Buddy (History)",
    basicPrompt: "Tell me about World War 2.",
    engineeredPrompt: "System: You are a history tutor AI. User: Explain the main causes of World War 2 for a high school student. Focus on the Treaty of Versailles, rise of fascism, and failure of the League of Nations. Keep the explanation concise (around 3-4 paragraphs) and easy to understand. Provide key dates for major events mentioned.",
    icon: BookOpen,
  },
  {
    id: "code-explainer",
    name: "Code Explainer (Python)",
    basicPrompt: "What does this Python code do: `print('Hello')`?",
    engineeredPrompt: "System: You are an expert Python programming assistant. User: Explain the following Python code snippet line by line, including its purpose and expected output. Identify any potential improvements or common pitfalls related to this type of code. Code: \n```python\ndef greet(name):\n  return f\"Hello, {name}!\"\n\nmessage = greet(\"Alice\")\nprint(message)\n```\nRespond in Markdown.",
    icon: Bot, // Or Code2 if available and preferred
  },
];


const PromptEngineeringPlayground = () => {
  const { toast } = useToast();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(playgroundScenarios[0].id);
  
  const [basicPrompt, setBasicPrompt] = useState(playgroundScenarios[0].basicPrompt);
  const [engineeredPrompt, setEngineeredPrompt] = useState(playgroundScenarios[0].engineeredPrompt);
  
  const [basicResponse, setBasicResponse] = useState("");
  const [engineeredResponse, setEngineeredResponse] = useState("");

  useEffect(() => {
    const scenario = playgroundScenarios.find(s => s.id === selectedScenarioId);
    if (scenario) {
      setBasicPrompt(scenario.basicPrompt);
      setEngineeredPrompt(scenario.engineeredPrompt);
      setBasicResponse(""); // Clear previous responses
      setEngineeredResponse("");
    }
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

  const currentScenarioIcon = playgroundScenarios.find(s => s.id === selectedScenarioId)?.icon || HelpCircle;


  return (
  <GlassCard className="h-full">
    <GlassCardHeader>
      <GlassCardTitle className="text-accent flex items-center">
        <currentScenarioIcon className="inline-block mr-3" />
        Prompt Engineering Playground: {playgroundScenarios.find(s => s.id === selectedScenarioId)?.name}
      </GlassCardTitle>
    </GlassCardHeader>
    <GlassCardContent className="space-y-6">
      <div>
        <label htmlFor="scenario-select-playground" className="block text-sm font-medium text-primary mb-1">Select Scenario:</label>
        <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
          <SelectTrigger id="scenario-select-playground" className="w-full md:w-1/2 bg-foreground/5 border-border focus:ring-accent">
            <SelectValue placeholder="Choose a scenario" />
          </SelectTrigger>
          <SelectContent>
            {playgroundScenarios.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id}>
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
          <label htmlFor="playgroundBasicPrompt" className="block text-sm font-medium text-primary mb-1">Basic Prompt</label>
          <Textarea
            id="playgroundBasicPrompt"
            value={basicPrompt}
            onChange={(e) => setBasicPrompt(e.target.value)}
            placeholder="Enter a basic prompt..."
            rows={6}
            className="bg-foreground/5 border-border focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="playgroundEngineeredPrompt" className="block text-sm font-medium text-primary mb-1">Engineered Prompt</label>
          <Textarea
            id="playgroundEngineeredPrompt"
            value={engineeredPrompt}
            onChange={(e) => setEngineeredPrompt(e.target.value)}
            placeholder="Enter an engineered prompt..."
            rows={6}
            className="bg-foreground/5 border-border focus:ring-accent"
          />
        </div>
      </div>

      <div className="text-center">
        <Button onClick={handleCompare} disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />} Compare AI Responses
        </Button>
      </div>
      
      {(mutation.isSuccess || mutation.isError) && (
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Basic Prompt Response</label>
            <Textarea
              readOnly
              value={basicResponse}
              className="h-48 bg-foreground/10 border-0 resize-none text-foreground/90"
              placeholder="AI response to basic prompt..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Engineered Prompt Response</label>
            <Textarea
              readOnly
              value={engineeredResponse}
              className="h-48 bg-foreground/10 border-0 resize-none text-foreground/90"
              placeholder="AI response to engineered prompt..."
            />
          </div>
        </div>
      )}
      <p className="text-xs text-center text-muted-foreground mt-4">
        (Gamified scoring and more advanced features coming soon!)
      </p>
    </GlassCardContent>
  </GlassCard>
  );
};


const SmartSuggestionsTool = () => {
  const [prompt, setPrompt] = useState("");
  // const [suggestions, setSuggestions] = useState<string[]>([]); // remove if using mutation.data directly
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: (input: ImprovePromptSuggestionsInput) => improvePromptSuggestions(input),
    onSuccess: (data) => {
      if (data && data.suggestions && data.suggestions.length > 0) {
        // setSuggestions(data.suggestions); // Not needed if directly using data.suggestions
        toast({ title: "Suggestions Ready!", description: "AI has provided feedback on your prompt." });
      } else {
        // setSuggestions([]); 
        toast({ title: "Suggestions Processed", description: "No specific suggestions were returned, or the format was as expected and needs no improvement." });
      }
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });

  const handleGetSuggestions = () => {
    if (!prompt.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Please enter a prompt to get suggestions." });
      return;
    }
    mutation.mutate({ prompt });
  };

  const suggestions = mutation.data?.suggestions || [];

  return (
    <GlassCard className="h-full">
      <GlassCardHeader>
        <GlassCardTitle className="text-accent">
          <Target className="inline-block mr-2" />
          Smart Prompt Suggestions
        </GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <p className="text-foreground/80 mb-4">
          Enter your prompt below and get AI-powered suggestions for improvement.
        </p>
        <Textarea 
          placeholder="Type your prompt here..." 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4 bg-foreground/5 border-border focus:ring-accent"
          rows={5}
        />
        <Button onClick={handleGetSuggestions} disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Get Suggestions"}
        </Button>
        
        {mutation.isSuccess && suggestions.length === 0 && !mutation.isPending && (
             <p className="mt-4 text-foreground/80">No specific improvement suggestions. Your prompt might be well-structured or the AI found no critical areas to highlight.</p>
        )}

        {suggestions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-primary mb-2">Suggestions:</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 bg-foreground/5 p-3 rounded-md">
              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {mutation.isError && (
           <p className="mt-4 text-destructive">Could not retrieve suggestions at this time.</p>
        )}
      </GlassCardContent>
    </GlassCard>
  );
};


export function LearningSections() {
  return (
    <SectionContainer
      id="learning"
      title="Interactive Learning Hub"
      subtitle="Explore the fundamentals and practice your prompt engineering skills in our interactive labs."
    >
      <Tabs defaultValue="anatomy" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8 bg-background/30 backdrop-blur-sm">
          <TabsTrigger value="anatomy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Microscope className="mr-2 h-4 w-4" />Prompt Anatomy Lab</TabsTrigger>
          <TabsTrigger value="playground" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><BookOpen className="mr-2 h-4 w-4"/>Engineering Playground</TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Target className="mr-2 h-4 w-4"/>Smart Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="anatomy">
          <PromptAnatomyLab />
        </TabsContent>
        <TabsContent value="playground">
          <PromptEngineeringPlayground />
        </TabsContent>
        <TabsContent value="suggestions">
          <SmartSuggestionsTool />
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}
