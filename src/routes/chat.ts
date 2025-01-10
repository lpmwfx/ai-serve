import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { chatController } from "../controllers/chat.ts";

export const chatRouter = new Router({ prefix: "/api/v1/chat" });

chatRouter.post("/", chatController.handleChat);
chatRouter.get("/stream", chatController.handleChatStream);
