
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { liveAIResponseDemo, type LiveAIResponseDemoInput } from "@/ai/flows/live-ai-response-demo";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, BarChartBig, Wand2, FileText } from "lucide-react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

interface DemoScenario {
  id: string;
  name: string;
  icon: LucideIcon;
  basicPrompt: string;
  engineeredPrompt: string;
}

const demoScenarios: DemoScenario[] = [
  {
    id: "nextjs-explanation",
    name: "Technical: Explain Next.js",
    icon: Wand2,
    basicPrompt: "Tell me about Next.js",
    engineeredPrompt:
      "Explain Next.js to a beginner web developer, focusing on its key features like App Router, Server Components, and benefits for SEO and performance. Use a friendly and encouraging tone. Provide the explanation in three concise paragraphs.",
  },
  {
    id: "erp-anomaly",
    name: "Business/ERP: Sales Data Anomaly",
    icon: FileText,
    basicPrompt: "What's wrong with this sales data? July: $120k, Aug: $115k, Sep: $45k in NA Electronics.",
    engineeredPrompt: `System: You are an ERP data analyst AI. Your task is to identify and explain potential anomalies or insights in provided sales data excerpts for a sales manager. Focus on actionable observations and conciseness.

User: The following Q3 sales data for product category 'Electronics' in the 'North America' region shows a significant dip in September:
- July: $120,000
- August: $115,000
- September: $45,000
(Context: Other regions and product categories remained stable or grew. Q4 started with sales returning to $110,000 for NA Electronics.)

Please analyze this specific dip. Provide:
1. A likely root cause category (e.g., market event, internal issue, data error).
2. Two specific, plausible explanations for the dip within that category.
3. One recommended immediate next step for the sales manager to investigate further.
Keep your entire response under 150 words.`
  },
];

function LiveAIDemoClient() {
  const { toast } = useToast();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(demoScenarios[0].id);
  
  const currentScenario = demoScenarios.find(s => s.id === selectedScenarioId) || demoScenarios[0];

  const [basicPrompt, setBasicPrompt] = useState(currentScenario.basicPrompt);
  const [engineeredPrompt, setEngineeredPrompt] = useState(currentScenario.engineeredPrompt);

  useState(() => {
    setBasicPrompt(currentScenario.basicPrompt);
    setEngineeredPrompt(currentScenario.engineeredPrompt);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenarioId]);


  const mutation = useMutation({
    mutationFn: (input: LiveAIResponseDemoInput) => liveAIResponseDemo(input),
    onSuccess: () => {
      toast({
        title: "AI Responses Received!",
        description: "Check out the comparison below.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error generating responses",
        description: error.message,
      });
    },
  });

  const handleSubmit = () => {
    if (!basicPrompt.trim() || !engineeredPrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Both prompts must be filled.",
      });
      return;
    }
    mutation.mutate({ basicPrompt, engineeredPrompt });
  };

  const basicResponseQuality = mutation.data?.basicResponse ? (mutation.data.basicResponse.length / 1000) * 100 : 10;
  const engineeredResponseQuality = mutation.data?.engineeredResponse ? (mutation.data.engineeredResponse.length / 1000) * 100 : 85;

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <label htmlFor="scenario-select-live-demo" className="block text-sm font-medium text-primary mb-1">Select Demo Scenario:</label>
        <Select value={selectedScenarioId} onValueChange={(value) => {
          const newScenario = demoScenarios.find(s => s.id === value) || demoScenarios[0];
          setSelectedScenarioId(value);
          setBasicPrompt(newScenario.basicPrompt);
          setEngineeredPrompt(newScenario.engineeredPrompt);
          mutation.reset(); // Clear previous results
        }}>
          <SelectTrigger id="scenario-select-live-demo" className="w-full md:w-1/2 bg-card/80 border-primary/50 focus:ring-accent text-foreground">
            <SelectValue placeholder="Choose a scenario" />
          </SelectTrigger>
          <SelectContent className="bg-card border-accent text-foreground">
            {demoScenarios.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id} className="focus:bg-accent/20">
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
          <label htmlFor="basicPrompt" className="block text-sm font-medium text-primary mb-1">
            Basic Prompt
          </label>
          <Textarea
            id="basicPrompt"
            value={basicPrompt}
            onChange={(e) => setBasicPrompt(e.target.value)}
            placeholder="Enter a basic prompt..."
            rows={8}
            className="bg-foreground/5 border-border focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="engineeredPrompt" className="block text-sm font-medium text-primary mb-1">
            Engineered Prompt
          </label>
          <Textarea
            id="engineeredPrompt"
            value={engineeredPrompt}
            onChange={(e) => setEngineeredPrompt(e.target.value)}
            placeholder="Enter an engineered prompt..."
            rows={8}
            className="bg-foreground/5 border-border focus:ring-accent"
          />
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Compare AI Responses
        </Button>
      </div>

      {mutation.isError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{mutation.error.message}</AlertDescription>
        </Alert>
      )}

      {mutation.data && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="text-primary">Basic Prompt Response</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <Textarea
                readOnly
                value={mutation.data.basicResponse}
                className="h-64 bg-transparent border-0 resize-none text-foreground/90"
              />
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="text-primary">Engineered Prompt Response</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <Textarea
                readOnly
                value={mutation.data.engineeredResponse}
                className="h-64 bg-transparent border-0 resize-none text-foreground/90"
              />
            </GlassCardContent>
          </GlassCard>
        </div>
      )}
      
      {mutation.data && (
         <GlassCard className="mt-8">
            <GlassCardHeader>
                <GlassCardTitle className="text-primary flex items-center">
                    <BarChartBig className="mr-2"/> Response Quality Meter
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
                    <div className="w-full h-6 bg-[hsl(var(--neon-green-raw))]/30 rounded-lg overflow-hidden relative">
                        <div 
                            className="h-full bg-[hsl(var(--neon-green-raw))] transition-all duration-500 ease-out" 
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
    </div>
  );
}


export function LiveAIDemoSection() {
  return (
    <SectionContainer
      id="live-ai-demo"
      title="Live AI Response Demo"
      subtitle="See the difference! Select a scenario and compare AI responses from basic vs. engineered prompts in real-time using Gemini."
    >
      <LiveAIDemoClient />
    </SectionContainer>
  );
}
