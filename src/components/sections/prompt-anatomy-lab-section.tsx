
"use client";

import { useState } from "react";
import { SectionContainer } from "@/components/shared/section-container";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Settings2, Puzzle, ListChecks, Eye, SlidersHorizontal, ShieldCheck, Wrench, Wand2, Info } from "lucide-react";

interface AnatomyPart {
  id: string;
  name: string;
  icon: LucideIcon;
  colorClass: string;
  textColorClass: string;
  borderColorClass: string;
  conciseDescription: string;
}

const anatomyParts: AnatomyPart[] = [
  {
    id: "system",
    name: "System Prompt / Role",
    icon: Settings2,
    colorClass: "bg-prompt-system",
    textColorClass: "text-purple-100",
    borderColorClass: "border-purple-500",
    conciseDescription: "Sets the AI's persona, context, and overall operational guidelines. Essential for guiding tone and behavior. E.g., 'You are a witty travel expert.'"
  },
  {
    id: "user",
    name: "User Input / Task",
    icon: Puzzle,
    colorClass: "bg-prompt-user",
    textColorClass: "text-blue-100",
    borderColorClass: "border-blue-500",
    conciseDescription: "The specific question or instruction from the user. Clarity and specificity are key for relevant AI responses. E.g., 'Suggest a 3-day Paris itinerary.'"
  },
  {
    id: "rag",
    name: "Context / RAG",
    icon: ListChecks,
    colorClass: "bg-prompt-rag",
    textColorClass: "text-green-100",
    borderColorClass: "border-green-500",
    conciseDescription: "Provides external information (documents, database results) to ground AI responses in facts, reducing hallucination. E.g., Including product manuals for troubleshooting."
  },
  {
    id: "examples",
    name: "Examples (Few-shot)",
    icon: Eye,
    colorClass: "bg-prompt-examples",
    textColorClass: "text-teal-100",
    borderColorClass: "border-teal-500",
    conciseDescription: "Illustrative input-output pairs demonstrating desired format, style, or reasoning. Helps AI understand nuanced requests. E.g., Showing 'good' vs 'bad' email styles."
  },
  {
    id: "constraints",
    name: "Constraints / Rules",
    icon: SlidersHorizontal,
    colorClass: "bg-prompt-constraints",
    textColorClass: "text-orange-100",
    borderColorClass: "border-orange-500",
    conciseDescription: "Specific directives limiting length, format, content, or topics to include/avoid. Ensures output meets precise needs. E.g., 'Keep summary under 100 words.'"
  },
  {
    id: "guardrails",
    name: "Guardrails / Safety",
    icon: ShieldCheck,
    colorClass: "bg-prompt-guardrails",
    textColorClass: "text-red-100",
    borderColorClass: "border-red-500",
    conciseDescription: "Ensures AI output is safe, ethical, and policy-aligned; avoids harmful or inappropriate content. Critical for responsible AI. E.g., 'Do not generate financial advice.'"
  },
  {
    id: "tools",
    name: "Tools / Functions",
    icon: Wrench,
    colorClass: "bg-prompt-tools",
    textColorClass: "text-yellow-100",
    borderColorClass: "border-yellow-500",
    conciseDescription: "Allows AI to interact with external APIs or systems to perform actions or retrieve real-time data. E.g., A tool to fetch current weather."
  },
  {
    id: "output_format",
    name: "Output Format Indicator",
    icon: Wand2,
    colorClass: "bg-pink-500",
    textColorClass: "text-pink-100",
    borderColorClass: "border-pink-500",
    conciseDescription: "Specifies the desired structure of the AI's response (e.g., JSON, Markdown, list). Crucial for machine-readable output. E.g., 'Format output as a numbered list.'"
  },
];

export function PromptAnatomyLabSection() {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [pinnedItemId, setPinnedItemId] = useState<string | null>(null);

  const handleTriggerClick = (partId: string) => {
    setPinnedItemId((prevPinnedId) => (prevPinnedId === partId ? null : partId));
  };

  const handlePopoverOpenChange = (open: boolean, partId: string) => {
    if (!open) {
      // If Popover is closed by its own means (e.g., click outside, Esc),
      // ensure it's unpinned and no longer considered hovered for opening.
      if (pinnedItemId === partId) {
        setPinnedItemId(null);
      }
      if (hoveredItemId === partId) {
        setHoveredItemId(null);
      }
    }
  };


  return (
    <SectionContainer
      id="anatomy"
      title="The Prompt Anatomy Lab"
      subtitle="&quot;Understanding the distinct components of a prompt is crucial. Each part plays a strategic role in shaping the AI's understanding, focus, and the quality of its output. Mastering this anatomy transforms your prompts from simple questions into powerful instructions.&quot;"
      subtitleClassName="italic"
      isContainedCard={true}
      className="!py-12 md:!py-16"
    >
      <div className="bg-card p-0.5 yellow-glowing-box rounded-lg">
        <div className="bg-card rounded-md p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {anatomyParts.map((part) => {
              const isOpen = pinnedItemId === part.id || hoveredItemId === part.id;
              const IconComponent = part.icon;

              return (
                <Popover
                  key={part.id}
                  open={isOpen}
                  onOpenChange={(openValue) => handlePopoverOpenChange(openValue, part.id)}
                >
                  <PopoverTrigger asChild>
                    <div // This div acts as the trigger area for hover and click
                      onClick={() => handleTriggerClick(part.id)}
                      onMouseEnter={() => setHoveredItemId(part.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      className={cn(
                        "card-neon-animated-border rounded-lg shadow-md p-0.5 cursor-pointer h-full",
                        "hover:scale-105 transition-transform duration-150 ease-in-out"
                      )}
                      // Prevent Popover from capturing focus on hover, allow click to focus
                      onPointerDown={(e) => { if (e.pointerType === 'mouse') e.preventDefault(); }}
                    >
                      <div
                        className={cn(
                          "h-full w-full p-4 rounded-[calc(var(--radius)-var(--neon-border-thickness))]",
                          part.colorClass,
                          part.textColorClass,
                          "flex flex-col items-center justify-center text-center min-h-[150px]"
                        )}
                      >
                        <IconComponent className="w-10 h-10 mb-3" />
                        <span className="font-semibold text-lg">{part.name}</span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    side="bottom"
                    align="center"
                    className={cn(
                      "w-80 sm:w-96 p-4 rounded-md shadow-xl text-sm",
                      part.borderColorClass,
                      "border-2",
                      part.colorClass, // Use themed background
                      part.textColorClass // Use themed text color
                    )}
                    // Prevent closing when mouse moves from trigger to content
                    onMouseEnter={() => setHoveredItemId(part.id)} 
                    onMouseLeave={() => setHoveredItemId(null)}
                  >
                    <div className="flex items-start">
                      <Info className={cn("w-5 h-5 mr-2 shrink-0 mt-0.5", part.textColorClass === "text-yellow-100" ? "text-background" : "")} />
                      <p className="flex-1">{part.conciseDescription}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
          <p className="text-foreground/70 mt-8 text-center text-sm">
            Note: Not all components are needed for every prompt. The complexity and combination depend on the task.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
