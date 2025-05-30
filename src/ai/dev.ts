
import { config } from 'dotenv';
config();

// The flows are no longer Genkit-defined flows.
// If you still want to run a Genkit dev UI for other Genkit features
// (like inspection, traces if you add custom Genkit instrumentation later),
// you might need to adjust what's imported here or how it's started.
// For now, emptying the direct flow imports to prevent errors.

// Example:
// import { start } from 'genkit/dev';
// start();

console.log("Genkit dev server starting (Note: AI flows now use direct OpenAI SDK).");
// To fully utilize Genkit's dev UI, flows would need to be re-instrumented with Genkit.
