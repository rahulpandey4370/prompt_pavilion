'use server';

/**
 * @fileOverview Provides smart suggestions for improving a given prompt.
 *
 * - improvePromptSuggestions - A function that provides suggestions for improving a prompt.
 * - ImprovePromptSuggestionsInput - The input type for the improvePromptSuggestions function.
 * - ImprovePromptSuggestionsOutput - The return type for the improvePromptSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImprovePromptSuggestionsInputSchema = z.object({
  prompt: z.string().describe('The prompt to be improved.'),
});
export type ImprovePromptSuggestionsInput = z.infer<
  typeof ImprovePromptSuggestionsInputSchema
>;

const ImprovePromptSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggestions for improving the prompt.'),
});
export type ImprovePromptSuggestionsOutput = z.infer<
  typeof ImprovePromptSuggestionsOutputSchema
>;

export async function improvePromptSuggestions(
  input: ImprovePromptSuggestionsInput
): Promise<ImprovePromptSuggestionsOutput> {
  return improvePromptSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvePromptSuggestionsPrompt',
  input: {schema: ImprovePromptSuggestionsInputSchema},
  output: {schema: ImprovePromptSuggestionsOutputSchema},
  prompt: `You are an AI prompt engineer. Your task is to provide suggestions for improving the given prompt.

Prompt: {{{prompt}}}

Suggestions:`,
});

const improvePromptSuggestionsFlow = ai.defineFlow(
  {
    name: 'improvePromptSuggestionsFlow',
    inputSchema: ImprovePromptSuggestionsInputSchema,
    outputSchema: ImprovePromptSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
