
'use server';
/**
 * @fileOverview Uses Azure OpenAI directly for a live AI response demo,
 * applying different system prompts and model configurations for basic vs. engineered.
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
  userInput: z.string().describe("The common user input/query."),
  engineeredSystemPrompt: z.string().describe("The detailed system prompt for the engineered version."),
});
export type LiveAIResponseDemoInput = z.infer<typeof LiveAIResponseDemoInputSchema>;

const LiveAIResponseDemoOutputSchema = z.object({
  basicResponse: z.string().describe('The AI response to the basic prompt setup.'),
  engineeredResponse: z.string().describe('The AI response to the engineered prompt setup.'),
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

const BASIC_SYSTEM_PROMPT = "You are a helpful chatbot. Please provide a very concise and direct answer, typically 1-2 sentences and under 80 words. Avoid lists or detailed formatting.";

async function getAzureOpenAIResponse(
  systemPrompt: string,
  userPrompt: string,
  modelConfig: Record<string, any>
): Promise<string> {
  try {
    const chatCompletion = await azureClient.chat.completions.create({
      model: azureDeploymentId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      ...modelConfig,
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

    const basicModelConfig = {
      temperature: 0.1,
      max_tokens: 100,
      top_p: 0.6,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    };

    const engineeredModelConfig = {
      temperature: 0.7,
      max_tokens: 400, // Increased slightly for more detailed engineered responses
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    const [basicResponse, engineeredResponse] = await Promise.all([
      getAzureOpenAIResponse(BASIC_SYSTEM_PROMPT, input.userInput, basicModelConfig),
      getAzureOpenAIResponse(input.engineeredSystemPrompt, input.userInput, engineeredModelConfig),
    ]);

    return { basicResponse, engineeredResponse };
  } catch (error: any) {
    console.error("Error in liveAIResponseDemo:", error.message);
    // Ensure a valid LiveAIResponseDemoOutput structure is returned even on error
    const errorMessage = `Error processing request: ${error.message}`;
    return {
      basicResponse: errorMessage,
      engineeredResponse: errorMessage,
    };
  }
}
