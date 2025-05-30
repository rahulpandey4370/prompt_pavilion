
'use server';
/**
 * @fileOverview Initializes and configures the Genkit AI instance with Azure OpenAI
 * using the community genkitx-azure-openai plugin.
 */

import {genkit} from 'genkit';
import {azureOpenAI} from 'genkitx-azure-openai'; // Community plugin
import {config} from 'dotenv';
config(); // Load environment variables from .env file

// Load and validate essential environment variables for Azure OpenAI
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const chatDeploymentId = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID;
const embeddingDeploymentId = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID; // This is now optional

if (!apiKey) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_KEY');
}
if (!endpoint) {
  throw new Error('Missing environment variable: AZURE_OPENAI_ENDPOINT');
}
if (!apiVersion) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_VERSION');
}
if (!chatDeploymentId) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_CHAT_DEPLOYMENT_ID for the chat model'
  );
}

// Prepare plugin options
// Use 'any' for pluginOptions if strict typing causes issues with this specific community plugin version.
const pluginOptions: {
  apiKey: string;
  endpoint: string;
  apiVersion: string;
  deployment?: string; // For embeddings, truly optional
  modelDeploymentMap?: Record<string, string>;
} = {
  apiKey: apiKey!,
  endpoint: endpoint!,
  apiVersion: apiVersion!,
};

if (embeddingDeploymentId) {
  pluginOptions.deployment = embeddingDeploymentId;
} else {
  // Log a warning if the embedding deployment ID is not set, as some plugin features might rely on it.
  console.warn(
    'AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID is not set. ' +
    'This might be required for embedding functionalities with the azureOpenAI plugin. ' +
    'Chat functionalities should still work if modelDeploymentMap is correctly configured.'
  );
}

// This identifier should match a model family that the plugin can recognize,
// e.g., 'gpt-3.5-turbo', 'gpt-4', 'gpt-4o'.
// This string is used as a key in modelDeploymentMap and as the default model for Genkit.
const chatModelIdentifier = 'gpt-3.5-turbo'; // Adjust if your deployment is for a different model type like gpt-4

pluginOptions.modelDeploymentMap = {
  [chatModelIdentifier]: chatDeploymentId!,
  // If you had other models (e.g., a gpt-4 deployment), you'd add them here:
  // 'gpt-4': process.env.AZURE_OPENAI_GPT4_DEPLOYMENT_ID!,
};

export const ai = genkit({
  plugins: [
    azureOpenAI(pluginOptions)
  ],
  // Use the string identifier that is mapped in modelDeploymentMap.
  // This tells Genkit to ask the azureOpenAI plugin for this logical model name,
  // and the plugin should use its map to find your actual Azure deployment ID.
  model: chatModelIdentifier,
});
