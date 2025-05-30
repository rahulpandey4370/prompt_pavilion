
'use server';
/**
 * @fileOverview Uses Azure OpenAI directly to generate a response from an assembled prompt.
 *
 * - generateFromAssembledPrompt - A function that takes an assembled prompt and returns an AI response.
 * - GenerateFromAssembledPromptInput - The input type.
 * - GenerateFromAssembledPromptOutput - The output type.
 */

import { AzureOpenAI } from 'openai';
import { z } from 'zod';
import { config } from 'dotenv';
config(); // Load environment variables

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

export async function generateFromAssembledPrompt(
  input: GenerateFromAssembledPromptInput
): Promise<GenerateFromAssembledPromptOutput> {
  try {
    GenerateFromAssembledPromptInputSchema.parse(input); // Validate input

    const chatCompletion = await azureClient.chat.completions.create({
      model: azureDeploymentId, // Your Azure deployment ID (e.g., "gpt-4o")
      messages: [{ role: 'user', content: input.assembledPrompt }],
      // Add other parameters like temperature, max_tokens if needed
      // temperature: 0.7,
      // max_tokens: 800,
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    if (typeof responseText !== 'string') {
      console.error('Azure OpenAI response content is not a string:', chatCompletion.choices[0]);
      return { response: "AI did not return a valid text response. The response might be empty or in an unexpected format." };
    }

    return { response: responseText };

  } catch (error: any) {
    console.error("Error calling Azure OpenAI in generateFromAssembledPrompt:", error.message);
    if (error.response) {
      console.error("Azure OpenAI API Error Details:", error.response.data);
    }
    // Provide a more user-friendly error message or re-throw if needed
    return { response: `Error generating response from AI: ${error.message}` };
  }
}
