import { LLM } from "./base.ts";
import { OpenAIClient } from "../deps.ts";

export class OpenAI implements LLM {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI(apiKey);
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.openai.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0]?.message?.content || "";
  }
}
