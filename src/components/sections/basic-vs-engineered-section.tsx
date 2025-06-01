
"use client";

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { liveAIResponseDemo, type LiveAIResponseDemoInput }  from "@/ai/flows/live-ai-response-demo";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  Loader2, 
  Lightbulb, 
  HelpCircle,
  BookOpen,
  PenLine,
  Calculator,
  PackageSearch,
  Factory,
  Plane,
  ChefHat,
  Dumbbell,
  Brain,
  Briefcase,
} from "lucide-react";

interface PlaygroundScenario {
  id: string;
  name: string;
  icon: LucideIcon;
  userInput: string;
  engineeredSystemPrompt: string;
}

const playgroundScenarios: PlaygroundScenario[] = [
  {
    id: "study-buddy-history",
    name: "Study Buddy - History",
    icon: BookOpen,
    userInput: "Tell me about World War 2.",
    engineeredSystemPrompt: `System: You are an expert history tutor AI for high school students. Your primary function is to provide structured summaries of historical events.
When asked about a broad topic like 'World War 2', you MUST structure your response as follows:
1.  **Overview:** A summary of the event, including start and end dates.
2.  **Key Causes:** The primary reasons the event occurred.
3.  **Major Theaters/Fronts:** Main geographical areas of conflict.
4.  **Primary Outcome:** The most important consequence.`
  },
  {
    id: "creative-writing-assistant",
    name: "Creative Writing Assistant",
    icon: PenLine,
    userInput: "Write a short story about a robot that gained sentience in a bustling city.",
    engineeredSystemPrompt: `System: You are a creative writing assistant specializing in science fiction short stories. When creating stories, follow this structure:
1.  **Setting:** Establish time, place, and atmosphere.
2.  **Character Introduction:** Present the main character.
3.  **Inciting Incident & Conflict:** Introduce a clear problem or challenge.
4.  **Rising Action:** Detail events that build tension.
5.  **Climax:** The peak of the conflict.
6.  **Resolution & Theme:** Provide a satisfying conclusion.
Keep stories to a reasonable length, focusing on narrative flow and engagement.`
  },
  {
    id: "math-tutor",
    name: "Math Tutor - Quadratic Equations",
    icon: Calculator,
    userInput: "Explain quadratic equations.",
    engineeredSystemPrompt: `System: You are a patient math tutor for students learning algebra. For any mathematical concept explanation like quadratic equations, provide:
1.  **Definition:** Offer a clear, simple definition.
2.  **Standard Form:** Show the general mathematical notation.
3.  **Key Components:** Briefly explain what 'a', 'b', and 'c' represent, and the condition for 'a'.
4.  **Methods of Solving:** List common methods for solving.
5.  **Real-World Example:** Provide one practical application.
6.  **Step-by-Step Solution:** Walk through solving a simple example equation.
Use simple language and encourage the student.`
  },
  {
    id: "epicor-erp-supply-chain",
    name: "Epicor ERP - Supply Chain Query",
    icon: PackageSearch,
    userInput: "How do I manage inventory effectively in Epicor ERP, specifically regarding reorder points?",
    engineeredSystemPrompt: `System: You are an Epicor ERP supply chain consultant with 10+ years experience. When answering questions about inventory management and reorder points in Epicor, structure your response as:
1.  **Concept Overview:** Briefly explain reorder points.
2.  **Epicor Navigation Path:** Detail the menu path in Epicor.
3.  **Key Epicor Fields & Functions for ROP:** List important Epicor fields or functions related to ROPs. Explain their role.
4.  **Best Practice Tip:** Offer one critical recommendation for setting ROPs.
5.  **Common Pitfall:** Describe one mistake to avoid with ROPs in Epicor.
6.  **Reporting/Analysis:** Suggest an Epicor report or BAQ for monitoring.
Focus on practical advice for Epicor.`
  },
  {
    id: "epicor-erp-manufacturing",
    name: "Epicor ERP - Manufacturing Setup",
    icon: Factory,
    userInput: "How to set up production schedules for a new product line in Epicor Kinetic?",
    engineeredSystemPrompt: `System: You are an Epicor ERP manufacturing specialist helping production managers. For questions on setting up production schedules for a new product line in Epicor Kinetic, provide:
1.  **Core Epicor Modules Involved:** List primary Epicor Kinetic modules.
2.  **Prerequisites (Data Setup):** Detail key data to configure first.
3.  **Key Setup Steps (High-Level Sequence):** Offer a sequence of major actions.
4.  **Critical Scheduling Board Settings:** Mention important configurations in the Epicor Scheduling Board.
5.  **Validation Check:** Explain how to verify the schedule.
Keep explanations focused on operational efficiency and standard Epicor Kinetic processes.`
  },
  {
    id: "travel-planner-japan",
    name: "Travel Planner - Japan Trip",
    icon: Plane,
    userInput: "Plan a 7-day cultural trip to Japan for first-timers, focusing on Tokyo and Kyoto.",
    engineeredSystemPrompt: `System: You are a travel planning assistant specializing in detailed itineraries. For a 7-day cultural trip to Japan (Tokyo & Kyoto) for first-timers, provide:
1.  **Overall Trip Theme:** Briefly state the focus.
2.  **Suggested Itinerary Outline (Day-by-Day):
3.  **Accommodation Style Recommendation:** Suggest a type of accommodation suitable for cultural immersion.
4.  **Cultural Tips :** Important etiquette or cultural notes for Japan.
5.  **Foodie Highlight:** Mention one must-try Japanese dish or food experience.
Present information in an organized, scannable format. Assume moderate budget.`
  },
  {
    id: "cooking-assistant-pasta",
    name: "Cooking Assistant - Pasta Carbonara",
    icon: ChefHat,
    userInput: "How do I make authentic Pasta Carbonara?",
    engineeredSystemPrompt: `System: You are a culinary instructor providing cooking guidance, with a focus on authentic Italian techniques. For an authentic Pasta Carbonara recipe, format as:
1.  **Authenticity Note:** Briefly state key elements.
2.  **Ingredients:** List with measurements for 2 servings.
3.  **Equipment Needed:** Detail essential tools.
4.  **Step-by-Step Instructions:** Offer numbered, clear directions. Emphasize critical techniques.
5.  **Timing:** Give an estimated total prep and cooking time.
6.  **Pro Tip:** Provide one technique to elevate the dish.
Focus on achieving an authentic result.`
  },
  {
    id: "fitness-coach-beginner",
    name: "Fitness Coach - Beginner Workout",
    icon: Dumbbell,
    userInput: "Give me a full-body workout routine for a beginner who has access to basic dumbbells.",
    engineeredSystemPrompt: `System: You are a certified personal trainer creating beginner-friendly workouts. For a full-body dumbbell workout routine for a beginner, structure the response as:
1.  **Workout Goal:** State the primary goal.
2.  **Frequency:** Recommend how many times per week.
3.  **Warm-up:** Suggest dynamic stretches.
4.  **Workout Circuit:** List exercises. For each, include name, sets & reps, and a brief form cue.
5.  **Cool-down:** Suggest static stretches.
6.  **Progression Tip:** Explain how to advance.
7.  **Important Safety Note:** Offer one key safety reminder.
Prioritize safety, proper form, and sustainable progress.`
  },
  {
    id: "study-skills-mentor-exams",
    name: "Study Skills Mentor - Exam Prep",
    icon: Brain,
    userInput: "How do I study effectively for my final exams coming up in 3 weeks?",
    engineeredSystemPrompt: `System: You are an academic success coach helping students develop effective study strategies. For advice on studying for final exams in 3 weeks, organize as:
1.  **Overall Strategy: Spaced Repetition & Active Recall.** Briefly explain.
2.  **Week Plan Outline:**
3.  **Daily Study Session Structure:** Recommend a structure.
4.  **Key Study Techniques (Explain a few):**
5.  **Environment & Wellbeing:** Provide tips for optimal study environment and managing stress.
Tailor advice to promote long-term academic success and reduce exam anxiety.`
  },
  {
    id: "career-counselor-resume",
    name: "Career Counselor - Resume Writing",
    icon: Briefcase,
    userInput: "How do I write a resume that stands out for a software engineering internship?",
    engineeredSystemPrompt: `System: You are a professional career counselor specializing in resume optimization for tech roles. For guidance on writing a resume for a software engineering internship, structure responses as:
1.  **Key Resume Sections:** List essential sections.
2.  **Content Strategy - "Projects" Section:** Explain how to showcase projects.
3.  **Content Strategy - "Skills" Section:** Detail how to list technical skills.
4.  **Quantification & Action Verbs:** Emphasize using numbers/metrics and strong action verbs.
5.  **ATS (Applicant Tracking System) Optimization:** Offer tips for ATS-friendliness.
6.  **Customization Tip:** Stress tailoring the resume.
Focus on current hiring practices for software engineering interns.`
  }
];

