import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { modelAliasService } from "../services/model_alias_service.ts";

export const chatController = {
  handleChat: async (ctx: Context) => {
    const { prompt, alias } = await ctx.request.body({ type: "json" }).value;
    const llm = modelAliasService.getModelInstance(alias || "gpt4");
    const response = await llm.generate(prompt);
    ctx.response.body = { response };
  },
  handleChatStream: async (ctx: Context) => {
    if (ctx.isUpgradable) {
      const ws = ctx.upgrade();
      ws.onopen = () => {
        console.log("WebSocket connection opened");
        ws.send("Welcome to the chat stream!");
      };
      ws.onmessage = async (evt: any) => {
        console.log("WebSocket message received:", evt.data);
        const llm = modelAliasService.getModelInstance("gpt4"); // Default to gpt4 for WebSocket
        const response = await llm.generate(evt.data);
        ws.send(`Response: ${response}`);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
      ws.onerror = (err: Event | Error) => {
        console.error("WebSocket error:", err);
      };
    } else {
      ctx.response.status = 400;
      ctx.response.body = "Not a websocket request";
    }
  },
};
