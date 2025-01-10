import { LLM } from "./base.ts";

export class OpenAI implements LLM {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey; // Store the API key
  }

  async generate(prompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.apiKey,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error: " + response.statusText);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No content returned"; // Ensure a value is returned
  }
}
