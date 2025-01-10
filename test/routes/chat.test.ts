import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { chatRouter } from "../../src/routes/chat.ts";
import { initServices } from "../../src/services/index.ts";

let server: any;
const port = 8081;

Deno.test("Setup server", async () => {
  // Initialize services
  await initServices();

  const app = new Application();
  app.use(chatRouter.routes());
  app.use(chatRouter.allowedMethods());

  server = await app.listen({ port });
});

Deno.test("POST /api/v1/chat should return response", async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const response = await fetch(`http://localhost:${port}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Hello" }),
  });
  assertEquals(response.status, 200);
  const data = await response.json();
  assertEquals(typeof data, "object");
});

Deno.test("GET /api/v1/chat/stream should upgrade to WebSocket", async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const ws = new WebSocket(`ws://localhost:${port}/chat/stream`);
  
  await new Promise<void>((resolve) => {
    ws.onopen = () => {
      assertEquals(ws.readyState, WebSocket.OPEN);
      ws.close();
      resolve();
    };
  });
});

Deno.test("Teardown server", () => {
  server.close();
});
