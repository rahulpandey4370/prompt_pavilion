import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Fingerprint, BarChartHorizontalBig } from "lucide-react"; // Removed Upload icon
import Image from "next/image";

export function PromptDNAAnalyzerSection() {
  return (
    <SectionContainer
      id="analyzer"
      title="Prompt DNA Analyzer"
      subtitle="Paste any text prompt and see its 'genetic makeup'. Get suggestions for improvement."
    >
      <GlassCard className="max-w-3xl mx-auto">
        <GlassCardHeader>
          <GlassCardTitle className="text-accent flex items-center">
            <Fingerprint className="mr-2" /> Analyze Your Prompt
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <Textarea 
            placeholder="Paste your prompt here..." 
            rows={6}
            className="mb-4 bg-foreground/5 border-border focus:ring-accent"
          />
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              <BarChartHorizontalBig className="mr-2 h-4 w-4" /> Analyze Prompt (Coming Soon)
            </Button>
            {/* The "Upload File (Coming Soon)" button was removed from here */}
          </div>
          {/* Placeholder for analysis results */}
          <div className="mt-6 p-4 border border-dashed border-border rounded-md min-h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Your prompt analysis will appear here.</p>
            {/* Example: <Image src="https://placehold.co/600x300.png" alt="Prompt Analysis Chart" width={600} height={300} className="rounded-md" data-ai-hint="chart analysis" /> */}
          </div>
        </GlassCardContent>
      </GlassCard>
    </SectionContainer>
  );
}
