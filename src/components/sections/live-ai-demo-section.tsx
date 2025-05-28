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
    "Explain Next.js to a beginner web developer, focusing on its key features like App Router, Server Components, and benefits for SEO and performance. Use a friendly and encouraging tone."
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
      
      {/* Placeholder for Response Quality Meter */}
      {mutation.data && (
         <GlassCard className="mt-8">
            <GlassCardHeader>
                <GlassCardTitle className="text-primary flex items-center">
                    <BarChartBig className="mr-2"/> Response Quality Meter (Conceptual)
                </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="flex items-center justify-around p-6">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Basic Prompt</p>
                    <div className="w-24 h-4 bg-destructive rounded-full mt-1 mx-auto overflow-hidden"><div className="h-full bg-destructive-foreground w-1/3"></div></div>
                    <p className="text-xs mt-1">Low Quality</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Engineered Prompt</p>
                    <div className="w-24 h-4 bg-green-500 rounded-full mt-1 mx-auto overflow-hidden"><div className="h-full bg-green-200 w-5/6"></div></div>
                     <p className="text-xs mt-1">High Quality</p>
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
