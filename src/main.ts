import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { chatRouter } from "./routes/chat.ts";

const app = new Application();
const port = 8080;

app.use(chatRouter.routes());
app.use(chatRouter.allowedMethods());

console.log(`Server running on port ${port}`);
await app.listen({ port });
