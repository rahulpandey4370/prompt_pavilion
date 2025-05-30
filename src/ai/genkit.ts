/**
 * @fileOverview Initializes and configures the Genkit AI instance with Azure OpenAI
 * using the community genkitx-openai plugin, configured for a custom Azure endpoint.
 */

import {
  GenerationCommonConfigSchema,
  genkit,
  type ModelInfo,
} from 'genkit';
import openAI from 'genkitx-openai'; // Community plugin
import {config} from 'dotenv';
config(); // Load environment variables from .env file

// Load and validate essential environment variables for Azure OpenAI
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT; // Base endpoint, e.g., https://your-resource.openai.azure.com/
const apiVersion = process.env.AZURE_OPENAI_API_VERSION; // Crucial for Azure
const chatDeploymentId = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID; // Your specific model deployment name in Azure

if (!apiKey) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_KEY');
}
if (!endpoint) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_ENDPOINT. This should be the base URI of your Azure OpenAI resource (e.g., https://<your-resource-name>.openai.azure.com/).'
  );
}
if (!apiVersion) {
  // This is critical for Azure OpenAI calls.
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_API_VERSION (e.g., 2024-02-15-preview). Check Azure portal for supported versions for your deployment.'
  );
}
if (!chatDeploymentId) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_CHAT_DEPLOYMENT_ID for the chat model (this is your model deployment name in Azure).'
  );
}

// Define model information for your Azure chat deployment
// Adjust 'label' and 'supports' based on your specific model (e.g., GPT-4o, GPT-3.5 Turbo)
const chatModelInfo: ModelInfo = {
  label: `Azure OpenAI - ${chatDeploymentId}`,
  versions: [chatDeploymentId], // The specific deployment ID might be used as a version if applicable
  supports: {
    multiturn: true,
    tools: true, // Assuming your Azure deployment supports tools
    media: true, // Set to true if your deployment supports vision (e.g., gpt-4o)
    systemRole: true,
    output: ['text', 'json'], // Common output types
  },
};

// Base schema for generation configuration - can be extended if model-specific configs are needed
const chatConfigSchema = GenerationCommonConfigSchema.extend({});

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: apiKey!,
      baseURL: endpoint!, // Your Azure OpenAI resource endpoint
      apiVersion: apiVersion!, // Explicitly pass apiVersion
      models: [
        {
          name: chatDeploymentId!, // This is your Azure deployment name
          info: chatModelInfo,
          configSchema: chatConfigSchema,
        },
        // You could define other deployments here (e.g., for embedding models)
      ],
    }),
  ],
  // The model name here tells Genkit which model configuration to use from the plugin.
  // The `genkitx-openai` plugin prefixes its registered model names with 'openai/'.
  model: `openai/${chatDeploymentId!}`,
});

// For clarity to the user regarding potential 404 errors:
// The 404 "Resource not found" error with Azure OpenAI is very often due to an incorrect
// AZURE_OPENAI_API_VERSION. Please ensure the version set in your .env file
// is a valid and active API version for your Azure OpenAI resource and specific deployment.
// Common formats are YYYY-MM-DD or YYYY-MM-DD-preview.
// Also, double-check the AZURE_OPENAI_ENDPOINT (should be the base URL like https://<your-resource-name>.openai.azure.com/)
// and AZURE_OPENAI_CHAT_DEPLOYMENT_ID (the exact name of your model deployment in Azure).
