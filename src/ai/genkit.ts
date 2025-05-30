
/**
 * @fileOverview Initializes and configures the Genkit AI instance with Azure OpenAI
 * using the community genkitx-openai plugin, configured for a custom Azure endpoint.
 */

import {GenerationCommonConfigSchema, genkit, type ModelInfo} from 'genkit';
import openAI from 'genkitx-openai'; // Community plugin for direct OpenAI API or compatible (like Azure)
import {config} from 'dotenv';
config(); // Load environment variables from .env file

// Load and validate essential environment variables for Azure OpenAI
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT; // Base endpoint, e.g., https://your-resource.openai.azure.com/
// const apiVersion = process.env.AZURE_OPENAI_API_VERSION; // Not directly used in this plugin's custom model config, usually part of endpoint or SDK handles it
const chatDeploymentId = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID; // Your specific model deployment name in Azure

if (!apiKey) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_KEY');
}
if (!endpoint) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_ENDPOINT. This should be the base URI of your Azure OpenAI resource (e.g., https://<your-resource-name>.openai.azure.com/). Ensure it ends with a trailing slash if required by the plugin or your setup.'
  );
}
// if (!apiVersion) {
//   // This is critical for direct Azure OpenAI SDK calls, but with genkitx-openai custom model, it might be handled differently or be part of the endpoint.
//   // The plugin's documentation for custom providers does not emphasize a separate apiVersion field in the plugin options.
//   console.warn(
//     'Warning: AZURE_OPENAI_API_VERSION is not explicitly used by this genkitx-openai custom provider setup. Ensure your endpoint is correctly formatted for your API version if needed.'
//   );
// }
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

// Base schema for generation configuration
const chatConfigSchema = GenerationCommonConfigSchema.extend({});

// Configure the genkitx-openai plugin for Azure
export const ai = genkit({
  plugins: [
    openAI({
      apiKey: apiKey!,
      baseURL: endpoint!, // Your Azure OpenAI resource endpoint
      // apiVersion: apiVersion, // apiVersion is not a direct top-level option for genkitx-openai's main config, usually part of Azure-specific SDK calls or endpoint query params.
      // The custom 'models' array is the key for Azure with this plugin.
      models: [
        {
          name: chatDeploymentId!, // This is your Azure deployment name. Genkit will refer to it as 'openai/YOUR_DEPLOYMENT_ID'
          info: chatModelInfo,
          configSchema: chatConfigSchema,
        },
        // You could define other deployments here (e.g., for embedding models)
      ],
    }),
  ],
  // The model name here tells Genkit which model configuration to use from the plugin.
  // The genkitx-openai plugin prefixes its registered model names with 'openai/'.
  model: `openai/${chatDeploymentId!}`,
  // Set a higher log level for more detailed debugging if needed
  // logLevel: 'debug', // Uncomment for verbose logging
});

// For clarity to the user regarding potential 404 errors with Azure OpenAI:
// 1. AZURE_OPENAI_ENDPOINT: Must be the correct base URL (e.g., https://your-resource-name.openai.azure.com/).
//    The plugin will append paths like '/openai/deployments/YOUR_DEPLOYMENT_ID/chat/completions'.
// 2. AZURE_OPENAI_API_VERSION: While not directly in the plugin options here, ensure your endpoint URL (if it needs it)
//    or your Azure resource itself is configured for a valid API version. Sometimes it's passed as a query parameter `api-version=YYYY-MM-DD`.
//    The OpenAI SDK underlying this plugin often expects this in the URL or specific headers when targeting Azure.
//    If issues persist, you might need to append `?api-version=YOUR_API_VERSION` to your AZURE_OPENAI_ENDPOINT.
// 3. AZURE_OPENAI_CHAT_DEPLOYMENT_ID: Must be the exact name of your model deployment in Azure.
// 4. AZURE_OPENAI_API_KEY: Must be a valid key for your Azure OpenAI resource.
