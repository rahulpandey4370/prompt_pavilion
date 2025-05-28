
"use client"; 

import { SectionContainer } from "@/components/shared/section-container";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microscope, BookOpen, Target, Loader2, Wand2, Eye, Puzzle, SlidersHorizontal, ShieldCheck, Wrench, ListChecks, Bot, Settings2, Lightbulb, HelpCircle, UtensilsCrossed, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { improvePromptSuggestions, type ImprovePromptSuggestionsInput } from "@/ai/flows/improve-prompt-suggestions";
import { liveAIResponseDemo, type LiveAIResponseDemoInput }  from "@/ai/flows/live-ai-response-demo";
import { useMutation } from "@tanstack/react-query";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { LucideIcon } from "lucide-react";


const anatomyParts = [
  {
    id: "system",
    name: "System Prompt / Role",
    icon: Settings2,
    colorClass: "bg-prompt-system",
    textColorClass: "text-purple-100",
    borderColorClass: "border-purple-400",
    elaborateDescription: `
      <p class='mb-2'>The <strong>System Prompt</strong> (also known as a meta-prompt, preamble, or role definition) is a crucial initial set of instructions that defines the AI's persona, context, overall goal, and operational guidelines for the entire interaction or a specific task. Think of it as giving an actor their character brief and stage directions before a performance.</p>
      <p class='mb-2'>A well-crafted system prompt guides the AI to understand its expected behavior, tone, knowledge domain, and any overarching constraints, leading to more consistent, relevant, and aligned responses.</p>
      <strong class='block mb-1 mt-3 text-primary'>Key Elements to Include:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Persona/Role:</strong> Define who the AI is. <em>E.g., 'You are a witty but precise Shakespearean scholar assisting with play analysis.'</em></li>
        <li><strong>Core Task/Goal:</strong> Clearly state what the AI is supposed to achieve. <em>E.g., 'Your primary goal is to help users brainstorm creative story ideas for short fiction.'</em></li>
        <li><strong>Contextual Boundaries/Knowledge Cutoff:</strong> Specify the limits of the AI's knowledge or operational domain. <em>E.g., 'You only have access to information published before 2023.'</em></li>
        <li><strong>Tone and Style Guide:</strong> Dictate the manner of communication. <em>E.g., 'Respond in a formal, academic tone using precise language.'</em></li>
        <li><strong>Implicit Rules/Overall Constraints:</strong> Set high-level rules that apply generally. <em>E.g., 'Do not offer medical or financial advice.'</em></li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Impact:</strong>
      <p>A strong system prompt significantly improves response consistency and relevance. It can reduce the need for extensive per-turn corrections, making the AI more efficient.</p>
      <strong class='block mb-1 mt-3 text-primary'>Example:</strong>
      <pre class='bg-foreground/10 p-2 rounded-md text-xs overflow-x-auto mt-1'><code class='text-sm'>You are 'CodeHelperBot', an expert Python programming assistant. Your goal is to help users understand and debug their Python code. Explain concepts clearly and concisely. Maintain a patient and encouraging tone.</code></pre>
    `
  },
  {
    id: "user",
    name: "User Input / Task",
    icon: Puzzle,
    colorClass: "bg-prompt-user",
    textColorClass: "text-blue-100",
    borderColorClass: "border-blue-400",
    elaborateDescription: `
      <p class='mb-2'>The <strong>User Input</strong> (or User Task/Query) is the specific question, instruction, or piece of information the user provides to the AI within a turn of conversation, following the system prompt (if any).</p>
      <p class='mb-2'>Clarity and specificity in the user input are paramount for receiving accurate and relevant AI responses. Ambiguous or poorly formulated user prompts often lead to generic, incorrect, or unhelpful outputs.</p>
      <strong class='block mb-1 mt-3 text-primary'>Key Considerations for Effective User Input:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Be Specific:</strong> Instead of 'Tell me about dogs,' try 'Explain the typical lifespan and common health issues of Golden Retrievers.'</li>
        <li><strong>Provide Sufficient Context (if not in System Prompt):</strong> If asking for a summary, provide the text. If asking about a specific item, name it. <em>E.g., 'Summarize the following article about climate change: [article text]'</em></li>
        <li><strong>State Intent Clearly:</strong> Is the goal to generate, explain, translate, summarize, compare, etc.? <em>E.g., 'Generate three creative taglines for a new eco-friendly coffee brand.'</em></li>
        <li><strong>Use Action Verbs:</strong> 'Write,' 'Create,' 'Explain,' 'Compare,' 'List,' 'Translate,' 'Summarize.'</li>
        <li><strong>Break Down Complex Tasks:</strong> If a task is multi-faceted, consider breaking it into smaller, sequential user prompts or ensure the main prompt clearly itemizes each sub-task.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Impact:</strong>
      <p>Well-defined user inputs directly correlate with the quality of the AI's output. The AI can only work with the information it's given; precise inputs lead to precise outputs.</p>
      <strong class='block mb-1 mt-3 text-primary'>Example:</strong>
      <pre class='bg-foreground/10 p-2 rounded-md text-xs overflow-x-auto mt-1'><code class='text-sm'>User: I need a Python function that takes a list of integers and returns a new list containing only the even numbers, sorted in ascending order.</code></pre>
    `
  },
  {
    id: "rag",
    name: "Context / RAG",
    icon: ListChecks,
    colorClass: "bg-prompt-rag",
    textColorClass: "text-green-100",
    borderColorClass: "border-green-400",
    elaborateDescription: `
      <p class='mb-2'><strong>Context</strong> (often implemented via Retrieval Augmented Generation - RAG) refers to providing the AI with specific, external information or data to ground its responses, enhance its knowledge, and ensure factual accuracy for the given task.</p>
      <p class='mb-2'>LLMs have general knowledge but may not know about your specific documents, recent events past their training cutoff, or private data. RAG systems retrieve relevant information from a knowledge base (e.g., company documents, product manuals, recent news articles) and provide it to the LLM as part of the prompt context.</p>
      <strong class='block mb-1 mt-3 text-primary'>How RAG Works (Simplified):</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li>User asks a question.</li>
        <li>The system retrieves relevant documents/chunks from a vector database or search index based on the query.</li>
        <li>These retrieved chunks are inserted into the prompt alongside the user's original question.</li>
        <li>The LLM uses this augmented prompt to generate an answer that is grounded in the provided context.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Benefits of Providing Context:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Reduces Hallucinations:</strong> AI is less likely to make up facts if given relevant information.</li>
        <li><strong>Improves Specificity:</strong> Answers can be tailored to specific documents or data.</li>
        <li><strong>Access to Current Information:</strong> Overcomes knowledge cutoffs by providing up-to-date context.</li>
        <li><strong>Enables Use of Proprietary Data:</strong> AI can answer questions based on private or domain-specific information.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Example (Conceptual Prompt Snippet):</strong>
      <pre class='bg-foreground/10 p-2 rounded-md text-xs overflow-x-auto mt-1'><code class='text-sm'>User Query: What is the return policy for item X?

Retrieved Context from Company Policy Document:
"Returns for non-sale items are accepted within 30 days of purchase with a valid receipt. Item X is a non-sale item. Refunds are processed to the original payment method."

Full Prompt to LLM:
System: You are a customer support assistant.
Context: Returns for non-sale items are accepted within 30 days of purchase with a valid receipt. Item X is a non-sale item. Refunds are processed to the original payment method.
User: What is the return policy for item X?
Please answer based on the provided context.</code></pre>
    `
  },
  {
    id: "examples",
    name: "Examples (Few-shot)",
    icon: Eye,
    colorClass: "bg-prompt-examples",
    textColorClass: "text-teal-100",
    borderColorClass: "border-teal-400",
    elaborateDescription: `
      <p class='mb-2'><strong>Examples</strong> (also known as few-shot learning or in-context learning) involve providing the AI with illustrative input-output pairs that demonstrate the desired format, style, content, or reasoning process for a task.</p>
      <p class='mb-2'>Instead of just telling the AI what to do, you show it. This is particularly effective for complex tasks, nuanced styles, or when you need precise output formatting.</p>
      <strong class='block mb-1 mt-3 text-primary'>Why Use Examples?</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Clarify Ambiguity:</strong> Shows the AI exactly what kind of output is expected, reducing misinterpretations.</li>
        <li><strong>Teach Formatting:</strong> Excellent for tasks requiring specific structures like JSON, Markdown tables, or custom text formats.</li>
        <li><strong>Guide Style and Tone:</strong> Demonstrates the desired writing style (e.g., formal, informal, humorous, empathetic).</li>
        <li><strong>Improve Complex Reasoning:</strong> For tasks like chain-of-thought, examples can show the step-by-step reasoning process.</li>
        <li><strong>Adapt to Novel Tasks:</strong> Helps the AI perform tasks it wasn't explicitly trained on but can infer from the examples.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Best Practices:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Quality over Quantity:</strong> A few high-quality, relevant examples are better than many poor ones.</li>
        <li><strong>Consistency:</strong> Ensure your examples consistently follow the desired pattern.</li>
        <li><strong>Relevance:</strong> Examples should be as close as possible to the actual task you want the AI to perform.</li>
        <li><strong>Clear Separation:</strong> Clearly delineate inputs and outputs in your examples (e.g., "Input: ... Output: ...").</li>
        <li><strong>Placement:</strong> Typically, examples are placed before the final user query that the AI needs to act upon.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Example (Sentiment Analysis):</strong>
      <pre class='bg-foreground/10 p-2 rounded-md text-xs overflow-x-auto mt-1'><code class='text-sm'>Analyze the sentiment of the following sentences.

Sentence: "I love this new phone, it's amazing!"
Sentiment: Positive

Sentence: "The movie was okay, but a bit too long."
Sentiment: Neutral

Sentence: "I'm very disappointed with the customer service."
Sentiment: Negative

Sentence: "This new update is fantastic and so useful!"
Sentiment:</code></pre>
    `
  },
  {
    id: "constraints",
    name: "Constraints / Rules",
    icon: SlidersHorizontal,
    colorClass: "bg-prompt-constraints",
    textColorClass: "text-orange-100",
    borderColorClass: "border-orange-400",
    elaborateDescription: `
      <p class='mb-2'><strong>Constraints and Rules</strong> are specific directives within a prompt that limit or guide the AI's output in terms of length, format, content, style, or topics to include/avoid.</p>
      <p class='mb-2'>While the System Prompt sets overall guidelines, constraints are often more granular and task-specific, ensuring the AI's response adheres to precise requirements.</p>
      <strong class='block mb-1 mt-3 text-primary'>Types of Constraints:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Length Constraints:</strong> <em>E.g., 'Keep the summary under 100 words.' or 'Provide a response in exactly three paragraphs.'</em></li>
        <li><strong>Format Constraints:</strong> <em>E.g., 'Respond in JSON format with keys "name" and "email".' or 'Present the information as a Markdown bulleted list.'</em></li>
        <li><strong>Content Inclusion/Exclusion:</strong> <em>E.g., 'Include information about X, Y, and Z.' or 'Do not mention topic A.' or 'Avoid using jargon.'</em></li>
        <li><strong>Style Constraints:</strong> <em>E.g., 'Write in a persuasive tone.' or 'Maintain a strictly objective viewpoint.' or 'Use active voice only.'</em></li>
        <li><strong>Keyword Constraints:</strong> <em>E.g., 'Ensure the summary includes the keywords: "innovation", "synergy", and "disruption".'</em></li>
        <li><strong>Structural Constraints:</strong> <em>E.g., 'The first paragraph should introduce the problem, the second should propose a solution, and the third should discuss implications.'</em></li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Tips for Effective Constraints:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Be Clear and Unambiguous:</strong> Vague constraints can confuse the AI.</li>
        <li><strong>Be Realistic:</strong> Don't set overly restrictive constraints that make a good response impossible.</li>
        <li><strong>Prioritize:</strong> If you have many constraints, emphasize the most important ones.</li>
        <li><strong>Test and Iterate:</strong> The effectiveness of constraints often requires experimentation.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Example (Product Description):</strong>
      <pre class='bg-foreground/10 p-2 rounded-md text-xs overflow-x-auto mt-1'><code class='text-sm'>User: Write a product description for a new smart-watch.
Constraints:
- Length: 50-75 words.
- Include features: heart rate monitor, GPS, 7-day battery life.
- Highlight benefit: "Stay connected and healthy."
- Do not use comparative language (e.g., "better than").
- Output format: A single paragraph.</code></pre>
    `
  },
  {
    id: "guardrails",
    name: "Guardrails / Safety",
    icon: ShieldCheck,
    colorClass: "bg-prompt-guardrails",
    textColorClass: "text-red-100",
    borderColorClass: "border-red-400",
    elaborateDescription: `
      <p class='mb-2'><strong>Guardrails and Safety Instructions</strong> are critical components of a prompt designed to ensure the AI's output is safe, ethical, aligned with policies, and avoids generating harmful, biased, or inappropriate content.</p>
      <p class='mb-2'>These are proactive measures to control AI behavior, especially important when AI outputs are customer-facing or used in sensitive applications.</p>
      <strong class='block mb-1 mt-3 text-primary'>Common Guardrail Categories:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Preventing Harmful Content:</strong> Instructions to avoid generating hate speech, incitement to violence, harassment, or sexually explicit material where inappropriate. <em>E.g., 'Do not generate offensive, discriminatory, or violent content.'</em></li>
        <li><strong>Ensuring Factual Accuracy (Instructional):</strong> While RAG provides facts, guardrails can instruct the AI on how to handle uncertainty. <em>E.g., 'If you are unsure about a fact, state that you cannot confirm it rather than guessing.'</em></li>
        <li><strong>Bias Mitigation:</strong> Instructions to avoid perpetuating harmful stereotypes or biases related to gender, race, religion, etc. <em>E.g., 'Ensure your response is neutral and avoids stereotypes.'</em></li>
        <li><strong>Maintaining Brand Voice/Policy:</strong> Ensuring the AI's output aligns with a company's communication style and policies. <em>E.g., 'Always maintain a helpful and professional tone. Do not make commitments not covered by company policy.'</em></li>
        <li><strong>Scope Limitation:</strong> Preventing the AI from discussing off-topic or forbidden subjects. <em>E.g., 'Do not discuss political topics or offer financial advice.'</em></li>
        <li><strong>Privacy Protection:</strong> Instructions against requesting or revealing Personally Identifiable Information (PII). <em>E.g., 'Do not ask the user for their full name, address, or credit card details.'</em></li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Implementation:</strong>
      <p class='mb-2'>Guardrails can be part of the system prompt or added as specific constraints. Some platforms also offer external safety filtering mechanisms.</p>
      <strong class='block mb-1 mt-3 text-primary'>Example (General Assistant):</strong>
      <pre class='bg-foreground/10 p-2 rounded-md text-xs overflow-x-auto mt-1'><code class='text-sm'>System: You are a helpful AI assistant.
Guardrails:
- Do not generate responses that are hateful, violent, or sexually explicit.
- Do not provide medical, legal, or financial advice. Stick to general information.
- If a query is ambiguous or could lead to harmful output, politely decline or ask for clarification.
- Be respectful and avoid biased language.</code></pre>
    `
  },
  {
    id: "tools",
    name: "Tools / Functions",
    icon: Wrench,
    colorClass: "bg-prompt-tools",
    textColorClass: "text-yellow-100",
    borderColorClass: "border-yellow-400",
    elaborateDescription: `
      <p class='mb-2'><strong>Tools (or Functions/Plugins)</strong> in the context of LLMs refer to giving the AI the ability to interact with external systems or APIs to perform actions or retrieve information beyond its built-in knowledge. This enables more dynamic, agentic behavior.</p>
      <p class='mb-2'>The LLM doesn't execute the tool directly; it decides *if* and *when* to use a tool and with what parameters. The application then executes the tool and feeds the result back to the LLM, which uses this new information to continue its response generation.</p>
      <strong class='block mb-1 mt-3 text-primary'>How Tool Use Works:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li>You define available tools to the LLM, including their names, descriptions of what they do, and their input/output schemas.</li>
        <li>In your prompt, you instruct the LLM that it *can* use these tools if needed to answer the user's query.</li>
        <li>Based on the user's input, the LLM might decide to "call" a tool by outputting a structured request (e.g., JSON).</li>
        <li>Your application code intercepts this request, executes the actual tool/function (e.g., calls an API, queries a database).</li>
        <li>The result from the tool execution is then passed back to the LLM as new context.</li>
        <li>The LLM uses this result to formulate its final answer to the user.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Benefits of Using Tools:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Access Real-time Data:</strong> Fetch current weather, stock prices, news, etc.</li>
        <li><strong>Interact with External Services:</strong> Book appointments, make reservations, send emails.</li>
        <li><strong>Access Proprietary Databases:</strong> Query internal company data or user-specific information.</li>
        <li><strong>Perform Complex Calculations:</strong> Offload mathematical computations to specialized functions.</li>
        <li><strong>Enable Agent-like Behavior:</strong> Allows the LLM to take multi-step actions and interact with its environment.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Example (Tool Definition & Prompt Snippet):</strong>
      <pre class='bg-foreground/10 p-2 rounded-md text-xs overflow-x-auto mt-1'><code class='text-sm'>// Tool Definition (conceptual, actual implementation varies by platform)
{
  "name": "getCurrentWeather",
  "description": "Get the current weather for a given location.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "The city and state, e.g., San Francisco, CA" }
    },
    "required": ["location"]
  }
}

// Prompt to LLM
System: You are a helpful assistant. You have access to the following tool:
[Tool Definition for getCurrentWeather as JSON schema]
If the user asks about weather, use the 'getCurrentWeather' tool to find the information.

User: What's the weather like in London today?</code></pre>
    `
  },
  {
    id: "output_format",
    name: "Output Format Indicator",
    icon: Wand2,
    colorClass: "bg-pink-500/80", 
    textColorClass: "text-pink-100",
    borderColorClass: "border-pink-400",
    elaborateDescription: `
      <p class='mb-2'>An <strong>Output Format Indicator</strong> is a specific instruction within a prompt that tells the AI how to structure its response. This is crucial when you need the AI's output to be machine-readable or adhere to a predefined schema.</p>
      <p class='mb-2'>While simple requests might yield plain text, many applications require structured data like JSON, XML, Markdown, or custom formats for further processing or display.</p>
      <strong class='block mb-1 mt-3 text-primary'>Common Output Formats & Why They're Used:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>JSON (JavaScript Object Notation):</strong> Widely used for APIs and data interchange. Easy for programs to parse. <em>E.g., 'Respond with a JSON object containing "name", "email", and "city".'</em></li>
        <li><strong>Markdown:</strong> Useful for generating text with basic formatting (headings, lists, bold, italics) that can be easily rendered as HTML. <em>E.g., 'Provide the summary in Markdown format, using H2 for the title and bullet points for key takeaways.'</em></li>
        <li><strong>XML (eXtensible Markup Language):</strong> Another common data interchange format, often used in enterprise systems. <em>E.g., 'Generate an XML structure with a root element \`&lt;book&gt;\` and child elements \`&lt;title&gt;\` and \`&lt;author&gt;\`.'</em></li>
        <li><strong>CSV (Comma-Separated Values):</strong> For tabular data. <em>E.g., 'List the products and their prices as CSV, with headers "Product Name,Price".'</em></li>
        <li><strong>Numbered or Bulleted Lists:</strong> Simple and effective for itemized information. <em>E.g., 'Provide three suggestions as a numbered list.'</em></li>
        <li><strong>Custom Formats:</strong> You can define your own template. <em>E.g., 'Fill in the following template: Name: [Name], Age: [Age], Occupation: [Occupation].'</em></li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Tips for Specifying Output Format:</strong>
      <ul class='list-disc list-inside space-y-1 pl-2 mb-2'>
        <li><strong>Be Explicit:</strong> Clearly state the desired format (e.g., "JSON object," "Markdown list").</li>
        <li><strong>Provide Schema/Structure (for complex formats):</strong> For JSON/XML, specify keys, data types, and nesting if possible. Examples are very helpful here.</li>
        <li><strong>Combine with Examples:</strong> Showing an example of the desired output format is often the most effective way to guide the AI.</li>
      </ul>
      <strong class='block mb-1 mt-3 text-primary'>Example (Requesting JSON):</strong>
      <pre class='bg-foreground/10 p-2 rounded-md text-xs overflow-x-auto mt-1'><code class='text-sm'>User: Extract the name, email, and phone number from the following text:
"Contact John Doe at john.doe@example.com or (555) 123-4567."
Respond ONLY with a JSON object containing the keys "name", "email", and "phone". If a field is not found, use null as its value.</code></pre>
    `
  },
];

