'use server';
/**
 * @fileOverview Initializes and configures the Genkit AI instance with Azure OpenAI
 * using the genkitx-azure-openai community plugin.
 */

import {genkit} from 'genkit';
import {azureOpenAI} from 'genkitx-azure-openai'; // Community plugin
import {config} from 'dotenv';
config(); // Load environment variables from .env file

// Validate essential environment variables for Azure OpenAI
if (!process.env.AZURE_OPENAI_ENDPOINT) {
  throw new Error('Missing environment variable: AZURE_OPENAI_ENDPOINT');
}
if (!process.env.AZURE_OPENAI_API_KEY) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_KEY');
}
if (!process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_CHAT_DEPLOYMENT_ID for the chat model'
  );
}
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
if (!apiVersion) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_API_VERSION'
  );
}

// Options for the genkitx-azure-openai plugin.
// Temporarily removing modelDeploymentMap to diagnose "plugin is not a function" error.
const pluginOptions: {
  apiKey: string;
  endpoint: string;
  apiVersion: string;
  deployment?: string; // For embeddings, optional
} = {
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    apiVersion: apiVersion,
  };

// Conditionally add the 'deployment' field if an embedding model deployment ID is provided.
// This 'deployment' field in genkitx-azure-openai is for a default embedding model.
if (process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID) {
  pluginOptions.deployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID;
} else {
  console.warn(
    "Optional environment variable AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID is not set. " +
    "If you plan to use embedding models with this plugin, ensure this variable is configured."
  );
}

export const ai = genkit({
  plugins: [
    azureOpenAI(pluginOptions),
  ],
  // If modelDeploymentMap is removed from pluginOptions,
  // try setting the model directly to the Azure deployment ID.
  model: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID!,
});
