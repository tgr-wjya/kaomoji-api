/**
 * Kaomoji REST API Group
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import { Elysia, t } from "elysia";
import { KaomojiNotFound, NotFoundException } from "../errors/error";
import type { kaomojiService } from "../service/kaomoji.service";

export function buildKaomojiRoutes(kaomoji: kaomojiService) {
	return new Elysia().group("/api", (app) =>
		app
			// api/kaomoji scope onError
			.onError(({ set, error }) => {
				const extra: Record<string, unknown> = {};

				if (error instanceof KaomojiNotFound) {
					set.status = error.status;
				} else if (error instanceof NotFoundException) {
					set.status = error.status;
					extra.availableEndpoints = error.availableEndpoints;
				}
				return {
					error: error instanceof Error ? error.message : "Unknown error",
					timestamp: new Date().toISOString(),
					...extra,
				};
			})

			.get("/kaomoji/all", ({ set }) => {
				const getAllKaomojis = kaomoji.getAll();

				set.status = 200;
				return getAllKaomojis;
			})

			// TODO: Add `GET /kaomoji/search?q=` with TypeBox query validation.
			// TODO: If `q` is absent, make `/kaomoji/search` behave like `/kaomoji` and return a random entry.
			.get("/kaomoji", ({ set }) => {
				const getRandomKaomoji = kaomoji.getRandom();

				set.status = 200;
				return getRandomKaomoji;
			})

			.get(
				"/kaomoji/:id",
				async ({ params, set }) => {
					const getIndex = kaomoji.getByIndex(params.id);

					set.status = 200;
					return getIndex;
				},
				{
					params: t.Object({
						id: t.Integer(),
					}),
				},
			),
	);
}
