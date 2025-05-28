
"use client"; // This directive should be at the top

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microscope, BookOpen, Target, Loader2 } from "lucide-react"; // Added Loader2 here
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Moved useToast import up
import { improvePromptSuggestions, type ImprovePromptSuggestionsInput } from "@/ai/flows/improve-prompt-suggestions";
import { useMutation } from "@tanstack/react-query";

// Placeholder content for sub-sections
const PromptAnatomyLab = () => (
  <GlassCard className="h-full">
    <GlassCardHeader>
      <GlassCardTitle className="text-accent">
        <Microscope className="inline-block mr-2" />
        The Prompt Anatomy Lab
      </GlassCardTitle>
    </GlassCardHeader>
    <GlassCardContent>
      <p className="text-foreground/80 mb-4">
        Dissect the structure of a perfect prompt. Hover over components to learn their roles. (Interactive elements to be implemented)
      </p>
      <Image src="https://placehold.co/600x400.png" alt="Prompt Anatomy Diagram" width={600} height={400} className="rounded-md shadow-lg" data-ai-hint="diagram structure" />
    </GlassCardContent>
  </GlassCard>
);

const PromptEngineeringPlayground = () => (
  <GlassCard className="h-full">
    <GlassCardHeader>
      <GlassCardTitle className="text-accent">
        <BookOpen className="inline-block mr-2" />
        Prompt Engineering Playground
      </GlassCardTitle>
    </GlassCardHeader>
    <GlassCardContent>
      <p className="text-foreground/80 mb-4">
        Experiment with different scenarios like Restaurant Assistant or Study Buddy. Modify prompts and see instant results. (Gamified scoring to be added)
      </p>
       <Image src="https://placehold.co/600x400.png" alt="Playground Interface" width={600} height={400} className="rounded-md shadow-lg" data-ai-hint="computer interface" />
    </GlassCardContent>
  </GlassCard>
);

const SmartSuggestionsTool = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: (input: ImprovePromptSuggestionsInput) => improvePromptSuggestions(input),
    onSuccess: (data) => {
      if (data && data.suggestions) {
        setSuggestions(data.suggestions);
        toast({ title: "Suggestions Ready!", description: "AI has provided feedback on your prompt." });
      } else {
        setSuggestions([]); // Handle cases where suggestions might be null or undefined
        toast({ title: "Suggestions Processed", description: "No specific suggestions were returned, or the format was unexpected." });
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
        />
        <Button onClick={handleGetSuggestions} disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Get Suggestions"}
        </Button>
        {suggestions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-primary mb-2">Suggestions:</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground/80">
              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
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
          <TabsTrigger value="anatomy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Prompt Anatomy Lab</TabsTrigger>
          <TabsTrigger value="playground" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Engineering Playground</TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Smart Suggestions</TabsTrigger>
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
