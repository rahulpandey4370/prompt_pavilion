'use server';
/**
 * @fileOverview A Genkit flow to rate the quality of an assembled prompt and provide feedback.
 *
 * - ratePromptQuality - A function that takes an assembled prompt and returns a rating and feedback.
 * - RatePromptQualityInput - The input type.
 * - RatePromptQualityOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RatePromptQualityInputSchema = z.object({
  assembledPrompt: z.string().describe('The fully assembled prompt text to be evaluated.'),
});
export type RatePromptQualityInput = z.infer<typeof RatePromptQualityInputSchema>;

const RatePromptQualityOutputSchema = z.object({
  overallAssessment: z.string().describe('A brief overall assessment of the prompt (1-2 sentences).'),
  rating: z.union([z.number().min(1).max(10), z.string()]).describe('A numerical (1-10) or descriptive rating (e.g., "Excellent", "Good", "Needs Improvement") of the prompt quality.'),
  feedback: z.array(z.string()).describe('An array of 3-5 specific, actionable feedback points, suggestions for improvement, or missing elements in the prompt.'),
});
export type RatePromptQualityOutput = z.infer<typeof RatePromptQualityOutputSchema>;

export async function ratePromptQuality(
  input: RatePromptQualityInput
): Promise<RatePromptQualityOutput> {
  return ratePromptQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ratePromptQualityPrompt',
  input: {schema: RatePromptQualityInputSchema},
  output: {schema: RatePromptQualityOutputSchema},
  prompt: `You are an expert AI Prompt Engineer. Your task is to meticulously evaluate the quality of the following assembled prompt.

Provide the following based on your evaluation:
1.  'overallAssessment': A concise (1-2 sentences) summary of the prompt's main strengths and weaknesses.
2.  'rating': Assign a quality score. This can be a numerical rating from 1 (Poor) to 10 (Excellent), or a descriptive rating like "Excellent", "Good", "Fair", "Needs Improvement", or "Poor".
3.  'feedback': A list of 3-5 concrete, actionable suggestions for improvement. Focus on clarity, specificity, completeness, context, constraints, and how well it guides the AI towards the desired output. Point out any missing crucial components or areas that could be refined.

Assembled Prompt to Evaluate:
---
{{{assembledPrompt}}}
---

Respond strictly in the JSON format defined by the output schema. Ensure all fields in the schema are populated.
`,
});

const ratePromptQualityFlow = ai.defineFlow(
  {
    name: 'ratePromptQualityFlow',
    inputSchema: RatePromptQualityInputSchema,
    outputSchema: RatePromptQualityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.rating || !output.feedback || !output.overallAssessment) {
      return {
        rating: "Error",
        feedback: ["AI did not return a valid rating or feedback. Please check the prompt or model configuration."],
        overallAssessment: "Could not assess the prompt due to an error or incomplete AI response."
      };
    }
    return output;
  }
);