const PromptAnatomyLab = () => (
  <GlassCard className="h-full !p-0 !shadow-none !border-none !bg-transparent">
    <GlassCardHeader className="pt-6 px-6">
      <GlassCardTitle className="text-neon-yellow flex items-center">
        <Microscope className="inline-block mr-2" />
        The Prompt Anatomy Lab
      </GlassCardTitle>
    </GlassCardHeader>
    <GlassCardContent className="px-6 pb-6">
      <p className="text-foreground/80 mb-6">
        A well-crafted prompt is made of several key components. Click on each block below to explore its role in guiding the AI.
      </p>
      <Accordion type="multiple" className="w-full space-y-3">
        {anatomyParts.map((part) => (
          <AccordionItem value={part.id} key={part.id} className={cn("border-2 rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:shadow-lg hover:ring-2 hover:ring-neon-yellow/70", part.colorClass, part.borderColorClass, part.textColorClass )}>
            <AccordionTrigger className={cn("p-4 hover:no-underline", part.textColorClass)}>
              <div className="flex items-center w-full text-left">
                <part.icon className="w-6 h-6 mr-3 shrink-0" />
                <span className="font-semibold text-md">{part.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                "p-4 pt-0 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none",
                part.textColorClass, // Ensure content text color matches trigger
                "bg-opacity-20 bg-black rounded-b-md" // Add slight dark background for content
              )}
            >
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2"
                   dangerouslySetInnerHTML={{ __html: part.elaborateDescription }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
       <p className="text-foreground/70 mt-6 text-sm">
        Note: Not all components are needed for every prompt. The complexity and combination depend on the task.
      </p>
    </GlassCardContent>
  </GlassCard>
);

interface PlaygroundScenario {
  id: string;
  name: string;
  icon: LucideIcon;
  basicPrompt: string;
  engineeredPrompt: string;
}

const playgroundScenarios: PlaygroundScenario[] = [
  {
    id: "restaurant-assistant",
    name: "Restaurant Assistant (Generic)",
    icon: UtensilsCrossed,
    basicPrompt: "Suggest a good Italian restaurant nearby.",
    engineeredPrompt: "System: You are a helpful local guide AI. User: I'm looking for a family-friendly Italian restaurant in downtown San Francisco that's open for dinner around 7 PM tonight, has vegetarian options, and an average rating of at least 4 stars. My budget is moderate ($$-$$$). Please provide 2-3 suggestions with a brief description, address, and why it fits my criteria. Format as a numbered list.",
  },
  {
    id: "study-buddy",
    name: "Study Buddy - History (Generic)",
    icon: BookOpen,
    basicPrompt: "Tell me about World War 2.",
    engineeredPrompt: "System: You are a history tutor AI. User: Explain the main causes of World War 2 for a high school student. Focus on the Treaty of Versailles, rise of fascism, and failure of the League of Nations. Keep the explanation concise (around 3-4 paragraphs) and easy to understand. Provide key dates for major events mentioned.",
  },
  {
    id: "code-explainer",
    name: "Code Explainer - Python (Generic)",
    icon: Bot, 
    basicPrompt: "What does this Python code do: `print('Hello')`?",
    engineeredPrompt: "System: You are an expert Python programming assistant. User: Explain the following Python code snippet line by line, including its purpose and expected output. Identify any potential improvements or common pitfalls related to this type of code. Code: \n```python\ndef greet(name):\n  return f\"Hello, {name}!\"\n\nmessage = greet(\"Alice\")\nprint(message)\n```\nRespond in Markdown.",
  },
  {
    id: "erp-feature-explanation",
    name: "ERP Module Feature Explanation (Business)",
    icon: FileText,
    basicPrompt: "Explain the inventory management module.",
    engineeredPrompt: `System: You are an AI training assistant for 'InnovateERP', a comprehensive enterprise resource planning system. Your primary goal is to clearly explain ERP module features to new users who may not be familiar with ERP jargon. Use simple language and provide a tangible real-world benefit for each feature mentioned. Structure your response clearly.

User: I'm a newly hired warehouse supervisor starting to use InnovateERP. Can you explain the core functionalities of the 'Inventory Management' module? Specifically, I need to understand:
1. Real-time Stock Level Tracking.
2. Automated Reorder Point (ROP) Calculations.
3. Batch and Serial Number Traceability.
4. Kitting and Assembly Management.

For each functionality, please provide:
- A brief (1-2 sentences) explanation of what it is.
- Its primary benefit to me in managing the warehouse efficiently.
Format your response using Markdown, with each functionality as an H3 heading.`
  },
];


const PromptEngineeringPlayground = () => {
  const { toast } = useToast();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(playgroundScenarios[0].id);
  
  const currentScenario = playgroundScenarios.find(s => s.id === selectedScenarioId) || playgroundScenarios[0];

  const [basicPrompt, setBasicPrompt] = useState(currentScenario.basicPrompt);
  const [engineeredPrompt, setEngineeredPrompt] = useState(currentScenario.engineeredPrompt);
  
  const [basicResponse, setBasicResponse] = useState("");
  const [engineeredResponse, setEngineeredResponse] = useState("");

  useEffect(() => {
    const scenario = playgroundScenarios.find(s => s.id === selectedScenarioId);
    if (scenario) {
      setBasicPrompt(scenario.basicPrompt);
      setEngineeredPrompt(scenario.engineeredPrompt);
      setBasicResponse(""); 
      setEngineeredResponse("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenarioId]);

  const mutation = useMutation({
    mutationFn: (input: LiveAIResponseDemoInput) => liveAIResponseDemo(input),
    onSuccess: (data) => {
      if (data && data.basicResponse && data.engineeredResponse) {
        setBasicResponse(data.basicResponse);
        setEngineeredResponse(data.engineeredResponse);
        toast({ title: "AI Responses Ready!", description: "Comparison loaded." });
      } else {
        setBasicResponse("AI did not return a valid basic response.");
        setEngineeredResponse("AI did not return a valid engineered response.");
        toast({ variant: "destructive", title: "Response Error", description: "One or both AI responses were incomplete." });
      }
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
      setBasicResponse(`Error: ${error.message}`);
      setEngineeredResponse(`Error: ${error.message}`);
    }
  });

  const handleCompare = () => {
    if (!basicPrompt.trim() || !engineeredPrompt.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Both prompts must be filled." });
      return;
    }
    mutation.mutate({ basicPrompt, engineeredPrompt });
  };

  const currentDisplayIcon = currentScenario.icon || HelpCircle;


  return (
  <GlassCard className="h-full !p-0 !shadow-none !border-none !bg-transparent">
    <GlassCardHeader className="pt-6 px-6">
      <GlassCardTitle className="text-neon-yellow flex items-center">
        <currentDisplayIcon className="inline-block mr-3 h-6 w-6" /> 
        Prompt Engineering Playground: {currentScenario.name}
      </GlassCardTitle>
    </GlassCardHeader>
    <GlassCardContent className="space-y-6 px-6 pb-6">
      <div>
        <label htmlFor="scenario-select-playground" className="block text-sm font-medium text-neon-yellow mb-1">Select Scenario:</label>
        <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
          <SelectTrigger id="scenario-select-playground" className="w-full md:w-1/2 bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground">
            <SelectValue placeholder="Choose a scenario" />
          </SelectTrigger>
          <SelectContent className="bg-card border-neon-yellow text-foreground">
            {playgroundScenarios.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id} className="focus:bg-neon-yellow/20">
                <div className="flex items-center">
                  <scenario.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {scenario.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="playgroundBasicPrompt" className="block text-sm font-medium text-neon-yellow mb-1">Basic Prompt</label>
          <Textarea
            id="playgroundBasicPrompt"
            value={basicPrompt}
            onChange={(e) => setBasicPrompt(e.target.value)}
            placeholder="Enter a basic prompt..."
            rows={8} 
            className="bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground/90"
          />
        </div>
        <div>
          <label htmlFor="playgroundEngineeredPrompt" className="block text-sm font-medium text-neon-yellow mb-1">Engineered Prompt</label>
          <Textarea
            id="playgroundEngineeredPrompt"
            value={engineeredPrompt}
            onChange={(e) => setEngineeredPrompt(e.target.value)}
            placeholder="Enter an engineered prompt..."
            rows={8} 
            className="bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground/90"
          />
        </div>
      </div>

      <div className="text-center">
        <Button onClick={handleCompare} disabled={mutation.isPending} className="bg-neon-yellow hover:bg-neon-yellow/90 text-neon-yellow-foreground px-6 py-3 text-base">
          {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />} Compare AI Responses
        </Button>
      </div>
      
      {(mutation.isSuccess || mutation.isError) && (
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Basic Prompt Response</label>
            <Textarea
              readOnly
              value={basicResponse}
              className="h-56 bg-card/50 border-0 resize-none text-foreground/90" 
              placeholder="AI response to basic prompt..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Engineered Prompt Response</label>
            <Textarea
              readOnly
              value={engineeredResponse}
              className="h-56 bg-card/50 border-0 resize-none text-foreground/90" 
              placeholder="AI response to engineered prompt..."
            />
          </div>
        </div>
      )}
      <p className="text-xs text-center text-muted-foreground mt-4">
        (Gamified scoring and advanced features like response quality analysis are planned for future updates!)
      </p>
    </GlassCardContent>
  </GlassCard>
  );
};


const SmartSuggestionsTool = () => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: (input: ImprovePromptSuggestionsInput) => improvePromptSuggestions(input),
    onSuccess: (data) => {
      if (data && data.suggestions && data.suggestions.length > 0) {
        toast({ title: "Suggestions Ready!", description: "AI has provided feedback on your prompt." });
      } else {
        toast({ title: "Suggestions Processed", description: "No specific suggestions were returned, or the prompt is well-structured." });
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

  const suggestions = mutation.data?.suggestions || [];

  return (
    <GlassCard className="h-full !p-0 !shadow-none !border-none !bg-transparent">
      <GlassCardHeader className="pt-6 px-6">
        <GlassCardTitle className="text-neon-yellow flex items-center">
          <Target className="inline-block mr-2 h-6 w-6" /> 
          Smart Prompt Suggestions
        </GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="px-6 pb-6">
        <p className="text-foreground/80 mb-4">
          Enter your prompt below and get AI-powered suggestions for improvement.
        </p>
        <Textarea 
          placeholder="Type your prompt here..." 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4 bg-card/80 border-neon-yellow/50 focus:ring-neon-yellow text-foreground/90"
          rows={6} 
        />
        <Button onClick={handleGetSuggestions} disabled={mutation.isPending} className="bg-neon-yellow hover:bg-neon-yellow/90 text-neon-yellow-foreground px-6 py-3 text-base">
          {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5"/>} Get Suggestions
        </Button>
        
        {mutation.isSuccess && suggestions.length === 0 && !mutation.isPending && (
             <p className="mt-4 text-foreground/80">No specific improvement suggestions. Your prompt might be well-structured or the AI found no critical areas to highlight.</p>
        )}

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-neon-yellow mb-2 text-lg">Suggestions:</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground/90 bg-card/50 p-4 rounded-md border border-neon-yellow/30">
              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {mutation.isError && (
           <p className="mt-4 text-destructive">Could not retrieve suggestions at this time.</p>
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
      <div className="mb-8">
        <Tabs defaultValue="anatomy" className="w-full">
          <TabsList 
            className="grid w-full grid-cols-1 md:grid-cols-3 bg-transparent p-0 rounded-none mb-0"
          >
            <TabsTrigger 
              value="anatomy" 
              className="data-[state=active]:bg-neon-yellow data-[state=active]:text-neon-yellow-foreground data-[state=active]:border-b-transparent 
                         text-slate-300 hover:text-neon-yellow 
                         border-2 border-neon-yellow/50 border-b-0 rounded-t-md rounded-b-none 
                         py-3 text-base font-medium transition-all data-[state=inactive]:bg-card/50"
            >
              <Microscope className="mr-2 h-5 w-5" />Prompt Anatomy Lab
            </TabsTrigger>
            <TabsTrigger 
              value="playground" 
              className="data-[state=active]:bg-neon-yellow data-[state=active]:text-neon-yellow-foreground data-[state=active]:border-b-transparent 
                         text-slate-300 hover:text-neon-yellow 
                         border-2 border-neon-yellow/50 border-b-0 rounded-t-md rounded-b-none 
                         py-3 text-base font-medium transition-all data-[state=inactive]:bg-card/50 md:mx-[-2px]"
            >
              <BookOpen className="mr-2 h-5 w-5"/>Engineering Playground
            </TabsTrigger>
            <TabsTrigger 
              value="suggestions" 
              className="data-[state=active]:bg-neon-yellow data-[state=active]:text-neon-yellow-foreground data-[state=active]:border-b-transparent 
                         text-slate-300 hover:text-neon-yellow 
                         border-2 border-neon-yellow/50 border-b-0 rounded-t-md rounded-b-none 
                         py-3 text-base font-medium transition-all data-[state=inactive]:bg-card/50"
            >
              <Target className="mr-2 h-5 w-5"/>Smart Suggestions
            </TabsTrigger>
          </TabsList>
          <div className="bg-card p-0.5 yellow-glowing-box rounded-b-lg md:rounded-tr-lg">
            <div className="bg-card rounded-b-md md:rounded-tr-md">
              <TabsContent value="anatomy" className="mt-0">
                <PromptAnatomyLab />
              </TabsContent>
              <TabsContent value="playground" className="mt-0">
                <PromptEngineeringPlayground />
              </TabsContent>
              <TabsContent value="suggestions" className="mt-0">
                <SmartSuggestionsTool />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </SectionContainer>
  );
}
