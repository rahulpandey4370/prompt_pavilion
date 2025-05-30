
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzePromptDNA, type AnalyzePromptDNAInput, type AnalyzePromptDNAOutput } from "@/ai/flows/analyze-prompt-dna";
import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Fingerprint, BarChartHorizontalBig, CheckCircle, AlertTriangle, Sparkles, Info, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getScoreVariant = (score: string | number | undefined): "default" | "secondary" | "destructive" => {
  if (typeof score === 'string') {
    const lowerScore = score.toLowerCase();
    if (["excellent", "high", "good"].includes(lowerScore) || (typeof score === 'number' && score >= 7)) return "default";
    if (["fair", "medium", "average"].includes(lowerScore) || (typeof score === 'number' && score >=4 && score < 7)) return "secondary";
    return "destructive";
  }
  if (typeof score === 'number') {
    if (score >=7) return "default";
    if (score >=4) return "secondary";
    return "destructive";
  }
  return "secondary"; 
};


export function PromptDNAAnalyzerSection() {
  const { toast } = useToast();
  const [promptText, setPromptText] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalyzePromptDNAOutput | null>(null);

  const mutation = useMutation({
    mutationFn: (input: AnalyzePromptDNAInput) => analyzePromptDNA(input),
    onSuccess: (data) => {
      if (data && data.overallAssessment) {
        setAnalysisResult(data);
        toast({ title: "Prompt Analysis Complete!", description: "DNA insights are ready below." });
      } else {
        setAnalysisResult(null);
        toast({ variant: "destructive", title: "Analysis Error", description: "The AI returned an incomplete analysis. Please try again or adjust your prompt." });
      }
    },
    onError: (error: Error) => {
      setAnalysisResult(null);
      toast({ variant: "destructive", title: "Analysis Failed", description: error.message });
    },
  });

  const handleAnalyzePrompt = () => {
    if (!promptText.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Please enter a prompt to analyze." });
      return;
    }
    setAnalysisResult(null); 
    mutation.mutate({ promptText });
  };

  return (
    <SectionContainer
      id="analyzer"
      title="Prompt DNA Analyzer"
      subtitle="Paste any text prompt to see its 'genetic makeup'. Get an AI-powered breakdown of its components, clarity, strengths, and areas for improvement."
    >
      <div className="bg-card p-6 yellow-glowing-box rounded-lg w-full max-w-screen-2xl mx-auto">
        <GlassCard className="w-full !shadow-none !border-none !bg-transparent !p-0">
          <GlassCardHeader className="pb-3">
            <GlassCardTitle className="text-neon-yellow flex items-center">
              <Fingerprint className="mr-2" /> Analyze Your Prompt's DNA
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-6">
            <Textarea 
              placeholder="Paste your full prompt text here..." 
              rows={8}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="mb-4 bg-background/30 border-neon-yellow/50 focus:ring-neon-yellow text-base text-foreground/90"
            />
            <div className="flex justify-center">
              <Button 
                onClick={handleAnalyzePrompt} 
                disabled={mutation.isPending}
                size="lg"
                className="bg-neon-yellow hover:bg-neon-yellow/90 text-neon-yellow-foreground"
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <BarChartHorizontalBig className="mr-2 h-5 w-5" />
                )}
                Analyze Prompt DNA
              </Button>
            </div>

            {mutation.isPending && (
              <div className="mt-6 p-6 border border-dashed border-neon-yellow/30 rounded-md min-h-[200px] flex flex-col items-center justify-center text-center bg-background/20">
                <Loader2 className="h-12 w-12 animate-spin text-neon-yellow mb-4" />
                <p className="text-lg text-foreground/80">Analyzing prompt structure...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments.</p>
              </div>
            )}

            {mutation.isError && !mutation.isPending && (
               <div className="mt-6 p-6 border border-destructive/50 bg-destructive/10 rounded-md min-h-[100px] flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
                <p className="text-lg font-semibold text-destructive-foreground">Analysis Failed</p>
                <p className="text-sm text-destructive-foreground/80">{mutation.error?.message || "An unknown error occurred."}</p>
              </div>
            )}

            {analysisResult && !mutation.isPending && (
              <div className="mt-8 space-y-6">
                <GlassCard className="!bg-background/30 !border-neon-yellow/30">
                  <GlassCardHeader>
                    <GlassCardTitle className="text-neon-yellow flex items-center"><Info className="mr-2"/>Overall Assessment & Clarity</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent className="space-y-3">
                    <p className="text-foreground/90 leading-relaxed">{analysisResult.overallAssessment}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neon-yellow">Clarity Score:</span>
                      <Badge 
                        variant={getScoreVariant(analysisResult.clarityScore)} 
                        className={cn(
                          "text-sm px-3 py-1",
                          getScoreVariant(analysisResult.clarityScore) === "default" && "bg-green-500/80 text-white",
                          getScoreVariant(analysisResult.clarityScore) === "secondary" && "bg-blue-500/80 text-white",
                          getScoreVariant(analysisResult.clarityScore) === "destructive" && "bg-red-500/80 text-white"
                        )}
                      >
                        {analysisResult.clarityScore.toString()}
                      </Badge>
                    </div>
                  </GlassCardContent>
                </GlassCard>

                <GlassCard className="!bg-background/30 !border-neon-yellow/30">
                  <GlassCardHeader>
                    <GlassCardTitle className="text-neon-yellow flex items-center"><Sparkles className="mr-2"/>Identified Strengths</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    {analysisResult.strengths.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-foreground/80 pl-4">
                        {analysisResult.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 mr-2 mt-1 text-green-400 shrink-0"/> 
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific strengths identified.</p>
                    )}
                  </GlassCardContent>
                </GlassCard>
                
                <GlassCard className="!bg-background/30 !border-neon-yellow/30">
                  <GlassCardHeader>
                    <GlassCardTitle className="text-neon-yellow flex items-center"><HelpCircle className="mr-2"/>Identified Prompt Components</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    {analysisResult.identifiedComponents && analysisResult.identifiedComponents.length > 0 ? (
                      <Accordion type="multiple" className="w-full">
                        {analysisResult.identifiedComponents.map((component, index) => (
                          <AccordionItem value={`component-${index}`} key={index} className="border-neon-yellow/30">
                            <AccordionTrigger className="text-base hover:no-underline text-neon-yellow/90 hover:text-neon-yellow">
                              <div className="flex items-center gap-3">
                                 <Badge variant={component.isPresent ? "default" : "destructive"} className={cn("w-20 justify-center", component.isPresent ? "bg-green-500/80" : "bg-red-500/80")}>
                                  {component.isPresent ? "Present" : "Missing"}
                                 </Badge>
                                <span className={cn(component.isPresent ? "text-neon-yellow" : "text-muted-foreground")}>{component.componentName}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pl-2 text-sm">
                              {component.extractedText && (
                                <div className="p-3 bg-background/20 rounded-md border border-neon-yellow/20">
                                  <p className="font-semibold text-muted-foreground mb-1">Extracted Text:</p>
                                  <p className="text-foreground/80 whitespace-pre-wrap break-words_">{component.extractedText}</p>
                                </div>
                              )}
                              {component.assessment && (
                                 <div className="p-3 bg-background/20 rounded-md border border-neon-yellow/20">
                                  <p className="font-semibold text-muted-foreground mb-1">Assessment:</p>
                                  <p className="text-foreground/80">{component.assessment}</p>
                                 </div>
                              )}
                              {!component.extractedText && !component.assessment && (
                                  <p className="text-muted-foreground italic">No specific text extracted or assessment provided for this component.</p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-muted-foreground">No specific components were detailed in the analysis.</p>
                    )}
                  </GlassCardContent>
                </GlassCard>

                <GlassCard className="!bg-background/30 !border-neon-yellow/30">
                  <GlassCardHeader>
                    <GlassCardTitle className="text-neon-yellow flex items-center"><AlertTriangle className="mr-2 text-orange-400"/>Suggestions for Improvement</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    {analysisResult.suggestions.length > 0 ? (
                       <ul className="list-disc list-inside space-y-1 text-foreground/80 pl-4">
                        {analysisResult.suggestions.map((suggestion, index) => (
                           <li key={index} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 mr-2 mt-1 text-orange-400 shrink-0"/>
                             <span>{suggestion}</span>
                           </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific improvement suggestions provided.</p>
                    )}
                  </GlassCardContent>
                </GlassCard>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>
    </SectionContainer>
  );
}
