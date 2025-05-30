
/**
 * @fileOverview Initializes and configures the Genkit AI instance with Azure OpenAI
 * using the community genkitx-openai plugin, configured as a custom provider.
 */

import {GenerationCommonConfigSchema, genkit, type ModelInfo} from 'genkit';
// Use the default export from genkitx-openai
import openAI from 'genkitx-openai';
import {config} from 'dotenv';
config(); // Load environment variables from .env file

// Load and validate essential environment variables for Azure OpenAI
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT; // Should be like https://YOUR_RESOURCE_NAME.openai.azure.com/
const apiVersion = process.env.AZURE_OPENAI_API_VERSION; // CRITICAL: Ensure this is a valid Azure OpenAI API version (e.g., 2024-02-01)
const chatDeploymentId = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID; // Your GPT-4o (or other model) deployment name

if (!apiKey) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_KEY');
}
if (!endpoint) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_ENDPOINT. This should be the base URI of your Azure OpenAI resource (e.g., https://<your-resource-name>.openai.azure.com/). Ensure it ends with a trailing slash if required by the plugin or your setup.'
  );
}
if (!apiVersion) {
  // While the Python script worked with a future date, this is highly unusual.
  // Standard Azure OpenAI API versions are like '2024-02-01' or '2024-02-15-preview'.
  // An invalid apiVersion here will cause 404 errors.
  throw new Error('Missing environment variable: AZURE_OPENAI_API_VERSION. Please use a valid Azure OpenAI API version string.');
}
if (!chatDeploymentId) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_CHAT_DEPLOYMENT_ID (this is your model deployment name in Azure).'
  );
}

// Define model information for your Azure chat deployment (e.g., GPT-4o)
const modelInfo: ModelInfo = {
  label: `Azure OpenAI - ${chatDeploymentId}`,
  versions: [chatDeploymentId], // The specific deployment ID
  supports: {
    multiturn: true,
    tools: true, // GPT-4o and similar models support tools
    media: true, // GPT-4o supports vision (media inputs)
    systemRole: true,
    output: ['text', 'json'], // Can output structured JSON
  },
};

// Configure the genkitx-openai plugin for Azure as a custom provider
export const ai = genkit({
  plugins: [
    openAI({
      apiKey: apiKey!,
      baseURL: endpoint!, // Your Azure OpenAI resource endpoint
      apiVersion: apiVersion!, // Explicitly pass apiVersion
      models: [
        {
          name: chatDeploymentId!, // Your Azure deployment name. Genkit will refer to it as 'openai/YOUR_DEPLOYMENT_ID'
          info: modelInfo,
          configSchema: GenerationCommonConfigSchema.extend({}), // Standard config schema
        },
        // You could define other deployments (e.g., for embedding models) here if needed
      ],
    }),
  ],
  // The model name here tells Genkit which model configuration to use from the plugin.
  // The genkitx-openai plugin prefixes its registered model names with 'openai/'.
  model: `openai/${chatDeploymentId!}`,
  // Set a higher log level for more detailed debugging if needed
  // logLevel: 'debug', // Uncomment for verbose logging
});

// For clarity regarding potential 404 errors with Azure OpenAI:
// 1. AZURE_OPENAI_ENDPOINT: Must be the correct base URL (e.g., https://your-resource-name.openai.azure.com/).
//    The plugin, using the underlying OpenAI JS SDK, should append paths like '/openai/deployments/YOUR_DEPLOYMENT_ID/chat/completions'.
// 2. AZURE_OPENAI_API_VERSION: THIS IS CRITICAL. The value '2025-01-01-preview' used in the Python example is highly unorthodox for Azure OpenAI.
//    Standard versions are like '2024-02-01', '2024-02-15-preview', '2023-12-01-preview'.
//    An invalid API version will lead to a 404. Please verify this in your .env file and use a valid, Microsoft-provided API version string for your resource.
// 3. AZURE_OPENAI_CHAT_DEPLOYMENT_ID: Must be the exact name of your model deployment in Azure (e.g., "gpt-4o", "my-gpt35-deployment").
// 4. AZURE_OPENAI_API_KEY: Must be a valid key for your Azure OpenAI resource.
//
// If all these are correct and the 404 persists, the issue might be a subtle incompatibility in how `genkitx-openai`
// constructs the request path or headers for Azure compared to how the Python SDK does.
