
'use server';
/**
 * @fileOverview Uses Azure OpenAI directly to rate the quality of an assembled prompt and provide feedback.
 *
 * - ratePromptQuality - A function that takes an assembled prompt and returns a rating and feedback.
 * - RatePromptQualityInput - The input type.
 * - RatePromptQualityOutput - The output type.
 */

import { AzureOpenAI } from 'openai';
import { z } from 'zod';
import { config } from 'dotenv';
config();

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

const systemPromptForRating = `You are an expert AI Prompt Engineer. Your task is to meticulously evaluate the quality of the following assembled prompt.
You MUST respond with a valid JSON object that strictly adheres to the following Zod schema for the output:
${JSON.stringify(RatePromptQualityOutputSchema.openapi('RatePromptQualityOutput'))}

Provide the following based on your evaluation:
1.  'overallAssessment': A concise (1-2 sentences) summary of the prompt's main strengths and weaknesses.
2.  'rating': Assign a quality score. This can be a numerical rating from 1 (Poor) to 10 (Excellent), or a descriptive rating like "Excellent", "Good", "Fair", "Needs Improvement", or "Poor".
3.  'feedback': A list of 3-5 concrete, actionable suggestions for improvement. Focus on clarity, specificity, completeness, context, constraints, and how well it guides the AI towards the desired output. Point out any missing crucial components or areas that could be refined.

Assembled Prompt to Evaluate:
---
<USER_PROMPT_TEXT_HERE>
---
Respond ONLY with the JSON object. Do not include any explanatory text before or after the JSON.`;


export async function ratePromptQuality(
  input: RatePromptQualityInput
): Promise<RatePromptQualityOutput> {
  try {
    RatePromptQualityInputSchema.parse(input);

    const userMessageContent = systemPromptForRating.replace('<USER_PROMPT_TEXT_HERE>', input.assembledPrompt);

    const chatCompletion = await azureClient.chat.completions.create({
      model: azureDeploymentId,
      messages: [{ role: 'user', content: userMessageContent }],
      // response_format: { type: "json_object" }, // If supported
      temperature: 0.2,
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("AI returned an empty response for prompt rating.");
    }
    
    let parsedOutput: RatePromptQualityOutput;
    try {
      parsedOutput = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON response from AI for rating:", responseText, e);
      throw new Error("AI returned an invalid JSON format for rating. Raw response: " + responseText);
    }
    
    const validationResult = RatePromptQualityOutputSchema.safeParse(parsedOutput);
    if (!validationResult.success) {
      console.error("AI response for rating failed Zod validation:", validationResult.error.issues);
      console.error("Problematic AI JSON for rating:", parsedOutput);
      throw new Error("AI response for rating did not match the expected structure.");
    }

    return validationResult.data;

  } catch (error: any) {
    console.error("Error in ratePromptQuality:", error.message);
    return {
      overallAssessment: "Could not assess prompt due to an error.",
      rating: "Error",
      feedback: [`Error during rating: ${error.message}`],
    };
  }
}
