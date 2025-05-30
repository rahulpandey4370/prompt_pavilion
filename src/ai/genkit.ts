
import { genkit } from 'genkit';
import { azureOpenAI } from 'genkitx-azure-openai'; // Community plugin

// Ensure you have these environment variables set:
// AZURE_OPENAI_ENDPOINT: Your Azure OpenAI instance endpoint (e.g., https://your-resource-name.openai.azure.com/)
// AZURE_OPENAI_API_KEY: Your Azure OpenAI API Key
// AZURE_OPENAI_CHAT_DEPLOYMENT_ID: The deployment name for your chat model (e.g., gpt-35-turbo)
// OPENAI_API_VERSION (or AZURE_OPENAI_API_VERSION): The API version, e.g., "2024-02-15-preview"

if (!process.env.AZURE_OPENAI_ENDPOINT) {
  throw new Error("Missing environment variable: AZURE_OPENAI_ENDPOINT");
}
if (!process.env.AZURE_OPENAI_API_KEY) {
  throw new Error("Missing environment variable: AZURE_OPENAI_API_KEY");
}
if (!process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID) {
  throw new Error("Missing environment variable: AZURE_OPENAI_CHAT_DEPLOYMENT_ID for the chat model");
}

// The community plugin might pick up OPENAI_API_VERSION or AZURE_OPENAI_API_VERSION from env
// but it's good to check if it's explicitly required by the plugin or Azure SDK.
// For genkitx-azure-openai, apiVersion is typically passed in the config.
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || process.env.OPENAI_API_VERSION;
if (!apiVersion) {
  throw new Error("Missing environment variable: AZURE_OPENAI_API_VERSION or OPENAI_API_VERSION");
}

export const ai = genkit({
  plugins: [
    azureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      deployment: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID, // Use this for the chat model deployment
      // embeddingsDeployment: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_ID, // If you have a separate one for embeddings
      apiVersion: apiVersion,
    }),
  ],
  // The model identifier here should match the deployment name on Azure
  // that you want to use by default for ai.generate() calls.
  model: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_ID, 
});
