"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { liveAIResponseDemo, type LiveAIResponseDemoInput } from "@/ai/flows/live-ai-response-demo";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, BarChartBig } from "lucide-react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

function LiveAIDemoClient() {
  const { toast } = useToast();
  const [basicPrompt, setBasicPrompt] = useState("Tell me about Next.js");
  const [engineeredPrompt, setEngineeredPrompt] = useState(
    "Explain Next.js to a beginner web developer, focusing on its key features like App Router, Server Components, and benefits for SEO and performance. Use a friendly and encouraging tone. Provide the explanation in three concise paragraphs."
  );

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

  // For the quality meter, we'll simulate quality based on whether engineered response exists and is longer.
  // This is a placeholder for a more sophisticated quality assessment.
  const basicResponseQuality = mutation.data?.basicResponse ? (mutation.data.basicResponse.length / 1000) * 100 : 10; // Example: 10% quality for basic
  const engineeredResponseQuality = mutation.data?.engineeredResponse ? (mutation.data.engineeredResponse.length / 1000) * 100 : 85; // Example: 85% for engineered

  return (
    <div className="space-y-8">
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
            rows={5}
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
            rows={5}
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
            <GlassCardContent className="flex items-center justify-around p-6 space-x-4">
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
                    <div className="w-full h-6 bg-green-500/30 rounded-lg overflow-hidden relative">
                        <div 
                            className="h-full bg-green-500 transition-all duration-500 ease-out" 
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
      subtitle="See the difference! Compare AI responses from basic vs. engineered prompts in real-time using Gemini 2.0 Flash."
    >
      <LiveAIDemoClient />
    </SectionContainer>
  );
}

