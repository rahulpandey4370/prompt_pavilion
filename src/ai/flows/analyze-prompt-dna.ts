
'use server';
/**
 * @fileOverview A Genkit flow to analyze the DNA (structure, components, clarity) of a given prompt.
 *
 * - analyzePromptDNA - A function that takes a prompt and returns its analysis.
 * - AnalyzePromptDNAInput - The input type.
 * - AnalyzePromptDNAOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePromptDNAInputSchema = z.object({
  promptText: z.string().describe('The text of the prompt to be analyzed.'),
});
export type AnalyzePromptDNAInput = z.infer<typeof AnalyzePromptDNAInputSchema>;

const IdentifiedComponentSchema = z.object({
  componentName: z.string().describe("Name of the identified prompt component (e.g., 'System Instructions', 'User Task', 'Context/RAG', 'Examples (Few-shot)', 'Constraints/Rules', 'Guardrails/Safety', 'Tool Definition', 'Output Format Specifier')."),
  extractedText: z.string().optional().describe("The text segment identified for this component. May be omitted if not clearly present."),
  isPresent: z.boolean().describe("Whether this type of component was clearly identified or seems to be present."),
  assessment: z.string().optional().describe("A brief assessment of this component's quality or impact, or a note if it's missing but recommended."),
});

const AnalyzePromptDNAOutputSchema = z.object({
  overallAssessment: z.string().describe("A concise (2-3 sentences) overall assessment of the prompt's structure, completeness, and clarity for guiding an AI."),
  clarityScore: z.union([z.number().min(1).max(10), z.string()]).describe("A numerical rating (1-10, where 10 is best) or a descriptive rating (e.g., 'Excellent', 'Good', 'Fair', 'Needs Improvement', 'Poor') of the prompt's overall clarity and effectiveness."),
  identifiedComponents: z.array(IdentifiedComponentSchema).describe("An array of key prompt components, indicating if they are present, their extracted text, and a brief assessment. The AI should try to identify standard components like System Instructions, User Task, Context, Examples, Constraints, etc."),
  strengths: z.array(z.string()).min(1).max(3).describe("A list of 2-3 key strengths or well-implemented aspects of the prompt."),
  suggestions: z.array(z.string()).min(1).max(5).describe("A list of 3-5 specific, actionable suggestions for improving the prompt's structure, clarity, or effectiveness."),
});
export type AnalyzePromptDNAOutput = z.infer<typeof AnalyzePromptDNAOutputSchema>;

export async function analyzePromptDNA(
  input: AnalyzePromptDNAInput
): Promise<AnalyzePromptDNAOutput> {
  return analyzePromptDNAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePromptDNAPrompt',
  input: {schema: AnalyzePromptDNAInputSchema},
  output: {schema: AnalyzePromptDNAOutputSchema},
  prompt: `You are an expert AI Prompt Engineer, acting as a "Prompt DNA Analyzer".
Your task is to meticulously analyze the provided prompt text and break down its structure.

Analyze the following prompt:
---
{{{promptText}}}
---

Based on your analysis, provide the following in strict JSON format adhering to the output schema:

1.  'overallAssessment': A concise (2-3 sentences) summary of the prompt's structure, completeness, and clarity for guiding an AI.
2.  'clarityScore': Assign a clarity and effectiveness score. This can be a numerical rating from 1 (Poor) to 10 (Excellent), or a descriptive rating (e.g., "Excellent", "Good", "Fair", "Needs Improvement", "Poor").
3.  'identifiedComponents': An array. For each of the following standard prompt components, determine if it's present in the analyzed prompt:
    *   System Instructions / Role Definition
    *   User Task / Specific Question
    *   Contextual Information / RAG Data
    *   Examples (Few-shot learning)
    *   Constraints / Rules (e.g., length, style, topics to avoid)
    *   Guardrails / Safety Instructions
    *   Tool / Function Definitions (if any are hinted or explicitly defined for the AI to use)
    *   Output Format Specifier (e.g., asking for JSON, Markdown, specific structure)
    For each component, provide:
    *   'componentName': The name of the component (e.g., "System Instructions").
    *   'isPresent': A boolean indicating if it's clearly identifiable.
    *   'extractedText': (Optional) The actual text segment from the prompt that corresponds to this component. If not clearly present, omit or provide a brief note.
    *   'assessment': (Optional) A brief assessment of this component's implementation in the prompt or a note if it's missing but could be beneficial.
4.  'strengths': A list of 2-3 key strengths or well-implemented aspects of the prompt.
5.  'suggestions': A list of 3-5 specific, actionable suggestions for improving the prompt's structure, clarity, or effectiveness. Focus on what could make the prompt guide the AI better towards a desired, high-quality output.

Ensure all fields in the output schema are populated. If a component is not found, 'isPresent' should be false, and 'extractedText' can be omitted or briefly note its absence.
`,
});

const analyzePromptDNAFlow = ai.defineFlow(
  {
    name: 'analyzePromptDNAFlow',
    inputSchema: AnalyzePromptDNAInputSchema,
    outputSchema: AnalyzePromptDNAOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.clarityScore || !output.identifiedComponents || !output.overallAssessment || !output.strengths || !output.suggestions) {
      return {
        overallAssessment: "Could not fully analyze the prompt due to an error or incomplete AI response.",
        clarityScore: "Error",
        identifiedComponents: [],
        strengths: ["Analysis incomplete."],
        suggestions: ["AI did not return a valid analysis. Please check the prompt or model configuration."],
      };
    }
    return output;
  }
);
