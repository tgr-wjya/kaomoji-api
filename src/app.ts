/**
 * Main Portfolio API App
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import { swagger } from "@elysiajs/swagger";
import { Elysia, ValidationError } from "elysia";
import { availableEndpointsArray } from "../tests/types";
import { NotFoundException } from "./errors/error";
import { buildKaomojiRoutes } from "./routes/kaomoji";
import { kaomojiService } from "./service/kaomoji.service";

// TODO: Configure swagger metadata so `/swagger` documents the API clearly.
// TODO: Register CORS here for `https://tgr-wjya.github.io` and `http://localhost:3000`.
// TODO: Compose future pet-counter routes here once `PetCounterService` exists.
// TODO: Keep app-level plugin wiring here so route files stay focused on handlers.

export function kaomojiApiApp(group = new kaomojiService()) {
	const app = new Elysia()
		// GLOBAL onError
		.onError(({ set, error }) => {
			const extra: Record<string, unknown> = {};

			if (error instanceof ValidationError) {
				set.status = 422;
				extra.error = JSON.parse(error.message);
			} else if (error instanceof NotFoundException) {
				set.status = error.status;
				extra.availableEndpoints = error.availableEndpoints;
			} else {
				set.status = 500;
			}

			return {
				error:
					extra.error ??
					(error instanceof Error ? error.message : "Unknown error"),
				timestamp: new Date().toISOString(),
				...extra,
			};
		})

		.all("/*", () => {
			throw new NotFoundException(availableEndpointsArray);
		})

		.use(buildKaomojiRoutes(group))

		.use(swagger());

	return app;
}
