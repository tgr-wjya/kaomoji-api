/**
 * Main Portfolio API App
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { buildKaomojiRoutes } from "./routes/kaomoji";
import { kaomojiService } from "./service/kaomoji.service";

// TODO: Add API Group

export function kaomojiApiApp(group = new kaomojiService()) {
	const app = new Elysia().use(buildKaomojiRoutes(group)).use(swagger());

	return app;
}
