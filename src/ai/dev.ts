import { config } from 'dotenv';
config();

import '@/ai/flows/improve-prompt-suggestions.ts';
import '@/ai/flows/live-ai-response-demo.ts';
import '@/ai/flows/generate-from-assembled-prompt.ts';
import '@/ai/flows/rate-prompt-quality.ts'; // Added new flow
