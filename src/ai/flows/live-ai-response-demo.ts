
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
  basicUserInput: z.string().describe("The user input for the basic prompt configuration."),
  fullEngineeredPrompt: z.string().describe("The complete text of the engineered prompt, including system instructions and user input."),
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

// System prompt for the "Basic" AI call, aiming for a concise, direct answer.
const BASIC_SYSTEM_PROMPT = "You are a helpful chatbot. Please provide a general and informative answer, approximately 100-150 words. Avoid highly structured formatting like lists unless essential.";

async function getAzureOpenAIResponse(
  systemPrompt: string | null,
  userPrompt: string,
  modelConfig: Record<string, any>
): Promise<string> {
  try {
    const messages: Array<{role: "system" | "user", content: string}> = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const chatCompletion = await azureClient.chat.completions.create({
      model: azureDeploymentId,
      messages: messages,
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

    // Configuration for the "Basic" AI call
    const basicModelConfig = {
      temperature: 0.1,
      max_tokens: 200, // Adjusted for 100-150 words target
      top_p: 0.6,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    };

    // Configuration for the "Engineered" AI call
    // Uses the full engineered prompt which contains system instructions and user input.
    const engineeredModelConfig = {
      temperature: 0.7,
      max_tokens: 200, // Kept at 200 to allow for detailed engineered output, implicitly guided by prompt structure.
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };
    
    // For the basic prompt, we use the hardcoded BASIC_SYSTEM_PROMPT.
    // For the engineered prompt, the fullEngineeredPrompt from UI already contains system instructions.
    const [basicResponse, engineeredResponse] = await Promise.all([
      getAzureOpenAIResponse(BASIC_SYSTEM_PROMPT, input.basicUserInput, basicModelConfig),
      getAzureOpenAIResponse(null, input.fullEngineeredPrompt, engineeredModelConfig), // System prompt is null as it's part of fullEngineeredPrompt
    ]);

    return { basicResponse, engineeredResponse };
  } catch (error: any) {
    console.error("Error in liveAIResponseDemo:", error.message);
    const errorMessage = `Error processing request: ${error.message}`;
    return {
      basicResponse: errorMessage,
      engineeredResponse: errorMessage,
    };
  }
}
