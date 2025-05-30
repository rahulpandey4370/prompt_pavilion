
'use server';
/**
 * @fileOverview Uses Azure OpenAI directly for a live AI response demo.
 *
 * - liveAIResponseDemo - Handles the live AI response demo process.
 * - LiveAIResponseDemoInput - The input type.
 * - LiveAIResponseDemoOutput - The output type.
 */

import { AzureOpenAI } from 'openai';
import { z } from 'zod';
import { config } from 'dotenv';
config();

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

async function getAzureOpenAIResponse(promptText: string): Promise<string> {
  try {
    const chatCompletion = await azureClient.chat.completions.create({
      model: azureDeploymentId,
      messages: [{ role: 'user', content: promptText }],
    });
    const responseText = chatCompletion.choices[0]?.message?.content;
    return typeof responseText === 'string' ? responseText : "AI did not return a valid text response.";
  } catch (error: any) {
    console.error("Error getting Azure OpenAI response:", error.message);
    return `Error generating AI response: ${error.message}`;
  }
}

export async function liveAIResponseDemo(input: LiveAIResponseDemoInput): Promise<LiveAIResponseDemoOutput> {
  try {
    LiveAIResponseDemoInputSchema.parse(input);

    const [basicResponse, engineeredResponse] = await Promise.all([
      getAzureOpenAIResponse(input.basicPrompt),
      getAzureOpenAIResponse(input.engineeredPrompt),
    ]);

    return { basicResponse, engineeredResponse };
  } catch (error: any) {
    console.error("Error in liveAIResponseDemo:", error.message);
    return {
      basicResponse: `Error: ${error.message}`,
      engineeredResponse: `Error: ${error.message}`,
    };
  }
}
