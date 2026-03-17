/**
 * GET API Kaomoji test runner
 *
 * @author Tegar Wijaya Kusuma
 * @date 18 March 2026
 */

import { beforeEach, describe, expect, it } from "bun:test";
import { kaomojiApiApp } from "../src/app";
import {
	KAOMOJI_COLLECTION,
	kaomojiService,
} from "../src/service/kaomoji.service";

const KAOMOJI_URL = Bun.env.KAOMOJI_URL ?? "http://localhost:3000/api";
let app: ReturnType<typeof kaomojiApiApp>;
let service: kaomojiService;

describe("TESTING GET /api/kaomoji", () => {
	beforeEach(() => {
		service = new kaomojiService();
		app = kaomojiApiApp(service);
	});

	it("Should return all kaomoji in an array", async () => {
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
});
