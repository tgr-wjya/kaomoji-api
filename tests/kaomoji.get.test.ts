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
import type { AllError, ElysiaValidationError } from "./types";

const KAOMOJI_API_URL = Bun.env.KAOMOJI_API_URL ?? "http://localhost:3000/api";
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
			new Request(`${KAOMOJI_API_URL}/kaomoji/all`, {
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
			new Request(`${KAOMOJI_API_URL}/kaomoji`, {
				method: "GET",
			}),
		);

		expect(response.status).toBe(200);
		const randomKaomoji = await response.json();
		expect(randomKaomoji).toHaveProperty("name");
		expect(randomKaomoji).toHaveProperty("kaomoji");
	});
});

describe("GET /api/kaomoji/:id endpoints", () => {
	it("Should correctly return kaomoji by its index", async () => {
		const response = await app.handle(
			new Request(`${KAOMOJI_API_URL}/kaomoji/2`, {
				method: "GET",
			}),
		);

		expect(response.status).toBe(200);
		const indexKaomoji = await response.json();
		expect(indexKaomoji).toEqual(KAOMOJI_COLLECTION[2]);
	});

	it("Should return 422, not meeting schema validation for both float and string params", async () => {
		const float = await app.handle(
			new Request(`${KAOMOJI_API_URL}/kaomoji/1.34`, {
				method: "GET",
			}),
		);

		expect(float.status).toBe(422);
		const floatData = (await float.json()) as AllError;
		const validation = floatData.error as unknown as ElysiaValidationError;
		expect(validation.type).toBe("validation");
		expect(validation.on).toBe("params");
		expect(validation.property).toBe("/id");

		Bun.sleep(4000);

		const string = await app.handle(
			new Request(`${KAOMOJI_API_URL}/kaomoji/hello`, {
				method: "GET",
			}),
		);

		expect(string.status).toBe(422);
		const stringData = (await string.json()) as AllError;
		const validation2 = stringData.error as unknown as ElysiaValidationError;
		expect(validation2.type).toBe("validation");
		expect(validation2.on).toBe("params");
		expect(validation2.property).toBe("/id");
	});
});
