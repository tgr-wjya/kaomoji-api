/**
 * kaomojiService() class
 *
 * @author Tegar Wijaya Kusuma
 * @date 19 March 2026
 */

import { KaomojiNotFound } from "../errors/error";
import { KAOMOJI_COLLECTION } from "../types";

export class kaomojiService {
	private readonly kaomoji = KAOMOJI_COLLECTION;

	getRandom() {
		// TODO: Keep random selection logic here so `/kaomoji` and `/kaomoji/search` share one source of truth.
		const randomKaomoji =
			this.kaomoji[Math.floor(Math.random() * this.kaomoji.length)];
		return randomKaomoji;
	}

	getAll() {
		// TODO: Add `searchByName(query)` using case-insensitive substring matching on `name`.
		// TODO: Keep the collection private to this service even after more kaomoji endpoints are added.
		return this.kaomoji;
	}

	getByIndex(id: number) {
		if (id >= this.kaomoji.length || id < 0) {
			throw new KaomojiNotFound();
		}

		return this.kaomoji[id];
	}
}
