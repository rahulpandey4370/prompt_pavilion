
'use server';
/**
 * @fileOverview Initializes and configures the Genkit AI instance with Azure OpenAI
 * using the community genkitx-azure-openai plugin.
 */

import {genkit} from 'genkit';
import {azureOpenAI} from 'genkitx-azure-openai';
import {config} from 'dotenv';
config(); // Load environment variables from .env file

// Load and validate essential environment variables for Azure OpenAI
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const chatDeployment = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID;
const embeddingDeployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID; // Optional for embeddings

if (!apiKey) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_KEY');
}
if (!endpoint) {
  throw new Error('Missing environment variable: AZURE_OPENAI_ENDPOINT');
}
if (!apiVersion) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_VERSION');
}
if (!chatDeployment) {
  throw new Error(
    'Missing environment variable: AZURE_OPENAI_CHAT_DEPLOYMENT_ID for the chat model'
  );
}

// This identifier should match a model family supported by the plugin/Azure, 
// e.g., 'gpt-3.5-turbo', 'gpt-4', 'gpt-4o'.
// Adjust this if your AZURE_OPENAI_CHAT_DEPLOYMENT_ID is for a different model type.
const chatModelIdentifier = 'gpt-3.5-turbo'; 

const pluginOptions: any = {
  apiKey: apiKey!,
  endpoint: endpoint!,
  apiVersion: apiVersion!,
  modelDeploymentMap: {
    [chatModelIdentifier]: chatDeployment!,
  },
};

if (embeddingDeployment) {
  // The 'deployment' field in genkitx-azure-openai plugin options is typically for a default/embedding deployment.
  pluginOptions.deployment = embeddingDeployment;
} else {
  console.warn(
    "Optional environment variable AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID is not set. " +
    "If you plan to use embedding models with this plugin, ensure this variable is configured and the plugin uses it as its default 'deployment'."
  );
}

export const ai = genkit({
  plugins: [
    azureOpenAI(pluginOptions)
  ],
  // Use the string identifier that is mapped in modelDeploymentMap
  model: chatModelIdentifier, 
});
