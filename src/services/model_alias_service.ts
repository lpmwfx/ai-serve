import config from "../../config.json" with { type: "json" };
import { LLM } from "../llms/base.ts";
import { OpenAI } from "../llms/openai.ts";

interface ModelProvider {
  api_key: string;
}

class ModelAliasService {
  private aliases: Record<string, string> = config.aliases;

  getModelInstance(alias: string): LLM {
    const providerName = this.aliases[alias];
    if (!providerName) {
      throw new Error(`Alias ${alias} not found`);
    }

    switch (providerName) {
      case "openai":
        return new OpenAI(Deno.env.get("OPENAI_API_KEY") || "");
      // Add cases for other providers
      default:
        throw new Error(`Model provider ${providerName} not implemented`);
    }
  }
}

export const modelAliasService = new ModelAliasService();
