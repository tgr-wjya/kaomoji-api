/**
 * Kaomoji REST API Group
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import { Elysia, t } from "elysia";
import type { kaomojiService } from "../service/kaomoji.service";

export function buildKaomojiRoutes(group: kaomojiService) {
	return new Elysia().group("/api", (app) =>
		app
			// TODO: Add `GET /kaomoji/:id` and translate out-of-bounds service errors into a clean 404 response.
			.get("/kaomoji/all", ({ set }) => {
				const getAllKaomojis = group.getAll();

				set.status = 200;
				return getAllKaomojis;
			})

			// TODO: Add `GET /kaomoji/search?q=` with TypeBox query validation.
			// TODO: If `q` is absent, make `/kaomoji/search` behave like `/kaomoji` and return a random entry.
			.get("/kaomoji", ({ set }) => {
				const getRandomKaomoji = group.getRandom();

				set.status = 200;
				return getRandomKaomoji;
			})

			.get(
				"/kaomoji/:id",
				async ({ params, set }) => {
					const getIndex = group.getByIndex(params.id);

					set.status = 200;
					return getIndex;
				},
				{
					params: t.Object({
						// TODO: This will silently return 200 with `undefined` for values like `1.5` unless `id` is restricted to integers before indexing the array.
						id: t.Integer(),
					}),
				},
			),
	);
}
