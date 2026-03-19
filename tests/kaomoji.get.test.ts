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

	// TODO: Add `GET /api/kaomoji/:id` coverage for a valid index response.
	// TODO: Add `GET /api/kaomoji/:id` coverage for the 404 path on out-of-bounds indices.
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

	// TODO: Add `/api/kaomoji/search?q=bear` coverage and assert only matching names are returned.
	// TODO: Add `/api/kaomoji/search` coverage without `q` and assert it falls back to a random kaomoji response shape.
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

	describe("GET /api/kaomoji/:id endpoints", () => {
		it("Should correctly return kaomoji by its index", async () => {
			const response = await app.handle(
				new Request(`${KAOMOJI_URL}/kaomoji/2`, {
					method: "GET",
				}),
			);

			expect(response.status).toBe(200);
			const indexKaomoji = await response.json();
			expect(indexKaomoji).toEqual(KAOMOJI_COLLECTION[2]);
		});

		it("Should return 404 and constructor for invalid URL params", async () => {
			const response = await app.handle(
				new Request(`${KAOMOJI_URL}/kaomoji/99`, {
					method: "GET",
				}),
			);

			expect(response.status).toBe(404);
			const invalidParams = await response.text();
			expect(invalidParams).toBe("Kaomoji Not Found");
		});

		it("Should return 422, not meeting schema validation for both float and string params", async () => {
			const float = await app.handle(
				new Request(`${KAOMOJI_URL}/kaomoji/1.34`, {
					method: "GET",
				}),
			);

			expect(float.status).toBe(422);

			Bun.sleep(4000);

			const string = await app.handle(
				new Request(`${KAOMOJI_URL}/kaomoji/hello`, {
					method: "GET",
				}),
			);

			expect(string.status).toBe(422);
		});
	});
});
