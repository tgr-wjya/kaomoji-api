/**
 * General test runner for kaomoji-api project.
 *
 * Structure:
 * 1. Wildcards
 *  a. Returns 404 with wildcard fields on http://localhost:3000/api/919
 *  b. Returns 404 with wildcard fields on http://localhost:3000/12219
 *  c. Returns 404 with wildcard fields on http://localhost:3000/kaomoji/12b1w98e
 *
 * @author Tegar Wijaya Kusuma
 * @date 20 March 2026
 */

import { beforeEach, describe, expect, it } from "bun:test";
import { kaomojiApiApp } from "../src/app";
import { kaomojiService } from "../src/service/kaomoji.service";
import { availableEndpointsArray } from "../tests/types";
import type { WildcardError } from "./types";

const KAOMOJI_BASE_URL = Bun.env.KAOMOJI_BASE_URL ?? "http://localhost:3000";
const KAOMOJI_API_URL = Bun.env.KAOMOJI_API_URL ?? "http://localhost:3000/api";
let app: ReturnType<typeof kaomojiApiApp>;
let service: kaomojiService;

describe("Testing Wildcards error on different scope (globally and group)", () => {
	beforeEach(() => {
		service = new kaomojiService();
		app = kaomojiApiApp(service);
	});

	it.each([
		`${KAOMOJI_BASE_URL}/919`,
		`${KAOMOJI_API_URL}/12219`,
		`${KAOMOJI_API_URL}/kaomoji/api/asda`,
	])("Returns 404 with wildcard fields on %s", async (url) => {
		const response = await app.handle(new Request(url, { method: "GET" }));

		expect(response.status).toBe(404);
		const body = (await response.json()) as WildcardError;
		expect(body).toHaveProperty("error", "Not Found");
		expect(body).toHaveProperty("timestamp");
		expect(body.availableEndpoints).toEqual(availableEndpointsArray);
		expect(body.availableEndpoints).toBeArray();
	});
});
