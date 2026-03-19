/**
 * Main Portfolio API App
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import { swagger } from "@elysiajs/swagger";
import { Elysia, ValidationError } from "elysia";
import { KaomojiNotFound } from "./errors/error";
import { buildKaomojiRoutes } from "./routes/kaomoji";
import { kaomojiService } from "./service/kaomoji.service";

// TODO: Configure swagger metadata so `/swagger` documents the API clearly.
// TODO: Register CORS here for `https://tgr-wjya.github.io` and `http://localhost:3000`.
// TODO: Compose future pet-counter routes here once `PetCounterService` exists.
// TODO: Keep app-level plugin wiring here so route files stay focused on handlers.

export function kaomojiApiApp(group = new kaomojiService()) {
	const app = new Elysia()
		.use(buildKaomojiRoutes(group))
		.use(swagger())

		.onError(({ set, error }) => {
			if (error instanceof KaomojiNotFound) {
				set.status = error.status;
			} else if (error instanceof ValidationError) {
				set.status = 422;
			} else {
				set.status = 500;
			}

			return {
				error: error instanceof Error ? error.message : "Unknown error",
				timestamp: new Date().toISOString(),
			};
		});

	return app;
}
