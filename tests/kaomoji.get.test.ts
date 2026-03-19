/**
 * Kaomoji GET endpoint tests
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import { beforeEach, describe, expect, it } from "bun:test";
import { kaomojiApiApp } from "../src/app";
import { kaomojiService } from "../src/service/kaomoji.service";
import { KAOMOJI_COLLECTION } from "../src/types";

const KAOMOJI_URL = Bun.env.KAOMOJI_URL ?? "http://localhost:3000/api";
let app: ReturnType<typeof kaomojiApiApp>;
let service: kaomojiService;

describe("GET /api/kaomoji endpoints", () => {
	beforeEach(() => {
		service = new kaomojiService();
		app = kaomojiApiApp(service);
	});

	it("returns the full kaomoji collection from GET /api/kaomoji/all", async () => {
		const response = await app.handle(
			new Request(`${KAOMOJI_URL}/kaomoji/all`, {
				method: "GET",
			}),
		);

		expect(response.status).toBe(200);
		const allKaomoji = await response.json();
		expect(allKaomoji).toBeArray();
		expect(allKaomoji).toEqual(KAOMOJI_COLLECTION);
	});

	it("returns a named random kaomoji from GET /api/kaomoji", async () => {
		const response = await app.handle(
			new Request(`${KAOMOJI_URL}/kaomoji`, {
				method: "GET",
			}),
		);

		expect(response.status).toBe(200);
		const randomKaomoji = await response.json();
		expect(randomKaomoji).toHaveProperty("name");
		expect(randomKaomoji).toHaveProperty("kaomoji");
	});
});
