import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { chatRouter } from "./chat.ts";

export const router = new Router();

// Mount routers
router.use("/api/v1", chatRouter.routes(), chatRouter.allowedMethods());
