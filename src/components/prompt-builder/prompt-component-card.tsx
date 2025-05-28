
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { GripVertical } from "lucide-react";
import type { DragEvent } from 'react';

export type PromptComponentType = 
  | "system" | "user" | "rag" | "constraints" 
  | "guardrails" | "tools" | "examples";

interface PromptComponentCardProps {
  type: PromptComponentType;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  isDraggable?: boolean;
  "data-component-id"?: string;
}

const typeColors: Record<PromptComponentType, string> = {
  system: "bg-prompt-system/80 border-purple-400",
  user: "bg-prompt-user/80 border-blue-400",
  rag: "bg-prompt-rag/80 border-green-400",
  constraints: "bg-prompt-constraints/80 border-orange-400",
  guardrails: "bg-prompt-guardrails/80 border-red-400",
  tools: "bg-prompt-tools/80 border-yellow-400",
  examples: "bg-prompt-examples/80 border-teal-400",
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


export function PromptComponentCard({ type, title, description, icon: Icon, className, isDraggable = true, "data-component-id": componentId }: PromptComponentCardProps) {
  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    if (!isDraggable || !componentId) return;
    event.dataTransfer.setData("promptComponentId", componentId);
  };

  const displayDescription = isDraggable && description.length > 70 
    ? description.substring(0, 67) + "..." 
    : description;

  const bgColorClass = typeColors[type].split(' ').find(cls => cls.startsWith('bg-')) || 'bg-card';


  return (
    <div // Outer div for border
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      className={cn(
        "card-neon-animated-border rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 active:shadow-xl relative overflow-hidden min-w-[200px]",
        isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default",
        className
      )}
      title={description}
      data-component-id={componentId}
      style={{ padding: 'var(--neon-border-thickness)' }}
    >
      <div // Inner div for actual content and background
        className={cn(
          "w-full h-full p-4", // Original padding
          bgColorClass,
          typeTextColors[type]
        )}
        style={{ borderRadius: `calc(var(--radius) - var(--neon-border-thickness))` }}
      >
        <div className="absolute top-0 left-0 h-full w-1 bg-white/30"></div>
        <div className="flex items-center mb-2">
          <Icon className="w-5 h-5 mr-2 shrink-0" />
          <h3 className="font-semibold text-md">{title}</h3>
          {isDraggable && <GripVertical className="ml-auto w-5 h-5 text-white/50 cursor-grab" />}
        </div>
        <p className={cn("text-xs opacity-80", isDraggable ? "max-h-10 overflow-hidden" : "")}>
          {displayDescription}
        </p>
      </div>
    </div>
  );
}
