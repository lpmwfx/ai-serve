import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { chatService } from "../services/chat.ts";

const router = new Router();

// Health check endpoint
router.get("/health", (ctx) => {
  ctx.response.body = { status: "ok" };
});

// POST /chat
router.post("/chat", async (ctx) => {
  console.log("Received POST request to /chat");
  try {
    const body = await ctx.request.body({ type: "json" }).value;
    const { prompt } = body;
    const response = await chatService.processPrompt(prompt);
    ctx.response.body = response;
  } catch (error) {
    console.error("Error handling POST /chat:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

// WebSocket /chat/stream
router.get("/chat/stream", (ctx) => {
  if (!ctx.isUpgradable) {
    ctx.throw(501, "WebSocket upgrade not available");
  }

  const ws = ctx.upgrade();
  chatService.handleStreamConnection(ws);
});

export { router as chatRouter };
