export interface LLMService {
  processPrompt(prompt: string): Promise<string>;
  handleStreamConnection(ws: WebSocket): void;
}

export type LLMConfig = {
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
};
