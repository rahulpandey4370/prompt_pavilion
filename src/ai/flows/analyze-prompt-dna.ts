
'use server';
/**
 * @fileOverview Uses Azure OpenAI directly to analyze the DNA of a given prompt.
 *
 * - analyzePromptDNA - A function that takes a prompt and returns its analysis.
 * - AnalyzePromptDNAInput - The input type.
 * - AnalyzePromptDNAOutput - The output type.
 */

import { AzureOpenAI } from 'openai';
import { z } from 'zod';
import { config } from 'dotenv';
config();

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

const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION;
const azureDeploymentId = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID;

if (!azureApiKey || !azureEndpoint || !azureApiVersion || !azureDeploymentId) {
  throw new Error('Missing one or more Azure OpenAI environment variables for direct SDK usage.');
}

const azureClient = new AzureOpenAI({
  apiKey: azureApiKey,
  endpoint: azureEndpoint,
  apiVersion: azureApiVersion,
});

const systemPromptForDNAAnalysis = `You are an expert AI Prompt Engineer, acting as a "Prompt DNA Analyzer".
Your task is to meticulously analyze the provided prompt text and break down its structure.
You MUST respond with a valid JSON object that strictly adheres to the following Zod schema for the output:
${JSON.stringify(AnalyzePromptDNAOutputSchema.openapi('AnalyzePromptDNAOutput'))}

Analyze the following prompt text:
---
<USER_PROMPT_TEXT_HERE>
---

Based on your analysis, provide the following in the specified JSON format:
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
Respond ONLY with the JSON object. Do not include any explanatory text before or after the JSON.`;

export async function analyzePromptDNA(
  input: AnalyzePromptDNAInput
): Promise<AnalyzePromptDNAOutput> {
  try {
    AnalyzePromptDNAInputSchema.parse(input);

    const userMessageContent = systemPromptForDNAAnalysis.replace('<USER_PROMPT_TEXT_HERE>', input.promptText);

    const chatCompletion = await azureClient.chat.completions.create({
      model: azureDeploymentId,
      messages: [{ role: 'user', content: userMessageContent }],
      // Consider response_format for models that support it for more reliable JSON
      // response_format: { type: "json_object" }, // If supported by your deployment & API version
      temperature: 0.2, // Lower temperature for more deterministic structured output
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("AI returned an empty response for DNA analysis.");
    }

    // Attempt to parse the JSON response
    let parsedOutput: AnalyzePromptDNAOutput;
    try {
      parsedOutput = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON response from AI for DNA analysis:", responseText, e);
      throw new Error("AI returned an invalid JSON format for DNA analysis. Raw response: " + responseText);
    }
    
    // Validate against Zod schema
    const validationResult = AnalyzePromptDNAOutputSchema.safeParse(parsedOutput);
    if (!validationResult.success) {
        console.error("AI response for DNA analysis failed Zod validation:", validationResult.error.issues);
        console.error("Problematic AI JSON:", parsedOutput);
        throw new Error("AI response for DNA analysis did not match the expected structure.");
    }

    return validationResult.data;

  } catch (error: any) {
    console.error("Error in analyzePromptDNA:", error.message);
    // Return a structured error response if appropriate for the frontend
    return {
      overallAssessment: "Could not analyze the prompt due to an error.",
      clarityScore: "Error",
      identifiedComponents: [],
      strengths: ["Analysis failed."],
      suggestions: [`Error during analysis: ${error.message}`],
    };
  }
}
