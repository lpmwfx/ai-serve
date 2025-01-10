import { LLMService, LLMConfig } from "./base.ts";
import { WebSocket } from "ws";
import { OpenAI } from "../llms/openai.ts";

export class ChatService implements LLMService {
  private config: LLMConfig;
  private openai: OpenAI;

  constructor(config: LLMConfig) {
    this.config = config;
    this.openai = new OpenAI(config.apiKey || "");
  }

  async processPrompt(prompt: string): Promise<string> {
    return await this.openai.generate(prompt);
  }

  handleStreamConnection(ws: WebSocket): void {
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = async (event: MessageEvent) => {
      const prompt = event.data.toString();
      const response = await this.openai.generate(prompt);
      ws.send(response);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }
}

export const chatService = new ChatService({
  model: "gpt-4",
  apiKey: Deno.env.get("OPENAI_API_KEY") || "", // Use environment variable for API key
  temperature: 0.7,
  maxTokens: 1000
});
