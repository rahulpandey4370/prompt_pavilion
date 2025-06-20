
'use server';
/**
 * @fileOverview Uses Azure OpenAI directly to provide smart suggestions for improving a given prompt.
 *
 * - improvePromptSuggestions - A function that provides suggestions for improving a prompt.
 * - ImprovePromptSuggestionsInput - The input type.
 * - ImprovePromptSuggestionsOutput - The output type.
 */

import { AzureOpenAI } from 'openai';
import { z } from 'zod';
import { config } from 'dotenv';
config();

const ImprovePromptSuggestionsInputSchema = z.object({
  prompt: z.string().describe('The prompt to be improved.'),
});
export type ImprovePromptSuggestionsInput = z.infer<
  typeof ImprovePromptSuggestionsInputSchema
>;

const ImprovePromptSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of 3-5 actionable suggestions for improving the prompt.'),
});
export type ImprovePromptSuggestionsOutput = z.infer<
  typeof ImprovePromptSuggestionsOutputSchema
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

const improvePromptSuggestionsOutputDescription = `
The expected JSON output structure is:
{
  "suggestions": ["string", "string", "..."] (An array of 3-5 actionable suggestions for improving the prompt.)
}`;

const systemPromptForSuggestions = `You are an AI prompt engineering expert.
Your task is to analyze the given user prompt and provide 3-5 specific, actionable suggestions for improving its clarity, effectiveness, and ability to guide an AI towards a desired, high-quality output.
Focus on aspects like specificity, context, constraints, examples, role definition, and output formatting.
You MUST respond with a valid JSON object that strictly adheres to the following JSON structure description for the output:
${improvePromptSuggestionsOutputDescription}

User's prompt to improve:
---
<USER_PROMPT_TEXT_HERE>
---
Respond ONLY with the JSON object containing the 'suggestions' array. Do not include any explanatory text before or after the JSON.`;


export async function improvePromptSuggestions(
  input: ImprovePromptSuggestionsInput
): Promise<ImprovePromptSuggestionsOutput> {
  try {
    ImprovePromptSuggestionsInputSchema.parse(input);

    const userMessageContent = systemPromptForSuggestions.replace('<USER_PROMPT_TEXT_HERE>', input.prompt);

    const chatCompletion = await azureClient.chat.completions.create({
      model: azureDeploymentId,
      messages: [{ role: 'user', content: userMessageContent }],
      temperature: 0.5,
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("AI returned an empty response for prompt suggestions.");
    }
    
    let cleanedResponseText = responseText.trim();
    const jsonRegex = /^```json\s*([\s\S]*?)\s*```$/;
    const match = cleanedResponseText.match(jsonRegex);
    if (match && match[1]) {
      cleanedResponseText = match[1];
    }

    let parsedOutput: ImprovePromptSuggestionsOutput;
    try {
      parsedOutput = JSON.parse(cleanedResponseText);
    } catch (e) {
      console.error("Failed to parse JSON response from AI for suggestions:", cleanedResponseText, e);
      throw new Error("AI returned an invalid JSON format for suggestions. Raw response: " + responseText);
    }

    const validationResult = ImprovePromptSuggestionsOutputSchema.safeParse(parsedOutput);
    if (!validationResult.success) {
      console.error("AI response for suggestions failed Zod validation:", validationResult.error.issues);
      console.error("Problematic AI JSON for suggestions:", parsedOutput);
      throw new Error("AI response for suggestions did not match the expected structure.");
    }

    return validationResult.data;

  } catch (error: any) {
    console.error("Error in improvePromptSuggestions:", error.message);
    return {
      suggestions: [`Error fetching suggestions: ${error.message}`],
    };
  }
}
