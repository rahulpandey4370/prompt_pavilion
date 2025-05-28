// 'use server';

/**
 * @fileOverview A live AI response demo flow that compares basic vs engineered prompts using the Gemini 2.0 Flash API.
 *
 * - liveAIResponseDemo - A function that handles the live AI response demo process.
 * - LiveAIResponseDemoInput - The input type for the liveAIResponseDemo function.
 * - LiveAIResponseDemoOutput - The return type for the liveAIResponseDemo function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LiveAIResponseDemoInputSchema = z.object({
  basicPrompt: z.string().describe('The basic prompt to be used for comparison.'),
  engineeredPrompt: z.string().describe('The engineered prompt to be used for comparison.'),
});
export type LiveAIResponseDemoInput = z.infer<typeof LiveAIResponseDemoInputSchema>;

const LiveAIResponseDemoOutputSchema = z.object({
  basicResponse: z.string().describe('The AI response to the basic prompt.'),
  engineeredResponse: z.string().describe('The AI response to the engineered prompt.'),
});
export type LiveAIResponseDemoOutput = z.infer<typeof LiveAIResponseDemoOutputSchema>;

export async function liveAIResponseDemo(input: LiveAIResponseDemoInput): Promise<LiveAIResponseDemoOutput> {
  return liveAIResponseDemoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'liveAIResponseDemoPrompt',
  input: {
    schema: LiveAIResponseDemoInputSchema,
  },
  output: {
    schema: LiveAIResponseDemoOutputSchema,
  },
  prompt: `You are an AI prompt evaluator. Given a basic prompt and an engineered prompt, evaluate the quality of the responses and return the responses for both prompts.

  Basic Prompt: {{{basicPrompt}}}
  Engineered Prompt: {{{engineeredPrompt}}}

  Respond with the output from both prompts, making sure to fill out the JSON schema completely.
  `,
});

const liveAIResponseDemoFlow = ai.defineFlow(
  {
    name: 'liveAIResponseDemoFlow',
    inputSchema: LiveAIResponseDemoInputSchema,
    outputSchema: LiveAIResponseDemoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
