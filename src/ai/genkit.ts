
/**
 * @fileOverview Initializes and configures the Genkit AI instance with Azure OpenAI
 * using the community genkitx-openai plugin, configured as a custom provider.
 */

import {genkit, GenerationCommonConfigSchema} from 'genkit';
import type {ModelInfo} from 'genkit/model'; // Correct import for ModelInfo type
import openAI from 'genkitx-openai'; // Default import from genkitx-openai
import {config} from 'dotenv';
config(); // Load environment variables from .env file

// Load and validate essential environment variables for Azure OpenAI
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT; // Should be base URL like https://<your-resource>.openai.azure.com/
const apiVersion = process.env.AZURE_OPENAI_API_VERSION; // For reference, may not be directly used by plugin in custom config
const chatDeploymentId = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID; // e.g., 'gpt-4o' or your specific deployment name

if (!apiKey) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_KEY');
}
if (!endpoint) {
  throw new Error('Missing environment variable: AZURE_OPENAI_ENDPOINT. This should be the base URI of your Azure OpenAI resource.');
}
if (!apiVersion) {
  // Though not directly passed to this plugin's custom config, it's crucial for Azure.
  console.warn(
    'Warning: AZURE_OPENAI_API_VERSION is not set. Ensure your endpoint URL includes the api-version if required, or that the plugin handles it implicitly.'
  );
}
if (!chatDeploymentId) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_CHAT_DEPLOYMENT_ID for the chat model'
  );
}

// Define model information for your Azure chat deployment
// Adjust 'label' and 'supports' based on your specific model (e.g., GPT-4o, GPT-3.5 Turbo)
const chatModelInfo: ModelInfo = {
  label: `Azure OpenAI - ${chatDeploymentId}`, // Example: Azure OpenAI - gpt-4o
  versions: [chatDeploymentId], // The specific deployment ID
  supports: {
    multiturn: true,
    tools: true, // Assuming your Azure deployment supports tools
    media: false, // Set to true if your deployment supports vision/media input
    systemRole: true,
    output: ['text', 'json'], // Common output types
  },
};

// Base schema for generation configuration
const chatConfigSchema = GenerationCommonConfigSchema.extend({});

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: apiKey,
      baseURL: endpoint, // Base URL for your Azure OpenAI resource
      models: [
        {
          name: chatDeploymentId, // Use the deployment ID as the model name for the plugin
          info: chatModelInfo,
          configSchema: chatConfigSchema,
        },
        // You could add other models/deployments here if needed
      ],
    }),
  ],
  // The plugin prefixes the 'name' from the models array with 'openai/'
  model: `openai/${chatDeploymentId}`, 
  // Example: if chatDeploymentId is 'gpt-4o', model will be 'openai/gpt-4o'
});