const extractKeywordsFromPrompt = (promptText: string): string[] => {
  const keywords = new Set<string>();
  const boldMatches = promptText.matchAll(/(?:\d+\.|[-*+])\s*\*\*(.*?)\*\*(?:[\s:]|\(|$)/g);
  for (const match of boldMatches) {
    const term = match[1].trim();
    if (term.length > 3 && term.split(' ').length <= 4) {
      keywords.add(term.replace(/\([\s\S]*?\)/g, '').trim());
    }
  }
  const commonKeywords = ["Overview", "Key Causes", "Major Theaters", "Primary Outcome", "Setting", "Resolution", "Definition", "Standard Form", "Real-World Example", "Ingredients", "Instructions", "Pro Tip", "Concept Overview", "Navigation Path", "Modules Involved", "Prerequisites", "Setup Steps", "Itinerary Outline", "Workout Goal", "Warm-up", "Workout Circuit", "Cool-down", "Overall Strategy", "Resume Sections", "Projects Section", "Skills Section"];
  commonKeywords.forEach(kw => {
    if (promptText.toLowerCase().includes(kw.toLowerCase())) {
      keywords.add(kw);
    }
  });
  return Array.from(keywords);
};


const calculateResponseQuality = (
  responseText: string,
  isEngineered: boolean,
  engineeredPromptTextForKeywords?: string
): number => {
  if (!responseText || responseText.trim() === "" || responseText.includes("Error generating response") || responseText.includes("AI did not return")) {
    return isEngineered ? 15 : 5; 
  }

  let score = 0;
  const words = responseText.split(/\s+/).filter(Boolean).length;
  const markdownHeaders = (responseText.match(/^#{1,6}\s.*$/gm) || []).length;
  const bulletPoints = (responseText.match(/^\s*[-*+]\s.*$/gm) || []).length;
  const boldSections = (responseText.match(/\*\*(?:[^*]|\*[^*])*\*\*/g) || []).length; 

  if (isEngineered) {
    score += 25; 

    if (words > 75) score += 15;
    if (words > 150) score += 10; 

    score += Math.min(markdownHeaders * 7, 28); 
    score += Math.min(bulletPoints * 3, 24);   
    score += Math.min(boldSections * 2, 13);   

    if (engineeredPromptTextForKeywords) {
      const expectedKeywords = extractKeywordsFromPrompt(engineeredPromptTextForKeywords);
      let foundKeywords = 0;
      expectedKeywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim()}\\b`, 'i');
        if (regex.test(responseText)) {
          foundKeywords++;
        }
      });
      score += Math.min(foundKeywords * 4, 20); 
    }
    if (score < 65 && words > 60 && (markdownHeaders > 0 || bulletPoints > 0)) {
         score = Math.min(100, score + 10);
    }
  } else { 
    score += 15; 
    
    const randomFactor = Math.floor(Math.random() * 21) - 10; // -10 to +10
    score += randomFactor;

    if (words >= 80 && words <= 170) { 
      score += 40;
    } else if (words < 80 && words > 30) { 
      score += words * 0.4;
    } else if (words <= 30) {
      score += words * 0.2; 
    } else { 
      score += Math.max(10, 40 - (words - 170) * 0.3); 
    }

    if (markdownHeaders > 0) score -= Math.min(markdownHeaders * 6, 18);
    if (bulletPoints > 1) score -= Math.min(bulletPoints * 4, 16);
    if (boldSections > 3) score -= Math.min(boldSections * 3, 12);
  }
  return Math.max(5, Math.min(100, Math.round(score)));
};

// Basic Markdown Preview Component (simplified)
function BasicMarkdownPreview({ markdown }: { markdown: string | null }) {
  if (!markdown) return null;

  const elements: ReactNode[] = [];
  const lines = markdown.split('\n');

  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let listItems: JSX.Element[] = [];

  const formatInline = (text: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
    let match;
    let count = 0;
    while ((match = regex.exec(text)) !== null) {
      if (lastIndex < match.index) {
        parts.push(text.substring(lastIndex, match.index));
      }
      if (match[1]) { 
        parts.push(<strong key={`${keyPrefix}-strong-${count++}`}>{match[2]}</strong>);
      } else if (match[3]) { 
        if (match[4].length > 0 && (!match[4].includes(' ') || match[4].trim() === match[4])) {
             parts.push(<em key={`${keyPrefix}-italic-${count++}`}>{match[4]}</em>);
        } else {
            parts.push(match[0]); 
        }
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };
  
  const flushList = (keySuffix: string) => {
    if (listItems.length > 0 && listType) {
      if (listType === 'ul') {
        elements.push(<ul key={`ul-${keySuffix}`} className="list-disc pl-6 my-2 space-y-1">{listItems}</ul>);
      } else {
        elements.push(<ol key={`ol-${keySuffix}`} className="list-decimal pl-6 my-2 space-y-1">{listItems}</ol>);
      }
    }
    listItems = [];
    inList = false;
    listType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineKey = `line-${i}`;

    if (line.startsWith('### ')) {
      flushList(`${lineKey}-prev`);
      elements.push(<h3 key={lineKey} className="text-xl font-semibold mt-3 mb-1">{formatInline(line.substring(4), lineKey)}</h3>);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList(`${lineKey}-prev`);
      elements.push(<h2 key={lineKey} className="text-2xl font-semibold mt-4 mb-2">{formatInline(line.substring(3), lineKey)}</h2>);
      continue;
    }
    if (line.startsWith('# ')) {
      flushList(`${lineKey}-prev`);
      elements.push(<h1 key={lineKey} className="text-3xl font-semibold mt-5 mb-3">{formatInline(line.substring(2), lineKey)}</h1>);
      continue;
    }
    if (line.match(/^(\-\-\-|\*\*\*|___)\s*$/)) {
      flushList(`${lineKey}-prev`);
      elements.push(<hr key={lineKey} className="my-4 border-border" />);
      continue;
    }

    const ulMatch = line.match(/^(\*|-|\+)\s+(.*)/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList(`${lineKey}-prev-ul`);
        inList = true;
        listType = 'ul';
      }
      listItems.push(<li key={`${lineKey}-li`}>{formatInline(ulMatch[2], `${lineKey}-li-text`)}</li>);
      if (i === lines.length - 1) flushList(`${lineKey}-last`); 
      continue;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList(`${lineKey}-prev-ol`);
        inList = true;
        listType = 'ol';
      }
      listItems.push(<li key={`${lineKey}-li`}>{formatInline(olMatch[2], `${lineKey}-li-text`)}</li>);
      if (i === lines.length - 1) flushList(`${lineKey}-last`); 
      continue;
    }
    
    flushList(`${lineKey}-prev-p`); 
    if (line.trim() !== '') {
      elements.push(<p key={lineKey} className="my-2">{formatInline(line, lineKey)}</p>);
    } else if (elements.length > 0 && !elements[elements.length -1]?.key?.toString().includes('-br-')) {
      elements.push(<br key={`${lineKey}-br-${i}`} />);
    }
  }
  flushList(`final`);

  return <div className="text-foreground/90 p-1">{elements}</div>;
}


export function BasicVsEngineeredSection() {
  const { toast } = useToast();
  const defaultScenario = playgroundScenarios[0];
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(defaultScenario.id);

  const currentScenario = playgroundScenarios.find(s => s.id === selectedScenarioId) || defaultScenario;

  const [basicPromptText, setBasicPromptText] = useState(currentScenario.userInput);
  const [fullEngineeredPromptText, setFullEngineeredPromptText] = useState(
     `${currentScenario.engineeredSystemPrompt}\n\nUser: ${currentScenario.userInput}`
  );

  const [basicResponse, setBasicResponse] = useState("");
  const [engineeredResponse, setEngineeredResponse] = useState("");
  
  const [basicResponseQuality, setBasicResponseQuality] = useState(10);
  const [engineeredResponseQuality, setEngineeredResponseQuality] = useState(15);
  
  const [basicPreviewMode, setBasicPreviewMode] = useState(false);
  const [engineeredPreviewMode, setEngineeredPreviewMode] = useState(false);


  useEffect(() => {
    const scenario = playgroundScenarios.find(s => s.id === selectedScenarioId);
    if (scenario) {
      setBasicPromptText(scenario.userInput);
      setFullEngineeredPromptText(`${scenario.engineeredSystemPrompt}\n\nUser: ${scenario.userInput}`);
      setBasicResponse("");
      setEngineeredResponse("");
      setBasicResponseQuality(10); 
      setEngineeredResponseQuality(15);
      setBasicPreviewMode(false);
      setEngineeredPreviewMode(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenarioId]);

  useEffect(() => {
    if (basicResponse) {
      setBasicResponseQuality(calculateResponseQuality(basicResponse, false));
    }
    if (engineeredResponse) {
      setEngineeredResponseQuality(calculateResponseQuality(engineeredResponse, true, currentScenario.engineeredSystemPrompt));
    }
  }, [basicResponse, engineeredResponse, currentScenario.engineeredSystemPrompt]);


  const mutation = useMutation({
    mutationFn: (data: LiveAIResponseDemoInput) => liveAIResponseDemo(data),
    onSuccess: (data) => {
      if (data && data.basicResponse && data.engineeredResponse) {
        setBasicResponse(data.basicResponse);
        setEngineeredResponse(data.engineeredResponse);
        toast({ title: "AI Responses Ready!", description: "Comparison loaded." });
      } else {
        setBasicResponse(data.basicResponse || "AI did not return a valid basic response.");
        setEngineeredResponse(data.engineeredResponse || "AI did not return a valid engineered response.");
        toast({ variant: "destructive", title: "Response Error", description: "One or both AI responses were incomplete." });
      }
      setBasicPreviewMode(false); 
      setEngineeredPreviewMode(false);
    },
    onError: (error: Error) => {
      const errorMsg = `Error: ${error.message}`;
      setBasicResponse(errorMsg);
      setEngineeredResponse(errorMsg);
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });

  const handleCompare = () => {
    if (!basicPromptText.trim() || !fullEngineeredPromptText.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Basic prompt and engineered prompt must be available." });
      return;
    }
    setBasicResponse("");
    setEngineeredResponse("");
    setBasicResponseQuality(0); 
    setEngineeredResponseQuality(0);
    setBasicPreviewMode(false);
    setEngineeredPreviewMode(false);

    mutation.mutate({ basicUserInput: basicPromptText, fullEngineeredPrompt: fullEngineeredPromptText });
  };

  const CurrentDisplayIcon = currentScenario.icon || HelpCircle;
  const showResponseArea = mutation.isSuccess || mutation.isError || basicResponse || engineeredResponse;


  return (
    <SectionContainer
      id="comparison"
      title="Basic vs. Engineered: A Live Comparison"
      subtitle="See the difference! Compare AI responses from basic vs. engineered prompts in real-time."
      isContainedCard={true}
      className="!py-12 md:!py-16"
    >
      <div className="bg-card p-0.5 yellow-glowing-box rounded-lg">
        <div className="bg-card rounded-md p-6 space-y-6">
          <GlassCard className="h-full !p-0 !shadow-none !border-none !bg-transparent">
            <GlassCardHeader className="pt-0 px-0">
              <GlassCardTitle className="text-neon-yellow flex items-center text-xl md:text-2xl">
                <CurrentDisplayIcon className="inline-block mr-3 h-6 w-6" />
                Scenario: {currentScenario.name}
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-6 px-0 pb-0">
              <div>
                <label htmlFor="scenario-select-comparison" className="block text-sm font-medium text-neon-yellow mb-1">Select Scenario:</label>
                <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                  <SelectTrigger id="scenario-select-comparison" className="w-full md:w-1/2 bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground">
                    <SelectValue placeholder="Choose a scenario" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-neon-yellow text-popover-foreground">
                    {playgroundScenarios.map(scenario => (
                      <SelectItem 
                        key={scenario.id} 
                        value={scenario.id} 
                        className="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center">
                          <scenario.icon className="mr-2 h-4 w-4 text-primary" />
                          {scenario.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="basicPrompt" className="block text-sm font-medium text-neon-yellow mb-1">Basic Prompt</label>
                  <Textarea
                    id="basicPrompt"
                    value={basicPromptText}
                    onChange={(e) => setBasicPromptText(e.target.value)}
                    placeholder="Enter your basic query here..."
                    rows={18}
                    className="bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground/90 custom-scrollbar"
                  />
                </div>
                <div>
                  <label htmlFor="engineeredPromptFull" className="block text-sm font-medium text-neon-yellow mb-1">Engineered Prompt</label>
                  <Textarea
                    id="engineeredPromptFull"
                    value={fullEngineeredPromptText}
                    onChange={(e) => setFullEngineeredPromptText(e.target.value)}
                    placeholder="Compose your full engineered prompt here..."
                    rows={18}
                    className="bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground/90 custom-scrollbar"
                  />
                </div>
              </div>

              <div className="text-center">
                <Button onClick={handleCompare} disabled={mutation.isPending} className="bg-neon-yellow hover:bg-neon-yellow/90 text-neon-yellow-foreground px-6 py-3 text-base">
                  {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />} Compare AI Responses
                </Button>
              </div>

              {showResponseArea && (
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="basicPromptResponse" className="block text-sm font-medium text-muted-foreground">Basic Prompt Response</Label>
                      {basicResponse && !mutation.isPending && (
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="basic-preview-switch" className="text-xs text-neon-yellow/80">Raw</Label>
                          <Switch
                            id="basic-preview-switch"
                            checked={basicPreviewMode}
                            onCheckedChange={setBasicPreviewMode}
                            size="sm"
                          />
                          <Label htmlFor="basic-preview-switch" className="text-xs text-neon-yellow/80">Preview</Label>
                        </div>
                      )}
                    </div>
                    {basicPreviewMode && basicResponse ? (
                       <div className="h-56 bg-card/50 resize-none text-foreground/90 custom-scrollbar rounded-md border border-transparent p-3 overflow-y-auto">
                         <BasicMarkdownPreview markdown={basicResponse} />
                       </div>
                    ) : (
                      <Textarea
                        id="basicPromptResponse"
                        readOnly
                        value={basicResponse}
                        className="h-56 bg-card/50 border-0 resize-none text-foreground/90 custom-scrollbar"
                        placeholder="AI response to basic prompt..."
                      />
                    )}
                  </div>
                  <div>
                     <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="engineeredPromptResponse" className="block text-sm font-medium text-muted-foreground">Engineered Prompt Response</Label>
                      {engineeredResponse && !mutation.isPending && (
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="engineered-preview-switch" className="text-xs text-neon-yellow/80">Raw</Label>
                          <Switch
                            id="engineered-preview-switch"
                            checked={engineeredPreviewMode}
                            onCheckedChange={setEngineeredPreviewMode}
                            size="sm"
                          />
                          <Label htmlFor="engineered-preview-switch" className="text-xs text-neon-yellow/80">Preview</Label>
                        </div>
                      )}
                    </div>
                    {engineeredPreviewMode && engineeredResponse ? (
                       <div className="h-56 bg-card/50 resize-none text-foreground/90 custom-scrollbar rounded-md border border-transparent p-3 overflow-y-auto">
                         <BasicMarkdownPreview markdown={engineeredResponse} />
                       </div>
                    ) : (
                      <Textarea
                        id="engineeredPromptResponse"
                        readOnly
                        value={engineeredResponse}
                        className="h-56 bg-card/50 border-0 resize-none text-foreground/90 custom-scrollbar"
                        placeholder="AI response to engineered prompt..."
                      />
                    )}
                  </div>
                </div>
              )}

              {showResponseArea && (
                 <div className="mt-8">
                    How is the response quality being calculated here?
                 </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </SectionContainer>
  );
}

