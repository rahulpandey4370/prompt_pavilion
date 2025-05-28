import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { GripVertical } from "lucide-react";

export type PromptComponentType = 
  | "system" | "user" | "rag" | "constraints" 
  | "guardrails" | "tools" | "examples";

interface PromptComponentCardProps {
  type: PromptComponentType;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const typeColors: Record<PromptComponentType, string> = {
  system: "bg-purple-500/80 border-purple-400", // System Prompt (purple)
  user: "bg-blue-500/80 border-blue-400",       // User Input (blue)
  rag: "bg-green-500/80 border-green-400",       // RAG Context (green)
  constraints: "bg-orange-500/80 border-orange-400", // Constraints (orange)
  guardrails: "bg-red-500/80 border-red-400",     // Guardrails (red)
  tools: "bg-yellow-500/80 border-yellow-400",   // Tools/Functions (yellow)
  examples: "bg-teal-500/80 border-teal-400",    // Examples (teal)
};

const typeTextColors: Record<PromptComponentType, string> = {
  system: "text-purple-100",
  user: "text-blue-100",
  rag: "text-green-100",
  constraints: "text-orange-100",
  guardrails: "text-red-100",
  tools: "text-yellow-100",
  examples: "text-teal-100",
};


export function PromptComponentCard({ type, title, description, icon: Icon, className }: PromptComponentCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing transition-all duration-150 ease-in-out transform hover:scale-105 active:shadow-xl relative overflow-hidden min-w-[200px]",
        typeColors[type],
        typeTextColors[type],
        "border-2",
        className
      )}
    >
      <div className="absolute top-0 left-0 h-full w-1 bg-white/30"></div>
      <div className="flex items-center mb-2">
        <Icon className="w-5 h-5 mr-2 shrink-0" />
        <h3 className="font-semibold text-md">{title}</h3>
        <GripVertical className="ml-auto w-5 h-5 text-white/50 cursor-grab" />
      </div>
      <p className="text-xs opacity-80">{description}</p>
    </div>
  );
}
