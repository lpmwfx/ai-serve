import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { chatRouter } from "../../src/routes/chat.ts";
import { initServices } from "../../src/services/index.ts";

// Initialize services
await initServices();

const app = new Application();

// Add request logging middleware
app.use(async (ctx, next) => {
  console.log(`Incoming request: ${ctx.request.method} ${ctx.request.url}`);
  await next();
});

// Mount the router at the root path
app.use(chatRouter.routes());
app.use(chatRouter.allowedMethods());

// Add error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Request error:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

// Start test server on a different port
const controller = new AbortController();
const { signal } = controller;
const port = 8081; // Use a different port to avoid potential conflicts

// Start server in a separate task
const serverTask = async () => {
  try {
    await app.listen({ port, signal });
  } catch (error) {
    console.error("Server error:", error);
    Deno.exit(1);
  }
};
const serverPromise = serverTask();

// Wait for server to be ready
let attempts = 0;
while (attempts < 10) {
  try {
    const response = await fetch(`http://localhost:${port}/health`);
    if (response.ok) break;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
}

if (attempts >= 10) {
  console.error("Server failed to start");
  Deno.exit(1);
}

// Cleanup after tests
Deno.test({
  name: "cleanup",
  fn: async () => {
    controller.abort();
    await serverPromise;
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test("POST /api/v1/chat should return response", async () => {
  const response = await fetch(`http://localhost:${port}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Hello" })
  });
  
  assertEquals(response.status, 200);
  const data = await response.json();
  assertEquals(typeof data, "object");
});

Deno.test("GET /api/v1/chat/stream should upgrade to WebSocket", async () => {
  const ws = new WebSocket(`ws://localhost:${port}/chat/stream`);
  
  await new Promise<void>((resolve) => {
    ws.onopen = () => {
      assertEquals(ws.readyState, WebSocket.OPEN);
      ws.close();
      resolve();
    };
  });
});
