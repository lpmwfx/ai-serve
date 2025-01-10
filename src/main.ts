import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { router } from "./routes/index.ts";
import { initServices } from "./services/index.ts";

const app = new Application();

// Initialize services
await initServices();

// Use router
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
const PORT = 8000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
