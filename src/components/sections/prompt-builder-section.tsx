
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { PromptComponentCard, type PromptComponentType } from "@/components/prompt-builder/prompt-component-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, type DragEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailableComponent {
  type: PromptComponentType;
  title: string;
  description: string;
  icon: LucideIcon;
}

const availableComponents: AvailableComponent[] = [
  { type: "system", title: "System Role", description: "Define AI's personality.", icon: Bot },
  { type: "user", title: "User Input", description: "What you want to ask.", icon: Puzzle },
  { type: "rag", title: "RAG Context", description: "Add external knowledge.", icon: ListChecks },
  { type: "constraints", title: "Constraints", description: "Set rules & limits.", icon: SlidersHorizontal },
  { type: "guardrails", title: "Guardrails", description: "Safety measures.", icon: ShieldCheck },
  { type: "tools", title: "Tools/Functions", description: "Define AI capabilities.", icon: Wrench },
  { type: "examples", title: "Examples", description: "Show sample I/O.", icon: Eye },
];

interface DroppedItem extends AvailableComponent {
  id: string;
}

export function PromptBuilderSection() {
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [draggedOver, setDraggedOver] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    setDraggedOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggedOver(false);
    const type = event.dataTransfer.getData("promptComponentType") as PromptComponentType;
    
    const originalComponent = availableComponents.find(c => c.type === type);
    if (originalComponent) {
      setDroppedItems(prev => [...prev, { ...originalComponent, id: Date.now().toString() }]);
    }
  };

  const handleRemoveItem = (idToRemove: string) => {
    setDroppedItems(prev => prev.filter(item => item.id !== idToRemove));
  };

  const livePreviewText = droppedItems.length > 0 
    ? droppedItems.map(item => `## ${item.title} (Type: ${item.type})\n${item.description}\n---`).join('\n\n')
    : "Your assembled prompt will appear here...";

  return (
    <SectionContainer
      id="workshop"
      title="PromptCraft Workshop"
      subtitle="Assemble your AI prompts like building blocks and see the magic happen."
      className="bg-background"
    >
      <div className="grid lg:grid-cols-3 gap-8 h-[70vh] max-h-[800px]">
        {/* Component Library Sidebar */}
        <GlassCard className="lg:col-span-1 h-full flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent">
              <Wand2 className="inline-block mr-2" />
              Prompt Components
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-3">
                {availableComponents.map((comp) => (
                  <PromptComponentCard
                    key={comp.type}
                    type={comp.type}
                    title={comp.title}
                    description={comp.description}
                    icon={comp.icon}
                  />
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </GlassCardContent>
        </GlassCard>

        {/* Prompt Assembly Area & Preview */}
        <GlassCard className="lg:col-span-2 h-full flex flex-col">
          <GlassCardHeader>
            <GlassCardTitle className="text-accent">
              <Puzzle className="inline-block mr-2" />
              Assembly & Preview
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="flex-grow grid grid-rows-2 gap-4 overflow-hidden">
            {/* Drop Zone */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
              className={cn(
                "bg-foreground/5 p-4 rounded-md border-2 border-dashed border-border row-span-1 overflow-y-auto space-y-2",
                draggedOver ? "border-primary ring-2 ring-primary" : "border-border",
                droppedItems.length === 0 ? "flex items-center justify-center" : "block"
              )}
            >
              {droppedItems.length === 0 ? (
                <p className="text-muted-foreground">Drag & Drop Prompt Components Here</p>
              ) : (
                droppedItems.map(item => (
                  <div key={item.id} className="relative group">
                    <PromptComponentCard
                      type={item.type}
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                      isDraggable={false} // Make cards in dropzone not draggable for now
                      className="opacity-90 group-hover:opacity-100"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1 right-1 h-6 w-6 text-red-500 hover:text-red-400 opacity-50 group-hover:opacity-100"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Remove component"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            {/* Real-time Preview */}
            <div className="row-span-1 flex flex-col">
              <h4 className="text-lg font-semibold text-primary mb-2">Live Prompt Preview:</h4>
              <Textarea
                readOnly
                placeholder="Your assembled prompt will appear here..."
                className="flex-grow bg-foreground/5 text-foreground/90 resize-none glass-card-content !p-3 !border-primary/30" 
                value={livePreviewText}
              />
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
       <Button variant="outline" size="lg" className="mt-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          Test Prompt with AI (Coming Soon)
        </Button>
    </SectionContainer>
  );
}
