import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: (import.meta as any).env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through a backend
});
