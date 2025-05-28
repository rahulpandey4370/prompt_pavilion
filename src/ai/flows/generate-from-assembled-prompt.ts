'use server';
/**
 * @fileOverview A Genkit flow to generate a response from an assembled prompt.
 *
 * - generateFromAssembledPrompt - A function that takes an assembled prompt and returns an AI response.
 * - GenerateFromAssembledPromptInput - The input type.
 * - GenerateFromAssembledPromptOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFromAssembledPromptInputSchema = z.object({
  assembledPrompt: z.string().describe('The fully assembled prompt text.'),
});
export type GenerateFromAssembledPromptInput = z.infer<
  typeof GenerateFromAssembledPromptInputSchema
>;

const GenerateFromAssembledPromptOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the assembled prompt.'),
});
export type GenerateFromAssembledPromptOutput = z.infer<
  typeof GenerateFromAssembledPromptOutputSchema
>;

export async function generateFromAssembledPrompt(
  input: GenerateFromAssembledPromptInput
): Promise<GenerateFromAssembledPromptOutput> {
  return generateFromAssembledPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFromAssembledPromptPrompt',
  input: {schema: GenerateFromAssembledPromptInputSchema},
  output: {schema: GenerateFromAssembledPromptOutputSchema},
  prompt: `{{{assembledPrompt}}}`, // Directly use the assembled prompt
});

const generateFromAssembledPromptFlow = ai.defineFlow(
  {
    name: 'generateFromAssembledPromptFlow',
    inputSchema: GenerateFromAssembledPromptInputSchema,
    outputSchema: GenerateFromAssembledPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output and response are not null/undefined
    if (!output || typeof output.response !== 'string') {
      // throw new Error('AI did not return a valid response.');
      // Return a structured error or a default response if necessary
      return { response: "AI did not return a structured response. Please check the prompt or model configuration." };
    }
    return output;
  }
);
