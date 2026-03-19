/**
 * Kaomoji REST API Group
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import Elysia from "elysia";
import type { kaomojiService } from "../service/kaomoji.service";

export function buildKaomojiRoutes(group: kaomojiService) {
	return new Elysia().group("/api", (app) =>
		app
			.get("/kaomoji/all", ({ set }) => {
				const getAllKaomojis = group.getAll();

				set.status = 200;
				return getAllKaomojis;
			})

			.get("/kaomoji", ({ set }) => {
				const getRandomKaomoji = group.getRandom();

				set.status = 200;
				return getRandomKaomoji;
			}),
	);
}
