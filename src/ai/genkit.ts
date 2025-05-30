
'use server';
import {genkit} from 'genkit';
// Import the plugin factory
import {azureOpenAI} from 'genkitx-azure-openai';
import {config} from 'dotenv';
config(); // Load environment variables from .env file

// Validate essential environment variables for Azure OpenAI
if (!process.env.AZURE_OPENAI_ENDPOINT) {
  throw new Error('Missing environment variable: AZURE_OPENAI_ENDPOINT');
}
if (!process.env.AZURE_OPENAI_API_KEY) {
  throw new Error('Missing environment variable: AZURE_OPENAI_API_KEY');
}
// This is the deployment name for your CHAT model (e.g., your-gpt35-deployment, your-gpt4o-deployment)
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

// This string identifier should correspond to the base model of your Azure deployment.
// For a GPT-3.5 Turbo deployment, this should be 'gpt-3.5-turbo'.
// For a GPT-4o deployment, it would be 'gpt-4o', etc.
const chatModelIdentifier = 'gpt-3.5-turbo'; // This should match the model type of your AZURE_OPENAI_CHAT_DEPLOYMENT_ID

export const ai = genkit({
  plugins: [
    azureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
      apiVersion: apiVersion!,
      // Map the generic model identifier to your specific Azure deployment name
      modelDeploymentMap: {
        [chatModelIdentifier]: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID!,
        // If you have other models like gpt-4o, you'd add them here:
        // 'gpt-4o': process.env.AZURE_OPENAI_GPT4O_DEPLOYMENT_ID!,
      },
      // Optional: If you have a separate deployment for embeddings and its ID in .env
      // deployment: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID, // This field in genkitx-azure-openai typically refers to an embedding deployment
    }),
  ],
  // Set the default model using the string identifier defined in chatModelIdentifier
  // This identifier will be resolved by the plugin using the modelDeploymentMap.
  model: chatModelIdentifier,
});
